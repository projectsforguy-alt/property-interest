'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { PropertyType } from '@/lib/types';
import { PROPERTY_TYPE_LABELS } from '@/lib/types';
import PostcodeInput from '@/components/PostcodeInput';

function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AddPropertyForm() {
  const router = useRouter();
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [town, setTown] = useState('');
  const [postcode, setPostcode] = useState('');
  const [postcodeValid, setPostcodeValid] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [bedrooms, setBedrooms] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [sellerNotes, setSellerNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handlePostcodeChange(value: string, result?: { postcode: string }) {
    setPostcode(value);
    if (result) { setPostcode(result.postcode); setPostcodeValid(true); }
    else setPostcodeValid(false);
  }

  function getFullAddress(): string {
    return [houseNumber, streetName, town, postcode].filter(Boolean).join(', ');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!streetName.trim()) { setError('Please enter the street name.'); return; }
    if (!postcode.trim()) { setError('Please enter and validate the postcode.'); return; }
    if (!postcodeValid) { setError('Please enter a valid UK postcode.'); return; }

    setLoading(true);
    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in to continue.'); setLoading(false); return; }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      full_address: getFullAddress(),
      postcode: postcode.trim().toUpperCase(),
      street_name: streetName.trim(),
      area_name: town.trim() || null,
      property_type: propertyType || null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      asking_price: askingPrice ? Math.round(parseFloat(askingPrice.replace(/[^0-9.]/g, '')) * 100) : null,
      seller_notes: sellerNotes || null,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('seller_properties').insert(payload).select().single();

    if (insertError) { setError(insertError.message); setLoading(false); return; }

    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_property_id: (inserted as Record<string, unknown>).id, user_id: user.id }),
    });

    router.push('/account/properties?added=1');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Property address</div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="houseNumber">House number / name</label>
            <input id="houseNumber" type="text" className="field-input"
              placeholder="e.g. 14 or Oakwood"
              value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="streetName">Street name</label>
            <input id="streetName" type="text" className="field-input"
              placeholder="e.g. Church Lane"
              value={streetName} onChange={e => setStreetName(e.target.value)} required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="town">Town or village</label>
            <input id="town" type="text" className="field-input"
              placeholder="e.g. Prestbury"
              value={town} onChange={e => setTown(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="postcode">Postcode</label>
            <PostcodeInput value={postcode} onChange={handlePostcodeChange} required />
          </div>
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Property details</div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="propertyType">Property type</label>
            <select id="propertyType" className="field-select"
              value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)}>
              <option value="">Select…</option>
              {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="bedrooms">Bedrooms</label>
            <select id="bedrooms" className="field-select"
              value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
              <option value="">Select…</option>
              {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="askingPrice">
            Asking price <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional)</span>
          </label>
          <input id="askingPrice" type="text" className="field-input"
            placeholder="e.g. £450,000"
            value={askingPrice} onChange={e => setAskingPrice(e.target.value)}
            style={{ maxWidth: 240 }} />
          <span className="field-hint">Leave blank to keep private</span>
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Message to buyers <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--slate)' }}>(optional)</span></div>
        <div className="field">
          <textarea id="sellerNotes" className="field-textarea"
            placeholder="Tell interested buyers about the property and why you're considering selling…"
            value={sellerNotes} onChange={e => setSellerNotes(e.target.value)} />
          <span className="field-hint">Only shared with matched buyers if you proceed with a broadcast</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Registering…' : 'Register property as available'}
      </button>
    </form>
  );
}
