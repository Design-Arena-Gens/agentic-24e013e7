import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getSession } from '@/lib/auth';

export const metadata = {
  title: 'QR Attendance',
  description: 'Admin and Employee QR Attendance Management',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-slate-800/80 sticky top-0 z-10 bg-slate-950/60 backdrop-blur">
          <div className="container flex items-center justify-between h-14">
            <Link href="/" className="font-semibold">QR Attendance</Link>
            <nav className="flex items-center gap-3 text-sm">
              {session?.user ? (
                <>
                  {session.user.role === 'admin' ? (
                    <Link className="btn btn-secondary" href="/admin">Admin</Link>
                  ) : (
                    <Link className="btn btn-secondary" href="/employee">Employee</Link>
                  )}
                  <form action="/api/auth/logout" method="post">
                    <button className="btn btn-primary" type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <Link className="btn btn-primary" href="/login">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-8 text-center text-slate-400 text-sm">? {new Date().getFullYear()} QR Attendance</footer>
      </body>
    </html>
  );
}
