import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';

const AUTH_COOKIE = 'session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = /session=([^;]+)/.exec(cookieHeader);
  if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let employeeId: string | undefined;
  try {
    const s = jwt.verify(match[1], AUTH_SECRET) as any;
    if (s?.user?.role !== 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    employeeId = s.user.employeeId;
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const body = await req.json().catch(() => ({}));
  const { eventId, code } = body as { eventId?: string; code?: string };
  if (!eventId || !code) return NextResponse.json({ error: 'Missing event' }, { status: 400 });
  const db = await getDb();
  const event = await db.getEventById(eventId);
  if (!event || event.code !== code) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  await db.recordCheckin({ eventId, employeeId: employeeId! });
  return NextResponse.json({ ok: true });
}
