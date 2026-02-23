'use client';
import { Truck, Droplet, Timer, TrendingUp } from 'lucide-react';

interface TrackingStatsProps {
  active: number;
  total: number;
  totalLoadLiters: number;
  avgEta: number;
  maintenance: number;
  efficiency: number;
}

export function TrackingStats({ active, total, totalLoadLiters, avgEta, maintenance, efficiency }: TrackingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Active Tankers */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Tankers</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {active} <span className="text-lg font-normal text-slate-400">/ {total}</span>
            </h3>
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

      {/* Water Volume */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Water Volume</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {(totalLoadLiters / 1_000_000).toFixed(2)}M L
            </h3>
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

      {/* Avg ETA */}
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
  );
}
