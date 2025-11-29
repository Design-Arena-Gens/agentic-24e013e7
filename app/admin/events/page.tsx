import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default async function EventsPage() {
  await requireAdmin();
  const db = await getDb();
  const events = await db.listEvents();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Events</h1>
        </div>
        {events.length === 0 ? (
          <p className="text-slate-400">No events created yet.</p>
        ) : (
          <ul className="space-y-2">
            {events.map(e => (
              <li key={e.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-slate-400 text-sm">Code: {e.code}</div>
                </div>
                <Link className="btn btn-secondary" href={`/admin/events/${e.id}`}>Open</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CreateEventForm />
    </div>
  );
}

function CreateEventForm() {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-3">Create Event</h2>
      <form action={createEvent} className="space-y-3">
        <div>
          <label className="label">Title</label>
          <input name="title" className="input" placeholder="Daily Standup - Nov 29" required />
        </div>
        <div>
          <label className="label">Custom Code (optional)</label>
          <input name="code" className="input" placeholder="STANDUP-1129" />
        </div>
        <button className="btn btn-primary w-full" type="submit">Create</button>
      </form>
    </div>
  );
}

async function createEvent(formData: FormData) {
  'use server';
  await requireAdmin();
  const title = (formData.get('title') as string)?.trim();
  const codeInput = (formData.get('code') as string)?.trim();
  const db = await getDb();
  const event = await db.createEvent({ title, code: codeInput });
  return { redirect: `/admin/events/${event.id}` } as any;
}
