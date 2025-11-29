import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE = 'session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  const protectedForAdmin = path.startsWith('/admin');
  const protectedForEmployee = path.startsWith('/employee') || path.startsWith('/checkin');

  if (protectedForAdmin || protectedForEmployee) {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      const next = encodeURIComponent(url.pathname + url.search);
      return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
    }
    try {
      const session = jwt.verify(token, AUTH_SECRET) as any;
      const role = session?.user?.role;
      if (protectedForAdmin && role !== 'admin') {
        return NextResponse.redirect(new URL('/login?role=admin', req.url));
      }
      if (protectedForEmployee && role !== 'employee') {
        return NextResponse.redirect(new URL('/login?role=employee', req.url));
      }
    } catch {
      const next = encodeURIComponent(url.pathname + url.search);
      return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*', '/checkin'],
};
