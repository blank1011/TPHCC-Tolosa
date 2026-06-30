'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const churchPosition: [number, number] = [11.063753666303958, 125.03609567286577];

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let marker: any;

    const resizeHandler = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const refresh = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.setView(churchPosition);
      }
    };

    const initializeMap = async () => {
      const L = await import('leaflet');

      if (!mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: churchPosition,
        zoom: 16,
        scrollWheelZoom: true,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      const churchIcon = L.divIcon({
        html: `
          <div style="width:48px; height:48px; border:3px solid #dc2626; border-radius:50%; background:#ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 14px 22px rgba(0,0,0,0.16);">
            <img src="/images/logo.gif" alt="Church pin" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" />
          </div>
        `,
        className: 'custom-leaflet-pin',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -44],
      });

      marker = L.marker(churchPosition, { icon: churchIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align:center; font-family:system-ui, sans-serif; color:#475569; line-height:1.4; white-space:nowrap;">
          <div style="font-size:1rem; font-weight:700; color:#1d4ed8; white-space:nowrap;">The Potter's House Christian Church</div>
          <div style="margin-top:0.35rem; font-size:0.9rem; color:#475569; white-space:normal;">Brgy. Imelda, Tolosa, Leyte</div>
          <div style="margin-top:0.75rem; font-size:0.82rem; font-style:italic; color:#475569; white-space:normal;">
            "Changing Lives, Making Disciples, Reaching the World"
          </div>
        </div>
      `);

      map.scrollWheelZoom.enable();

      requestAnimationFrame(() => {
        refresh();
        setTimeout(refresh, 300);
      });

      window.addEventListener('resize', refresh);
    };

    initializeMap();

    return () => {
      window.removeEventListener('resize', refresh);
      if (marker) marker.remove();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full" style={{ minHeight: '420px' }} />;
}
