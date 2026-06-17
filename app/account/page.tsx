import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { BuyerInterest } from '@/lib/types';
import { INTEREST_TYPE_LABELS, INTEREST_STATUS_LABELS } from '@/lib/types';

export const metadata = { title: 'My interests | Intentory' };

function interestLocationLabel(i: BuyerInterest): string {
  if (i.interest_type === 'specific_property') return i.full_address ?? i.postcode ?? '—';
  if (i.interest_type === 'street') return `${i.street_name ?? ''}${i.postcode ? `, ${i.postcode}` : ''}`;
  if (i.interest_type === 'area') return `${i.area_name ?? ''}${i.postcode ? `, ${i.postcode}` : ''}`;
  if (i.interest_type === 'land') return `${i.area_name ?? ''}${i.postcode ? `, ${i.postcode}` : ''}`;
  return i.postcode ?? '—';
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ added?: string; welcome?: string }> }) {
  const params = await searchParams;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.first_name ?? 'there';

  const { data: interests } = await supabase
    .from('buyer_interests')
    .select('*')
    .eq('user_id', user!.id)
    .neq('status', 'removed')
    .order('created_at', { ascending: false });

  const activeInterests = (interests ?? []) as BuyerInterest[];

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">My interests</h1>
          <p className="account-page-sub">
            {params.welcome ? `Welcome to Intentory, ${firstName}.` : `Welcome back, ${firstName}.`}
            {' '}Manage your registered buying interests below.
          </p>
        </div>
        <Link href="/account/add-interest" className="btn btn-primary">+ Add interest</Link>
      </div>

      {params.added && (
        <div style={{ background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--teal-dark)' }}>
          ✓ Interest registered. We&apos;ll alert you if a matching seller registers.
        </div>
      )}

      {activeInterests.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M24 4v4M24 40v4M4 24h4M40 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="empty-state-title">No interests registered yet</div>
          <p className="empty-state-body">Register interest in a property, street, area, or plot of land and we&apos;ll alert you when a matching opportunity appears.</p>
          <Link href="/account/add-interest" className="btn btn-primary">Register your first interest</Link>
        </div>
      ) : (
        <div className="card-grid">
          {activeInterests.map(interest => (
            <div key={interest.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <span className="badge badge-navy">{INTEREST_TYPE_LABELS[interest.interest_type]}</span>
                <span className={`badge ${interest.status === 'active' ? 'badge-teal' : 'badge-slate'}`}>
                  {INTEREST_STATUS_LABELS[interest.status]}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>
                {interestLocationLabel(interest)}
              </div>
              {interest.max_price && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
                  Budget up to £{(interest.max_price / 100).toLocaleString()}
                </div>
              )}
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)', marginTop: 'auto' }}>
                Registered {new Date(interest.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <Link href={`/account/interests/${interest.id}`} className="btn btn-outline-dark btn-sm">
                  View
                </Link>
                {!interest.approach_requested && interest.interest_type === 'specific_property' && (
                  <Link href={`/account/interests/${interest.id}/approach`} className="btn btn-primary btn-sm">
                    Request owner approach — £29
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
