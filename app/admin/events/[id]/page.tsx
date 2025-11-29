import Image from 'next/image';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default async function EventDetail({ params }: { params: { id: string } }) {
  await requireAdmin();
  const db = await getDb();
  const event = await db.getEventById(params.id);
  if (!event) {
    return <div className="text-slate-400">Event not found.</div>;
  }

  const qrUrl = `/api/events/${event.id}/qrcode`;
  const checkinUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/checkin?event=${encodeURIComponent(event.id)}&code=${encodeURIComponent(event.code)}`;

  const attendance = await db.listAttendance(event.id);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card p-6 md:col-span-2">
        <h1 className="text-xl font-semibold mb-2">{event.title}</h1>
        <p className="text-slate-400 mb-4">Code: {event.code}</p>
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="QR Code" className="bg-white rounded p-2" width={256} height={256} />
          <p className="text-sm text-slate-400 break-all">{checkinUrl || `Open /checkin?event=${event.id}&code=${event.code}`}</p>
          <Link className="btn btn-secondary" href={`/checkin?event=${encodeURIComponent(event.id)}&code=${encodeURIComponent(event.code)}`}>Open Check-in Page</Link>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-2">Attendance</h2>
        {attendance.length === 0 ? (
          <p className="text-slate-400">No check-ins yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id}>
                  <td>{a.employeeId}</td>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
