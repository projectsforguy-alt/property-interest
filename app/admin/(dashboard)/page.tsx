import Link from 'next/link';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const metadata = { title: 'Admin | Intentory' };

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServiceClient();

  const [{ count: buyerCount }, { count: sellerCount }, { count: matchCount }, { count: messageCount }] =
    await Promise.all([
      supabase.from('buyer_interests').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('seller_properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
    ]);

  const { data: recentMatches } = await supabase
    .from('matches')
    .select('*, buyer_interests(interest_type, postcode, full_address), seller_properties(full_address, postcode)')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Dashboard</h1>
        <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>Intentory platform overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Active buyer interests', value: buyerCount ?? 0, href: '/admin/buyers' },
          { label: 'Available properties', value: sellerCount ?? 0, href: '/admin/properties' },
          { label: 'Matches', value: matchCount ?? 0, href: '/admin/matches' },
          { label: 'Messages sent', value: messageCount ?? 0, href: '/admin/messages' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', marginTop: 'var(--space-2)' }}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Match</th>
              <th>Buyer interest</th>
              <th>Seller property</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(recentMatches ?? []).map((m: Record<string, unknown>) => {
              const interest = m.buyer_interests as Record<string, string> | null;
              const property = m.seller_properties as Record<string, string> | null;
              return (
                <tr key={m.id as string}>
                  <td><Link href={`/admin/matches/${m.id}`} style={{ color: 'var(--teal)', fontWeight: 500 }}>{(m.id as string).slice(0, 8)}…</Link></td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{interest?.full_address ?? interest?.postcode ?? '—'}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{property?.full_address ?? '—'}</td>
                  <td><span className="badge badge-teal">{m.status as string}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                    {new Date(m.created_at as string).toLocaleDateString('en-GB')}
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
