import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { BuyerInterest } from '@/lib/types';

export const metadata = { title: 'Owner approach requested | EarlyEggs' };

export default async function ApproachSuccessPage({ params }: { params: Promise<{ id: string }> }) {
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

  // If they land here without having paid, redirect to the approach page
  if (!interest.approach_requested) {
    redirect(`/account/interests/${id}/approach`);
  }

  const address = interest.full_address ?? interest.postcode ?? 'your target property';

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Owner approach requested</h1>
          <p className="account-page-sub">{address}</p>
        </div>
        <Link href="/account" className="btn btn-outline-dark">← My interests</Link>
      </div>

      <div style={{ maxWidth: 560 }}>

        {/* Confirmation */}
        <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>
                Payment received — we&apos;re on it
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
                We&apos;ll send a personally addressed letter to the registered owner of {address} within 3–5 working days.
              </p>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="form-section-title">What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              {
                title: 'We research the owner',
                body: 'We look up the registered owner via HM Land Registry. If there\'s an issue finding the registration, we\'ll contact you directly.',
              },
              {
                title: 'The letter is sent',
                body: 'A professionally written, personally addressed letter goes out by post within 3–5 working days. It includes a secure, private response link — no obligation on the owner.',
              },
              {
                title: 'We notify you if they respond',
                body: 'If the owner uses their response link, you\'ll get an email notification and can view their response in your account. Some owners respond within days; others take weeks.',
              },
              {
                title: 'Your interest stays active',
                body: 'Regardless of the owner\'s response, your interest remains registered. If they later register the property as privately available, you\'ll be matched automatically.',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', paddingBottom: i < 3 ? 'var(--space-4)' : 0, borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: '1.5px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--slate)',
                  fontFamily: 'var(--font-tight)',
                }}>
                  {i + 1}
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

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href="/account" className="btn btn-primary">
            Back to my interests
          </Link>
          <Link href="/account/add-interest" className="btn btn-outline-dark">
            Register another interest
          </Link>
        </div>

      </div>
    </>
  );
}
