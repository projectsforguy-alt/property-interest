import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { SellerProperty } from '@/lib/types';
import BroadcastPayButton from './BroadcastPayButton';

export const metadata = { title: 'Broadcast to buyers | EarlyEggs' };

export default async function BroadcastPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (property.broadcast_paid_at) {
    redirect(`/account/properties/${id}`);
  }

  if (property.status !== 'available') {
    redirect(`/account/properties/${id}`);
  }

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Broadcast to buyers</h1>
          <p className="account-page-sub">{property.full_address}</p>
        </div>
        <Link href={`/account/properties/${id}`} className="btn btn-outline-dark">← Back</Link>
      </div>

      <div style={{ maxWidth: 600 }}>

        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="form-section-title">What the broadcast does</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              {
                n: '01',
                title: 'Reaches nearby buyers',
                body: 'We notify all active buyers with registered interest within 2 miles of your property who are not already matched to you.',
              },
              {
                n: '02',
                title: 'Active for 30 days',
                body: 'Your property remains in broadcast mode for 30 days. Any new buyers who register interest in the area during that time are also notified.',
              },
              {
                n: '03',
                title: 'You stay in control',
                body: 'Buyers are notified that a property is available in their area — your identity and address are not shared until you choose to connect.',
              },
              {
                n: '04',
                title: 'Matches open a conversation',
                body: 'Buyers who respond are matched to your property. You can then message them directly through your account.',
              },
            ].map(item => (
              <div key={item.n} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--gold)', flexShrink: 0, width: 24, paddingTop: 2 }}>
                  {item.n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'var(--surface)' }}>
          <div className="form-section-title">Before you pay</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              'This is a one-off, non-refundable fee of £49. The broadcast runs for 30 days from the date of payment.',
              'Buyers are not given your address — they are told a property is available in their area of interest and invited to express interest.',
              'Your property must remain marked as available for the broadcast to remain active.',
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

        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--forest)', letterSpacing: '-0.02em' }}>
                £49 <span style={{ fontWeight: 400, fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>one-off · 30 days</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginTop: 'var(--space-1)' }}>
                Broadcast for {property.full_address}
              </div>
            </div>
            <BroadcastPayButton propertyId={id} />
          </div>
        </div>

      </div>
    </>
  );
}
