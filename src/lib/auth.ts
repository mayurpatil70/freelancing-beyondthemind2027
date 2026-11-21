import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const SESSION_COOKIE_NAME = 'btm_admin_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || `btm:${process.env.ADMIN_PASSWORD || 'pradeep123'}`;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionToken(user: string) {
  const payload = Buffer.from(JSON.stringify({ user, issuedAt: Date.now() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string): { user: string } | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (typeof data.issuedAt !== 'number' || Date.now() - data.issuedAt > SESSION_TTL_MS) return null;
    return { user: String(data.user || 'admin') };
  } catch {
    return null;
  }
}

export function isAdminRequest(req: NextRequest) {
  return readSession(req.cookies.get(SESSION_COOKIE_NAME)?.value) !== null;
}
