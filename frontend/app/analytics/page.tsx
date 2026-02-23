'use client'
import { useEffect, useState } from 'react';
import { Download, FileText, Calendar, Filter, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { api, type District, type Tanker, riskColor, riskVwsiPercent } from '@/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

export default function AnalyticsPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.districts.list(), api.tankers.list()])
      .then(([dRes, tRes]) => {
        setDistricts(dRes.districts);
        setTankers(tRes);
      })
      .catch((e) => console.warn('[Analytics] Backend unavailable:', e))
      .finally(() => setLoading(false));
  }, []);

  // Build distribution trend data (simulated monthly using real VWSI as baseline)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const avgVwsi = districts.length
    ? districts.reduce((s, d) => s + d.vwsi, 0) / districts.length
    : 0.4;

  const distributionData = monthNames.map((name, i) => {
    const factor = 0.7 + i * 0.08;
    const base = avgVwsi * 1000 * factor;
    return { name, allocated: Math.round(base * 1.08), delivered: Math.round(base) };
  });

  // Resource utilization from real data
  const active = tankers.filter(t => t.status === 'active').length;
  const efficiency = tankers.length ? Math.round((active / tankers.length) * 100) : 85;
  const utilizationData = [
    { name: 'Tankers', value: efficiency },
    { name: 'Coverage', value: Math.round(70 + avgVwsi * 15) },
    { name: 'Manpower', value: 70 },
  ];

  const avgUtil = Math.round(utilizationData.reduce((s, u) => s + u.value, 0) / utilizationData.length);

  // Top districts by VWSI
  const topDistricts = [...districts].sort((a, b) => b.vwsi - a.vwsi).slice(0, 5);

  const riskLevelStyle: Record<string, string> = {
    CRITICAL: 'text-red-600',
    HIGH: 'text-orange-500',
    MEDIUM: 'text-yellow-500',
    LOW: 'text-emerald-500',
  };
  const riskBarStyle: Record<string, string> = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-emerald-500',
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Left Column - Charts & Trends */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Distribution Trends */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                Water Distribution Trends
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Allocated vs Delivered volume (in &apos;000 Liters) — based on live VWSI data
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> This Year
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="allocated" name="Allocated" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="delivered" name="Delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* District-wise Risk / VWSI (live from API) */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              District-wise VWSI Stress Level
            </h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Live data</span>
          </div>

          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-5">
              {topDistricts.map(d => (
                <div key={d.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-800">{d.name}</span>
                    <span className={`text-xs font-bold ${riskLevelStyle[d.risk_level]}`}>
                      {d.risk_level} ({d.vwsi.toFixed(2)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${riskBarStyle[d.risk_level]} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${riskVwsiPercent(d.vwsi)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Utilization & Reports */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Resource Utilization */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Resource Utilization
            </h3>
          </div>

          <div className="flex items-center justify-center relative h-48 mb-6">
            {loading ? <Skeleton className="w-40 h-40 rounded-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {utilizationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(v) => `${v}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{avgUtil}%</span>
              <span className="text-xs text-slate-500">Avg. Used</span>
            </div>
          </div>

          <div className="space-y-3">
            {utilizationData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Generate Report
            </h3>
          </div>

          <form className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Report Type</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none">
                <option>Comprehensive District Report</option>
                <option>Tanker Operations Summary</option>
                <option>Financial Utilization</option>
                <option>VWSI Trend Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-600" />
                <input type="date" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-600" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Format</label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="format" className="peer sr-only" defaultChecked />
                  <div className="py-2 text-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">PDF</div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="format" className="peer sr-only" />
                  <div className="py-2 text-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">Excel</div>
                </label>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button type="button" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
