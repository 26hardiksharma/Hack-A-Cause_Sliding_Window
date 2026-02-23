'use client';

import { useEffect, useRef } from 'react';
import type { District, RiskLevel } from '@/lib/api';

// ── Risk colour map ───────────────────────────────────────────────────────────
const RISK_COLORS: Record<RiskLevel, string> = {
    CRITICAL: '#EF4444',
    HIGH: '#F97316',
    MEDIUM: '#EAB308',
    LOW: '#22C55E',
};

// ── SVG circle pin ────────────────────────────────────────────────────────────
function circlePinUrl(color: string, size = 28) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" stroke="white" stroke-width="2.5"/>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Script loading singleton (shared key so Maps JS only loads once) ───────────
let _mapsReady = false;
const _callbacks: Array<() => void> = [];

function loadMapsScript(apiKey: string, cb: () => void) {
    if (_mapsReady) { cb(); return; }
    _callbacks.push(cb);
    if (document.querySelector('script[data-gm2]')) return;
    const s = document.createElement('script');
    s.setAttribute('data-gm2', '1');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    s.async = true;
    s.defer = true;
    s.onload = () => {
        _mapsReady = true;
        _callbacks.forEach(f => f());
        _callbacks.length = 0;
    };
    document.head.appendChild(s);
}

// ── Info window content ───────────────────────────────────────────────────────
function districtInfoHtml(d: District) {
    const color = RISK_COLORS[d.risk_level];
    return `
      <div style="font-family:sans-serif;min-width:180px;padding:4px 0">
        <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:6px">${d.name}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
          <span style="font-size:11px;font-weight:700;color:${color}">${d.risk_level}</span>
          <span style="font-size:11px;color:#94a3b8">VWSI: ${d.vwsi.toFixed(2)}</span>
        </div>
        <div style="background:#f8fafc;border-radius:8px;padding:8px;font-size:11px;color:#475569">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span>Villages under stress</span>
            <strong>${d.villages_under_stress}</strong>
          </div>
          ${d.active_tankers != null ? `
          <div style="display:flex;justify-content:space-between">
            <span>Active tankers</span>
            <strong>${d.active_tankers}</strong>
          </div>` : ''}
        </div>
      </div>`;
}

// ── Component ─────────────────────────────────────────────────────────────────
interface DistrictMapProps {
    apiKey: string;
    districts: District[];
    height?: string;
}

// Centre of Maharashtra
const MH_CENTER = { lat: 19.7515, lng: 75.7139 };

export default function DistrictMap({ apiKey, districts, height = '300px' }: DistrictMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gMap = useRef<any>(null);
    // Store previous marker list so we can clear on district updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markers = useRef<any[]>([]);

    useEffect(() => {
        if (!apiKey || !mapRef.current) return;

        loadMapsScript(apiKey, () => {
            if (!mapRef.current) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const G = (window as any).google.maps;

            // Create map only once
            if (!gMap.current) {
                gMap.current = new G.Map(mapRef.current, {
                    center: MH_CENTER,
                    zoom: 7,
                    mapTypeId: 'roadmap',
                    disableDefaultUI: true,
                    gestureHandling: 'cooperative',
                    styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                        { featureType: 'water', stylers: [{ color: '#bfdbfe' }] },
                        { featureType: 'landscape', stylers: [{ color: '#f8fafc' }] },
                        { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
                    ],
                });
            }

            const map = gMap.current;
            const infoWindow = new G.InfoWindow();

            // Clear old markers
            markers.current.forEach(m => m.setMap(null));
            markers.current = [];

            if (districts.length === 0) return;

            // Fit bounds to all district points
            const bounds = new G.LatLngBounds();

            districts.forEach(d => {
                if (!d.lat || !d.lng) return;

                // Pin size scaled by severity
                const pinSize = d.risk_level === 'CRITICAL' ? 36
                    : d.risk_level === 'HIGH' ? 30
                        : 24;

                const marker = new G.Marker({
                    position: { lat: d.lat, lng: d.lng },
                    map,
                    icon: {
                        url: circlePinUrl(RISK_COLORS[d.risk_level], pinSize),
                        scaledSize: new G.Size(pinSize, pinSize),
                        anchor: new G.Point(pinSize / 2, pinSize / 2),
                    },
                    title: `${d.name} — ${d.risk_level}`,
                    zIndex: d.risk_level === 'CRITICAL' ? 40 : d.risk_level === 'HIGH' ? 30 : 20,
                });

                marker.addListener('click', () => {
                    infoWindow.setContent(districtInfoHtml(d));
                    infoWindow.open(map, marker);
                });

                markers.current.push(marker);
                bounds.extend({ lat: d.lat, lng: d.lng });
            });

            // Only fit bounds if we have actual points
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
            }
        });
    }, [apiKey, districts]);

    return (
        <div
            ref={mapRef}
            style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}
        />
    );
}
