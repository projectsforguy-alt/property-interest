'use client';
import { useState } from 'react';

interface PostcodeResult {
  postcode: string;
  district: string;
  ward: string;
  parish: string | null;
  admin_district: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface Props {
  value: string;
  onChange: (postcode: string, result?: PostcodeResult) => void;
  required?: boolean;
  style?: React.CSSProperties;
}

export default function PostcodeInput({ value, onChange, required, style }: Props) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function validate(raw: string) {
    const cleaned = raw.replace(/\s+/g, '').toUpperCase();
    if (!cleaned || cleaned.length < 5) { setStatus('idle'); return; }
    setStatus('checking');
    setErrorMsg('');
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (data.status === 200 && data.result) {
        const result: PostcodeResult = {
          postcode: data.result.postcode,
          district: data.result.outcode,
          ward: data.result.ward,
          parish: data.result.parish,
          admin_district: data.result.admin_district,
          region: data.result.region,
          latitude: data.result.latitude,
          longitude: data.result.longitude,
        };
        setStatus('valid');
        onChange(data.result.postcode, result);
      } else {
        setStatus('invalid');
        setErrorMsg('Postcode not found — please check and try again');
      }
    } catch {
      setStatus('invalid');
      setErrorMsg('Could not validate postcode — please check your connection');
    }
  }

  const borderColor = status === 'valid' ? 'var(--teal)' : status === 'invalid' ? 'var(--red)' : undefined;
  const boxShadow = status === 'valid' ? '0 0 0 3px rgba(29,184,160,0.12)' : status === 'invalid' ? '0 0 0 3px rgba(220,38,38,0.12)' : undefined;

  return (
    <div>
      <div style={{ position: 'relative', maxWidth: 240 }}>
        <input
          type="text"
          className={`field-input${status === 'invalid' ? ' error' : ''}`}
          style={{ ...style, borderColor, boxShadow, paddingRight: 36 }}
          value={value}
          onChange={e => { onChange(e.target.value); setStatus('idle'); }}
          onBlur={e => validate(e.target.value)}
          placeholder="e.g. SK10 3AQ"
          required={required}
          autoComplete="postal-code"
        />
        {status === 'checking' && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>…</span>
        )}
        {status === 'valid' && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--teal)' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        )}
        {status === 'invalid' && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--red)' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
        )}
      </div>
      {errorMsg && <div className="field-error" style={{ marginTop: 4 }}>{errorMsg}</div>}
    </div>
  );
}
