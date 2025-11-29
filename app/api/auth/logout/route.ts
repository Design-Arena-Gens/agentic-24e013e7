import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 0 });
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
