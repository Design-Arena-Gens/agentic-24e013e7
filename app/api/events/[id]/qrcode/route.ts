import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import QRCode from 'qrcode';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const event = await db.getEventById(params.id);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const url = `${base}/checkin?event=${encodeURIComponent(event.id)}&code=${encodeURIComponent(event.code)}`;
  const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 256 });
  const img = Buffer.from(dataUrl.split(',')[1], 'base64');
  return new NextResponse(img, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' } });
}
