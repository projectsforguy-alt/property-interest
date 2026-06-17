import Link from 'next/link';
import SignOutButton from './SignOutButton';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Quietly admin</h2>
        <nav>
          <Link href="/admin">All submissions</Link>
        </nav>
        <div style={{ marginTop: 32 }}>
          <SignOutButton />
        </div>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
