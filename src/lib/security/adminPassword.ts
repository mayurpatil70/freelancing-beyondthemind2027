import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getSql } from '@/lib/db/neon';

/**
 * Admin login storage (password and username).
 *
 * Until the admin changes it in the panel, the password is ADMIN_PASSWORD from the
 * environment. After a change, a scrypt hash is kept in the Neon table
 * `admin_credentials` and that hash wins over the environment value.
 * The username works the same way: a username saved in the panel replaces
 * ADMIN_USERNAME / ADMIN_EMAIL for login.
 * Forgotten login: run `DELETE FROM admin_credentials;` in Neon and the
 * environment values work again.
 */

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LEN = 64;
const ROW_ID = 'admin';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 100;
/** Letters, digits and . _ @ + - (so an email address also works as a username). */
export const USERNAME_PATTERN = /^[A-Za-z0-9._@+-]+$/;

let tableReady: Promise<void> | null = null;

function ensureTable(sql: NonNullable<ReturnType<typeof getSql>>): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_credentials (
          id TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      // Added after the first version: the username, and a row may now hold only a username.
      await sql`ALTER TABLE admin_credentials ADD COLUMN IF NOT EXISTS username TEXT`;
      await sql`ALTER TABLE admin_credentials ADD COLUMN IF NOT EXISTS username_updated_at TIMESTAMPTZ`;
      await sql`ALTER TABLE admin_credentials ALTER COLUMN password_hash DROP NOT NULL`;
    })().catch((err) => {
      tableReady = null;
      throw err;
    });
  }
  return tableReady;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN);
  return ['scrypt', salt.toString('base64'), key.toString('base64')].join('$');
}

async function matchesHash(password: string, stored: string): Promise<boolean> {
  const [algo, saltB64, keyB64] = stored.split('$');
  if (algo !== 'scrypt' || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, 'base64');
  if (expected.length === 0) return false;
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sameString(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** The stored hash, or null when the admin has never changed the password (or there is no database). */
async function readStoredHash(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable(sql);
  const rows = await sql`SELECT password_hash FROM admin_credentials WHERE id = ${ROW_ID}`;
  return rows.length > 0 && rows[0].password_hash ? String(rows[0].password_hash) : null;
}

/** Checks a password against the changed password if there is one, otherwise against ADMIN_PASSWORD. */
export async function verifyAdminPassword(password: string, envPassword: string): Promise<boolean> {
  const stored = await readStoredHash();
  if (stored) return matchesHash(password, stored);
  return sameString(password, envPassword);
}

export function passwordChangeAvailable(): boolean {
  return getSql() !== null;
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not set');
  await ensureTable(sql);
  const hash = await hashPassword(newPassword);
  await sql`
    INSERT INTO admin_credentials (id, password_hash, updated_at)
    VALUES (${ROW_ID}, ${hash}, now())
    ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()
  `;
}

export async function passwordLastChanged(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable(sql);
  const rows = await sql`SELECT updated_at, password_hash FROM admin_credentials WHERE id = ${ROW_ID}`;
  return rows.length > 0 && rows[0].password_hash ? new Date(rows[0].updated_at as string).toISOString() : null;
}

/** The username saved in the admin panel, or null when it was never changed (or there is no database). */
export async function getStoredUsername(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable(sql);
  const rows = await sql`SELECT username FROM admin_credentials WHERE id = ${ROW_ID}`;
  return rows.length > 0 && rows[0].username ? String(rows[0].username) : null;
}

export async function usernameLastChanged(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable(sql);
  const rows = await sql`SELECT username_updated_at FROM admin_credentials WHERE id = ${ROW_ID}`;
  return rows.length > 0 && rows[0].username_updated_at
    ? new Date(rows[0].username_updated_at as string).toISOString()
    : null;
}

export async function setAdminUsername(newUsername: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not set');
  await ensureTable(sql);
  await sql`
    INSERT INTO admin_credentials (id, username, username_updated_at)
    VALUES (${ROW_ID}, ${newUsername}, now())
    ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, username_updated_at = now()
  `;
}

/**
 * The usernames that may log in. A username saved in the panel replaces both
 * ADMIN_USERNAME and ADMIN_EMAIL, so the old one stops working after a change.
 */
export async function getLoginUsernames(envUsername: string, envEmail: string): Promise<string[]> {
  const stored = await getStoredUsername();
  if (stored) return [stored];
  return [envUsername, envEmail].filter(Boolean);
}
