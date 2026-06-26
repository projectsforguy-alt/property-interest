import Link from 'next/link';
import { getSupabaseServiceClient } from '@/lib/supabase';
import type { OwnerApproach } from '@/lib/types';

export const metadata = { title: 'Owner approaches | EarlyEggs Admin' };

const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'badge-slate',
  paid: 'badge-amber',
  owner_identified: 'badge-amber',
  letter_sent: 'badge-amber',
  awaiting_response: 'badge-amber',
  responded: 'badge-gold',
  no_response: 'badge-slate',
  opted_out: 'badge-slate',
  failed: 'badge-red',
  refunded: 'badge-slate',
};

export default async function AdminApproachesPage() {
  const supabase = getSupabaseServiceClient();

  const { data } = await supabase
    .from('owner_approaches')
    .select(`
      *,
      profiles(first_name, last_name),
      buyer_interests(full_address, postcode, street_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  const approaches = (data ?? []) as (OwnerApproach & {
    profiles: { first_name: string | null; last_name: string | null } | null;
    buyer_interests: { full_address: string | null; postcode: string | null; street_name: string | null } | null;
  })[];

  const pending = approaches.filter(a => ['paid', 'owner_identified'].includes(a.status));

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Owner approaches</h1>
          <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>
            {approaches.length} total · <strong style={{ color: pending.length > 0 ? 'var(--gold-dark)' : 'var(--slate)' }}>{pending.length} awaiting action</strong>
          </p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Target property</th>
              <th>Owner name</th>
              <th>Owner address</th>
              <th>Letter sent</th>
              <th>Response</th>
              <th>Status</th>
              <th>Paid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {approaches.map(a => {
              const profile = a.profiles;
              const buyerName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : '—';
              const interest = a.buyer_interests;
              const target = interest?.full_address ?? interest?.street_name ?? interest?.postcode ?? '—';
              return (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{buyerName}</td>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 160 }}>{target}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{a.owner_name ?? '—'}</td>
                  <td style={{ fontSize: 'var(--text-xs)', maxWidth: 160 }}>{a.owner_address ?? '—'}</td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {a.letter_sent_date ? new Date(a.letter_sent_date).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td>
                    {a.owner_response
                      ? <span className="badge badge-gold">{a.owner_response.replace(/_/g, ' ')}</span>
                      : <span style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)' }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[a.status] ?? 'badge-slate'}`}>
                      {a.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {new Date(a.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <Link href={`/admin/approaches/${a.id}`} className="btn btn-outline-dark btn-sm">Edit</Link>
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
