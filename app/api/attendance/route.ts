import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE = 'session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = /session=([^;]+)/.exec(cookieHeader);
  if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const s = jwt.verify(match[1], AUTH_SECRET) as any;
    if (s?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const url = new URL(req.url);
  const eventId = url.searchParams.get('eventId') || undefined;
  const db = await getDb();
  const rows = await db.listAttendance(eventId);
  return NextResponse.json({ attendance: rows });
}
