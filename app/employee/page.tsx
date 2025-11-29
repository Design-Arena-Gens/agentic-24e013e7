import Link from 'next/link';
import { requireEmployee, getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default async function EmployeeHome() {
  await requireEmployee();
  const session = await getSession();
  const db = await getDb();
  const events = await db.listEvents();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Employee Portal</h1>
      <div className="text-slate-300">Logged in as <span className="font-semibold">{session?.user?.employeeId}</span></div>
      <div className="card p-6">
        <h2 className="font-semibold mb-2">Active Events</h2>
        {events.length === 0 ? (
          <p className="text-slate-400">No active events. Ask your admin.</p>
        ) : (
          <ul className="space-y-2">
            {events.map(e => (
              <li key={e.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-slate-400 text-sm">Code: {e.code}</div>
                </div>
                <Link className="btn btn-secondary" href={`/checkin?event=${encodeURIComponent(e.id)}&code=${encodeURIComponent(e.code)}`}>Check In</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
