import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { role } = body as { role?: 'admin' | 'employee' };
  const db = await getDb();

  if (role === 'admin') {
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    const ok = await db.verifyAdmin(email, password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = createSessionToken({ role: 'admin', email });
    const cookieStore = await cookies();
    cookieStore.set('session', token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
    return NextResponse.json({ ok: true });
  }

  if (role === 'employee') {
    const { employeeId, pin } = body as { employeeId?: string; pin?: string };
    if (!employeeId || !pin) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    const ok = await db.verifyEmployee(employeeId, pin);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = createSessionToken({ role: 'employee', employeeId });
    const cookieStore = await cookies();
    cookieStore.set('session', token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown role' }, { status: 400 });
}
