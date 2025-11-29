import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const event = await db.getEventById(params.id);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}
