import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE = 'session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export async function GET() {
  const db = await getDb();
  const events = await db.listEvents();
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = /session=([^;]+)/.exec(cookieHeader);
  if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const s = jwt.verify(match[1], AUTH_SECRET) as any;
    if (s?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const body = await req.json().catch(() => ({}));
  const { title, code } = body as { title?: string; code?: string };
  if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });
  const db = await getDb();
  const event = await db.createEvent({ title, code });
  return NextResponse.json({ event });
}
