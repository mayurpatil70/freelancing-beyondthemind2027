import type { NextRequest } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { getSql } from '@/lib/db/neon';

/**
 * Admin login rate limiting.
 *
 * Failed attempts are counted per IP and per device fingerprint. When Neon is
 * configured the counters live in Postgres (tables `admin_login_attempts` and
 * `admin_security_events`), so they are shared by every serverless instance and
 * survive cold starts. Without DATABASE_URL (local dev) the same logic runs in
 * memory.
 */

type SecurityEventType = 'FAILED_LOGIN' | 'LOCKOUT_TRIGGERED';

interface SecurityThreatEvent {
  id: string;
  timestamp: number;
  type: SecurityEventType;
  ip: string;
  deviceHash: string;
  details: string;
}

interface AttemptState {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;
const WINDOW_SECONDS = 15 * 60;
const MAX_AUDIT_LOGS = 100;

const ipKey = (ip: string) => `ip:${ip}`;
const deviceKey = (hash: string) => `dev:${hash}`;

// ---------------------------------------------------------------------------
// Client identification
// ---------------------------------------------------------------------------

/**
 * Client IP. On Vercel, `x-real-ip` and `x-forwarded-for` are set by the
 * platform and cannot be spoofed by the client. Headers such as
 * `cf-connecting-ip` are not trusted, because anyone can send them and rotate
 * the value to dodge the per-IP limit.
 */
export function getClientIp(req: NextRequest): string {
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0];
    if (first) return first.trim();
  }

  return '127.0.0.1';
}

/**
 * Device fingerprint hash based on headers and optional client device ID.
 */
export function getClientFingerprint(req: NextRequest, clientDeviceId?: string): string {
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent') || 'unknown-ua';
  const acceptLang = req.headers.get('accept-language') || 'unknown-lang';
  const deviceId = clientDeviceId || req.headers.get('x-client-device-id') || '';

  return createHash('sha256')
    .update(`${ip}|${userAgent}|${acceptLang}|${deviceId}`)
    .digest('hex')
    .slice(0, 32);
}

// ---------------------------------------------------------------------------
// Storage: Neon with in-memory fallback
// ---------------------------------------------------------------------------

const memoryAttempts = new Map<string, AttemptState>();
const memoryEvents: SecurityThreatEvent[] = [];

let tablesReady: Promise<void> | null = null;

/** Creates the tables on first use so a deploy works before `npm run db:setup` is re-run. */
function ensureTables(sql: NonNullable<ReturnType<typeof getSql>>): Promise<void> {
  if (!tablesReady) {
    tablesReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_login_attempts (
          key TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0,
          first_attempt TIMESTAMPTZ NOT NULL DEFAULT now(),
          last_attempt TIMESTAMPTZ NOT NULL DEFAULT now(),
          locked_until TIMESTAMPTZ
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_security_events (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          ip TEXT NOT NULL,
          device_hash TEXT NOT NULL,
          details TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS admin_security_events_created_at_idx ON admin_security_events (created_at DESC)`;
    })().catch((err) => {
      tablesReady = null;
      throw err;
    });
  }
  return tablesReady;
}

function toMs(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const ms = new Date(value as string | Date).getTime();
  return Number.isNaN(ms) ? null : ms;
}

async function readAttempts(keys: string[]): Promise<Map<string, AttemptState>> {
  const result = new Map<string, AttemptState>();
  const sql = getSql();

  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        SELECT key, count, first_attempt, locked_until
        FROM admin_login_attempts
        WHERE key = ANY(${keys})`;
      for (const row of rows) {
        result.set(String(row.key), {
          count: Number(row.count),
          firstAttempt: toMs(row.first_attempt) ?? 0,
          lockedUntil: toMs(row.locked_until),
        });
      }
      return result;
    } catch (err) {
      console.error('Login rate limit: Neon read failed, using in-memory counters for this request.', err);
    }
  }

  for (const key of keys) {
    const rec = memoryAttempts.get(key);
    if (rec) result.set(key, rec);
  }
  return result;
}

/** Atomically records one failed attempt for a key and returns the new state. */
async function incrementAttempt(key: string): Promise<AttemptState> {
  const sql = getSql();

  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        INSERT INTO admin_login_attempts AS a (key, count, first_attempt, last_attempt, locked_until)
        VALUES (${key}, 1, now(), now(), NULL)
        ON CONFLICT (key) DO UPDATE SET
          count = CASE
            WHEN a.first_attempt < now() - make_interval(secs => ${WINDOW_SECONDS}::int) THEN 1
            ELSE a.count + 1 END,
          first_attempt = CASE
            WHEN a.first_attempt < now() - make_interval(secs => ${WINDOW_SECONDS}::int) THEN now()
            ELSE a.first_attempt END,
          last_attempt = now(),
          locked_until = CASE
            WHEN a.first_attempt < now() - make_interval(secs => ${WINDOW_SECONDS}::int) THEN NULL
            WHEN a.count + 1 >= ${MAX_FAILED_ATTEMPTS}::int THEN now() + make_interval(secs => ${LOCKOUT_SECONDS}::int)
            ELSE a.locked_until END
        RETURNING count, first_attempt, locked_until`;
      const row = rows[0];
      return {
        count: Number(row.count),
        firstAttempt: toMs(row.first_attempt) ?? Date.now(),
        lockedUntil: toMs(row.locked_until),
      };
    } catch (err) {
      console.error('Login rate limit: Neon write failed, using in-memory counters for this request.', err);
    }
  }

  const now = Date.now();
  const prev = memoryAttempts.get(key);
  let next: AttemptState;
  if (!prev || now - prev.firstAttempt > WINDOW_SECONDS * 1000) {
    next = { count: 1, firstAttempt: now, lockedUntil: null };
  } else {
    const count = prev.count + 1;
    next = {
      count,
      firstAttempt: prev.firstAttempt,
      lockedUntil: count >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_SECONDS * 1000 : prev.lockedUntil,
    };
  }
  memoryAttempts.set(key, next);
  return next;
}

async function clearAttempts(keys: string[]): Promise<void> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`DELETE FROM admin_login_attempts WHERE key = ANY(${keys})`;
    } catch (err) {
      console.error('Login rate limit: could not clear counters in Neon.', err);
    }
  }
  for (const key of keys) memoryAttempts.delete(key);
}

async function logEvent(event: SecurityThreatEvent): Promise<void> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`
        INSERT INTO admin_security_events (id, type, ip, device_hash, details)
        VALUES (${event.id}, ${event.type}, ${event.ip}, ${event.deviceHash}, ${event.details})`;
      // Keep the table small: drop anything older than 30 days.
      await sql`DELETE FROM admin_security_events WHERE created_at < now() - interval '30 days'`;
      return;
    } catch (err) {
      console.error('Login rate limit: could not write security event to Neon.', err);
    }
  }
  memoryEvents.unshift(event);
  if (memoryEvents.length > MAX_AUDIT_LOGS) memoryEvents.length = MAX_AUDIT_LOGS;
}

function isActiveInWindow(rec: AttemptState | undefined, now: number): rec is AttemptState {
  return Boolean(rec && now - rec.firstAttempt < WINDOW_SECONDS * 1000);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks if the IP or device is currently locked out from login.
 */
export async function checkLoginRateLimit(ip: string, deviceHash: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  reason?: string;
}> {
  const now = Date.now();
  const attempts = await readAttempts([ipKey(ip), deviceKey(deviceHash)]);
  const ipRecord = attempts.get(ipKey(ip));
  const deviceRecord = attempts.get(deviceKey(deviceHash));

  for (const [rec, label] of [
    [ipRecord, 'IP address'],
    [deviceRecord, 'device'],
  ] as const) {
    if (rec?.lockedUntil && rec.lockedUntil > now) {
      const retryAfter = Math.ceil((rec.lockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds: retryAfter,
        reason: `Access temporarily frozen for this ${label} due to repeated failed attempts. Retry in ${retryAfter}s.`,
      };
    }
  }

  const highestFailedCount = Math.max(
    isActiveInWindow(ipRecord, now) ? ipRecord.count : 0,
    isActiveInWindow(deviceRecord, now) ? deviceRecord.count : 0
  );

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - highestFailedCount),
    retryAfterSeconds: 0,
  };
}

/**
 * Records a failed login attempt for an IP and device fingerprint.
 */
export async function recordFailedLogin(
  ip: string,
  deviceHash: string,
  details: string = 'Invalid admin credentials'
): Promise<{ locked: boolean; retryAfterSeconds: number; remainingAttempts: number }> {
  const now = Date.now();
  const [ipState, devState] = await Promise.all([
    incrementAttempt(ipKey(ip)),
    incrementAttempt(deviceKey(deviceHash)),
  ]);

  const lockedUntil = Math.max(ipState.lockedUntil ?? 0, devState.lockedUntil ?? 0);
  const isLocked = lockedUntil > now;
  const highest = Math.max(ipState.count, devState.count);
  const retryAfterSeconds = isLocked ? Math.ceil((lockedUntil - now) / 1000) : 0;

  await logEvent({
    id: `sec-${now}-${randomBytes(4).toString('hex')}`,
    timestamp: now,
    type: isLocked ? 'LOCKOUT_TRIGGERED' : 'FAILED_LOGIN',
    ip,
    deviceHash,
    details: isLocked
      ? `Rate limit threshold exceeded (${MAX_FAILED_ATTEMPTS} failed attempts). IP/Device locked for ${Math.round(LOCKOUT_SECONDS / 60)} minutes.`
      : `${details}. Attempts so far: ${highest}/${MAX_FAILED_ATTEMPTS}.`,
  });

  return {
    locked: isLocked,
    retryAfterSeconds,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - highest),
  };
}

/**
 * Resets failed login attempts upon successful authentication.
 */
export async function recordSuccessfulLogin(ip: string, deviceHash: string): Promise<void> {
  await clearAttempts([ipKey(ip), deviceKey(deviceHash)]);
}

/**
 * Returns security threat log and active lockouts for the admin console.
 */
export async function getSecurityThreatSummary() {
  const base = {
    maxFailedAttempts: MAX_FAILED_ATTEMPTS,
    lockoutDurationMinutes: Math.round(LOCKOUT_SECONDS / 60),
  };

  const sql = getSql();
  if (sql) {
    try {
      await ensureTables(sql);
      const [locks, events] = await Promise.all([
        sql`SELECT count(*)::int AS n FROM admin_login_attempts WHERE key LIKE 'ip:%' AND locked_until > now()`,
        sql`SELECT id, type, ip, device_hash, details, created_at FROM admin_security_events ORDER BY created_at DESC LIMIT 20`,
      ]);
      return {
        ...base,
        activeLockouts: Number(locks[0]?.n ?? 0),
        recentThreats: events.map((e) => ({
          id: String(e.id),
          timestamp: toMs(e.created_at) ?? 0,
          type: e.type as SecurityEventType,
          ip: String(e.ip),
          deviceHash: String(e.device_hash),
          details: String(e.details),
        })),
      };
    } catch (err) {
      console.error('Login rate limit: could not read security summary from Neon.', err);
    }
  }

  const now = Date.now();
  let activeLockouts = 0;
  memoryAttempts.forEach((rec, key) => {
    if (key.startsWith('ip:') && rec.lockedUntil && rec.lockedUntil > now) activeLockouts++;
  });
  return { ...base, activeLockouts, recentThreats: memoryEvents.slice(0, 20) };
}
