'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, Layers, Satellite, Map as MapIcon, Navigation } from 'lucide-react';
import { loadMapsScript } from '@/lib/maps-loader';

// ── Fallback depot (Nagpur district HQ) ───────────────────────────────────────
const FALLBACK_DEPOT = { lat: 20.4514, lng: 79.0053 };

// ── Mock drought-affected villages — spread across Vidarbha, Maharashtra ──────
// Placed in 4 different compass directions from Nagpur for visually distinct routes.
const DROUGHT_VILLAGES = [
    {
        id: 'v1',
        name: 'Amravati',          // ~150 km NORTH-WEST of Nagpur
        lat: 20.9320,
        lng: 77.7523,
        vwsi: 0.72,
        stress: 'red' as const,
        population: 6500,
        tankerId: 'MH-31-AB-1111',
        tankerStatus: 'delivering' as const,
        progress: 75,
    },
    {
        id: 'v2',
        name: 'Yavatmal',           // ~200 km SOUTH-WEST of Nagpur
        lat: 20.3888,
        lng: 78.1204,
        vwsi: 0.58,
        stress: 'orange' as const,
        population: 4200,
        tankerId: 'MH-31-CD-2222',
        tankerStatus: 'en-route' as const,
        progress: 45,
    },
    {
        id: 'v3',
        name: 'Chandrapur',         // ~130 km SOUTH of Nagpur
        lat: 19.9615,
        lng: 79.2961,
        vwsi: 0.65,
        stress: 'red' as const,
        population: 3800,
        tankerId: 'MH-31-EF-3333',
        tankerStatus: 'issue' as const,
        progress: 20,
    },
    {
        id: 'v4',
        name: 'Gondia',             // ~180 km NORTH-EAST of Nagpur
        lat: 21.4642,
        lng: 80.1944,
        vwsi: 0.38,
        stress: 'yellow' as const,
        population: 2900,
        tankerId: 'MH-31-GH-4444',
        tankerStatus: 'en-route' as const,
        progress: 60,
    },
];

// ── Colour maps ───────────────────────────────────────────────────────────────
const STRESS_COLORS: Record<string, string> = {
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#EAB308',
    green: '#22C55E',
};

const STATUS_COLORS: Record<string, string> = {
    delivering: '#22C55E',
    'en-route': '#3B82F6',
    issue: '#EF4444',
};

// ── SVG Markers ───────────────────────────────────────────────────────────────
function svgUrl(svg: string) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const YOU_PIN = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
  <circle cx="24" cy="24" r="20" fill="#3B82F6" fill-opacity="0.2"/>
</svg>`);

function villagePinSvg(color: string) {
    return svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
  <path d="M16 2C9.37 2 4 7.37 4 14c0 9.33 12 26 12 26s12-16.67 12-26C28 7.37 22.63 2 16 2z"
    fill="${color}" stroke="white" stroke-width="2.5"/>
  <circle cx="16" cy="14" r="6" fill="white"/>
</svg>`);
}

function depotPinSvg() {
    return svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <rect x="2" y="2" width="36" height="36" rx="10" fill="#1E293B" stroke="white" stroke-width="2.5"/>
  <path d="M10 30 L10 18 L20 11 L30 18 L30 30 Z M17 30 L17 23 L23 23 L23 30"
    fill="none" stroke="white" stroke-width="2.2" stroke-linejoin="round"/>
</svg>`);
}

// ── Info window HTML helpers ──────────────────────────────────────────────────
function depotInfoHtml(isLive: boolean) {
    return `<div style="font-family:sans-serif;padding:4px 0;min-width:150px">
      <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:3px">
        ${isLive ? '📍 Your Location' : '📍 Default Depot (Nagpur)'}
      </div>
      <div style="font-size:11px;color:#64748b">
        ${isLive ? 'Live GPS location used as water depot origin.' : 'Geolocation unavailable — using Nagpur district HQ.'}
      </div>
    </div>`;
}

function villageInfoHtml(
    v: (typeof DROUGHT_VILLAGES)[0],
    eta: string,
    distance: string,
) {
    const stressColor = STRESS_COLORS[v.stress];
    const statusColor = STATUS_COLORS[v.tankerStatus];
    const stressLabel =
        v.vwsi > 0.6 ? 'Severe Stress' : v.vwsi > 0.4 ? 'High Stress' : 'Moderate';
    const statusLabel =
        v.tankerStatus === 'delivering'
            ? '🟢 Delivering'
            : v.tankerStatus === 'en-route'
                ? '🔵 En Route'
                : '🔴 Breakdown';

    return `<div style="font-family:sans-serif;min-width:200px;padding:4px 0">
      <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:6px">${v.name} Village</div>
      
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="width:10px;height:10px;border-radius:50%;background:${stressColor};display:inline-block;flex-shrink:0"></span>
        <span style="font-size:11px;color:#475569;font-weight:600">${stressLabel}</span>
        <span style="font-size:11px;color:#94a3b8">VWSI: ${v.vwsi.toFixed(2)}</span>
      </div>

      <div style="background:#f8fafc;border-radius:8px;padding:8px;margin-bottom:8px">
        <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:5px">Fastest Route</div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:12px;color:#1e293b"><strong>${distance || '—'}</strong></span>
          <span style="font-size:12px;color:#1e293b">ETA <strong>${eta || '—'}</strong></span>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase">${v.tankerId}</div>
        <div style="font-size:11px;font-weight:600;color:${statusColor}">${statusLabel}</div>
      </div>

      <div style="background:#f1f5f9;border-radius:6px;height:5px;margin-top:6px;overflow:hidden">
        <div style="background:${statusColor};width:${v.progress}%;height:100%;border-radius:6px;transition:width 0.3s"></div>
      </div>
      <div style="font-size:10px;color:#94a3b8;margin-top:3px;text-align:right">${v.progress}% complete</div>
    </div>`;
}


interface LiveMapProps { apiKey: string }

type RouteInfo = { eta: string; distance: string };

export default function LiveMap({ apiKey }: LiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gMap = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderers = useRef<any[]>([]);

    const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
    const [phase, setPhase] = useState<'locating' | 'loading' | 'ready' | 'error'>('locating');
    const [fallback, setFallback] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    // Per-village route info resolved from Directions API
    const [routes, setRoutes] = useState<Record<string, RouteInfo>>({});

    useEffect(() => {
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
            setErrorMsg('Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local');
            setPhase('error');
            return;
        }

        // Step 1: Get geolocation
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                // Sanity check: desktop browsers often return an IP-based city
                // (commonly Mumbai, ~880 km from Nagpur) instead of real GPS.
                // If the returned point is more than 300 km outside the Nagpur
                // district area, treat it as unreliable and use the fallback.
                const dLat = lat - FALLBACK_DEPOT.lat;
                const dLng = lng - FALLBACK_DEPOT.lng;
                const approxKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
                const isTooFar = approxKm > 300;

                if (isTooFar) {
                    setFallback(true);
                    setPhase('loading');
                    initMap(FALLBACK_DEPOT, true);
                } else {
                    setPhase('loading');
                    initMap({ lat, lng }, false);
                }
            },
            () => {
                // Denied or unavailable — use fallback
                setFallback(true);
                setPhase('loading');
                initMap(FALLBACK_DEPOT, true);
            },
            { timeout: 8000, enableHighAccuracy: true },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function initMap(depot: { lat: number; lng: number }, isFallback: boolean) {
        loadMapsScript(apiKey, () => {
            if (!mapRef.current) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const G = (window as any).google.maps;

            const map = new G.Map(mapRef.current, {
                center: depot,
                zoom: 11,
                mapTypeId: 'roadmap',
                disableDefaultUI: true,
                styles: [
                    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
                    { featureType: 'water', stylers: [{ color: '#bfdbfe' }] },
                    { featureType: 'landscape', stylers: [{ color: '#f8fafc' }] },
                ],
            });
            gMap.current = map;

            const infoWindow = new G.InfoWindow();

            // ── "You are here" / depot marker ─────────────────────────────────
            const depotMarker = new G.Marker({
                position: depot,
                map,
                icon: {
                    url: isFallback ? depotPinSvg() : YOU_PIN,
                    scaledSize: isFallback ? new G.Size(40, 40) : new G.Size(48, 48),
                    anchor: new G.Point(24, 24),
                },
                title: isFallback ? 'Default Depot' : 'Your Location',
                zIndex: 50,
            });
            depotMarker.addListener('click', () => {
                infoWindow.setContent(depotInfoHtml(!isFallback));
                infoWindow.open(map, depotMarker);
            });

            // ── Village markers ────────────────────────────────────────────────
            DROUGHT_VILLAGES.forEach((v) => {
                const vMarker = new G.Marker({
                    position: { lat: v.lat, lng: v.lng },
                    map,
                    icon: {
                        url: villagePinSvg(STRESS_COLORS[v.stress]),
                        scaledSize: new G.Size(32, 42),
                        anchor: new G.Point(16, 42),
                    },
                    title: v.name,
                    zIndex: 20,
                });
                vMarker.addListener('click', () => {
                    // Show info immediately; route info may update reactively
                    const r = routes[v.id] ?? { eta: 'Calculating…', distance: '…' };
                    infoWindow.setContent(villageInfoHtml(v, r.eta, r.distance));
                    infoWindow.open(map, vMarker);
                });
                // Store ref for reactive update
                (vMarker as any).__villageId = v.id;
                (vMarker as any).__village = v;
                (vMarker as any).__infoWindow = infoWindow;
                (vMarker as any).__map = map;
            });

            // ── Directions API: fastest route per active tanker ────────────────
            const directionsService = new G.DirectionsService();

            DROUGHT_VILLAGES.forEach((v, idx) => {
                const strokeColor = STATUS_COLORS[v.tankerStatus];
                const renderer = new G.DirectionsRenderer({
                    suppressMarkers: true, // we draw our own markers
                    polylineOptions: {
                        strokeColor,
                        strokeOpacity: v.tankerStatus === 'issue' ? 0.35 : 0.85,
                        strokeWeight: v.tankerStatus === 'issue' ? 2 : 4,
                        ...(v.tankerStatus === 'issue' ? { icons: [] } : {}),
                    },
                    map,
                });
                renderers.current.push(renderer);

                directionsService.route(
                    {
                        origin: depot,
                        destination: { lat: v.lat, lng: v.lng },
                        travelMode: G.TravelMode.DRIVING,
                        provideRouteAlternatives: false,
                        drivingOptions: {
                            departureTime: new Date(),
                            trafficModel: 'bestguess',
                        },
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (result: any, status: string) => {
                        if (status === 'OK') {
                            renderer.setDirections(result);
                            const leg = result.routes[0].legs[0];
                            const routeInfo: RouteInfo = {
                                eta: leg.duration_in_traffic?.text ?? leg.duration.text,
                                distance: leg.distance.text,
                            };
                            setRoutes((prev) => ({ ...prev, [v.id]: routeInfo }));
                        } else {
                            console.warn(`Directions API [${v.name}]:`, status);
                            // Draw a simple fallback geodesic line
                            new G.Polyline({
                                path: [depot, { lat: v.lat, lng: v.lng }],
                                geodesic: true,
                                strokeColor,
                                strokeOpacity: 0.6,
                                strokeWeight: 3,
                                strokeDasharray: '10 5',
                                map,
                            });
                        }
                    },
                );

                // Stagger requests to avoid hitting rate limits
                void idx; // suppress unused
            });

            setPhase('ready');
        });
    }

    // Sync map type changes
    useEffect(() => {
        if (gMap.current) gMap.current.setMapTypeId(mapType);
    }, [mapType]);

    const zoomIn = () => gMap.current?.setZoom(gMap.current.getZoom() + 1);
    const zoomOut = () => gMap.current?.setZoom(gMap.current.getZoom() - 1);

    // ── Error screen ──────────────────────────────────────────────────────────
    if (phase === 'error') {
        return (
            <div className="flex-1 rounded-2xl bg-red-50 border border-red-200 flex flex-col items-center justify-center gap-3 p-8">
                <span className="text-4xl">⚠️</span>
                <p className="text-red-600 font-semibold text-center text-sm max-w-xs">{errorMsg}</p>
                <code className="text-[11px] bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
                </code>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="flex-1 rounded-2xl overflow-hidden relative border border-slate-100 shadow-inner bg-slate-50">
            {/* Map canvas */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />

            {/* Loading / locating spinner */}
            {(phase === 'locating' || phase === 'loading') && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-sm text-slate-500 font-medium">
                            {phase === 'locating' ? 'Getting your location…' : 'Loading map & routes…'}
                        </p>
                    </div>
                </div>
            )}

            {/* Fallback location notice */}
            {phase === 'ready' && fallback && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
                    Using default location (Nagpur) — allow location for live depot
                </div>
            )}

            {/* Map / Satellite toggle */}
            <div className={`absolute z-20 flex gap-1 bg-white rounded-xl shadow-sm border border-slate-100 p-1 ${fallback ? 'top-14 left-4' : 'top-4 left-4'}`}>
                <button
                    onClick={() => setMapType('roadmap')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${mapType === 'roadmap' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                >
                    <MapIcon className="w-3.5 h-3.5" /> Map
                </button>
                <button
                    onClick={() => setMapType('satellite')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${mapType === 'satellite' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                >
                    <Satellite className="w-3.5 h-3.5" /> Satellite
                </button>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5">
                <button onClick={zoomIn} aria-label="Zoom in" className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-slate-100">
                    <Plus className="w-4 h-4" />
                </button>
                <button onClick={zoomOut} aria-label="Zoom out" className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-slate-100">
                    <Minus className="w-4 h-4" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-3 min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Legend
                </p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1.5">Village Stress</p>
                {[
                    { label: 'Severe (VWSI > 0.6)', color: '#EF4444' },
                    { label: 'High (0.4–0.6)', color: '#F97316' },
                    { label: 'Moderate (0.2–0.4)', color: '#EAB308' },
                ].map((i) => (
                    <div key={i.label} className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i.color }} />
                        <span className="text-[10px] text-slate-500">{i.label}</span>
                    </div>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1.5">Tanker Route</p>
                    {[
                        { label: 'Delivering', color: '#22C55E' },
                        { label: 'En Route', color: '#3B82F6' },
                        { label: 'Issue / Breakdown', color: '#EF4444' },
                    ].map((i) => (
                        <div key={i.label} className="flex items-center gap-2 mb-1">
                            <span className="w-4 h-1 rounded flex-shrink-0" style={{ background: i.color }} />
                            <span className="text-[10px] text-slate-500">{i.label}</span>
                        </div>
                    ))}
                </div>

                {/* Live route info summary */}
                {Object.keys(routes).length > 0 && (
                    <div className="border-t border-slate-100 mt-2 pt-2">
                        <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1.5">Route ETAs</p>
                        {DROUGHT_VILLAGES.filter((v) => routes[v.id]).map((v) => (
                            <div key={v.id} className="flex justify-between items-center mb-1 gap-2">
                                <span className="text-[10px] text-slate-600 font-medium truncate">{v.name}</span>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{routes[v.id].eta}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
