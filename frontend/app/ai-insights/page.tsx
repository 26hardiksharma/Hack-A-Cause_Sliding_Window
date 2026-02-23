'use client'
import { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Loader2, RefreshCcw, Copy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, type District, type Tanker } from '@/lib/api';

type Urgency = 'critical' | 'high' | 'medium';
type Severity = 'high' | 'medium' | 'low';

interface Insights {
  source: string;
  summary: string;
  risk_factors: { name: string; value: string; severity: Severity; detail: string }[];
  forecast: { trend: string; peak_day: number; peak_vwsi: number; narrative: string };
  recommendations: { title: string; detail: string; action: string; urgency: Urgency; tankers_required: number }[];
  sms_template: string;
  critical_districts: string[];
  model_confidence: number;
}

const urgencyStyle: Record<Urgency, string> = {
  critical: 'bg-red-50 border-red-200 text-red-700',
  high:     'bg-orange-50 border-orange-200 text-orange-700',
  medium:   'bg-yellow-50 border-yellow-200 text-yellow-700',
};
const severityDot: Record<Severity, string> = {
  high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-emerald-500',
};

export default function AIInsights() {
  const [insights,   setInsights]   = useState<Insights | null>(null);
  const [chartData,  setChartData]  = useState<{ day: string; predicted: number; historical: number }[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied,     setCopied]     = useState(false);

  async function loadInsights(refresh = false) {
    try {
      if (refresh) setRefreshing(true); else setLoading(true);

      const [dRes, tRes] = await Promise.all([api.districts.list(), api.tankers.list()]);
      const districts: District[] = dRes.districts;
      const tankers: Tanker[]    = tRes;

      // Call Groq AI
      const ai = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ districts, tankers }),
      }).then(r => r.json());

      setInsights(ai);

      // Build 30-day forecast chart using top district history + AI peak projection
      const topDistrict = districts.reduce((a, b) => a.vwsi > b.vwsi ? a : b, districts[0]);
      if (topDistrict) {
        const history = await api.districts.history(topDistrict.id, 14);
        const baseVwsi = topDistrict.vwsi;
        const peakVwsi = ai.forecast?.peak_vwsi ?? baseVwsi + 0.12;
        const peakDay  = ai.forecast?.peak_day ?? 25;

        // Combine historical + forecast
        const combined: typeof chartData = [];
        history.history.forEach((h, i) => {
          combined.push({ day: `D-${14-i}`, predicted: NaN, historical: h.vwsi });
        });
        for (let d = 1; d <= 16; d++) {
          const frac     = d / peakDay;
          const projected = baseVwsi + (peakVwsi - baseVwsi) * Math.sin(frac * Math.PI / 2);
          combined.push({ day: `+${d}`, predicted: parseFloat(projected.toFixed(3)), historical: NaN });
        }
        setChartData(combined);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { loadInsights(); }, []);

  function copyTemplate() {
    if (insights?.sms_template) {
      navigator.clipboard.writeText(insights.sms_template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
        <p className="text-sm text-slate-500">Analyzing drought risk with Groq AI…</p>
        <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
      {/* Header */}
      <div className="xl:col-span-12 bg-gradient-to-r from-violet-600 to-purple-700 rounded-[24px] shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Drought Intelligence</h1>
              <p className="text-violet-200 text-sm mt-0.5">
                Powered by Groq · {insights?.source === 'groq' ? insights.model : 'Heuristic Fallback'} · {Math.round((insights?.model_confidence ?? 0.85) * 100)}% confidence
              </p>
            </div>
          </div>
          <button
            onClick={() => loadInsights(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Re-analyze
          </button>
        </div>

        {insights?.summary && (
          <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm leading-relaxed text-white/90">
            {insights.summary}
          </div>
        )}
      </div>

      {/* Forecast Chart */}
      <div className="xl:col-span-8 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">30-Day VWSI Forecast</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical (grey) + AI Prediction (purple) · Peak at Day {insights?.forecast?.peak_day}
            </p>
          </div>
          {insights?.forecast?.trend && (
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              insights.forecast.trend === 'increasing' ? 'bg-red-50 text-red-600' :
              insights.forecast.trend === 'decreasing' ? 'bg-emerald-50 text-emerald-600' :
              'bg-yellow-50 text-yellow-600'
            }`}>
              <TrendingUp className="inline w-3 h-3 mr-1" />
              {insights.forecast.trend}
            </span>
          )}
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="historical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v) => typeof v === 'number' && !isNaN(v) ? v.toFixed(3) : '-'} />
              <Area type="monotone" dataKey="historical" stroke="#94a3b8" fill="url(#historical)" strokeWidth={2} dot={false} connectNulls={false} name="Historical" />
              <Area type="monotone" dataKey="predicted"  stroke="#7c3aed" fill="url(#predicted)"  strokeWidth={2} dot={false} connectNulls={false} name="Predicted"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {insights?.forecast?.narrative && (
          <p className="text-xs text-slate-500 mt-3 leading-relaxed border-t border-slate-50 pt-3">{insights.forecast.narrative}</p>
        )}
      </div>

      {/* Risk Factors */}
      <div className="xl:col-span-4 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-5">Key Risk Factors</h2>
        <div className="flex flex-col gap-4">
          {insights?.risk_factors?.map((rf, i) => (
            <div key={i} className="flex gap-3 bg-slate-50 rounded-xl p-4">
              <div className={`w-2 h-full rounded-full min-h-[40px] ${severityDot[rf.severity]}`} />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-slate-700">{rf.name}</p>
                  <span className="text-xs font-mono font-bold text-slate-500">{rf.value}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{rf.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="xl:col-span-8 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-bold text-slate-800">AI Recommendations</h2>
        </div>
        <div className="flex flex-col gap-4">
          {insights?.recommendations?.map((rec, i) => (
            <div key={i} className={`border rounded-xl p-4 ${urgencyStyle[rec.urgency]}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  {rec.urgency === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-bold">{rec.title}</p>
                    <p className="text-xs mt-1 leading-relaxed opacity-80">{rec.detail}</p>
                    {rec.tankers_required > 0 && (
                      <p className="text-xs mt-1 font-medium opacity-70">🚛 {rec.tankers_required} tankers required</p>
                    )}
                  </div>
                </div>
                <button className="text-xs font-bold border border-current rounded-lg px-3 py-1 whitespace-nowrap hover:bg-white/50 transition-colors">
                  {rec.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Template */}
      <div className="xl:col-span-4 bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-2">AI SMS Template</h2>
        <p className="text-xs text-slate-400 mb-4">Auto-generated for most critical district</p>
        <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-700 border border-slate-100 min-h-[80px]">
          {insights?.sms_template}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={copyTemplate}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Template'}
          </button>
        </div>
        {insights?.critical_districts && insights.critical_districts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2">Critical Districts</p>
            <div className="flex flex-wrap gap-2">
              {insights.critical_districts.map(d => (
                <span key={d} className="text-xs bg-red-50 text-red-600 font-bold px-2 py-1 rounded-lg">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
