'use client';

import { useState } from 'react';
import type { OwnerResponse } from '@/lib/types';

const RESPONSE_OPTIONS: { value: OwnerResponse; label: string; desc: string }[] = [
  {
    value: 'not_interested',
    label: 'Not interested',
    desc: 'I have no intention of selling this property and do not wish to be contacted again about it.',
  },
  {
    value: 'not_considering',
    label: 'Not currently considering selling',
    desc: 'I am not thinking of selling at this time, but I am not ruling it out in future.',
  },
  {
    value: 'open_to_offer',
    label: 'Open to hearing more',
    desc: 'I would be willing to hear what the buyer has in mind. I understand this does not commit me to anything.',
  },
  {
    value: 'ready_to_connect',
    label: 'Yes — I am ready to connect',
    desc: 'I am actively considering selling and happy for an introduction to be made.',
  },
];

export default function RespondPageClient({ code }: { code: string }) {
  const [selected, setSelected] = useState<OwnerResponse | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!selected) { setError('Please choose a response.'); return; }
    setLoading(true);
    setError('');

    const res = await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, response: selected, message }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-5)' }}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--forest)', marginBottom: 'var(--space-3)' }}>
              Response received
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>
              Thank you for taking the time to respond. The buyer has been notified.
            </p>
          </div>
          <div className="card" style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65 }}>
            <p>
              EarlyEggs is a private platform for property buyers and sellers to connect discreetly — before properties go to the open market.
              You will not receive any further contact from us about this property unless you indicated you were open to hearing more.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', padding: 'var(--space-8) var(--space-6)' }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-4)' }}>
            EarlyEggs — private property
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 400, color: 'var(--forest)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 'var(--space-4)' }}>
            A buyer has registered interest in your property
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>
            Someone has asked us to make a discreet enquiry on their behalf. They are a serious buyer who specifically registered interest in your address — not a general search.
          </p>
        </div>

        {/* What this is */}
        <div className="card" style={{ marginBottom: 'var(--space-5)', background: 'var(--gold-soft)', border: '1.5px solid var(--gold)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-2)' }}>About this letter</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', lineHeight: 1.65 }}>
            EarlyEggs is a UK platform that helps buyers register private interest in specific properties. We only contact homeowners when a genuine buyer has paid to make an approach.
            Your details and response are kept entirely private. The buyer will not receive your contact details unless you choose to connect.
          </div>
        </div>

        {/* Response options */}
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">How would you like to respond?</div>
          {error && <div className="form-error-banner">{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {RESPONSE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-4) var(--space-5)',
                  border: `1.5px solid ${selected === opt.value ? 'var(--gold)' : 'var(--line)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: selected === opt.value ? 'var(--gold-soft)' : 'var(--white)',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  boxShadow: selected === opt.value ? '0 0 0 3px rgba(220,190,141,0.12)' : 'none',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--forest)', marginBottom: 'var(--space-1)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate)', lineHeight: 1.5 }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Optional message — only show for open_to_offer and ready_to_connect */}
        {(selected === 'open_to_offer' || selected === 'ready_to_connect') && (
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="form-section-title">Add a message <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--slate)' }}>(optional)</span></div>
            <div className="field">
              <textarea
                className="field-textarea"
                placeholder="e.g. We would consider selling from spring next year, or We are open to a conversation but would need a figure close to £X."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ minHeight: 100 }}
              />
              <span className="field-hint">This will be passed to the buyer. Keep it brief — no need to share contact details.</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !selected}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', opacity: loading || !selected ? 0.6 : 1 }}
        >
          {loading ? 'Sending response…' : 'Send my response'}
        </button>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)', textAlign: 'center', marginTop: 'var(--space-4)', lineHeight: 1.6 }}>
          Your response is private and will only be shared with the buyer who made this approach.
          EarlyEggs will not pass your details to any third parties.
        </p>
      </div>
    </div>
  );
}
