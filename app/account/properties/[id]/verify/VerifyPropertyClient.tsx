'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SellerProperty, VerificationStatus } from '@/lib/types';
import { VERIFICATION_STATUS_LABELS } from '@/lib/types';

const STATUS_STEPS: VerificationStatus[] = [
  'unverified',
  'letter_requested',
  'letter_sent',
  'awaiting_code',
  'verified',
];

function StatusStepper({ current }: { current: VerificationStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 'var(--space-8)' }}>
      {STATUS_STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? 'var(--gold)' : active ? 'var(--forest)' : 'var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: active ? 'var(--white)' : 'var(--slate)' }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: '10px', color: active ? 'var(--forest)' : 'var(--mist)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                {VERIFICATION_STATUS_LABELS[s]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? 'var(--gold)' : 'var(--line)', margin: '0 var(--space-2)', marginBottom: 'var(--space-6)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyPropertyClient({ property }: { property: SellerProperty }) {
  const router = useRouter();
  const status = property.verification_status ?? 'unverified';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function requestLetter() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/account/properties/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id, action: 'request_letter' }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); setLoading(false); return; }
    setSuccess('Verification letter requested. Allow 3–5 working days for delivery.');
    setLoading(false);
    router.refresh();
  }

  async function submitCode() {
    if (code.length !== 6) { setError('Please enter the 6-digit code from your letter.'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/account/properties/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id, action: 'submit_code', code }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) { setError(data.error ?? 'Incorrect code. Please check and try again.'); setLoading(false); return; }
    setSuccess('Property verified successfully.');
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ maxWidth: 580 }}>
      <div className="account-page-header">
        <div>
          <h1 className="account-page-title">Verify ownership</h1>
          <p className="account-page-sub">{property.full_address}</p>
        </div>
      </div>

      <StatusStepper current={status as VerificationStatus} />

      {success && (
        <div style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--forest)' }}>
          ✓ {success}
        </div>
      )}

      {error && <div className="form-error-banner">{error}</div>}

      {/* Unverified: explain and offer to request letter */}
      {(status === 'unverified' || status === 'letter_requested') && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">How ownership verification works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {[
              { n: '01', title: 'We send a letter to your property', body: 'A letter containing a unique 6-digit code is sent by post to the registered address. It typically arrives within 3–5 working days.' },
              { n: '02', title: 'Enter the code here', body: 'Once your letter arrives, enter the code below to confirm you have access to the property.' },
              { n: '03', title: 'Unlock full seller features', body: 'Once verified, you can act on buyer approaches via email and your property will be marked as verified to matched buyers.' },
            ].map(item => (
              <div key={item.n} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ fontFamily: 'var(--font-tight)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--gold)', flexShrink: 0, width: 24, paddingTop: 2 }}>{item.n}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          {status === 'unverified' && (
            <button onClick={requestLetter} disabled={loading} className="btn btn-primary">
              {loading ? 'Requesting…' : 'Request verification letter — free'}
            </button>
          )}
          {status === 'letter_requested' && (
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              Letter requested — allow 3–5 working days for delivery.
            </div>
          )}
        </div>
      )}

      {/* Letter sent / awaiting code: show code entry */}
      {(status === 'letter_sent' || status === 'awaiting_code') && (
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Enter your verification code</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, marginBottom: 'var(--space-5)' }}>
            Your letter has been sent to {property.full_address}. Enter the 6-digit code printed in the letter below.
          </p>
          <div className="field">
            <label className="field-label" htmlFor="verifyCode">Verification code</label>
            <input
              id="verifyCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="field-input"
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ maxWidth: 160, fontSize: 'var(--text-xl)', letterSpacing: '0.2em', fontFamily: 'var(--font-tight)' }}
            />
          </div>
          <button onClick={submitCode} disabled={loading || code.length !== 6} className="btn btn-primary">
            {loading ? 'Verifying…' : 'Confirm code'}
          </button>
        </div>
      )}

      {/* Verified */}
      {status === 'verified' && (
        <div className="card" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>Ownership verified</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
                This property is verified. You can now receive future buyer approaches by email.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
