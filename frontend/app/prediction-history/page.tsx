'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  BrainCircuit, RefreshCw, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, Info, Clock, TrendingUp,
  Droplets, Thermometer, Calendar, Sparkles, Shield,
  BarChart2, MessageSquare
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Prediction {
  district_id: number;
  district_name?: string;
  drought_prob: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predicted_at: string;
  horizon_days?: number;
}

interface DistrictSummary {
  district_name: string;
  risk_level: string;
  drought_prob: number;
  plain_english: string;
  what_to_do: string;
}

interface AIExplanation {
  source: string;
  headline: string;
  what_ai_did: string;
  district_summaries: DistrictSummary[];
  overall_advice: string;
  good_news: string;
  next_run: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const RISK_CONFIG = {
  CRITICAL: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-200',
    bar: 'bg-red-500',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    dot: 'bg-red-500',
    ring: 'ring-red-200',
  },
  HIGH: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    bar: 'bg-orange-400',
    icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    dot: 'bg-orange-400',
    ring: 'ring-orange-200',
  },
  MEDIUM: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bar: 'bg-yellow-400',
    icon: <Info className="w-4 h-4 text-yellow-500" />,
    dot: 'bg-yellow-400',
    ring: 'ring-yellow-200',
  },
  LOW: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-400',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-200',
  },
};

function fmt(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

// ── District Card ─────────────────────────────────────────────────────────────
function DistrictCard({ pred, summary }: { pred: Prediction; summary?: DistrictSummary }) {
  const [open, setOpen] = useState(false);
  const cfg = RISK_CONFIG[pred.risk_level] ?? RISK_CONFIG.LOW;
  const pct = Math.round(pred.drought_prob * 100);
  const name = pred.district_name ?? summary?.district_name ?? `District ${pred.district_id}`;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:shadow-md`}>
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        {/* Risk dot */}
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />

        {/* Name + badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-slate-800 text-sm">{name}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {pred.risk_level}
            </span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-600 w-10 text-right">{pct}%</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-right hidden sm:block">
          <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3" />
            {fmt(pred.predicted_at)}
          </p>
          <p className="text-[11px] text-slate-400">{pred.horizon_days ?? 7}-day horizon</p>
        </div>

        {/* Expand chevron */}
        <div className="text-slate-400 ml-2">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded AI explanation */}
      {open && summary && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-3 space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                What this means
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{summary.plain_english}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Recommended action
              </p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{summary.what_to_do}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PredictionHistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [explanation, setExplanation]  = useState<AIExplanation | null>(null);
  const [loadingPreds, setLoadingPreds] = useState(true);
  const [loadingAI, setLoadingAI]      = useState(false);
  const [lastRun, setLastRun]          = useState<string | null>(null);
  const [filter, setFilter]            = useState<string>('ALL');

  const fetchHistory = async () => {
    setLoadingPreds(true);
    try {
      const res = await api.predictions.latest(50);
      // Deduplicate: keep most recent per district
      const seen = new Map<number, Prediction>();
      for (const p of (res as Prediction[])) {
        if (!seen.has(p.district_id)) seen.set(p.district_id, p);
      }
      const deduped = Array.from(seen.values()).sort((a, b) => b.drought_prob - a.drought_prob);
      setPredictions(deduped);
      if (deduped.length > 0) setLastRun(deduped[0].predicted_at);
    } catch (e) {
      console.warn('[PredHistory]', e);
    } finally {
      setLoadingPreds(false);
    }
  };

  const fetchAI = async (preds: Prediction[]) => {
    if (preds.length === 0) return;
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/explain-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictions: preds }),
      });
      const data = await res.json();
      setExplanation(data);
    } catch (e) {
      console.warn('[AI explain]', e);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (predictions.length > 0) fetchAI(predictions);
  }, [predictions]);

  const filtered = filter === 'ALL'
    ? predictions
    : predictions.filter(p => p.risk_level === filter);

  const counts = {
    CRITICAL: predictions.filter(p => p.risk_level === 'CRITICAL').length,
    HIGH:     predictions.filter(p => p.risk_level === 'HIGH').length,
    MEDIUM:   predictions.filter(p => p.risk_level === 'MEDIUM').length,
    LOW:      predictions.filter(p => p.risk_level === 'LOW').length,
  };

  const avgRisk = predictions.length
    ? predictions.reduce((s, p) => s + p.drought_prob, 0) / predictions.length
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-blue-600" />
            AI Prediction History
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Plain-English explanations of what the drought AI found — for every district officer.
          </p>
        </div>
        <button
          onClick={() => { fetchHistory(); }}
          disabled={loadingPreds}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loadingPreds ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
          const cfg = RISK_CONFIG[level];
          return (
            <button
              key={level}
              onClick={() => setFilter(prev => prev === level ? 'ALL' : level)}
              className={`rounded-xl border p-4 text-left cursor-pointer transition-all duration-200 
                ${filter === level ? `ring-2 ${cfg.ring} shadow-md` : 'hover:shadow-sm'}
                ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {cfg.icon}
                <span className="text-xs font-bold text-slate-500 uppercase">{level}</span>
              </div>
              {loadingPreds
                ? <Skeleton className="h-7 w-10" />
                : <p className="text-2xl font-bold text-slate-800">{counts[level]}</p>}
              <p className="text-[11px] text-slate-400 mt-0.5">districts</p>
            </button>
          );
        })}
      </div>

      {/* ── AI What it found ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-200" />
          <span className="text-sm font-semibold text-blue-100 uppercase tracking-wide">
            AI Summary for Block Officers
          </span>
          {explanation?.source && (
            <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              via {explanation.source === 'groq' ? 'Groq AI' : 'built-in'}
            </span>
          )}
        </div>

        {loadingAI ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 bg-white/20" />
            <Skeleton className="h-4 w-full bg-white/20" />
            <Skeleton className="h-4 w-5/6 bg-white/20" />
          </div>
        ) : explanation ? (
          <div className="space-y-4">
            <p className="text-lg font-semibold leading-snug">{explanation.headline}</p>

            <div className="bg-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-200 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase mb-1">How the AI works (simple explanation)</p>
                  <p className="text-sm text-blue-50 leading-relaxed">{explanation.what_ai_did}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-green-200 uppercase mb-1">Overall advice</p>
                  <p className="text-sm text-blue-50 leading-relaxed">{explanation.overall_advice}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-50 leading-relaxed">{explanation.good_news}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-blue-200 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Next AI analysis: {explanation.next_run}</span>
              {lastRun && (
                <>
                  <span className="mx-2 opacity-40">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last run: {fmt(lastRun)}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-blue-200 text-sm">Loading AI explanation…</p>
        )}
      </div>

      {/* ── Model stats bar ────────────────────────────────────────────── */}
      {predictions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold">Model accuracy</p>
              <p className="text-lg font-bold text-slate-800">99.78%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold">Avg region risk</p>
              <p className="text-lg font-bold text-slate-800">{Math.round(avgRisk * 100)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold">Districts tracked</p>
              <p className="text-lg font-bold text-slate-800">{predictions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold">Window size</p>
              <p className="text-lg font-bold text-slate-800">30 days</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slateald-500 font-medium text-emerald-600">Live from LSTM model</span>
          </div>
        </div>
      )}

      {/* ── Filter chips ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-500 font-medium">Filter:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
              ${filter === level
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
          >
            {level}{level !== 'ALL' && ` (${counts[level as keyof typeof counts]})`}
          </button>
        ))}
      </div>

      {/* ── District cards ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        {loadingPreds
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          : filtered.length === 0
          ? (
            <div className="text-center py-16 text-slate-400">
              <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No predictions found</p>
              <p className="text-sm mt-1">
                Run the ML cron job to generate predictions:
                <code className="ml-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  python -m app.cron.daily_predict
                </code>
              </p>
            </div>
          )
          : filtered.map(pred => {
              const summary = explanation?.district_summaries?.find(
                s => s.district_name === pred.district_name
                  || s.district_name === `District ${pred.district_id}`
              );
              return (
                <DistrictCard
                  key={`${pred.district_id}-${pred.predicted_at}`}
                  pred={pred}
                  summary={summary}
                />
              );
            })
        }
      </div>

      {/* ── Footer note ────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Predictions are generated by a deep learning AI model (LSTM) trained on historical rainfall,
          temperature, humidity, and groundwater data from Jiwati Block, Chandrapur, Maharashtra.
          The model runs a new analysis every morning at 6 AM and saves results to the database.
          Click any district to see what the AI found in simple language.
        </p>
      </div>
    </div>
  );
}
