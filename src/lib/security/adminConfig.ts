import { readEnv } from '@/lib/env';

export interface AdminConfig {
  username: string;
  email: string;
  password: string;
  sessionSecret: string;
}

export type AdminConfigResult =
  | { ok: true; config: AdminConfig }
  | { ok: false; missing: string[] };

/**
 * Reads the admin credentials from the environment. There are deliberately no
 * built-in defaults: if a value is missing, admin login is disabled and the
 * caller reports exactly which variables need to be set.
 */
export function getAdminConfig(): AdminConfigResult {
  const email = readEnv('ADMIN_EMAIL');
  const username = readEnv('ADMIN_USERNAME') || email;
  const password = readEnv('ADMIN_PASSWORD');
  const sessionSecret = readEnv('ADMIN_SESSION_SECRET');

  const missing: string[] = [];
  if (!username) missing.push('ADMIN_USERNAME (or ADMIN_EMAIL)');
  if (!password) missing.push('ADMIN_PASSWORD');
  if (!sessionSecret) missing.push('ADMIN_SESSION_SECRET');

  if (missing.length > 0) return { ok: false, missing };

  if (sessionSecret.length < 32) {
    console.warn('ADMIN_SESSION_SECRET is shorter than 32 characters. Use a long random value (e.g. `openssl rand -hex 32`).');
  }

  return { ok: true, config: { username, email, password, sessionSecret } };
}

export function adminConfigErrorMessage(missing: string[]): string {
  return `Admin login is not configured on this server. Missing environment variable(s): ${missing.join(', ')}.`;
}
