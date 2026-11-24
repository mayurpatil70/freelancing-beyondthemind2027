import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, readSession } from '@/lib/auth';
import { getActiveSession } from '@/lib/security/singleSession';
import { getAdminConfig } from '@/lib/security/adminConfig';
import {
  getClientIp,
  getClientFingerprint,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from '@/lib/security/rateLimit';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  passwordChangeAvailable,
  passwordLastChanged,
  setAdminPassword,
  verifyAdminPassword,
} from '@/lib/security/adminPassword';

export const dynamic = 'force-dynamic';

/** Only the single registered admin session may read or change the password. */
async function isActiveAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !readSession(token)) return false;
  const active = await getActiveSession();
  return Boolean(active && active.token === token);
}

export async function GET(req: NextRequest) {
  if (!(await isActiveAdmin(req))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json({
      success: true,
      available: passwordChangeAvailable(),
      lastChanged: await passwordLastChanged(),
      minLength: PASSWORD_MIN_LENGTH,
    });
  } catch (err) {
    console.error('Could not read admin password status:', err);
    return NextResponse.json({ success: false, message: 'Could not read password status.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isActiveAdmin(req))) {
    return NextResponse.json({ success: false, message: 'Your session has ended. Please log in again.' }, { status: 401 });
  }

  const config = getAdminConfig();
  if (!config.ok) {
    return NextResponse.json({ success: false, message: 'Admin login is not configured on this server.' }, { status: 503 });
  }

  if (!passwordChangeAvailable()) {
    return NextResponse.json(
      { success: false, message: 'Password change needs the database (DATABASE_URL) to be configured.' },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const deviceHash = getClientFingerprint(req, req.headers.get('x-client-device-id') || undefined);

  const limit = await checkLoginRateLimit(ip, deviceHash);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: limit.reason || 'Too many wrong attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const body = await req.json().catch(() => null);
  // Login trims the password, so trim here too to keep the two consistent.
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword.trim() : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword.trim() : '';

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ success: false, message: 'Enter your current password and a new password.' }, { status: 400 });
  }
  if (currentPassword.length > PASSWORD_MAX_LENGTH || newPassword.length > PASSWORD_MAX_LENGTH) {
    return NextResponse.json({ success: false, message: `Passwords can be at most ${PASSWORD_MAX_LENGTH} characters.` }, { status: 400 });
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { success: false, message: `The new password must be at least ${PASSWORD_MIN_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    const ok = await verifyAdminPassword(currentPassword, config.config.password);
    if (!ok) {
      const fail = await recordFailedLogin(ip, deviceHash, 'Wrong current password on password change');
      return NextResponse.json(
        {
          success: false,
          message: fail.locked
            ? 'Too many wrong attempts. Password change is locked for 15 minutes.'
            : 'The current password is not correct.',
        },
        { status: fail.locked ? 429 : 401 }
      );
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ success: false, message: 'The new password must be different from the current one.' }, { status: 400 });
    }

    await setAdminPassword(newPassword);
    await recordSuccessfulLogin(ip, deviceHash);
    return NextResponse.json({ success: true, message: 'Password changed. Use the new password next time you log in.' });
  } catch (err) {
    console.error('Admin password change failed:', err);
    return NextResponse.json({ success: false, message: 'Could not change the password. Please try again.' }, { status: 500 });
  }
}
