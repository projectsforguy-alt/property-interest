'use client';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }
  return (
    <button onClick={signOut} className="account-nav-item" style={{ textAlign: 'left', width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
      <svg className="account-nav-icon" viewBox="0 0 20 20" fill="none">
        <path d="M13 15l4-5-4-5M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Sign out
    </button>
  );
}
