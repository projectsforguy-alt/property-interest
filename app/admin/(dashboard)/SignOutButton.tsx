'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-secondary btn-small btn-block" onClick={handleSignOut}>
      Sign out
    </button>
  );
}
