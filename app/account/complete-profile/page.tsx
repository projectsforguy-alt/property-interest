'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { BuyingPosition, Timeline, PropertyType } from '@/lib/types';
import { BUYING_POSITION_LABELS, TIMELINE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/types';

function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const PROPERTY_TYPES = Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][];

export default function CompleteProfilePage() {
  const [buyingPosition, setBuyingPosition] = useState<BuyingPosition | ''>('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [timeline, setTimeline] = useState<Timeline | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleType(t: PropertyType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function parsePence(val: string): number | null {
    const n = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? null : Math.round(n * 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!buyingPosition) { setError('Please select your buying position.'); return; }
    if (!timeline) { setError('Please select your buying timeline.'); return; }

    setLoading(true);
    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        buying_position: buyingPosition,
        budget_min: parsePence(budgetMin),
        budget_max: parsePence(budgetMax),
        preferred_property_types: selectedTypes.length > 0 ? selectedTypes : null,
        timeline,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Use full navigation so middleware reads fresh profile data
    window.location.href = '/account/add-interest';
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-6)', background: 'var(--surface)' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-3)' }}>
            One more step
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 400, color: 'var(--forest)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
            Tell us about your buying position
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate)', lineHeight: 1.65 }}>
            This helps sellers understand how serious you are, and helps us surface the most relevant opportunities. You can update it at any time.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error-banner">{error}</div>}

          <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="form-section-title">Buying position</div>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="buyingPosition">Your position</label>
                <select id="buyingPosition" className="field-select" value={buyingPosition}
                  onChange={e => setBuyingPosition(e.target.value as BuyingPosition)} required>
                  <option value="">Select…</option>
                  {(Object.entries(BUYING_POSITION_LABELS) as [BuyingPosition, string][]).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="timeline">Timeline</label>
                <select id="timeline" className="field-select" value={timeline}
                  onChange={e => setTimeline(e.target.value as Timeline)} required>
                  <option value="">Select…</option>
                  {(Object.entries(TIMELINE_LABELS) as [Timeline, string][]).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="form-section-title">Budget <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--slate)' }}>(optional)</span></div>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="budgetMin">Minimum</label>
                <input id="budgetMin" type="text" className="field-input" placeholder="e.g. £200,000"
                  value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="budgetMax">Maximum</label>
                <input id="budgetMax" type="text" className="field-input" placeholder="e.g. £500,000"
                  value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="form-section-title">Property types <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--slate)' }}>(optional)</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {PROPERTY_TYPES.map(([type, label]) => (
                <button key={type} type="button"
                  onClick={() => toggleType(type)}
                  className={`badge ${selectedTypes.includes(type) ? 'badge-gold' : 'badge-slate'}`}
                  style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving…' : 'Save and register my interest'}
          </button>
        </form>
      </div>
    </div>
  );
}
