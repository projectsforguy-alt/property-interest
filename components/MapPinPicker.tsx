'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default Leaflet marker icons reference image files that don't resolve under
// Next.js bundling — point them at the CDN copies instead.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const UK_CENTER: [number, number] = [54.5, -3.4];

type MapPinPickerProps = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
};

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPinPicker({ lat, lng, onChange }: MapPinPickerProps) {
  const [center] = useState<[number, number]>(lat && lng ? [lat, lng] : UK_CENTER);
  const zoom = lat && lng ? 15 : 6;

  return (
    <div
      style={{
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: '1px solid var(--line-strong)',
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '320px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {lat && lng && <Marker position={[lat, lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
