'use client';
import { useState, useCallback, useEffect } from 'react';
import { Truck, Droplet, Timer, CheckCircle, AlertTriangle, Hourglass, MoreHorizontal, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { api, type Tanker, type FeedItem } from '@/lib/api';

// Dynamically import the map so it only runs on the client (Google Maps needs window)
const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// ── Inline Skeleton component ─────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-[24px] ${className ?? ''}`} />;
}

// ── Feed item icon map ────────────────────────────────────────────────────────
const statusIcon: Record<string, { icon: React.ElementType; bg: string; cls: string }> = {
  delivery: { icon: CheckCircle, bg: 'bg-emerald-50', cls: 'text-emerald-600' },
  breakdown: { icon: AlertTriangle, bg: 'bg-white', cls: 'text-red-500' },
  loading: { icon: Hourglass, bg: 'bg-orange-50', cls: 'text-orange-500' },
  maintenance: { icon: Truck, bg: 'bg-slate-100', cls: 'text-slate-500' },
};

export default function TrackingPage() {
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const load = useCallback(async () => {
    try {
      const [tRes, fRes] = await Promise.all([
        api.tankers.list(),
        api.tankers.feed(),
      ]);
      setTankers(tRes);
      setFeed(fRes.feed);
      setLastSync(new Date());
    } catch (e) {
      // Backend may not be running — log as warning so the Next.js
      // dev overlay doesn't treat it as a blocking error.
      console.warn('[Tracking] Backend unavailable, showing empty state:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = tankers.filter(t => t.status === 'active').length;
  const loading_ = tankers.filter(t => t.status === 'loading').length;
  const maintenance = tankers.filter(t => t.status === 'maintenance').length;
  const idle = tankers.filter(t => t.status === 'idle').length;
  const totalLoad = tankers.reduce((s, t) => s + t.current_load_liters, 0);
  const avgEta = tankers.filter(t => t.eta_minutes).length
    ? Math.round(tankers.filter(t => t.eta_minutes).reduce((s, t) => s + (t.eta_minutes ?? 0), 0) / tankers.filter(t => t.eta_minutes).length)
    : 0;
  const efficiency = tankers.length ? Math.round((active / tankers.length) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-6 h-full pb-8">
        <Skeleton className="col-span-12 lg:col-span-8 h-[600px] rounded-[24px]" />
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <Skeleton className="h-[300px] rounded-[24px]" />
          <Skeleton className="h-[280px] rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Left Column - Map & Stats */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Map Container */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 flex-1 flex flex-col relative overflow-hidden border border-slate-100 min-h-[500px]">
          <div className="flex justify-between items-center mb-4 z-10 relative">
            <h2 className="text-lg font-bold text-slate-800">Live Coverage Area</h2>
          </div>

          {/* Google Maps — fills the remaining height of this card */}
          <LiveMap apiKey={GOOGLE_MAPS_API_KEY} />
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Tankers</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{active} <span className="text-lg font-normal text-slate-400">/ {tankers.length}</span></h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {efficiency}%
              </span>
              <span className="text-slate-400">fleet efficiency</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Water Volume</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{(totalLoad / 1_000_000).toFixed(2)}M L</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
              <span className="text-slate-400">current fleet load</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg ETA</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{avgEta}m</h3>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Timer className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${maintenance > 0 ? 'text-red-500 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                {maintenance > 0 ? `${maintenance} breakdown` : 'On track'}
              </span>
              <span className="text-slate-400">to delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Status & Feed */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Fleet Status */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Fleet Status</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center mb-8 relative">
            <div className="w-48 h-48 rounded-full border-[12px] border-l-emerald-500 border-t-emerald-500 border-r-orange-400 border-b-red-500 rotate-45 transform flex items-center justify-center relative">
              <div className="text-center transform -rotate-45">
                <p className="text-xs text-slate-400 font-medium">Efficiency</p>
                <p className="text-3xl font-bold text-slate-800">{efficiency}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'On Time (Active)', color: 'bg-emerald-500', count: active, pct: tankers.length ? Math.round(active / tankers.length * 100) : 0 },
              { label: 'Loading / En Route', color: 'bg-orange-400', count: loading_, pct: tankers.length ? Math.round(loading_ / tankers.length * 100) : 0 },
              { label: 'Issues / Maintenance', color: 'bg-red-500', count: maintenance, pct: tankers.length ? Math.round(maintenance / tankers.length * 100) : 0 },
            ].map(row => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${row.color}`}></span>
                    <span className="text-sm font-medium text-slate-600">{row.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{row.count} tankers</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${row.color} h-full rounded-full transition-all duration-700`} style={{ width: `${row.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-white rounded-[24px] shadow-sm flex-1 border border-slate-100 flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Live Feed</h3>
            <div className="flex gap-2 text-xs">
              <button className="font-bold text-blue-600">All</button>
              <button className="text-slate-400 hover:text-slate-600">Issues</button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {feed.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No recent events.</p>
            ) : feed.map((item, i) => {
              const s = statusIcon[item.type] ?? statusIcon.delivery;
              const Icon = s.icon;
              const isAlert = item.type === 'breakdown';
              return (
                <div
                  key={i}
                  className={`p-3 rounded-2xl transition-colors cursor-pointer group mb-2 ${isAlert ? 'bg-red-50/50 border border-red-100 hover:bg-red-50' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.cls} flex items-center justify-center flex-shrink-0 ${isAlert ? 'shadow-sm' : 'group-hover:bg-white group-hover:shadow-sm'} border border-transparent group-hover:border-slate-100 transition-all`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                        <span className={`text-[10px] whitespace-nowrap ${isAlert ? 'text-red-500 font-medium' : 'text-slate-400'}`}>{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.detail}</p>
                      {isAlert && (
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded hover:bg-red-200 transition-colors">Dispatch Help</button>
                          <button className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded hover:bg-slate-50 transition-colors">View Map</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
