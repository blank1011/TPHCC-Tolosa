'use client';

import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const churchPosition: [number, number] = [11.063753666303958, 125.03609567286577];

const churchIcon = L.icon({
  iconUrl: '/images/logo.png',
  iconSize: [50, 50],
  iconAnchor: [25, 45],
  popupAnchor: [0, -40],
  className: 'rounded-full border border-white bg-white shadow-lg',
});

export default function MapPlaceholder() {
  return (
    <MapContainer
      center={churchPosition}
      zoom={16}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={churchPosition} icon={churchIcon}>
        <Popup>
          The Potter&apos;s House Christian Centre<br />Brgy. Imelda, Tolosa, Leyte
        </Popup>
      </Marker>
    </MapContainer>
  );
}
