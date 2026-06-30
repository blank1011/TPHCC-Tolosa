import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security';
import { createAdminSessionToken } from '@/lib/admin-auth';

const ADMIN_COOKIE_NAME = 'admin_session';

export async function POST(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'admin:login',
      limit: 10,
      windowMs: 60_000,
    });

    if (rateLimited) {
      return rateLimited;
    }

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || (expectedUsername && expectedPassword ? `${expectedUsername}:${expectedPassword}` : '');

    if (!expectedUsername || !expectedPassword || !sessionSecret) {
      return NextResponse.json({ error: 'Admin authentication is not configured.' }, { status: 503 });
    }

    const body = await request.json();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '');

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createAdminSessionToken(username, sessionSecret);
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Failed to login.' }, { status: 500 });
  }
}