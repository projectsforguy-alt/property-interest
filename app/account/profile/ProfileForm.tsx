'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

import type { Profile, BuyingPosition, Timeline } from '@/lib/types';
import { BUYING_POSITION_LABELS, TIMELINE_LABELS } from '@/lib/types';

function getBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export default function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const [firstName, setFirstName] = useState(profile.first_name ?? '');
  const [lastName, setLastName] = useState(profile.last_name ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [buyingPosition, setBuyingPosition] = useState<BuyingPosition | ''>(profile.buying_position ?? '');
  const [timeline, setTimeline] = useState<Timeline | ''>(profile.timeline ?? '');
  const [budgetMin, setBudgetMin] = useState(profile.budget_min ? String(profile.budget_min / 100) : '');
  const [budgetMax, setBudgetMax] = useState(profile.budget_max ? String(profile.budget_max / 100) : '');
  const [alertEmail, setAlertEmail] = useState(profile.alert_email);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const supabase = getBrowserClient();
    await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      buying_position: buyingPosition || null,
      timeline: timeline || null,
      budget_min: budgetMin ? Math.round(parseFloat(budgetMin) * 100) : null,
      budget_max: budgetMax ? Math.round(parseFloat(budgetMax) * 100) : null,
      alert_email: alertEmail,
    }).eq('id', profile.id);
    setLoading(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {saved && (
        <div style={{ background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--teal-dark)' }}>
          ✓ Profile saved
        </div>
      )}
      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Personal details</div>
        <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', color: 'var(--slate)' }}>
          Email: <strong>{email}</strong>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="firstName">First name</label>
            <input id="firstName" type="text" className="field-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="lastName">Last name</label>
            <input id="lastName" type="text" className="field-input" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="phone">Phone number <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span></label>
          <input id="phone" type="tel" className="field-input" value={phone} onChange={e => setPhone(e.target.value)} style={{ maxWidth: 240 }} />
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Buying profile</div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="buyingPosition">Buying position</label>
            <select id="buyingPosition" className="field-select" value={buyingPosition} onChange={e => setBuyingPosition(e.target.value as BuyingPosition)}>
              <option value="">Select…</option>
              {(Object.entries(BUYING_POSITION_LABELS) as [BuyingPosition, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="timeline">Timeline</label>
            <select id="timeline" className="field-select" value={timeline} onChange={e => setTimeline(e.target.value as Timeline)}>
              <option value="">Select…</option>
              {(Object.entries(TIMELINE_LABELS) as [Timeline, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="budgetMin">Budget from (£)</label>
            <input id="budgetMin" type="text" className="field-input" placeholder="e.g. 200000" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="budgetMax">Budget to (£)</label>
            <input id="budgetMax" type="text" className="field-input" placeholder="e.g. 500000" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Alert preferences</div>
        <div className="checkbox-field">
          <input type="checkbox" id="alertEmail" checked={alertEmail} onChange={e => setAlertEmail(e.target.checked)} />
          <label htmlFor="alertEmail" className="checkbox-label">Email me when a matching seller or buyer opportunity appears</label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
