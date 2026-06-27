import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';

export const metadata = { title: 'Messages | EarlyEggs' };

export default async function MessagesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get all non-expired matches for this user
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      id, status, match_type, created_at,
      buyer_interests(interest_type, full_address, street_name, area_name, postcode),
      seller_properties(full_address, postcode)
    `)
    .or(`buyer_user_id.eq.${user!.id},seller_user_id.eq.${user!.id}`)
    .neq('status', 'expired')
    .neq('status', 'declined')
    .order('created_at', { ascending: false });

  const allMatches = matches ?? [];

  // Get message counts per match so we can show which have messages
  const matchIds = allMatches.map(m => (m as Record<string, unknown>).id as string);
  const messageCounts: Record<string, number> = {};
  const lastMessages: Record<string, string> = {};

  if (matchIds.length > 0) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('match_id, body, created_at')
      .in('match_id', matchIds)
      .order('created_at', { ascending: false });

    for (const msg of (msgs ?? [])) {
      const mid = (msg as Record<string, unknown>).match_id as string;
      messageCounts[mid] = (messageCounts[mid] ?? 0) + 1;
      if (!lastMessages[mid]) {
        lastMessages[mid] = (msg as Record<string, unknown>).body as string;
      }
    }
  }

  // Show matches that have messages first, then others
  const withMessages = allMatches.filter(m => messageCounts[(m as Record<string, unknown>).id as string] > 0);
  const withoutMessages = allMatches.filter(m => !messageCounts[(m as Record<string, unknown>).id as string]);

  const displayMatches = [...withMessages, ...withoutMessages];

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Messages</h1>
          <p className="account-page-sub">Private conversations with matched buyers and sellers.</p>
        </div>
      </div>

      {displayMatches.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 48 48" fill="none">
            <path d="M6 10h36a2 2 0 012 2v20a2 2 0 01-2 2H10l-6 6V12a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div className="empty-state-title">No conversations yet</div>
          <p className="empty-state-body">When a buyer and seller are matched, a private conversation opens here.</p>
          <Link href="/account" className="btn btn-outline-dark">View my interests</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {displayMatches.map((m) => {
            const match = m as Record<string, unknown>;
            const id = match.id as string;
            const interest = match.buyer_interests as Record<string, string> | null;
            const property = match.seller_properties as Record<string, string> | null;
            const label = property?.full_address ?? interest?.full_address ?? interest?.street_name ?? interest?.area_name ?? 'Property';
            const hasMessages = messageCounts[id] > 0;
            const preview = lastMessages[id];
            const status = match.status as string;

            return (
              <Link key={id} href={`/account/messages/${id}`} className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', textDecoration: 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{label}</div>
                  {preview ? (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preview}
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)' }}>
                      No messages yet — start the conversation
                    </div>
                  )}
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)', marginTop: 'var(--space-1)' }}>
                    Matched {new Date(match.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                  {hasMessages && (
                    <span className="badge badge-forest">{messageCounts[id]} {messageCounts[id] === 1 ? 'message' : 'messages'}</span>
                  )}
                  <span className={`badge ${status === 'active' ? 'badge-gold' : 'badge-slate'}`}>
                    {status === 'notified' ? 'New match' : status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
