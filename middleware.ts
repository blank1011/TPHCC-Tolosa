import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/admin-auth';

const ADMIN_COOKIE_NAME = 'admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLoginPage = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin');
  const isProtectedWriteApi =
    (pathname === '/api/events' || pathname === '/api/churches' || pathname === '/api/extract-facebook-post') &&
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.method !== 'OPTIONS';

  if (!isAdminPath && !isProtectedWriteApi) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || (expectedUser && expectedPass ? `${expectedUser}:${expectedPass}` : '');

  if (!expectedUser || !sessionSecret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Admin authentication is not configured on the server.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value || '';
  const isAuthorized = sessionToken
    ? await verifyAdminSessionToken(sessionToken, sessionSecret, expectedUser)
    : false;

  if (isAdminPath) {
    if (isAdminLoginPage && isAuthorized) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isAdminLoginPage && !isAuthorized) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedWriteApi && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/events', '/api/churches', '/api/extract-facebook-post'],
};