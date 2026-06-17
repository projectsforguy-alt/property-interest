'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { PropertyType } from '@/lib/types';
import { PROPERTY_TYPE_LABELS } from '@/lib/types';

function getBrowserClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export default function AddPropertyForm() {
  const router = useRouter();
  const [fullAddress, setFullAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [bedrooms, setBedrooms] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [sellerNotes, setSellerNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!fullAddress.trim()) { setError('Please enter the property address.'); return; }
    if (!postcode.trim()) { setError('Please enter the postcode.'); return; }
    setLoading(true);

    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in to continue.'); setLoading(false); return; }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      full_address: fullAddress.trim(),
      postcode: postcode.trim().toUpperCase(),
      property_type: propertyType || null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      asking_price: askingPrice ? Math.round(parseFloat(askingPrice.replace(/[^0-9.]/g, '')) * 100) : null,
      seller_notes: sellerNotes || null,
    };

    // Extract street name from address (simple heuristic)
    const parts = fullAddress.split(',');
    if (parts.length >= 2) {
      payload.street_name = parts[1].trim();
      if (parts.length >= 3) payload.area_name = parts[2].trim();
    }

    const { data: inserted, error: insertError } = await supabase
      .from('seller_properties').insert(payload).select().single();

    if (insertError) { setError(insertError.message); setLoading(false); return; }

    // Run matching
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
        <div className="form-section-title">Property details</div>
        <div className="field">
          <label className="field-label" htmlFor="fullAddress">Full address</label>
          <textarea id="fullAddress" className="field-textarea" style={{ minHeight: 72 }}
            placeholder="e.g. 14 Church Lane, Prestbury, Macclesfield, SK10 4HP"
            value={fullAddress} onChange={e => setFullAddress(e.target.value)} required />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="postcode">Postcode</label>
          <input id="postcode" type="text" className="field-input"
            placeholder="e.g. SK10 4HP"
            value={postcode} onChange={e => setPostcode(e.target.value)} required
            style={{ maxWidth: 200 }} />
        </div>
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
            Asking price <span style={{ fontWeight: 400, color: 'var(--slate)' }}>(optional — leave blank to keep private)</span>
          </label>
          <input id="askingPrice" type="text" className="field-input"
            placeholder="e.g. £450,000"
            value={askingPrice} onChange={e => setAskingPrice(e.target.value)}
            style={{ maxWidth: 240 }} />
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-section-title">Message to buyers <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--slate)' }}>(optional)</span></div>
        <div className="field">
          <textarea id="sellerNotes" className="field-textarea"
            placeholder="Tell interested buyers a little about the property and why you're considering selling…"
            value={sellerNotes} onChange={e => setSellerNotes(e.target.value)} />
          <span className="field-hint">Only shared with matched buyers if you choose to proceed with a broadcast</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? 'Registering…' : 'Register property as available'}
      </button>
    </form>
  );
}
