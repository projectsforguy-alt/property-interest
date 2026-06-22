'use client';
import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PostcodeInput from '@/components/PostcodeInput';

// Dynamically imported — Leaflet requires browser APIs unavailable in SSR
const DemandMap = dynamic(() => import('@/components/DemandMap'), { ssr: false });

interface PostcodeData {
  postcode: string;
  district: string;
  admin_district: string;
  latitude: number;
  longitude: number;
}

interface DemandResult {
  postcode: string;
  district: string;
  admin_district: string;
  exactCount: number;
  areaCount: number;
  hasInterest: boolean;
  lat: number;
  lng: number;
}

export default function DemandCheckForm() {
  const [postcode, setPostcode] = useState('');
  const [postcodeData, setPostcodeData] = useState<PostcodeData | null>(null);
  const [result, setResult] = useState<DemandResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handlePostcodeChange(value: string, data?: { postcode: string; district: string; admin_district: string; latitude: number; longitude: number }) {
    setPostcode(value);
    if (data) setPostcodeData(data);
    else setPostcodeData(null);
    setResult(null);
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!postcodeData) { setError('Please enter a valid UK postcode.'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/demand-check?postcode=${encodeURIComponent(postcodeData.postcode)}`);
      const data = await res.json();
      setResult({
        ...data,
        postcode: postcodeData.postcode,
        district: postcodeData.district,
        admin_district: postcodeData.admin_district,
        lat: postcodeData.latitude,
        lng: postcodeData.longitude,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <form onSubmit={handleCheck}>
        {error && <div className="form-error-banner">{error}</div>}
        <div className="form-card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-section-title">Enter your postcode</div>
          <div className="field">
            <label className="field-label" htmlFor="checkPostcode">Postcode</label>
            <PostcodeInput value={postcode} onChange={handlePostcodeChange} required />
            <span className="field-hint" style={{ marginTop: 4 }}>We&apos;ll check demand at this postcode and the surrounding area</span>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !postcodeData}>
            {loading ? 'Checking…' : 'Check demand'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Map — always shown once we have a result */}
          <DemandMap
            lat={result.lat}
            lng={result.lng}
            exactCount={result.exactCount}
            areaCount={result.areaCount}
            hasInterest={result.hasInterest}
            postcode={result.postcode}
          />

          {result.hasInterest ? (
            <div className="card" style={{ background: 'var(--teal-soft)', border: '1.5px solid var(--teal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--teal)', flexShrink: 0 }}>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--navy)' }}>
                  Buyer demand exists in your area
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {result.exactCount > 0 && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--navy)' }}>
                    <strong>{result.exactCount}</strong> {result.exactCount === 1 ? 'buyer has' : 'buyers have'} registered interest specifically in <strong>{result.postcode}</strong>
                  </div>
                )}
                {result.areaCount > 0 && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--navy)' }}>
                    <strong>{result.areaCount}</strong> {result.areaCount === 1 ? 'buyer is' : 'buyers are'} actively looking in <strong>{result.admin_district}</strong>
                  </div>
                )}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)' }}>
                Register your property as privately available and we&apos;ll match it to these buyers — before you list anywhere publicly.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link href="/register?intent=seller" className="btn btn-primary">Register as available — free</Link>
                <Link href="/how-it-works" className="btn btn-outline-dark">How it works</Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ border: '1.5px solid var(--line)' }}>
              <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>No specific demand registered yet</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                No buyers have registered interest in <strong>{result.postcode}</strong> yet — but demand can appear at any time. Register your property as available and we&apos;ll notify you the moment a matching buyer appears.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link href="/register?intent=seller" className="btn btn-primary">Register and get notified — free</Link>
                <Link href="/pricing" className="btn btn-outline-dark">View pricing</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
