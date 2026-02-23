'use client'
import { Truck, Droplet, Timer, CheckCircle, AlertTriangle, Hourglass, MoreHorizontal, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map so it only runs on the client (Google Maps needs window)
const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export default function TrackingPage() {
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
                <h3 className="text-3xl font-bold text-slate-800 mt-1">18 <span className="text-lg font-normal text-slate-400">/ 24</span></h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 12%
              </span>
              <span className="text-slate-400">vs last shift</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Water Volume</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">1.85L</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 5%
              </span>
              <span className="text-slate-400">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg Delay</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">12m</h3>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Timer className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 2m
              </span>
              <span className="text-slate-400">increase</span>
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
                <p className="text-3xl font-bold text-slate-800">87%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-medium text-slate-600">On Time (Active)</span>
                </div>
                <span className="text-sm font-bold text-slate-800">8 Ships</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                  <span className="text-sm font-medium text-slate-600">Loading / En Route</span>
                </div>
                <span className="text-sm font-bold text-slate-800">6 Ships</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-400 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm font-medium text-slate-600">Issues / Maintenance</span>
                </div>
                <span className="text-sm font-bold text-slate-800">1 Ship</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
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
            {/* Feed Item 1 */}
            <div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group mb-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-sm font-bold text-slate-800 truncate">Route R-07 Complete</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">Successfully delivered 10,000L to Manwat distribution center.</p>
                  <div className="flex items-center gap-2">
                    <img alt="Driver" className="w-5 h-5 rounded-full object-cover" src="https://picsum.photos/seed/driver1/50/50" />
                    <span className="text-[10px] font-medium text-slate-500">Suresh K.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Item 2 */}
            <div className="p-3 rounded-2xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer group mb-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-sm font-bold text-slate-800 truncate">Breakdown Alert</h4>
                    <span className="text-[10px] text-red-500 font-medium whitespace-nowrap">15m ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Engine overheating reported on Highway 42 near Selu Village.</p>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded hover:bg-red-200 transition-colors">Dispatch Help</button>
                    <button className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded hover:bg-slate-50 transition-colors">View Map</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Item 3 */}
            <div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group mb-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-sm font-bold text-slate-800 truncate">Loading Started</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">45m ago</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Route R-12 filling at East Depot. Est departure: 10:30 AM.</p>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
