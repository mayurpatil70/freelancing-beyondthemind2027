import { getSql } from '@/lib/db/neon';
import { readLocalDb, writeLocalDb } from '@/lib/storage/store';

export interface ActiveSessionRecord {
  token: string;
  ip: string;
  deviceId: string;
  userAgent: string;
  loginTime: number;
  lastActivity: number;
}

const SESSION_INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000; // 2 hours inactivity timeout

/**
 * Retrieves the currently active admin session from Postgres or local DB fallback.
 */
export async function getActiveSession(): Promise<ActiveSessionRecord | null> {
  const sql = getSql();
  let record: ActiveSessionRecord | null = null;

  if (sql) {
    try {
      const rows = await sql`SELECT data FROM cms_content WHERE key = 'active_admin_session'`;
      if (rows && rows.length > 0 && rows[0].data) {
        record = rows[0].data as ActiveSessionRecord;
      }
    } catch (e) {
      console.warn('Could not read active_admin_session from Neon:', e);
    }
  } else {
    const db = readLocalDb();
    if (db && (db as Record<string, unknown>).active_admin_session) {
      record = (db as Record<string, unknown>).active_admin_session as ActiveSessionRecord;
    }
  }

  if (!record) return null;

  // Auto-expire session if inactive for more than 2 hours
  const now = Date.now();
  if (now - record.lastActivity > SESSION_INACTIVITY_LIMIT_MS) {
    await clearActiveSession();
    return null;
  }

  return record;
}

/**
 * Checks whether an incoming login attempt from an IP and Device ID is allowed.
 * Strictly permits only 1 active device login at any time.
 */
export async function checkSingleSessionLogin(
  incomingIp: string,
  incomingDeviceId: string
): Promise<{ allowed: boolean; activeSession?: ActiveSessionRecord; reason?: string }> {
  const active = await getActiveSession();
  if (!active) {
    return { allowed: true };
  }

  // If the same device is re-authenticating, allow it
  const isSameDevice = active.deviceId === incomingDeviceId;
  const isSameIp = active.ip === incomingIp;

  if (isSameDevice) {
    return { allowed: true };
  }

  // Different device/IP: strictly reject
  return {
    allowed: false,
    activeSession: active,
    reason: `An administrative session is currently active on another device (${active.ip.slice(0, 10)}...). Only 1 device may be logged in at a time. Please log out from the active device first to gain access.`,
  };
}

/**
 * Registers a newly created active admin session.
 */
export async function registerActiveSession(
  token: string,
  ip: string,
  deviceId: string,
  userAgent: string
): Promise<void> {
  const now = Date.now();
  const sessionData: ActiveSessionRecord = {
    token,
    ip,
    deviceId,
    userAgent,
    loginTime: now,
    lastActivity: now,
  };

  const sql = getSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO cms_content (key, data, updated_at)
        VALUES ('active_admin_session', ${JSON.stringify(sessionData)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      `;
    } catch (e) {
      console.error('Error registering active_admin_session in Neon:', e);
    }
  } else {
    const db = readLocalDb();
    (db as Record<string, unknown>).active_admin_session = sessionData;
    writeLocalDb(db);
  }
}

/**
 * Touches the lastActivity timestamp for the active session.
 */
export async function touchActiveSession(token: string): Promise<boolean> {
  const active = await getActiveSession();
  if (!active || active.token !== token) return false;

  active.lastActivity = Date.now();
  const sql = getSql();
  if (sql) {
    try {
      await sql`
        UPDATE cms_content
        SET data = jsonb_set(data, '{lastActivity}', ${Date.now().toString()}::jsonb),
            updated_at = now()
        WHERE key = 'active_admin_session'
      `;
    } catch {
      // Non-critical touch failure
    }
  }
  return true;
}

/**
 * Clears the active admin session upon explicit logout.
 */
export async function clearActiveSession(): Promise<void> {
  const sql = getSql();
  if (sql) {
    try {
      await sql`DELETE FROM cms_content WHERE key = 'active_admin_session'`;
    } catch (e) {
      console.warn('Could not clear active_admin_session from Neon:', e);
    }
  } else {
    const db = readLocalDb();
    delete (db as Record<string, unknown>).active_admin_session;
    writeLocalDb(db);
  }
}
