import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { SESSION_COOKIE_NAME, createSessionToken, readSession } from '@/lib/auth';
import {
  getClientIp,
  getClientFingerprint,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from '@/lib/security/rateLimit';
import {
  checkSingleSessionLogin,
  registerActiveSession,
  clearActiveSession,
  getActiveSession,
  touchActiveSession,
} from '@/lib/security/singleSession';
import { adminConfigErrorMessage, getAdminConfig } from '@/lib/security/adminConfig';
import { verifyAdminPassword } from '@/lib/security/adminPassword';

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
  // 0. Refuse to run without explicit credentials. There are no defaults.
  const adminConfig = getAdminConfig();
  if (!adminConfig.ok) {
    const message = adminConfigErrorMessage(adminConfig.missing);
    console.error(message);
    return NextResponse.json({ success: false, message }, { status: 503 });
  }
  const { username: configuredUsername, email: configuredEmail, password: configuredPassword } = adminConfig.config;

  const ip = getClientIp(req);
  const clientDeviceId = req.headers.get('x-client-device-id') || undefined;
  const deviceHash = getClientFingerprint(req, clientDeviceId);

  // 1. Rate Limiting Check (Device + IP)
  const rateLimitStatus = await checkLoginRateLimit(ip, deviceHash);
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

  // 2. Strict Single Active Session Enforcement (Only 1 device/IP logged in at a time)
  const singleSessionStatus = await checkSingleSessionLogin(ip, deviceHash);
  if (!singleSessionStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        singleSessionBlocked: true,
        message:
          singleSessionStatus.reason ||
          'An administrative session is currently active on another device or IP address. To prevent unauthorized multi-device access, please log out from the other device first.',
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      await recordFailedLogin(ip, deviceHash, 'Malformed JSON payload');
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
      await recordFailedLogin(ip, deviceHash, 'Abnormally large credentials submitted');
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

    const expectedUsername = configuredUsername.toLowerCase();
    const expectedEmail = configuredEmail.toLowerCase();

    // Timing-safe user check
    const isUserMatch = timingSafeCompare(username.toLowerCase(), expectedUsername);
    const isEmailMatch = expectedEmail ? timingSafeCompare(username.toLowerCase(), expectedEmail) : false;
    const isValidUser = isUserMatch || isEmailMatch;

    // Password check: a password changed in the admin panel wins over ADMIN_PASSWORD.
    const isValidPass = await verifyAdminPassword(password, configuredPassword);

    if (!isValidUser || !isValidPass) {
      const failResult = await recordFailedLogin(ip, deviceHash, `Invalid credentials for user: ${username.slice(0, 16)}`);

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
    await recordSuccessfulLogin(ip, deviceHash);

    const sessionToken = createSessionToken(username);

    // Register active session to lock other devices out until this device logs out
    await registerActiveSession(sessionToken, ip, deviceHash, req.headers.get('user-agent') || 'admin-agent');

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      user: { username, role: 'admin' },
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
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = readSession(token);
  if (!session || !token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Verify that this token matches the registered single active session
  const activeSession = await getActiveSession();
  if (!activeSession || activeSession.token !== token) {
    return NextResponse.json({ authenticated: false, reason: 'Logged out or replaced by another active session' }, { status: 401 });
  }

  await touchActiveSession(token);
  return NextResponse.json({ authenticated: true, user: session.user });
}

export async function DELETE() {
  await clearActiveSession();
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
