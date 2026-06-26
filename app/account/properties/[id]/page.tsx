import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, VERIFICATION_STATUS_LABELS, formatBudget } from '@/lib/types';
import type { SellerProperty } from '@/lib/types';

export const metadata = { title: 'Property | EarlyEggs' };

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('seller_properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) notFound();
  const property = data as SellerProperty;

  const verificationStatus = property.verification_status ?? 'unverified';
  const isVerified = property.verified;
  const hasBroadcast = !!property.broadcast_sent_at;

  const { data: matchData } = await supabase
    .from('matches')
    .select('id, status, match_type')
    .eq('seller_property_id', id)
    .neq('status', 'expired');

  const matches = matchData ?? [];

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">{property.full_address}</h1>
          <p className="account-page-sub">
            {property.property_type ? PROPERTY_TYPE_LABELS[property.property_type] : 'Property'} · {PROPERTY_STATUS_LABELS[property.status]}
          </p>
        </div>
        <Link href="/account/properties" className="btn btn-outline-dark">← Back</Link>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="card">
          <div className="form-section-title">Property details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
            <div><strong>Address:</strong> {property.full_address}</div>
            <div><strong>Postcode:</strong> {property.postcode}</div>
            {property.property_type && <div><strong>Type:</strong> {PROPERTY_TYPE_LABELS[property.property_type]}</div>}
            {property.bedrooms && <div><strong>Bedrooms:</strong> {property.bedrooms}</div>}
            {property.asking_price && <div><strong>Asking price:</strong> {formatBudget(property.asking_price)}</div>}
            {property.seller_notes && (
              <div style={{ marginTop: 'var(--space-2)', color: 'var(--slate)', lineHeight: 1.6 }}>{property.seller_notes}</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="form-section-title">Ownership verification</div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span className={`badge ${isVerified ? 'badge-gold' : 'badge-slate'}`}>
              {VERIFICATION_STATUS_LABELS[verificationStatus as keyof typeof VERIFICATION_STATUS_LABELS] ?? 'Unverified'}
            </span>
          </div>
          {!isVerified && (
            <>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-4)' }}>
                Verifying ownership unlocks email notifications for future buyer approaches and shows a verified badge to matched buyers.
              </p>
              <Link href={`/account/properties/${id}/verify`} className="btn btn-outline-dark btn-sm">
                {verificationStatus === 'unverified' ? 'Start verification' : 'Continue verification'}
              </Link>
            </>
          )}
          {isVerified && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65 }}>
              Your ownership is confirmed. Future buyer approaches can be delivered by email.
            </p>
          )}
        </div>
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Matched buyers ({matches.length})</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
            These buyers have registered interest that overlaps with your property.
          </p>
          {matches.map((m: { id: string; status: string; match_type: string }) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                <span className="badge badge-forest" style={{ marginRight: 'var(--space-2)' }}>{m.match_type.replace(/_/g, ' ')}</span>
                <span style={{ color: 'var(--slate)' }}>{m.status}</span>
              </div>
              <Link href={`/account/messages/${m.id}`} className="btn btn-primary btn-sm">Open conversation</Link>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast CTA */}
      {!hasBroadcast && property.status === 'available' && (
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', marginBottom: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Broadcast to nearby buyers — £49</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-4)' }}>
            Reach buyers within 2 miles who aren&apos;t already matched to your property. Active for 30 days.
          </p>
          <Link href={`/account/properties/${id}/broadcast`} className="btn btn-primary">Broadcast to buyers</Link>
        </div>
      )}

      {hasBroadcast && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Broadcast</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>
            Broadcast sent to {property.broadcast_buyer_count} {property.broadcast_buyer_count === 1 ? 'buyer' : 'buyers'} on {property.broadcast_sent_at ? new Date(property.broadcast_sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}.
          </p>
        </div>
      )}
    </>
  );
}
