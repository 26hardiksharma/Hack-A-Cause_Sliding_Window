'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, MessageSquare } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { api, type District, type Tanker, riskColor, riskBg, riskVwsiPercent } from '@/lib/api';

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

// ─── DashboardStats ───────────────────────────────────────────────────────────
interface DashboardStatsProps {
  avgVWSI: number;
  criticalCount: number;
  districtCount: number;
  totalStress: number;
  highCriticalCount: number;
  activeTankers: number;
  totalTankers: number;
  loadingTankers: number;
}

function DashboardStats({
  avgVWSI, criticalCount, districtCount,
  totalStress, highCriticalCount,
  activeTankers, totalTankers, loadingTankers,
}: DashboardStatsProps) {
  return (
    <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Avg VWSI */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg District VWSI</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{avgVWSI.toFixed(2)}</h3>
          </div>
          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {criticalCount} Critical
          </span>
          <span className="text-slate-400">across {districtCount} districts</span>
        </div>
      </div>

      {/* Villages Under Stress */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Villages Under Stress</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalStress}</h3>
          </div>
          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {highCriticalCount}
          </span>
          <span className="text-slate-400">high/critical districts</span>
        </div>
      </div>

      {/* Active Tankers */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Tankers</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">
              {activeTankers} <span className="text-lg font-normal text-slate-400">/ {totalTankers}</span>
            </h3>
          </div>
          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">On Route</span>
          <span className="text-slate-400">{loadingTankers} Loading</span>
        </div>
      </div>
    </div>
  );
}

// ─── DashboardDistrictMap ─────────────────────────────────────────────────────
function DashboardDistrictMap({ districts }: { districts: District[] }) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">District Risk Overview</h2>
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          Live · {new Date().toLocaleTimeString()}
        </span>
      </div>
      <div className="space-y-3">
        {[...districts].sort((a, b) => b.vwsi - a.vwsi).map(d => (
          <div key={d.id} className="flex items-center gap-4 group hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
            <div className="w-32 min-w-[8rem]">
              <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
              <p className="text-xs text-slate-400">{d.villages_under_stress} villages</p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    d.risk_level === 'CRITICAL' ? 'bg-red-500' :
                    d.risk_level === 'HIGH'     ? 'bg-orange-500' :
                    d.risk_level === 'MEDIUM'   ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${riskVwsiPercent(d.vwsi)}%` }}
                />
              </div>
            </div>
            <div className="w-28 text-right">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${riskBg[d.risk_level]} ${riskColor[d.risk_level]}`}>
                {d.risk_level} ({d.vwsi.toFixed(2)})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VWSITrendsLive ───────────────────────────────────────────────────────────
function VWSITrendsLive({
  history,
  topDistrictName,
}: {
  history: { name: string; value: number }[];
  topDistrictName?: string;
}) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">VWSI Weekly Trend</h2>
          {topDistrictName && (
            <p className="text-xs text-slate-400 mt-0.5">{topDistrictName} (highest risk)</p>
          )}
        </div>
      </div>
      <div className="h-[200px] w-full">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 1]} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" name="VWSI" radius={[4, 4, 0, 0]}>
                {history.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === history.length - 1 ? '#e2e8f0' :
                      i === history.length - 2 ? '#3b82f6' : '#bfdbfe'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse bg-slate-100 rounded-lg" />
        )}
      </div>
    </div>
  );
}

// ─── AllocationPieLive ────────────────────────────────────────────────────────
const PIE_COLORS = ['#10B981', '#EF4444'];

function AllocationPieLive({
  activeTankers,
  totalTankers,
}: {
  activeTankers: number;
  totalTankers: number;
}) {
  const data = [
    { name: 'Active',          value: activeTankers },
    { name: 'Idle / Loading',  value: totalTankers - activeTankers },
  ];

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Tanker Allocation</h2>
      <div className="flex items-center justify-center relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{activeTankers}</span>
          <span className="text-xs text-slate-500">Active</span>
        </div>
      </div>
      <div className="space-y-3 mt-4">
        {data.map((item, i) => (
          <div key={item.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-bold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CriticalAlertsLive ───────────────────────────────────────────────────────
function CriticalAlertsLive({
  criticalDistricts,
  totalStress,
}: {
  criticalDistricts: District[];
  totalStress: number;
}) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Critical Alerts</h2>
        {criticalDistricts.length > 0 && (
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
            {criticalDistricts.length} Critical
          </span>
        )}
      </div>
      <div className="space-y-4">
        {criticalDistricts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No critical alerts right now ✅</p>
        ) : (
          criticalDistricts.slice(0, 3).map(d => (
            <div key={d.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{d.name} – CRITICAL</h4>
                <p className="text-xs text-slate-500 mt-1 mb-2">
                  VWSI at <span className="font-bold text-red-500">{d.vwsi.toFixed(3)}</span> · {d.villages_under_stress} villages affected
                </p>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Acknowledge</button>
              </div>
            </div>
          ))
        )}

        <div className="flex gap-4 pt-2 border-t border-slate-50">
          <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">SMS Advisory</h4>
            <p className="text-xs text-slate-500 mt-1">Ready to broadcast to {totalStress}+ villages</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DashboardPageContent (main orchestrator) ─────────────────────────────────
export function DashboardPageContent() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [tankers,   setTankers]   = useState<Tanker[]>([]);
  const [history,   setHistory]   = useState<{ name: string; value: number }[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dRes, tRes] = await Promise.all([
          api.districts.list(),
          api.tankers.list(),
        ]);
        setDistricts(dRes.districts);
        setTankers(tRes);

        const top = dRes.districts.reduce(
          (a, b) => (a.vwsi > b.vwsi ? a : b),
          dRes.districts[0],
        );
        if (top) {
          const hRes = await api.districts.history(top.id, 7);
          setHistory(
            hRes.history.map(h => ({
              name: new Date(h.date).toLocaleDateString('en', { weekday: 'short' }).toUpperCase(),
              value: parseFloat(h.vwsi.toFixed(3)),
            })),
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avgVWSI          = districts.length ? districts.reduce((s, d) => s + d.vwsi, 0) / districts.length : 0;
  const totalStress      = districts.reduce((s, d) => s + d.villages_under_stress, 0);
  const activeTankers    = tankers.filter(t => t.status === 'active').length;
  const loadingTankers   = tankers.filter(t => t.status === 'loading').length;
  const criticalDistricts = districts.filter(d => d.risk_level === 'CRITICAL');
  const highCriticalCount = districts.filter(d => d.risk_level === 'HIGH' || d.risk_level === 'CRITICAL').length;
  const topDistrict      = districts.length ? districts.reduce((a, b) => (a.vwsi > b.vwsi ? a : b)) : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[24px]" />)}
        </div>
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Skeleton className="h-[420px] rounded-[24px]" />
          <Skeleton className="h-[280px] rounded-[24px]" />
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Skeleton className="h-[280px] rounded-[24px]" />
          <Skeleton className="h-[300px] rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
      {/* Top stat cards */}
      <DashboardStats
        avgVWSI={avgVWSI}
        criticalCount={criticalDistricts.length}
        districtCount={districts.length}
        totalStress={totalStress}
        highCriticalCount={highCriticalCount}
        activeTankers={activeTankers}
        totalTankers={tankers.length}
        loadingTankers={loadingTankers}
      />

      {/* Left column */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        <DashboardDistrictMap districts={districts} />
        <VWSITrendsLive history={history} topDistrictName={topDistrict?.name} />
      </div>

      {/* Right column */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        <AllocationPieLive activeTankers={activeTankers} totalTankers={tankers.length} />
        <CriticalAlertsLive criticalDistricts={criticalDistricts} totalStress={totalStress} />
      </div>
    </div>
  );
}
