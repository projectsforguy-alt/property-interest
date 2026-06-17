import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import SignOutButton from './SignOutButton';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const name = user.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
    : user.email ?? 'Your account';

  return (
    <div className="account-shell">
      <aside className="account-sidebar">
        <div className="account-sidebar-user">
          <div className="account-sidebar-name">{name}</div>
          <div className="account-sidebar-email">{user.email}</div>
        </div>
        <nav className="account-nav" aria-label="Account">
          <div className="account-nav-section">Buying</div>
          <Link href="/account" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            My interests
          </Link>
          <Link href="/account/add-interest" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add interest
          </Link>
          <div className="account-nav-section">Selling</div>
          <Link href="/account/properties" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            My properties
          </Link>
          <Link href="/account/properties/add" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Register a property
          </Link>
          <div className="account-nav-section">Account</div>
          <Link href="/account/messages" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 2V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Messages
          </Link>
          <Link href="/account/profile" className="account-nav-item">
            <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Profile &amp; settings
          </Link>
          <SignOutButton />
        </nav>
      </aside>
      <div className="account-content">{children}</div>
    </div>
  );
}
