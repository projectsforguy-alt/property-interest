import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS, formatBudget } from '@/lib/types';
import type { SellerProperty } from '@/lib/types';

export const metadata = { title: 'My properties | EarlyEggs' };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const params = await searchParams;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('seller_properties')
    .select('*')
    .eq('user_id', user!.id)
    .neq('status', 'withdrawn')
    .order('created_at', { ascending: false });

  const properties = (data ?? []) as SellerProperty[];

  // Fetch match counts for all properties in one query
  const { data: matchData } = await supabase
    .from('matches')
    .select('seller_property_id')
    .eq('seller_user_id', user!.id)
    .neq('status', 'expired');

  const matchCounts: Record<string, number> = {};
  for (const m of (matchData ?? [])) {
    const pid = m.seller_property_id as string;
    matchCounts[pid] = (matchCounts[pid] ?? 0) + 1;
  }

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">My properties</h1>
          <p className="account-page-sub">Properties you have registered as privately available.</p>
        </div>
        <Link href="/account/properties/add" className="btn btn-primary">+ Register a property</Link>
      </div>

      {params.added && (
        <div style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--gold-dark)' }}>
          ✓ Property registered. We&apos;re checking for matched buyers now.
        </div>
      )}

      {properties.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 48 48" fill="none">
            <path d="M6 20L24 6l18 14v22a2 2 0 01-2 2H8a2 2 0 01-2-2V20z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M18 42V28h12v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div className="empty-state-title">No properties registered yet</div>
          <p className="empty-state-body">Register a property as privately available and we&apos;ll match it to buyers who have already registered interest in your area.</p>
          <Link href="/account/properties/add" className="btn btn-primary">Register a property</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {properties.map(p => {
            const matchCount = matchCounts[p.id] ?? 0;
            const hasMatches = matchCount > 0;

            return (
              <div key={p.id} className="card" style={{
                border: hasMatches ? '1.5px solid var(--gold)' : undefined,
              }}>
                {/* Match alert banner */}
                {hasMatches && (
                  <div style={{
                    background: 'var(--gold)',
                    margin: 'calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-5)',
                    padding: 'var(--space-3) var(--space-5)',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" fill="var(--forest)" fillOpacity="0.15" />
                        <circle cx="10" cy="10" r="4" fill="var(--forest)" />
                      </svg>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--forest)' }}>
                        {matchCount} interested {matchCount === 1 ? 'buyer' : 'buyers'}
                      </span>
                    </div>
                    <Link href={`/account/properties/${p.id}`} className="btn btn-sm" style={{ background: 'var(--forest)', color: 'var(--white)', border: 'none' }}>
                      View buyers
                    </Link>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', lineHeight: 1.3, marginBottom: 'var(--space-2)' }}>
                      {p.full_address}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                      {p.property_type && (
                        <span className="badge badge-forest">{PROPERTY_TYPE_LABELS[p.property_type]}</span>
                      )}
                      <span className={`badge ${p.status === 'available' ? 'badge-gold' : 'badge-slate'}`}>
                        {PROPERTY_STATUS_LABELS[p.status]}
                      </span>
                      {p.asking_price && (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                          Asking {formatBudget(p.asking_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                    <Link href={`/account/properties/${p.id}`} className="btn btn-outline-dark btn-sm">View</Link>
                    {!p.broadcast_sent_at && p.status === 'available' && (
                      <Link href={`/account/properties/${p.id}/broadcast`} className="btn btn-primary btn-sm">
                        Broadcast — £49
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
