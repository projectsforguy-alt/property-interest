import { getSupabaseServiceClient } from '@/lib/supabase';
import { MATCH_TYPE_LABELS } from '@/lib/types';
import type { Match } from '@/lib/types';

export const metadata = { title: 'Matches | Intentory Admin' };

export default async function AdminMatchesPage() {
  const supabase = getSupabaseServiceClient();
  const { data } = await supabase
    .from('matches')
    .select('*, buyer_interests(interest_type, full_address, street_name, area_name, postcode), seller_properties(full_address, postcode)')
    .order('created_at', { ascending: false })
    .limit(100);

  const matches = (data ?? []) as (Match & {
    buyer_interests: Record<string, string> | null;
    seller_properties: Record<string, string> | null;
  })[];

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Matches</h1>
        <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>{matches.length} matches created</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer interest</th>
              <th>Seller property</th>
              <th>Match type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => {
              const interest = m.buyer_interests;
              const property = m.seller_properties;
              const buyerLabel = interest?.full_address ?? interest?.street_name ?? interest?.area_name ?? interest?.postcode ?? '—';
              const sellerLabel = property?.full_address ?? property?.postcode ?? '—';
              return (
                <tr key={m.id}>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 180 }}>{buyerLabel}</td>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 180 }}>{sellerLabel}</td>
                  <td><span className="badge badge-navy">{MATCH_TYPE_LABELS[m.match_type]}</span></td>
                  <td><span className={`badge ${m.status === 'active' ? 'badge-teal' : 'badge-slate'}`}>{m.status}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {new Date(m.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
