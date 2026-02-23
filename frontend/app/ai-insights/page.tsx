'use client'
import { Sparkles, TrendingUp, CloudRain, Droplets, Thermometer, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const forecastData = [
  { name: '1 May', value: 0.45, historical: 0.40 },
  { name: '5 May', value: 0.48, historical: 0.42 },
  { name: '10 May', value: 0.52, historical: 0.43 },
  { name: '15 May', value: 0.58, historical: 0.45 },
  { name: '20 May', value: 0.65, historical: 0.48 },
  { name: '25 May', value: 0.72, historical: 0.50 },
  { name: '30 May', value: 0.78, historical: 0.52 },
];

export default function AIInsightsPage() {
  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Left Column - Forecast & Factors */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Forecast Chart */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Drought Risk Forecast (30 Days)
              </h2>
              <p className="text-sm text-slate-500 mt-1">Predicted VWSI based on current trends and historical data.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                Predicted
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                Historical Avg
              </span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
                />
                <ReferenceLine y={0.6} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Critical Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="historical" stroke="#cbd5e1" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> High Risk
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Rainfall Deficit</h3>
            <p className="text-2xl font-bold text-slate-800">-42% <span className="text-sm font-normal text-slate-400">vs normal</span></p>
            <p className="text-xs text-slate-500 mt-3">Monsoon delayed by 14 days in eastern talukas.</p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Med Risk
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Soil Moisture</h3>
            <p className="text-2xl font-bold text-slate-800">18% <span className="text-sm font-normal text-slate-400">avg</span></p>
            <p className="text-xs text-slate-500 mt-3">Rapid depletion in topsoil across 45 villages.</p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> High Risk
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Temp Anomaly</h3>
            <p className="text-2xl font-bold text-slate-800">+2.4°C <span className="text-sm font-normal text-slate-400">avg</span></p>
            <p className="text-xs text-slate-500 mt-3">Prolonged heatwave expected next week.</p>
          </div>
        </div>
      </div>

      {/* Right Column - Recommendations */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Recommendations
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">3 Actions</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {/* Rec 1 */}
            <div className="p-4 rounded-2xl border border-red-100 bg-red-50/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Increase Tanker Allocation</h4>
                  <p className="text-xs text-slate-600 mt-1">Khamgaon and Selu clusters are predicted to cross critical VWSI threshold (0.6) in 5 days.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-red-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-700">+4 Tankers required</span>
                <button className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">
                  Approve Allocation
                </button>
              </div>
            </div>

            {/* Rec 2 */}
            <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Send Conservation Advisory</h4>
                  <p className="text-xs text-slate-600 mt-1">Heatwave predicted. Advise farmers in eastern talukas to delay sowing by 1 week.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-orange-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-700">Target: 12,400 Farmers</span>
                <button className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors">
                  Draft SMS
                </button>
              </div>
            </div>

            {/* Rec 3 */}
            <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Prepare Emergency Reservoir</h4>
                  <p className="text-xs text-slate-600 mt-1">Current depletion rate suggests primary reservoir will hit dead storage in 18 days.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-700">Action: Start pumping</span>
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  View Plan <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Last updated 10 mins ago
          </div>
        </div>
      </div>
    </div>
  );
}
