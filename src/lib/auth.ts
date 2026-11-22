import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import type { NextRequest } from 'next/server';
import { readEnv } from '@/lib/env';

export const SESSION_COOKIE_NAME = 'btm_admin_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// No fallback: without ADMIN_SESSION_SECRET no session can be created or accepted.
function secret(): string | null {
  return readEnv('ADMIN_SESSION_SECRET') || null;
}

function sign(payload: string): string {
  const key = secret();
  if (!key) throw new Error('ADMIN_SESSION_SECRET is not set');
  return createHmac('sha256', key).update(payload).digest('base64url');
}

export function createSessionToken(user: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      user,
      issuedAt: Date.now(),
      nonce: randomBytes(8).toString('hex'),
    })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string): { user: string } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!payload || !signature) return null;
  if (!secret()) return null;

  try {
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
      return null;
    }

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (typeof data.issuedAt !== 'number' || Date.now() - data.issuedAt > SESSION_TTL_MS) {
      return null;
    }
    return { user: String(data.user || 'admin') };
  } catch {
    return null;
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  return readSession(req.cookies.get(SESSION_COOKIE_NAME)?.value) !== null;
}
