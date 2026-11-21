import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil?: number;
}

interface SecurityThreatEvent {
  id: string;
  timestamp: number;
  type: 'FAILED_LOGIN' | 'LOCKOUT_TRIGGERED' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_PAYLOAD';
  ip: string;
  deviceHash: string;
  details: string;
}

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_DURATION_MS = 15 * 60 * 1000;  // 15 minutes window

// In-memory trackers
const loginAttemptsByIp = new Map<string, AttemptRecord>();
const loginAttemptsByDevice = new Map<string, AttemptRecord>();
const generalApiRequests = new Map<string, { count: number; windowStart: number }>();
const threatAuditLogs: SecurityThreatEvent[] = [];
const MAX_AUDIT_LOGS = 100;

/**
 * Extracts normalized client IP address from request headers.
 */
export function getClientIp(req: NextRequest): string {
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

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
 * Creates a unique device fingerprint hash based on headers and optional client device ID.
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

/**
 * Checks if the IP or Device is currently rate limited / locked out from login.
 */
export function checkLoginRateLimit(ip: string, deviceHash: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  reason?: string;
} {
  const now = Date.now();

  // Prune expired locks or records
  cleanupOldRecords();

  const ipRecord = loginAttemptsByIp.get(ip);
  const deviceRecord = loginAttemptsByDevice.get(deviceHash);

  // Check IP lockout
  if (ipRecord?.lockedUntil && ipRecord.lockedUntil > now) {
    const retryAfter = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
      reason: `Access temporarily frozen for this IP address due to repeated failed attempts. Retry in ${retryAfter}s.`,
    };
  }

  // Check Device lockout
  if (deviceRecord?.lockedUntil && deviceRecord.lockedUntil > now) {
    const retryAfter = Math.ceil((deviceRecord.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
      reason: `Access temporarily frozen for this device due to repeated failed attempts. Retry in ${retryAfter}s.`,
    };
  }

  const highestFailedCount = Math.max(
    ipRecord && now - ipRecord.firstAttempt < WINDOW_DURATION_MS ? ipRecord.count : 0,
    deviceRecord && now - deviceRecord.firstAttempt < WINDOW_DURATION_MS ? deviceRecord.count : 0
  );

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - highestFailedCount);

  return {
    allowed: true,
    remainingAttempts: remaining,
    retryAfterSeconds: 0,
  };
}

/**
 * Records a failed login attempt for an IP and device fingerprint.
 */
export function recordFailedLogin(
  ip: string,
  deviceHash: string,
  details: string = 'Invalid admin credentials'
): { locked: boolean; retryAfterSeconds: number; remainingAttempts: number } {
  const now = Date.now();

  const updateRecord = (record?: AttemptRecord): AttemptRecord => {
    if (!record || now - record.firstAttempt > WINDOW_DURATION_MS) {
      return { count: 1, firstAttempt: now, lastAttempt: now };
    }
    const newCount = record.count + 1;
    const lockedUntil = newCount >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : undefined;
    return {
      count: newCount,
      firstAttempt: record.firstAttempt,
      lastAttempt: now,
      lockedUntil,
    };
  };

  const newIpRecord = updateRecord(loginAttemptsByIp.get(ip));
  loginAttemptsByIp.set(ip, newIpRecord);

  const newDevRecord = updateRecord(loginAttemptsByDevice.get(deviceHash));
  loginAttemptsByDevice.set(deviceHash, newDevRecord);

  const isLocked = Boolean(newIpRecord.lockedUntil || newDevRecord.lockedUntil);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - Math.max(newIpRecord.count, newDevRecord.count));
  const retryAfterSeconds = isLocked ? Math.ceil(LOCKOUT_DURATION_MS / 1000) : 0;

  // Log Threat Event
  threatAuditLogs.unshift({
    id: `sec-${now}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    type: isLocked ? 'LOCKOUT_TRIGGERED' : 'FAILED_LOGIN',
    ip,
    deviceHash,
    details: isLocked
      ? `Rate limit threshold exceeded (${MAX_FAILED_ATTEMPTS} failed attempts). IP/Device locked for 15 minutes.`
      : `${details}. Attempts so far: ${Math.max(newIpRecord.count, newDevRecord.count)}/${MAX_FAILED_ATTEMPTS}.`,
  });

  if (threatAuditLogs.length > MAX_AUDIT_LOGS) {
    threatAuditLogs.pop();
  }

  return {
    locked: isLocked,
    retryAfterSeconds,
    remainingAttempts: remaining,
  };
}

/**
 * Resets failed login attempts upon successful authentication.
 */
export function recordSuccessfulLogin(ip: string, deviceHash: string): void {
  loginAttemptsByIp.delete(ip);
  loginAttemptsByDevice.delete(deviceHash);
}

/**
 * General API rate limiter for admin endpoints (e.g. max 120 req/min per IP).
 */
export function checkGeneralApiRateLimit(ip: string, limit: number = 120, windowMs: number = 60_000): boolean {
  const now = Date.now();
  const record = generalApiRequests.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    generalApiRequests.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Cleanup helper for memory safety.
 */
function cleanupOldRecords() {
  const now = Date.now();

  loginAttemptsByIp.forEach((rec, ip) => {
    if (rec.lockedUntil && rec.lockedUntil < now) {
      loginAttemptsByIp.delete(ip);
    } else if (!rec.lockedUntil && now - rec.lastAttempt > WINDOW_DURATION_MS) {
      loginAttemptsByIp.delete(ip);
    }
  });

  loginAttemptsByDevice.forEach((rec, dev) => {
    if (rec.lockedUntil && rec.lockedUntil < now) {
      loginAttemptsByDevice.delete(dev);
    } else if (!rec.lockedUntil && now - rec.lastAttempt > WINDOW_DURATION_MS) {
      loginAttemptsByDevice.delete(dev);
    }
  });

  generalApiRequests.forEach((rec, ip) => {
    if (now - rec.windowStart > 60_000) {
      generalApiRequests.delete(ip);
    }
  });
}

/**
 * Returns security threat log and active lockouts for the admin console.
 */
export function getSecurityThreatSummary() {
  cleanupOldRecords();
  const now = Date.now();

  let activeLocks = 0;
  loginAttemptsByIp.forEach((rec) => {
    if (rec.lockedUntil && rec.lockedUntil > now) activeLocks++;
  });

  return {
    activeLockouts: activeLocks,
    recentThreats: threatAuditLogs.slice(0, 20),
    maxFailedAttempts: MAX_FAILED_ATTEMPTS,
    lockoutDurationMinutes: Math.round(LOCKOUT_DURATION_MS / 60000),
  };
}
