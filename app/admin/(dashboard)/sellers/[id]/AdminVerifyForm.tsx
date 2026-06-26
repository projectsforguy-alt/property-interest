'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SellerProperty, VerificationStatus } from '@/lib/types';

const STATUS_OPTIONS: VerificationStatus[] = [
  'unverified',
  'letter_requested',
  'letter_sent',
  'awaiting_code',
  'verified',
];

export default function AdminVerifyForm({ property }: { property: SellerProperty }) {
  const router = useRouter();

  const [verificationCode, setVerificationCode] = useState(property.verification_code ?? '');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    (property.verification_status as VerificationStatus) ?? 'unverified'
  );
  const [adminNotes, setAdminNotes] = useState(property.admin_notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Generate a random 6-digit code
  function generateCode() {
    setVerificationCode(String(Math.floor(100000 + Math.random() * 900000)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch('/api/admin/sellers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: property.id,
        verification_code: verificationCode || null,
        verification_status: verificationStatus,
        verified: verificationStatus === 'verified',
        admin_notes: adminNotes || null,
        // Set timestamps based on status transitions
        ...(verificationStatus === 'letter_sent' && !property.verification_letter_sent_at
          ? { verification_letter_sent_at: new Date().toISOString() }
          : {}),
      }),
    });

    const data = await res.json() as { error?: string };
    if (!res.ok) { setError(data.error ?? 'Failed to save.'); setSaving(false); return; }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave}>
      {error && <div className="form-error-banner">{error}</div>}
      {saved && (
        <div style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--forest)' }}>
          ✓ Saved
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Verification management</div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="verificationStatus">Verification status</label>
            <select id="verificationStatus" className="field-select" value={verificationStatus}
              onChange={e => setVerificationStatus(e.target.value as VerificationStatus)}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="verificationCode">Verification code</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                id="verificationCode"
                type="text"
                className="field-input"
                maxLength={6}
                placeholder="6 digits"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontFamily: 'var(--font-tight)', letterSpacing: '0.15em', fontSize: 'var(--text-lg)' }}
              />
              <button type="button" onClick={generateCode} className="btn btn-outline-dark btn-sm" style={{ flexShrink: 0 }}>
                Generate
              </button>
            </div>
            <span className="field-hint">This code goes into the letter. Print it on the letter before marking as sent.</span>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="adminNotes">Admin notes</label>
          <textarea id="adminNotes" className="field-textarea"
            placeholder="Internal notes — not visible to seller"
            value={adminNotes}
            onChange={e => setAdminNotes(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
