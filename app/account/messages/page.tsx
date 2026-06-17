import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';

export const metadata = { title: 'Messages | Intentory' };

export default async function MessagesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      id, status, match_type, created_at,
      buyer_interests(interest_type, full_address, street_name, area_name, postcode),
      seller_properties(full_address, postcode)
    `)
    .or(`buyer_user_id.eq.${user!.id},seller_user_id.eq.${user!.id}`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const activeMatches = matches ?? [];

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Messages</h1>
          <p className="account-page-sub">Private conversations with matched buyers and sellers.</p>
        </div>
      </div>

      {activeMatches.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 48 48" fill="none">
            <path d="M6 10h36a2 2 0 012 2v20a2 2 0 01-2 2H10l-6 6V12a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div className="empty-state-title">No active conversations</div>
          <p className="empty-state-body">Conversations open when a buyer and seller have been matched and both choose to proceed.</p>
          <Link href="/account" className="btn btn-outline-dark">View my interests</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {activeMatches.map((m: Record<string, unknown>) => {
            const interest = m.buyer_interests as Record<string, string> | null;
            const property = m.seller_properties as Record<string, string> | null;
            const label = property?.full_address ?? interest?.full_address ?? interest?.street_name ?? interest?.area_name ?? 'Property';
            return (
              <Link key={m.id as string} href={`/account/messages/${m.id}`} className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', textDecoration: 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{label}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', marginTop: 4 }}>
                    Match opened {new Date(m.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span className="badge badge-teal">Active</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
