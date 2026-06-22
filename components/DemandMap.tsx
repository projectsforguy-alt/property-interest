'use client';

import { useEffect, useRef } from 'react';

interface Props {
  lat: number;
  lng: number;
  exactCount: number;
  areaCount: number;
  hasInterest: boolean;
  postcode: string;
}

export default function DemandMap({ lat, lng, exactCount, areaCount, hasInterest, postcode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
      });

      mapRef.current = map;

      // Clean CartoDB Positron tiles — light, minimal, no API key needed
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Attribution tucked away neatly
      L.control.attribution({ prefix: false, position: 'bottomright' })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>')
        .addTo(map);

      // Custom postcode marker
      const markerHtml = `
        <div style="
          width: 36px;
          height: 36px;
          background: #0F1F2E;
          border: 3px solid #1DB8A0;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(15,31,46,0.35);
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<strong>${postcode}</strong>`, { closeButton: false, offset: [0, -8] });

      if (hasInterest) {
        // Exact postcode demand — tight teal circle
        if (exactCount > 0) {
          L.circle([lat, lng], {
            radius: 180,
            color: '#1DB8A0',
            fillColor: '#1DB8A0',
            fillOpacity: 0.12,
            weight: 1.5,
            opacity: 0.5,
          }).addTo(map);
        }

        // Area/district demand — wider, more diffuse circle
        if (areaCount > 0) {
          L.circle([lat, lng], {
            radius: 800,
            color: '#1DB8A0',
            fillColor: '#1DB8A0',
            fillOpacity: 0.05,
            weight: 1,
            opacity: 0.25,
            dashArray: '4 4',
          }).addTo(map);
        }
      }
    });

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid var(--line)' }}>
      <div ref={containerRef} style={{ height: 280, width: '100%', background: 'var(--surface)' }} />
      {hasInterest && (
        <div style={{
          position: 'absolute',
          top: 'var(--space-3)',
          left: 'var(--space-3)',
          background: 'rgba(15,31,46,0.85)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-2) var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--teal)',
            boxShadow: '0 0 0 3px rgba(29,184,160,0.3)',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap' }}>
            {exactCount + areaCount} {exactCount + areaCount === 1 ? 'buyer' : 'buyers'} registered nearby
          </span>
        </div>
      )}
    </div>
  );
}
