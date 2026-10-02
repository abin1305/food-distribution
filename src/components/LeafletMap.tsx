import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'provider' | 'receiver' | 'food';
  subtitle?: string;
  details?: string;
  status?: string;
  onSelect?: () => void;
}

interface LeafletMapProps {
  markers: MapMarker[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers,
  centerLat = 37.7749,
  centerLng = -122.4194,
  zoom = 13,
  height = '380px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], zoom);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon SVG helper
    const createCustomIcon = (type: 'provider' | 'receiver' | 'food') => {
      const color =
        type === 'provider'
          ? '#059669' // Emerald Green
          : type === 'receiver'
          ? '#2563eb' // Royal Blue
          : '#d97706'; // Amber

      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
          <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
        </svg>
      `;

      return L.divIcon({
        className: 'custom-leaflet-pin',
        html: svgIcon,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30],
      });
    };

    // Add markers
    markers.forEach((m) => {
      if (!m.lat || !m.lng) return;

      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type),
      }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
              m.type === 'provider' ? '#059669' : m.type === 'receiver' ? '#2563eb' : '#d97706'
            }"></span>
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b;">${m.type}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${m.title}</h4>
          ${m.subtitle ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;">${m.subtitle}</p>` : ''}
          ${m.details ? `<p style="margin: 0 0 6px 0; font-size: 11px; color: #059669; font-weight: 600;">${m.details}</p>` : ''}
          ${m.status ? `<span style="font-size: 10px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${m.status}</span>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [markers, centerLat, centerLng, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-2xl overflow-hidden shadow-inner border border-slate-200 z-10"
      id="leaflet-map-canvas"
    />
  );
};
