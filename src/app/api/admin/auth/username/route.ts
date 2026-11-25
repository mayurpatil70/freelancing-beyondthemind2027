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
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
  getLoginUsernames,
  passwordChangeAvailable,
  setAdminUsername,
  usernameLastChanged,
  verifyAdminPassword,
} from '@/lib/security/adminPassword';

export const dynamic = 'force-dynamic';

/** Only the single registered admin session may read or change the username. */
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
  const config = getAdminConfig();
  if (!config.ok) {
    return NextResponse.json({ success: false, message: 'Admin login is not configured on this server.' }, { status: 503 });
  }
  try {
    const names = await getLoginUsernames(config.config.username, config.config.email);
    return NextResponse.json({
      success: true,
      available: passwordChangeAvailable(),
      username: names[0] || '',
      lastChanged: await usernameLastChanged(),
      minLength: USERNAME_MIN_LENGTH,
      maxLength: USERNAME_MAX_LENGTH,
    });
  } catch (err) {
    console.error('Could not read admin username status:', err);
    return NextResponse.json({ success: false, message: 'Could not read username status.' }, { status: 500 });
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
      { success: false, message: 'Username change needs the database (DATABASE_URL) to be configured.' },
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
  // Login trims both fields, so trim here too to keep the two consistent.
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword.trim() : '';
  const newUsername = typeof body?.newUsername === 'string' ? body.newUsername.trim() : '';

  if (!currentPassword || !newUsername) {
    return NextResponse.json({ success: false, message: 'Enter a new username and your current password.' }, { status: 400 });
  }
  if (currentPassword.length > PASSWORD_MAX_LENGTH) {
    return NextResponse.json({ success: false, message: `Passwords can be at most ${PASSWORD_MAX_LENGTH} characters.` }, { status: 400 });
  }
  if (newUsername.length < USERNAME_MIN_LENGTH || newUsername.length > USERNAME_MAX_LENGTH) {
    return NextResponse.json(
      { success: false, message: `The username must be ${USERNAME_MIN_LENGTH} to ${USERNAME_MAX_LENGTH} characters.` },
      { status: 400 }
    );
  }
  if (!USERNAME_PATTERN.test(newUsername)) {
    return NextResponse.json(
      { success: false, message: 'The username can only use letters, numbers and . _ @ + - (no spaces).' },
      { status: 400 }
    );
  }

  try {
    const ok = await verifyAdminPassword(currentPassword, config.config.password);
    if (!ok) {
      const fail = await recordFailedLogin(ip, deviceHash, 'Wrong current password on username change');
      return NextResponse.json(
        {
          success: false,
          message: fail.locked
            ? 'Too many wrong attempts. Username change is locked for 15 minutes.'
            : 'The current password is not correct.',
        },
        { status: fail.locked ? 429 : 401 }
      );
    }

    const currentNames = await getLoginUsernames(config.config.username, config.config.email);
    if (currentNames[0] && currentNames[0].toLowerCase() === newUsername.toLowerCase()) {
      return NextResponse.json({ success: false, message: 'That is already your username.' }, { status: 400 });
    }

    await setAdminUsername(newUsername);
    await recordSuccessfulLogin(ip, deviceHash);
    return NextResponse.json({
      success: true,
      username: newUsername,
      message: `Username changed to "${newUsername}". Use it next time you log in. The old username no longer works.`,
    });
  } catch (err) {
    console.error('Admin username change failed:', err);
    return NextResponse.json({ success: false, message: 'Could not change the username. Please try again.' }, { status: 500 });
  }
}
