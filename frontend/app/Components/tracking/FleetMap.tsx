'use client';
import { Map as MapIcon, Truck, AlertTriangle, Plus, Minus, Layers } from 'lucide-react';

export function FleetMap() {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 flex-1 flex flex-col relative overflow-hidden border border-slate-100 min-h-[500px]">
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <h2 className="text-lg font-bold text-slate-800">Live Coverage Area</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100">Satellite</button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg shadow-sm">Map View</button>
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden relative border border-slate-100 shadow-inner bg-slate-50">
        {/* Mock Map Background */}
        <div className="absolute inset-0 w-full h-full bg-[url('https://picsum.photos/seed/map2/800/600')] bg-cover bg-center opacity-30 grayscale" />

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <button className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-slate-100">
            <Plus className="w-5 h-5" />
          </button>
          <button className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-slate-100">
            <Minus className="w-5 h-5" />
          </button>
          <button className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors mt-2 border border-slate-100">
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Mock Routes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path d="M 200 150 Q 350 200 400 100 T 600 130" fill="none" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="6" />
          <path d="M 200 150 Q 350 200 400 100 T 600 130" fill="none" stroke="#3B82F6" strokeLinecap="round" strokeWidth="3" strokeDasharray="8 8" className="animate-[dash_30s_linear_infinite]" />
          <path d="M 220 170 Q 250 300 300 350" fill="none" stroke="#FECACA" strokeLinecap="round" strokeWidth="6" />
        </svg>

        {/* Depot Marker */}
        <div className="absolute top-[150px] left-[200px] transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer">
          <div className="bg-slate-800 p-2 rounded-xl shadow-md text-white hover:scale-110 transition-transform">
            <MapIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Active Truck Marker */}
        <div className="absolute top-[130px] left-[600px] transform -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer hover:scale-110 transition-transform group">
          <div className="bg-white p-1.5 rounded-full shadow-md border-2 border-blue-600 relative">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
              <Truck className="w-5 h-5" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-lg min-w-[180px] border border-slate-100 z-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">MH-14-AB-1234</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-sm font-bold text-slate-800">Manwat Route</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-500">
              <span>In Transit</span>
              <span>25m left</span>
            </div>
          </div>
        </div>

        {/* Alert Marker */}
        <div className="absolute top-[350px] left-[300px] transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-110 transition-transform">
          <div className="bg-white p-1.5 rounded-full shadow-md border-2 border-red-200 relative animate-pulse">
            <div className="bg-red-50 text-red-500 p-2 rounded-full">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
