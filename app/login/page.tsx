"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const search = useSearchParams();
  const next = search.get('next') || '/';
  const defaultRole = (search.get('role') as 'admin' | 'employee') || 'employee';
  const [role, setRole] = useState<'admin' | 'employee'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (defaultRole) setRole(defaultRole);
  }, [defaultRole]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = role === 'admin'
      ? { role, email, password }
      : { role, employeeId, pin };

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Login failed');
      return;
    }
    router.push(next || (role === 'admin' ? '/admin' : '/employee'));
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <div className="flex gap-2 mb-4">
        <button className={`btn ${role === 'employee' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setRole('employee')}>Employee</button>
        <button className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setRole('admin')}>Admin</button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {role === 'admin' ? (
          <>
            <div>
              <label className="label">Email</label>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@company.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="????????" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="label">Employee ID</label>
              <input className="input" value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="E001" />
            </div>
            <div>
              <label className="label">PIN</label>
              <input type="password" className="input" value={pin} onChange={e => setPin(e.target.value)} placeholder="1234" />
            </div>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="btn btn-primary w-full" type="submit">Sign In</button>
      </form>

      <div className="mt-4 text-sm text-slate-400">
        <p>Demo credentials:</p>
        <ul className="list-disc pl-5">
          <li>Admin: admin@company.com / admin123</li>
          <li>Employee: E001 / 1234</li>
        </ul>
      </div>
    </div>
  );
}
