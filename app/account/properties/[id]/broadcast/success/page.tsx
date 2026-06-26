import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { SellerProperty } from '@/lib/types';

export const metadata = { title: 'Broadcast sent | EarlyEggs' };

export default async function BroadcastSuccessPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (!property.broadcast_paid_at) {
    redirect(`/account/properties/${id}/broadcast`);
  }

  const expiresAt = property.broadcast_expires_at
    ? new Date(property.broadcast_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Broadcast sent</h1>
          <p className="account-page-sub">{property.full_address}</p>
        </div>
        <Link href="/account/properties" className="btn btn-outline-dark">← My properties</Link>
      </div>

      <div style={{ maxWidth: 560 }}>

        <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>
                Broadcast active
                {property.broadcast_buyer_count > 0 && ` — ${property.broadcast_buyer_count} ${property.broadcast_buyer_count === 1 ? 'buyer' : 'buyers'} notified`}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
                Buyers with registered interest within 2 miles of your property have been notified.
                {expiresAt && ` Your broadcast is active until ${expiresAt}.`}
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="form-section-title">What happens next</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { title: 'Buyers are notified', body: 'Matched buyers have been sent an alert letting them know a property is available in their area of interest.' },
              { title: 'Matches appear in your account', body: 'Any buyer who responds is matched to your property and a conversation is opened. You\'ll see them in your property\'s matches.' },
              { title: 'You stay anonymous until you choose to connect', body: 'Buyers are not given your address or identity until you proceed with an introduction through the platform.' },
              { title: 'Broadcast runs for 30 days', body: 'New buyers who register interest in your area during the broadcast period are also notified automatically.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', paddingBottom: i < 3 ? 'var(--space-4)' : 0, borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface)', border: '1.5px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--slate)', fontFamily: 'var(--font-tight)' }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href={`/account/properties/${id}`} className="btn btn-primary">View property</Link>
          <Link href="/account/properties" className="btn btn-outline-dark">My properties</Link>
        </div>

      </div>
    </>
  );
}
