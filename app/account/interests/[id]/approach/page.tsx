import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import { PAID_ACTION_PRICES, formatPrice } from '@/lib/types';
import type { BuyerInterest } from '@/lib/types';
import ApproachPayButton from './ApproachPayButton';

export const metadata = { title: 'Request owner approach | EarlyEggs' };

export default async function ApproachPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Already requested — send to success page
  if (interest.approach_requested) {
    redirect(`/account/interests/${id}/approach/success`);
  }

  // Only available for specific property interests
  if (interest.interest_type !== 'specific_property') {
    redirect(`/account/interests/${id}`);
  }

  const price = formatPrice(PAID_ACTION_PRICES.owner_approach);
  const address = interest.full_address ?? interest.postcode ?? 'your target property';

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Request owner approach</h1>
          <p className="account-page-sub">{address}</p>
        </div>
        <Link href={`/account/interests/${id}`} className="btn btn-outline-dark">← Back</Link>
      </div>

      <div style={{ maxWidth: 600 }}>

        {/* What happens */}
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="form-section-title">What we&apos;ll do</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              {
                n: '01',
                title: 'Identify the registered owner',
                body: 'We search HM Land Registry records to find the name and address of the current registered owner of this property.',
              },
              {
                n: '02',
                title: 'Write and send a personal letter',
                body: 'A professionally written letter is sent by post to the owner by name, explaining that a serious buyer has registered interest in their property specifically.',
              },
              {
                n: '03',
                title: 'Include a private response link',
                body: 'The letter includes a secure, private link the owner can use to respond — without any obligation, and without your contact details being shared until they choose to connect.',
              },
              {
                n: '04',
                title: 'Notify you of any response',
                body: 'If the owner responds, you\'ll be notified via email and can view their response in your account. We aim to send letters within 3–5 working days of payment.',
              },
            ].map(item => (
              <div key={item.n} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'var(--font-tight)',
                  fontWeight: 700,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--gold)',
                  flexShrink: 0,
                  width: 24,
                  paddingTop: 2,
                }}>
                  {item.n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important notes */}
        <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'var(--surface)' }}>
          <div className="form-section-title">Before you pay</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              'This is a one-off, non-refundable fee of £29 per property. If the property is not registered at Land Registry, we will contact you and discuss next steps.',
              'Letters are sent within 3–5 working days. Response rates vary — some owners respond quickly, others don\'t respond at all. We cannot guarantee a positive outcome.',
              'If the owner declines or does not respond, your interest remains registered and you\'ll be notified automatically if they later register as available.',
            ].map((note, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.6 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="10" cy="10" r="9" stroke="var(--mist)" strokeWidth="1.5" />
                  <path d="M10 6v4M10 13v1" stroke="var(--mist)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Payment CTA */}
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--forest)', letterSpacing: '-0.02em' }}>
                {price} <span style={{ fontWeight: 400, fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>one-off</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginTop: 'var(--space-1)' }}>
                Owner approach for {address}
              </div>
            </div>
            <ApproachPayButton interestId={id} />
          </div>
        </div>

      </div>
    </>
  );
}
