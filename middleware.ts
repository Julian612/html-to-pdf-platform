import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';
const LOGIN_PATH = '/admin/login';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return new TextEncoder().encode('dev-secret-change-in-production-32chars!!');
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin/login itself)
  if (!pathname.startsWith('/admin') || pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
