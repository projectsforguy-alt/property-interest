import Link from 'next/link';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { INTEREST_TYPE_LABELS, INTEREST_STATUS_LABELS } from '@/lib/types';
import type { BuyerInterest } from '@/lib/types';

export const metadata = { title: 'Buyers | Intentory Admin' };

export default async function AdminBuyersPage() {
  const supabase = getSupabaseServiceClient();
  const { data } = await supabase
    .from('buyer_interests')
    .select('*, profiles(first_name, last_name, buying_position)')
    .order('created_at', { ascending: false })
    .limit(100);

  const interests = (data ?? []) as (BuyerInterest & { profiles: { first_name: string; last_name: string; buying_position: string } | null })[];

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Buyer interests</h1>
        <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>{interests.length} total registrations</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Type</th>
              <th>Location</th>
              <th>Postcode</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {interests.map(i => {
              const profile = i.profiles;
              const name = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : '—';
              const location = i.full_address ?? i.street_name ?? i.area_name ?? '—';
              return (
                <tr key={i.id}>
                  <td style={{ fontWeight: 500 }}>{name}</td>
                  <td><span className="badge badge-navy">{INTEREST_TYPE_LABELS[i.interest_type]}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 200 }}>{location}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>{i.postcode ?? '—'}</td>
                  <td><span className={`badge ${i.status === 'active' ? 'badge-teal' : 'badge-slate'}`}>{INTEREST_STATUS_LABELS[i.status]}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {new Date(i.created_at).toLocaleDateString('en-GB')}
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
