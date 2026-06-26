import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServiceClient } from '@/lib/supabase';
import type { OwnerApproach } from '@/lib/types';
import AdminApproachEditForm from './AdminApproachEditForm';

export default async function AdminApproachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServiceClient();

  const { data } = await supabase
    .from('owner_approaches')
    .select(`
      *,
      profiles(first_name, last_name),
      buyer_interests(full_address, postcode, street_name, interest_type, buyer_message)
    `)
    .eq('id', id)
    .single();

  if (!data) notFound();

  const approach = data as OwnerApproach & {
    profiles: { first_name: string | null; last_name: string | null } | null;
    buyer_interests: {
      full_address: string | null;
      postcode: string | null;
      street_name: string | null;
      interest_type: string;
      buyer_message: string | null;
    } | null;
  };

  const profile = approach.profiles;
  const buyerName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : '—';
  const interest = approach.buyer_interests;
  const target = interest?.full_address ?? interest?.street_name ?? interest?.postcode ?? '—';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.earlyeggs.com';
  const responseUrl = approach.response_code ? `${baseUrl}/respond/${approach.response_code}` : null;

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Owner approach</h1>
          <p style={{ color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>{buyerName} → {target}</p>
        </div>
        <Link href="/admin/approaches" className="btn btn-outline-dark btn-sm">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        {/* Buyer & interest */}
        <div className="card">
          <div className="form-section-title">Buyer details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
            <div><strong>Buyer:</strong> {buyerName}</div>
            <div><strong>Target:</strong> {target}</div>
            {interest?.buyer_message && (
              <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', color: 'var(--slate)', lineHeight: 1.6 }}>
                &ldquo;{interest.buyer_message}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Response link */}
        <div className="card">
          <div className="form-section-title">Response link</div>
          {responseUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', background: 'var(--surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', wordBreak: 'break-all', color: 'var(--forest)' }}>
                {responseUrl}
              </div>
              <a href={responseUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm" style={{ width: 'fit-content' }}>
                Test link ↗
              </a>
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--mist)' }}>No response code yet.</p>
          )}

          {approach.owner_response && (
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>Owner responded</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--forest)' }}>{approach.owner_response.replace(/_/g, ' ')}</div>
              {approach.owner_message && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>{approach.owner_message}</p>}
              {approach.owner_response_at && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)', marginTop: 'var(--space-1)' }}>{new Date(approach.owner_response_at).toLocaleDateString('en-GB')}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <AdminApproachEditForm approach={approach} />
    </>
  );
}
