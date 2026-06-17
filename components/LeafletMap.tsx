'use client';
import { useEffect, useRef } from 'react';

interface Props {
  lat: number | null;
  lng: number | null;
  onMapClick: (lat: number, lng: number) => void;
}

export default function LeafletMap({ lat, lng, onMapClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = require('leaflet');

    // Fix default marker icon
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView([53.5, -2.0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        (markerRef.current as { setLatLng: (ll: [number, number]) => void }).setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      onMapClick(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker if lat/lng changes externally
  useEffect(() => {
    if (!mapInstanceRef.current || !lat || !lng) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current as { setView: (ll: [number, number], z: number) => void };
    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    }
    (markerRef.current as { setLatLng: (ll: [number, number]) => void }).setLatLng([lat, lng]);
    map.setView([lat, lng], 14);
  }, [lat, lng]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: 320, borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--line)', overflow: 'hidden' }} />
    </>
  );
}
