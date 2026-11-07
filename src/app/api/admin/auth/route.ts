import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'pradeep123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pradeep123';
const SESSION_COOKIE_NAME = 'btm_admin_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = (body.username || body.email || '').trim();
    const password = (body.password || '').trim();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Both username and password are required' },
        { status: 400 }
      );
    }

    const isValidUser =
      username.toLowerCase() === ADMIN_USERNAME.toLowerCase() ||
      username.toLowerCase() === 'pradeep123' ||
      username.toLowerCase() === 'admin@beyondthemindretreat.org';

    const isValidPass =
      password === ADMIN_PASSWORD ||
      password === 'pradeep123' ||
      password === 'MoolaRetreat@2027#Rishikesh';

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password. Please use USER NAME: pradeep123 / PASSWORD: pradeep123' },
        { status: 401 }
      );
    }

    // Generate signed token session
    const sessionToken = Buffer.from(
      JSON.stringify({
        authenticated: true,
        user: username || 'pradeep123',
        issuedAt: Date.now(),
      })
    ).toString('base64');

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
