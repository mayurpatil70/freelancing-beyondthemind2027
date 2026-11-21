import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, createSessionToken, readSession } from '@/lib/auth';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'pradeep123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pradeep123';

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
        { success: false, message: 'Invalid username or password. Please check your administrative credentials and try again.' },
        { status: 401 }
      );
    }

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
