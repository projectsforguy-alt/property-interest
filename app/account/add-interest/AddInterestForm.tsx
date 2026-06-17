'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { InterestType, BuyingPosition, Timeline, PropertyType } from '@/lib/types';
import {
  INTEREST_TYPE_LABELS, INTEREST_TYPE_DESCRIPTIONS,
  BUYING_POSITION_LABELS, TIMELINE_LABELS, PROPERTY_TYPE_LABELS,
} from '@/lib/types';

function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const PROPERTY_TYPES = Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][];

export default function AddInterestForm() {
  const router = useRouter();
  const [interestType, setInterestType] = useState<InterestType>('specific_property');
  const [fullAddress, setFullAddress] = useState('');
  const [streetName, setStreetName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [buyingPosition, setBuyingPosition] = useState<BuyingPosition | ''>('');
  const [timeline, setTimeline] = useState<Timeline | ''>('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleType(t: PropertyType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!postcode.trim()) { setError('Please enter a postcode or postcode district.'); return; }
    if (interestType === 'specific_property' && !fullAddress.trim()) { setError('Please enter the property address.'); return; }
    if (interestType === 'street' && !streetName.trim()) { setError('Please enter the street name.'); return; }
    if ((interestType === 'area' || interestType === 'land') && !areaName.trim()) { setError('Please enter the area or village name.'); return; }

    setLoading(true);
    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in to continue.'); setLoading(false); return; }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      interest_type: interestType,
      postcode: postcode.trim().toUpperCase(),
      location_notes: locationNotes || null,
      property_types: selectedTypes.length > 0 ? selectedTypes : null,
      min_bedrooms: minBedrooms ? parseInt(minBedrooms) : null,
      max_price: maxPrice ? Math.round(parseFloat(maxPrice.replace(/[^0-9.]/g, '')) * 100) : null,
      buyer_message: buyerMessage || null,
    };

    if (interestType === 'specific_property') payload.full_address = fullAddress.trim();
    if (interestType === 'street') payload.street_name = streetName.trim();
    if (interestType === 'area' || interestType === 'land') payload.area_name = areaName.trim();

    // Also update profile buying position & timeline if provided
    if (buyingPosition) {
      await supabase.from('profiles').update({ buying_position: buyingPosition }).eq('id', user.id);
    }
    if (timeline) {
      await supabase.from('profiles').update({ timeline }).eq('id', user.id);
    }

    const { error: insertError } = await supabase.from('buyer_interests').insert(payload);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Run matching after insert
    await fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id }) });

    router.push('/account?added=1');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">What are you interested in?</div>
        <div className="intent-picker">
          {(Object.entries(INTEREST_TYPE_LABELS) as [InterestType, string][]).map(([type, label]) => (
            <button
              key={type} type="button"
              className={`intent-option${interestType === type ? ' active' : ''}`}
              onClick={() => setInterestType(type)}
            >
              <span className="intent-option-title">{label}</span>
              <span className="intent-option-desc">{INTEREST_TYPE_DESCRIPTIONS[type]}</span>
            </button>
          ))}
        </div>

        {interestType === 'specific_property' && (
          <div className="field">
            <label className="field-label" htmlFor="fullAddress">Property address</label>
            <textarea id="fullAddress" className="field-textarea" style={{ minHeight: 72 }}
              placeholder="e.g. 14 Church Lane, Macclesfield, SK10 3AQ"
              value={fullAddress} onChange={e => setFullAddress(e.target.value)} required />
          </div>
        )}

        {interestType === 'street' && (
          <div className="field">
            <label className="field-label" htmlFor="streetName">Street name</label>
            <input id="streetName" type="text" className="field-input"
              placeholder="e.g. Church Lane"
              value={streetName} onChange={e => setStreetName(e.target.value)} required />
          </div>
        )}

        {(interestType === 'area' || interestType === 'land') && (
          <div className="field">
            <label className="field-label" htmlFor="areaName">
              {interestType === 'land' ? 'Area or location description' : 'Area, village or town'}
            </label>
            <input id="areaName" type="text" className="field-input"
              placeholder={interestType === 'land' ? 'e.g. Rural Cheshire, edge of village' : 'e.g. Prestbury, Macclesfield'}
              value={areaName} onChange={e => setAreaName(e.target.value)} required />
          </div>
        )}

        <div className="field">
          <label className="field-label" htmlFor="postcode">Postcode or postcode district</label>
          <input id="postcode" type="text" className="field-input"
            placeholder="e.g. SK10 or SK10 3AQ"
            value={postcode} onChange={e => setPostcode(e.target.value)} required
            style={{ maxWidth: 200 }} />
          <span className="field-hint">Used to match your interest against seller registrations</span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="locationNotes">Additional location details <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span></label>
          <input id="locationNotes" type="text" className="field-input"
            placeholder="e.g. South-facing garden preferred, near school catchment"
            value={locationNotes} onChange={e => setLocationNotes(e.target.value)} />
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Property preferences</div>
        <div className="field">
          <label className="field-label">Property types <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional — select all that apply)</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {PROPERTY_TYPES.map(([type, label]) => (
              <button key={type} type="button"
                onClick={() => toggleType(type)}
                className={`badge${selectedTypes.includes(type) ? ' badge-teal' : ' badge-slate'}`}
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 'var(--text-sm)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="minBedrooms">Minimum bedrooms</label>
            <select id="minBedrooms" className="field-select"
              value={minBedrooms} onChange={e => setMinBedrooms(e.target.value)}>
              <option value="">Any</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="maxPrice">Maximum budget</label>
            <input id="maxPrice" type="text" className="field-input"
              placeholder="e.g. £450,000"
              value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Your buying position</div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="buyingPosition">Buying position</label>
            <select id="buyingPosition" className="field-select"
              value={buyingPosition} onChange={e => setBuyingPosition(e.target.value as BuyingPosition)}>
              <option value="">Select…</option>
              {(Object.entries(BUYING_POSITION_LABELS) as [BuyingPosition, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="timeline">Timeline</label>
            <select id="timeline" className="field-select"
              value={timeline} onChange={e => setTimeline(e.target.value as Timeline)}>
              <option value="">Select…</option>
              {(Object.entries(TIMELINE_LABELS) as [Timeline, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="buyerMessage">
            Message to potential seller <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span>
          </label>
          <textarea id="buyerMessage" className="field-textarea"
            placeholder="Tell a seller a little about yourself and why you want to buy in this area…"
            value={buyerMessage} onChange={e => setBuyerMessage(e.target.value)} />
          <span className="field-hint">Only shared with a seller if you both proceed with an introduction</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Saving…' : 'Register this interest'}
      </button>
    </form>
  );
}
