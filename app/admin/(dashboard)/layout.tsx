import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/adminAuth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);
  if (!valid) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 'var(--space-4)' }}>
          <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 600, color: 'var(--white)', fontSize: 'var(--text-base)' }}>Intentory</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Admin</div>
        </div>
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/buyers" className="admin-nav-item">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Buyers
          </Link>
          <Link href="/admin/sellers" className="admin-nav-item">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            Properties
          </Link>
          <Link href="/admin/matches" className="admin-nav-item">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Matches
          </Link>
        </nav>
        <div style={{ position: 'absolute', bottom: 'var(--space-6)', left: 0, right: 0, padding: '0 var(--space-3)' }}>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="admin-nav-item" style={{ width: '100%', textAlign: 'left' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 15l4-5-4-5M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
