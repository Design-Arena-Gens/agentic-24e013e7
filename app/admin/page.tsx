import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default async function AdminHome() {
  await requireAdmin();
  const db = await getDb();
  const events = await db.listEvents();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link href="/admin/events" className="btn btn-primary">Manage Events</Link>
      </div>
      <div className="card p-4">
        <h2 className="font-semibold mb-2">Recent Events</h2>
        {events.length === 0 ? (
          <p className="text-slate-400">No events yet. Create one in Manage Events.</p>
        ) : (
          <ul className="space-y-2">
            {events.slice(0,5).map(e => (
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
    </div>
  );
}
