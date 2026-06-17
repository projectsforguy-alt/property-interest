'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number, address?: string) => void;
}

// Dynamically import Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false, loading: () => (
  <div style={{ height: 320, background: 'var(--surface)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate)', fontSize: 'var(--text-sm)' }}>
    Loading map…
  </div>
) });

export default function MapPinPicker({ lat, lng, onChange }: Props) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleMapClick(newLat: number, newLng: number) {
    setLoading(true);
    onChange(newLat, newLng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${newLat}&lon=${newLng}&format=json`,
        { headers: { 'Accept-Language': 'en-GB' } }
      );
      const data = await res.json();
      if (data.display_name) {
        setAddress(data.display_name);
        onChange(newLat, newLng, data.display_name);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div>
      <LeafletMap lat={lat} lng={lng} onMapClick={handleMapClick} />
      {lat && lng && (
        <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
          {loading ? 'Looking up address…' : address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
        </div>
      )}
      {!lat && (
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--slate)' }}>
          Click on the map to drop a pin at your target location
        </div>
      )}
    </div>
  );
}
