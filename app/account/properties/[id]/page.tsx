import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase';
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, VERIFICATION_STATUS_LABELS, INTEREST_TYPE_LABELS, formatBudget } from '@/lib/types';
import type { SellerProperty, InterestType } from '@/lib/types';

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
    .select('id, status, match_type, buyer_user_id, buyer_interests(interest_type, full_address, street_name, area_name, postcode)')
    .eq('seller_property_id', id)
    .neq('status', 'expired');

  const matches = (matchData ?? []) as {
    id: string;
    status: string;
    match_type: string;
    buyer_user_id: string;
    buyer_interests: { interest_type: InterestType; full_address: string | null; street_name: string | null; area_name: string | null; postcode: string | null } | null;
  }[];

  // Fetch buyer first names only via service client
  const buyerIds = [...new Set(matches.map(m => m.buyer_user_id))];
  const buyerFirstNames: Record<string, string> = {};

  if (buyerIds.length > 0) {
    const service = getSupabaseServiceClient();
    const { data: profiles } = await service
      .from('profiles')
      .select('id, first_name')
      .in('id', buyerIds) as { data: { id: string; first_name: string | null }[] | null; error: unknown };

    for (const p of (profiles ?? [])) {
      buyerFirstNames[p.id] = p.first_name ?? 'Buyer';
    }
  }

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

      {/* Matched buyers */}
      {matches.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Interested buyers ({matches.length})</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
            These buyers have registered interest in your property or area. You can message them privately below.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {matches.map(m => {
              const firstName = buyerFirstNames[m.buyer_user_id] ?? 'Buyer';
              const interest = m.buyer_interests;
              const interestLabel = interest ? INTEREST_TYPE_LABELS[interest.interest_type] : 'Property';
              const location = interest?.full_address ?? interest?.street_name ?? interest?.area_name ?? interest?.postcode ?? '';
              const description = location ? `${interestLabel} interest — ${location}` : `${interestLabel} interest`;

              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) 0', borderTop: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>{firstName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>{description}</div>
                  </div>
                  <Link href={`/account/messages/${m.id}`} className="btn btn-primary btn-sm">
                    Message {firstName}
                  </Link>
                </div>
              );
            })}
          </div>
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
