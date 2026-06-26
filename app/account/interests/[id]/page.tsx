import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { INTEREST_TYPE_LABELS, PROPERTY_TYPE_LABELS, BUYING_POSITION_LABELS, TIMELINE_LABELS, formatBudget } from '@/lib/types';
import type { BuyerInterest, Profile } from '@/lib/types';
import DeleteInterestButton from './DeleteInterestButton';

export default async function InterestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase.from('buyer_interests').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!data) notFound();
  const interest = data as BuyerInterest;

  const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const profile = profileData as Profile | null;

  const { data: matchData } = await supabase
    .from('matches')
    .select('*, seller_properties(*)')
    .eq('buyer_interest_id', id)
    .neq('status', 'expired');
  const matches = matchData ?? [];

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">
            {INTEREST_TYPE_LABELS[interest.interest_type]}
            {interest.postcode ? ` · ${interest.postcode}` : ''}
          </h1>
          <p className="account-page-sub">Registered {new Date(interest.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link href="/account" className="btn btn-outline-dark">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="form-section-title">Location</div>
          {interest.full_address && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Address:</strong> {interest.full_address}</div>}
          {interest.street_name && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Street:</strong> {interest.street_name}</div>}
          {interest.area_name && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Area:</strong> {interest.area_name}</div>}
          {interest.postcode && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Postcode:</strong> {interest.postcode}</div>}
          {interest.location_notes && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>{interest.location_notes}</div>}
        </div>
        <div className="card">
          <div className="form-section-title">Preferences</div>
          {interest.property_types && interest.property_types.length > 0 && (
            <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
              <strong>Type:</strong> {interest.property_types.map(t => PROPERTY_TYPE_LABELS[t]).join(', ')}
            </div>
          )}
          {interest.min_bedrooms && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Min bedrooms:</strong> {interest.min_bedrooms}+</div>}
          {interest.max_price && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Budget:</strong> up to {formatBudget(interest.max_price)}</div>}
          {profile?.buying_position && <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}><strong>Position:</strong> {BUYING_POSITION_LABELS[profile.buying_position]}</div>}
          {profile?.timeline && <div style={{ fontSize: 'var(--text-sm)' }}><strong>Timeline:</strong> {TIMELINE_LABELS[profile.timeline]}</div>}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="form-section-title">Matches ({matches.length})</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
            A seller has registered a property that matches your interest.
          </p>
          {matches.map((m: Record<string, unknown>) => (
            <div key={m.id as string} style={{ padding: 'var(--space-3) 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Matched property</div>
                <Link href={`/account/messages/${m.id}`} className="btn btn-primary btn-sm">Open conversation</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {interest.interest_type === 'specific_property' && !interest.approach_requested && (
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Request a private owner approach — £29</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
            We&apos;ll contact the owner of this property on your behalf with a professional letter and a private response link.
          </p>
          <Link href={`/account/interests/${id}/approach`} className="btn btn-primary">Request owner approach</Link>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <DeleteInterestButton interestId={id} />
      </div>
    </>
  );
}
