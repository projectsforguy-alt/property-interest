import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { INTEREST_TYPE_LABELS, PROPERTY_TYPE_LABELS, BUYING_POSITION_LABELS, TIMELINE_LABELS, formatBudget, isContactBlocked } from '@/lib/types';
import type { BuyerInterest, Profile, OwnerApproach } from '@/lib/types';
import DeleteInterestButton from './DeleteInterestButton';

const APPROACH_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid — awaiting owner research',
  owner_identified: 'Owner identified — letter being prepared',
  letter_sent: 'Letter sent — awaiting response',
  awaiting_response: 'Awaiting response',
  responded: 'Owner responded',
  no_response: 'No response received',
  opted_out: 'Owner opted out',
};

const OWNER_RESPONSE_LABELS: Record<string, { label: string; desc: string; colour: string }> = {
  not_interested: {
    label: 'Not interested',
    desc: 'The owner has indicated they do not wish to sell and do not want further contact.',
    colour: 'var(--slate)',
  },
  not_considering: {
    label: 'Not currently considering selling',
    desc: 'The owner is not thinking of selling at this time but has not ruled it out. Your interest remains active.',
    colour: 'var(--slate)',
  },
  open_to_offer: {
    label: 'Open to hearing more',
    desc: 'The owner is open to a conversation. Submit an offer figure below and they will decide whether to proceed.',
    colour: 'var(--gold-dark)',
  },
  ready_to_connect: {
    label: 'Ready to connect',
    desc: 'The owner is actively considering selling and has agreed to an introduction. A referral agreement has been triggered.',
    colour: 'var(--forest)',
  },
};

export default async function InterestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('buyer_interests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!data) notFound();
  const interest = data as BuyerInterest;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const profile = profileData as Profile | null;

  const { data: matchData } = await supabase
    .from('matches')
    .select('*, seller_properties(*)')
    .eq('buyer_interest_id', id)
    .neq('status', 'expired');
  const matches = matchData ?? [];

  // Fetch approach if one exists
  const { data: approachData } = await supabase
    .from('owner_approaches')
    .select('*')
    .eq('buyer_interest_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: OwnerApproach | null; error: unknown };

  const approach = approachData;

  // Is a follow-up prompt due? (21 days since letter sent, no response)
  const showFollowUpPrompt = approach &&
    approach.status === 'letter_sent' &&
    !approach.owner_response &&
    approach.letter_sent_date &&
    (Date.now() - new Date(approach.letter_sent_date).getTime()) > 21 * 24 * 60 * 60 * 1000;

  const isBlocked = isContactBlocked(approach?.contact_blocked_until ?? null);

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">
            {INTEREST_TYPE_LABELS[interest.interest_type]}
            {interest.postcode ? ` · ${interest.postcode}` : ''}
          </h1>
          <p className="account-page-sub">
            Registered {new Date(interest.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/account" className="btn btn-outline-dark">← Back</Link>
      </div>

      {/* Location + Preferences */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
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

      {/* Matches */}
      {matches.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
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

      {/* Owner approach status */}
      {approach && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Owner approach</div>

          {/* Current status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <span className={`badge ${approach.status === 'responded' ? 'badge-gold' : approach.status === 'no_response' || approach.status === 'opted_out' ? 'badge-slate' : 'badge-amber'}`}>
              {APPROACH_STATUS_LABELS[approach.status] ?? approach.status.replace(/_/g, ' ')}
            </span>
            {approach.letter_sent_date && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)' }}>
                Letter sent {new Date(approach.letter_sent_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          {/* Owner response */}
          {approach.owner_response && OWNER_RESPONSE_LABELS[approach.owner_response] && (() => {
            const r = OWNER_RESPONSE_LABELS[approach.owner_response!];
            return (
              <div style={{ padding: 'var(--space-4)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: 'var(--space-3)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: r.colour, marginBottom: 'var(--space-1)' }}>
                  {r.label}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                {approach.owner_message && (
                  <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', fontSize: 'var(--text-sm)', color: 'var(--forest)', lineHeight: 1.65, fontStyle: 'italic' }}>
                    &ldquo;{approach.owner_message}&rdquo;
                  </div>
                )}
                {approach.owner_response_at && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)', marginTop: 'var(--space-2)' }}>
                    Responded {new Date(approach.owner_response_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 2-year block notice */}
          {isBlocked && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', padding: 'var(--space-3)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              This owner has requested no further contact until {approach.contact_blocked_until ? new Date(approach.contact_blocked_until).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}.
            </div>
          )}
        </div>
      )}

      {/* Follow-up prompt */}
      {showFollowUpPrompt && !isBlocked && (
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', marginBottom: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>No response yet — send a follow-up?</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-4)' }}>
            It has been more than 21 days since your letter was sent. A polite follow-up letter can increase the chance of a response.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link href={`/account/interests/${id}/followup`} className="btn btn-primary btn-sm">
              Send follow-up letter — £29
            </Link>
            <Link href={`/account/interests/${id}/outreach`} className="btn btn-outline-dark btn-sm">
              Try street outreach instead — £99
            </Link>
          </div>
        </div>
      )}

      {/* Owner approach CTA — not yet requested, not blocked */}
      {interest.interest_type === 'specific_property' && !interest.approach_requested && !isBlocked && (
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', marginBottom: 'var(--space-5)' }}>
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
