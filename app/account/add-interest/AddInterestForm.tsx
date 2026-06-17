'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import dynamic from 'next/dynamic';
import type { InterestType, BuyingPosition, Timeline, PropertyType } from '@/lib/types';
import {
  INTEREST_TYPE_LABELS, INTEREST_TYPE_DESCRIPTIONS,
  BUYING_POSITION_LABELS, TIMELINE_LABELS, PROPERTY_TYPE_LABELS,
} from '@/lib/types';
import PostcodeInput from '@/components/PostcodeInput';

const MapPinPicker = dynamic(() => import('@/components/MapPinPicker'), { ssr: false });

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

  // Location fields
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [postcodeValid, setPostcodeValid] = useState(false);
  const [mapLat, setMapLat] = useState<number | null>(null);
  const [mapLng, setMapLng] = useState<number | null>(null);
  const [mapAddress, setMapAddress] = useState('');
  const [locationNotes, setLocationNotes] = useState('');

  // Preferences
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Buyer profile
  const [buyingPosition, setBuyingPosition] = useState<BuyingPosition | ''>('');
  const [timeline, setTimeline] = useState<Timeline | ''>('');
  const [buyerMessage, setBuyerMessage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleType(t: PropertyType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function handlePostcodeChange(value: string, result?: { postcode: string }) {
    setPostcode(value);
    if (result) {
      setPostcode(result.postcode);
      setPostcodeValid(true);
    } else {
      setPostcodeValid(false);
    }
  }

  function handleMapPin(lat: number, lng: number, address?: string) {
    setMapLat(lat);
    setMapLng(lng);
    if (address) setMapAddress(address);
  }

  function getFullAddress(): string {
    if (interestType === 'specific_property') {
      return [houseNumber, streetName, postcode].filter(Boolean).join(', ');
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!postcode && interestType !== 'area' && interestType !== 'land') {
      setError('Please enter and validate a postcode.'); return;
    }
    if (interestType === 'specific_property' && !streetName.trim()) {
      setError('Please enter the street name.'); return;
    }
    if (interestType === 'street' && !streetName.trim()) {
      setError('Please enter the street name.'); return;
    }
    if ((interestType === 'area' || interestType === 'land') && !areaName.trim() && !mapLat) {
      setError('Please enter an area name or drop a pin on the map.'); return;
    }

    setLoading(true);
    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in to continue.'); setLoading(false); return; }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      interest_type: interestType,
      postcode: postcode.trim().toUpperCase() || null,
      location_notes: locationNotes || null,
      property_types: selectedTypes.length > 0 ? selectedTypes : null,
      min_bedrooms: minBedrooms ? parseInt(minBedrooms) : null,
      max_price: maxPrice ? Math.round(parseFloat(maxPrice.replace(/[^0-9.]/g, '')) * 100) : null,
      buyer_message: buyerMessage || null,
    };

    if (interestType === 'specific_property') {
      payload.full_address = getFullAddress();
      payload.street_name = streetName.trim();
    }
    if (interestType === 'street') {
      payload.street_name = streetName.trim();
    }
    if (interestType === 'area' || interestType === 'land') {
      payload.area_name = areaName.trim() || null;
      payload.map_lat = mapLat;
      payload.map_lng = mapLng;
      if (mapAddress && !areaName) payload.location_notes = mapAddress;
    }

    if (buyingPosition) {
      await supabase.from('profiles').update({ buying_position: buyingPosition }).eq('id', user.id);
    }
    if (timeline) {
      await supabase.from('profiles').update({ timeline }).eq('id', user.id);
    }

    const { error: insertError } = await supabase.from('buyer_interests').insert(payload);
    if (insertError) { setError(insertError.message); setLoading(false); return; }

    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    });

    router.push('/account?added=1');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && <div className="form-error-banner">{error}</div>}

      {/* Step 1: Interest type */}
      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">What are you interested in?</div>
        <div className="intent-picker">
          {(Object.entries(INTEREST_TYPE_LABELS) as [InterestType, string][]).map(([type, label]) => (
            <button key={type} type="button"
              className={`intent-option${interestType === type ? ' active' : ''}`}
              onClick={() => setInterestType(type)}>
              <span className="intent-option-title">{label}</span>
              <span className="intent-option-desc">{INTEREST_TYPE_DESCRIPTIONS[type]}</span>
            </button>
          ))}
        </div>

        {/* Specific property */}
        {interestType === 'specific_property' && (
          <>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="houseNumber">House number / name</label>
                <input id="houseNumber" type="text" className="field-input"
                  placeholder="e.g. 14 or Oakwood"
                  value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="streetNameSpecific">Street name</label>
                <input id="streetNameSpecific" type="text" className="field-input"
                  placeholder="e.g. Church Lane"
                  value={streetName} onChange={e => setStreetName(e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="postcodeSpecific">Postcode</label>
              <PostcodeInput value={postcode} onChange={handlePostcodeChange} required />
              <span className="field-hint" style={{ marginTop: 4 }}>
                {postcodeValid ? `✓ ${postcode}` : 'Enter your postcode and we\'ll validate it'}
              </span>
            </div>
          </>
        )}

        {/* Street */}
        {interestType === 'street' && (
          <>
            <div className="field">
              <label className="field-label" htmlFor="streetNameStreet">Street name</label>
              <input id="streetNameStreet" type="text" className="field-input"
                placeholder="e.g. Church Lane"
                value={streetName} onChange={e => setStreetName(e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="postcodeStreet">Postcode</label>
              <PostcodeInput value={postcode} onChange={handlePostcodeChange} required />
              <span className="field-hint" style={{ marginTop: 4 }}>Used to identify the correct street</span>
            </div>
          </>
        )}

        {/* Area or land */}
        {(interestType === 'area' || interestType === 'land') && (
          <>
            <div className="field">
              <label className="field-label" htmlFor="areaName">
                {interestType === 'land' ? 'Location description' : 'Area, village or town'}
              </label>
              <input id="areaName" type="text" className="field-input"
                placeholder={interestType === 'land' ? 'e.g. Rural Cheshire, edge of village' : 'e.g. Prestbury, Macclesfield'}
                value={areaName} onChange={e => setAreaName(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="postcodeArea">Postcode or district <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span></label>
              <PostcodeInput value={postcode} onChange={handlePostcodeChange} />
            </div>
            <div className="field">
              <label className="field-label">Or pick on map</label>
              <MapPinPicker lat={mapLat} lng={mapLng} onChange={handleMapPin} />
            </div>
          </>
        )}

        <div className="field" style={{ marginTop: 'var(--space-2)' }}>
          <label className="field-label" htmlFor="locationNotes">Additional location details <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span></label>
          <input id="locationNotes" type="text" className="field-input"
            placeholder="e.g. South-facing garden preferred, near school catchment"
            value={locationNotes} onChange={e => setLocationNotes(e.target.value)} />
        </div>
      </div>

      {/* Step 2: Property preferences */}
      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Property preferences</div>
        <div className="field">
          <label className="field-label">Property types <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {PROPERTY_TYPES.map(([type, label]) => (
              <button key={type} type="button"
                onClick={() => toggleType(type)}
                className={`badge${selectedTypes.includes(type) ? ' badge-teal' : ' badge-slate'}`}
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
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

      {/* Step 3: Buying position */}
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
          <span className="field-hint">Only shared if you proceed with an introduction</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Saving…' : 'Register this interest'}
      </button>
    </form>
  );
}
