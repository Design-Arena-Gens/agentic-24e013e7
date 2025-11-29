import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-2">For Admins</h2>
        <p className="text-slate-300 mb-4">Create attendance events and display QR codes for quick employee check-ins. View attendance in real time.</p>
        <div className="flex gap-3">
          <Link className="btn btn-primary" href="/admin">Go to Admin</Link>
          <Link className="btn btn-secondary" href="/login?role=admin">Admin Login</Link>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-2">For Employees</h2>
        <p className="text-slate-300 mb-4">Scan the event QR to open the check-in page, then confirm to record your attendance.</p>
        <div className="flex gap-3">
          <Link className="btn btn-primary" href="/employee">Go to Employee</Link>
          <Link className="btn btn-secondary" href="/login?role=employee">Employee Login</Link>
        </div>
      </div>
    </div>
  );
}
