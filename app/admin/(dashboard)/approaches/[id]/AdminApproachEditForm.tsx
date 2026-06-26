'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OwnerApproach, ApproachStatus } from '@/lib/types';

const STATUS_OPTIONS: ApproachStatus[] = [
  'pending_payment',
  'paid',
  'owner_identified',
  'letter_sent',
  'awaiting_response',
  'responded',
  'no_response',
  'opted_out',
  'failed',
  'refunded',
];

export default function AdminApproachEditForm({ approach }: { approach: OwnerApproach }) {
  const router = useRouter();

  const [ownerName, setOwnerName] = useState(approach.owner_name ?? '');
  const [ownerAddress, setOwnerAddress] = useState(approach.owner_address ?? '');
  const [ownerPostcode, setOwnerPostcode] = useState(approach.owner_postcode ?? '');
  const [letterSentDate, setLetterSentDate] = useState(
    approach.letter_sent_date ? approach.letter_sent_date.slice(0, 10) : ''
  );
  const [status, setStatus] = useState<ApproachStatus>(approach.status);
  const [adminNotes, setAdminNotes] = useState(approach.admin_notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch('/api/admin/approaches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: approach.id,
        owner_name: ownerName || null,
        owner_address: ownerAddress || null,
        owner_postcode: ownerPostcode || null,
        letter_sent_date: letterSentDate || null,
        status,
        admin_notes: adminNotes || null,
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
        <div className="form-section-title">Owner details</div>
        <div className="field">
          <label className="field-label" htmlFor="ownerName">Owner name</label>
          <input id="ownerName" type="text" className="field-input" placeholder="e.g. Mr J Smith"
            value={ownerName} onChange={e => setOwnerName(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="ownerAddress">Owner address (for letter)</label>
          <input id="ownerAddress" type="text" className="field-input" placeholder="Full postal address"
            value={ownerAddress} onChange={e => setOwnerAddress(e.target.value)} />
        </div>
        <div className="field" style={{ maxWidth: 200 }}>
          <label className="field-label" htmlFor="ownerPostcode">Owner postcode</label>
          <input id="ownerPostcode" type="text" className="field-input"
            value={ownerPostcode} onChange={e => setOwnerPostcode(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Status &amp; progress</div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="status">Status</label>
            <select id="status" className="field-select" value={status}
              onChange={e => setStatus(e.target.value as ApproachStatus)}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="letterSentDate">Letter sent date</label>
            <input id="letterSentDate" type="date" className="field-input"
              value={letterSentDate} onChange={e => setLetterSentDate(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="adminNotes">Admin notes</label>
          <textarea id="adminNotes" className="field-textarea"
            placeholder="Internal notes — not visible to buyer or owner"
            value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
