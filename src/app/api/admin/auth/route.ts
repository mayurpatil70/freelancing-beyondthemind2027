import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MoolaRetreat@2027#Rishikesh';
const SESSION_COOKIE_NAME = 'btm_admin_session';

export async function POST(req: NextRequest) {
  try {
    const { password, email } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Invalid administrative credentials' }, { status: 401 });
    }

    // Generate signed token session
    const sessionToken = Buffer.from(
      JSON.stringify({
        authenticated: true,
        user: email || 'admin@beyondthemindretreat.org',
        issuedAt: Date.now(),
      })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      user: { email: email || 'admin@beyondthemindretreat.org', role: 'admin' },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Admin login error:', errMsg);
    return NextResponse.json({ success: false, message: 'Authentication error', error: errMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    if (payload.authenticated) {
      return NextResponse.json({ authenticated: true, user: payload.user });
    }
  } catch {
    // Malformed session
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
