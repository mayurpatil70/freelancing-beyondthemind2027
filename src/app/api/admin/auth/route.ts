import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { SESSION_COOKIE_NAME, createSessionToken, readSession } from '@/lib/auth';
import {
  getClientIp,
  getClientFingerprint,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
  getSecurityThreatSummary,
} from '@/lib/security/rateLimit';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'pradeep123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pradeep123';

/**
 * Constant-time comparison between two strings via SHA-256 hashing.
 * Prevents timing attacks and password length discovery.
 */
function timingSafeCompare(submitted: string, expected: string): boolean {
  const hashSubmitted = createHash('sha256').update(submitted).digest();
  const hashExpected = createHash('sha256').update(expected).digest();
  return timingSafeEqual(hashSubmitted, hashExpected);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const clientDeviceId = req.headers.get('x-client-device-id') || undefined;
  const deviceHash = getClientFingerprint(req, clientDeviceId);

  // 1. Rate Limiting Check (Device + IP)
  const rateLimitStatus = checkLoginRateLimit(ip, deviceHash);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        locked: true,
        retryAfter: rateLimitStatus.retryAfterSeconds,
        message: rateLimitStatus.reason || 'Too many failed login attempts. Access temporarily locked for security.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitStatus.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      recordFailedLogin(ip, deviceHash, 'Malformed JSON payload');
      return NextResponse.json(
        { success: false, message: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const rawUsername = typeof body.username === 'string' ? body.username : (typeof body.email === 'string' ? body.email : '');
    const rawPassword = typeof body.password === 'string' ? body.password : '';

    const username = rawUsername.trim();
    const password = rawPassword.trim();

    // Prevent oversized payload attacks
    if (username.length > 100 || password.length > 128) {
      recordFailedLogin(ip, deviceHash, 'Abnormally large credentials submitted');
      return NextResponse.json(
        { success: false, message: 'Credentials exceed allowed character limits.' },
        { status: 400 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Both username and password are required' },
        { status: 400 }
      );
    }

    const expectedUsername = ADMIN_USERNAME.toLowerCase();
    const expectedEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();

    // Timing-safe user check
    const isUserMatch = timingSafeCompare(username.toLowerCase(), expectedUsername);
    const isEmailMatch = expectedEmail ? timingSafeCompare(username.toLowerCase(), expectedEmail) : false;
    const isValidUser = isUserMatch || isEmailMatch;

    // Timing-safe password check
    const isValidPass = timingSafeCompare(password, ADMIN_PASSWORD);

    if (!isValidUser || !isValidPass) {
      const failResult = recordFailedLogin(ip, deviceHash, `Invalid credentials for user: ${username.slice(0, 16)}`);

      if (failResult.locked) {
        return NextResponse.json(
          {
            success: false,
            locked: true,
            retryAfter: failResult.retryAfterSeconds,
            message: `Maximum login attempts exceeded. Access has been locked for ${Math.round(failResult.retryAfterSeconds / 60)} minutes to protect the sanctuary against unauthorized access.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(failResult.retryAfterSeconds) },
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          remainingAttempts: failResult.remainingAttempts,
          message: failResult.remainingAttempts <= 2
            ? `Invalid credentials. Warning: ${failResult.remainingAttempts} attempt(s) remaining before automatic 15-minute security lockout.`
            : 'Invalid username or password. Please check your administrative credentials and try again.',
        },
        { status: 401 }
      );
    }

    // Login Successful: Reset rate limit tracker
    recordSuccessfulLogin(ip, deviceHash);

    const sessionToken = createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      user: { username: username || 'pradeep123', role: 'admin' },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Admin login error:', errMsg);
    return NextResponse.json({ success: false, message: 'Internal authentication error. Please try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = readSession(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session.user });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
