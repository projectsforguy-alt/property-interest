'use client';

import { useState } from 'react';

export default function ApproachPayButton({ interestId }: { interestId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestId, action: 'owner_approach' }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--red)', marginBottom: 'var(--space-2)' }}>
          {error}
        </p>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="btn btn-primary btn-lg"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Redirecting to payment…' : 'Pay £29 — proceed to checkout'}
      </button>
    </div>
  );
}
