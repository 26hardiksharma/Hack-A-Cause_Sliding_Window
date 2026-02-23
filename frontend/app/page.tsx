'use client'
import { TrendingUp, Map as MapIcon, AlertTriangle, Truck, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const vwsiData = [
  { name: 'MON', value: 0.2 },
  { name: 'TUE', value: 0.3 },
  { name: 'WED', value: 0.4 },
  { name: 'THU', value: 0.45 },
  { name: 'FRI', value: 0.5 },
  { name: 'SAT', value: 0.52 },
  { name: 'SUN (PROJ)', value: 0.58 },
];

const allocationData = [
  { name: 'Allocated', value: 24 },
  { name: 'Pending', value: 12 },
];
const COLORS = ['#10B981', '#EF4444'];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
      {/* Top Cards */}
      <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">District VWSI</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">0.52</h3>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +0.08
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Villages Under Stress</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">127</h3>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
              <MapIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 12
            </span>
            <span className="text-slate-400">added this week</span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Tankers</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">18 <span className="text-lg font-normal text-slate-400">/ 24</span></h3>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              On Route
            </span>
            <span className="text-slate-400">6 Loading</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        {/* Map */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1 min-h-[400px] relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">District Overview Map</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100">Map</button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100">Satellite</button>
            </div>
          </div>
          <div className="absolute inset-x-6 bottom-6 top-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
            {/* Mock Map Background */}
            <div className="w-full h-full bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover bg-center opacity-20"></div>
            
            {/* Map Pin & Tooltip */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg border border-slate-100 w-64 z-10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">Khamgaon</h4>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-uppercase">SEVERE</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">VWSI Index</span>
                  <span className="font-bold text-slate-800">0.58</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-500">Tankers En Route</span>
                  <span className="font-bold text-slate-800">2</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VWSI Trends */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">VWSI Trends</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg">Weekly</button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Monthly</button>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vwsiData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {vwsiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === vwsiData.length - 1 ? '#e2e8f0' : index === vwsiData.length - 2 ? '#3b82f6' : '#bfdbfe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        {/* Allocation */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Allocation</h2>
          <div className="flex items-center justify-center relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">24</span>
              <span className="text-xs text-slate-500">Allocated</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Allocated</span>
              </div>
              <span className="font-bold text-slate-800">24</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Pending</span>
              </div>
              <span className="font-bold text-slate-800">0.36L</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Critical Alerts</h2>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">3 New</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">VWSI Escalation</h4>
                  <span className="text-xs text-slate-400">12m</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-2">Khamgaon village VWSI jumped to <span className="font-bold text-red-500">0.63</span>.</p>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Acknowledge</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">Tanker Breakdown</h4>
                  <span className="text-xs text-slate-400">45m</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-2">MH-14-AB-1234 halted on Route R-07.</p>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Re-optimize</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">SMS Failure</h4>
                  <span className="text-xs text-slate-400">2h</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-2">3 villages failed to receive advisory.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
