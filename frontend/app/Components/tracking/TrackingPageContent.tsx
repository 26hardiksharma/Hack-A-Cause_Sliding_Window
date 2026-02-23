'use client';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { api, type Tanker, type FeedItem } from '@/lib/api';
import { FleetMap } from './FleetMap';
import { FleetStatus } from './FleetStatus';
import { LiveFeed } from './LiveFeed';
import { TrackingStats } from './TrackingStats';

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-[24px] ${className ?? ''}`} />;
}

export function TrackingPageContent() {
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [feed,    setFeed]    = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [tRes, fRes] = await Promise.all([api.tankers.list(), api.tankers.feed()]);
      setTankers(tRes);
      setFeed(fRes.feed);
    } catch (e) {
      console.warn('[Tracking] Backend unavailable, showing empty state:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const active      = tankers.filter(t => t.status === 'active').length;
  const maintenance = tankers.filter(t => t.status === 'maintenance').length;
  const totalLoad   = tankers.reduce((s, t) => s + t.current_load_liters, 0);
  const avgEta      = tankers.filter(t => t.eta_minutes).length
    ? Math.round(tankers.filter(t => t.eta_minutes).reduce((s, t) => s + (t.eta_minutes ?? 0), 0) / tankers.filter(t => t.eta_minutes).length)
    : 0;
  const efficiency  = tankers.length ? Math.round((active / tankers.length) * 100) : 0;

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
      {/* Left Column – Map & Stats */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Map Container — uses real Google Maps if API key present, otherwise FleetMap mock */}
        {GOOGLE_MAPS_API_KEY ? (
          <div className="bg-white rounded-[24px] shadow-sm p-6 flex-1 flex flex-col relative overflow-hidden border border-slate-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-4 z-10 relative">
              <h2 className="text-lg font-bold text-slate-800">Live Coverage Area</h2>
            </div>
            <LiveMap apiKey={GOOGLE_MAPS_API_KEY} />
          </div>
        ) : (
          <FleetMap />
        )}
        <TrackingStats
          active={active}
          total={tankers.length}
          totalLoadLiters={totalLoad}
          avgEta={avgEta}
          maintenance={maintenance}
          efficiency={efficiency}
        />
      </div>

      {/* Right Column – Status & Feed */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <FleetStatus tankers={tankers} efficiency={efficiency} />
        <LiveFeed feed={feed} />
      </div>
    </div>
  );
}
