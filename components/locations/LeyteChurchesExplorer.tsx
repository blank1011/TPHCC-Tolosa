'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

type ChurchLocation = {
  _id?: string;
  id: string;
  name: string;
  address: string;
  pastorName: string;
  phone?: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER: [number, number] = [11.063753666303958, 125.03609567286577];

export default function LeyteChurchesExplorer() {
  const [churches, setChurches] = useState<ChurchLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const loadChurches = async () => {
      try {
        const response = await fetch('/api/churches');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          setChurches([]);
          setSelectedId('');
          return;
        }

        const normalized = data
          .map((item: any) => ({
            _id: item._id?.toString(),
            id: item._id?.toString() || item.id || `${item.name}-${item.latitude}-${item.longitude}`,
            name: String(item.name || '').trim(),
            address: String(item.address || '').trim(),
            pastorName: String(item.pastorName || '').trim(),
            phone: item.phone ? String(item.phone) : undefined,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          }))
          .filter(
            (item: ChurchLocation) =>
              item.name &&
              item.address &&
              !Number.isNaN(item.latitude) &&
              !Number.isNaN(item.longitude)
          );

        if (normalized.length) {
          setChurches(normalized);
          setSelectedId((prev) =>
            normalized.some((church) => church.id === prev) ? prev : normalized[0].id
          );
        }
      } catch (error) {
        console.error('Failed to load churches:', error);
      }
    };

    loadChurches();
  }, []);

  const centerLocation = (locationId: string, withAnimation = true) => {
    const map = mapInstanceRef.current;
    const location = churches.find((item) => item.id === locationId);

    if (!map || !location) {
      return;
    }

    map.closePopup();
    map.setView([location.latitude, location.longitude], 16, {
      animate: withAnimation,
      duration: 0.6,
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      const L = await import('leaflet');

      if (!mapRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialPosition = DEFAULT_CENTER;

      const map = L.map(mapRef.current, {
        center: initialPosition,
        zoom: 12,
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

      map.invalidateSize();

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    let cleanup: (() => void) | undefined;

    initializeMap().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    const renderMarkers = async () => {
      const L = await import('leaflet');

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      if (!churches.length) {
        map.setView(DEFAULT_CENTER, 12, { animate: false });
        return;
      }

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

      churches.forEach((location) => {
        const marker = L.marker([location.latitude, location.longitude], { icon: churchIcon }).addTo(map);
        marker.bindPopup(`
          <div style="width:250px; max-width:250px; font-family:system-ui, sans-serif; color:#475569; line-height:1.4;">
            <div style="font-size:0.98rem; font-weight:700; color:#1d4ed8;">${location.name}</div>
            <div style="margin-top:0.4rem; font-size:0.88rem; color:#475569;">${location.address}</div>
            <div style="margin-top:0.4rem; font-size:0.84rem; color:#334155;">Pastor: ${location.pastorName || 'To be added'}</div>
          </div>
        `, { minWidth: 250, maxWidth: 280, autoPan: false, keepInView: false });

        markersRef.current.set(location.id, marker);
      });

      const activeId = churches.some((church) => church.id === selectedId)
        ? selectedId
        : churches[0].id;

      if (activeId !== selectedId) {
        setSelectedId(activeId);
      }

      requestAnimationFrame(() => {
        map.invalidateSize();
        centerLocation(activeId, false);
      });
    };

    renderMarkers();
  }, [churches]);

  useEffect(() => {
    if (!selectedId || !churches.length) {
      return;
    }

    centerLocation(selectedId);
  }, [selectedId, churches]);

  return (
    <section className="grid gap-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-stretch">
      <aside className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/90">Leyte Churches</p>
          <p className="mt-2 px-3 text-sm text-slate-200">Tap a church to focus it on the map.</p>
          {churches.length ? (
            <div className="mt-3 grid max-h-[560px] gap-3 overflow-y-auto pr-1">
              {churches.map((location) => {
                const isActive = selectedId === location.id;

                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(location.id);
                      centerLocation(location.id);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? 'border-blue-300/60 bg-blue-500/20 text-white shadow-lg shadow-blue-900/20'
                        : 'border-white/15 bg-slate-950/35 text-slate-100 hover:border-white/30 hover:bg-slate-900/50'
                    }`}
                  >
                    <h3 className="text-sm font-semibold sm:text-base">{location.name}</h3>
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-200 sm:text-sm">
                      <MapPin size={15} className="mt-0.5 flex-shrink-0 text-red-300" />
                      <span>{location.address}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 sm:text-sm">Pastor: {location.pastorName || 'To be added'}</p>
                    {location.phone ? (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
                        <Phone size={14} className="flex-shrink-0 text-emerald-300" />
                        <span>{location.phone}</span>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-white/20 bg-slate-950/35 p-4 text-sm text-slate-300">
              No church locations yet. Add one from the admin Add Church page.
            </div>
          )}
      </aside>

      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl shadow-slate-950/30 lg:min-h-[720px]">
        <div ref={mapRef} className="h-full w-full" style={{ minHeight: '460px' }} />
      </div>
    </section>
  );
}
