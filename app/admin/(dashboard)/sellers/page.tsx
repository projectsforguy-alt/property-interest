import { getSupabaseServiceClient } from '@/lib/supabase';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS, formatBudget } from '@/lib/types';
import type { SellerProperty } from '@/lib/types';

export const metadata = { title: 'Properties | EarlyEggs Admin' };

export default async function AdminSellersPage() {
  const supabase = getSupabaseServiceClient();
  const { data } = await supabase
    .from('seller_properties')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const properties = (data ?? []) as (SellerProperty & { profiles: { first_name: string; last_name: string } | null })[];

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Seller properties</h1>
        <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>{properties.length} properties registered</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Address</th>
              <th>Type</th>
              <th>Price</th>
              <th>Matches</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => {
              const profile = p.profiles;
              const name = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : '—';
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{name}</td>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 200 }}>{p.full_address}</td>
                  <td>{p.property_type ? <span className="badge badge-forest">{PROPERTY_TYPE_LABELS[p.property_type]}</span> : '—'}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{p.asking_price ? formatBudget(p.asking_price) : '—'}</td>
                  <td style={{ fontWeight: 600, color: p.broadcast_buyer_count > 0 ? 'var(--gold-dark)' : 'var(--slate)' }}>
                    {p.broadcast_buyer_count}
                  </td>
                  <td>
                    <span className={`badge ${p.verified ? 'badge-gold' : 'badge-slate'}`}>
                      {p.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td><span className={`badge ${p.status === 'available' ? 'badge-gold' : 'badge-slate'}`}>{PROPERTY_STATUS_LABELS[p.status]}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {new Date(p.created_at).toLocaleDateString('en-GB')}
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
