import { redirect } from 'next/navigation';
import { getSession, requireEmployee } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default async function CheckinPage({ searchParams }: { searchParams: { event?: string; code?: string } }) {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/checkin?event=${encodeURIComponent(searchParams.event || '')}&code=${encodeURIComponent(searchParams.code || '')}`);
  }
  await requireEmployee();
  const { event: eventId, code } = searchParams;
  const db = await getDb();
  if (!eventId || !code) {
    return <div className="text-slate-400">Invalid check-in link.</div>;
  }
  const event = await db.getEventById(eventId);
  if (!event || event.code !== code) {
    return <div className="text-slate-400">Event not found or code mismatch.</div>;
  }
  async function submitCheckin() {
    'use server';
    const sessionInner = await getSession();
    if (!sessionInner?.user?.employeeId) return;
    const dbInner = await getDb();
    await dbInner.recordCheckin({ eventId: eventId!, employeeId: sessionInner.user.employeeId });
  }
  return (
    <div className="max-w-lg mx-auto card p-6 text-center">
      <h1 className="text-xl font-semibold mb-2">{event.title}</h1>
      <p className="text-slate-400 mb-6">Confirm your attendance for this event.</p>
      <form action={submitCheckin}>
        <button className="btn btn-primary w-full" type="submit">Confirm Check-In</button>
      </form>
      <p className="text-sm text-slate-400 mt-4">Employee: {session.user.employeeId}</p>
    </div>
  );
}
