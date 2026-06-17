'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';


export default function DeleteInterestButton({ interestId }: { interestId: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm('Remove this interest? This cannot be undone.')) return;
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await supabase.from('buyer_interests').update({ status: 'removed' }).eq('id', interestId);
    router.push('/account');
    router.refresh();
  }
  return (
    <button onClick={handleDelete} className="btn btn-outline-dark" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
      Remove interest
    </button>
  );
}
