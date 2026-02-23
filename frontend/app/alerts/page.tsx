'use client'
import { Send, Users, MapPin, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AlertsPage() {
  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Left Column - Create Alert */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Create New Advisory</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">Est. Reach: 15,000+</span>
          </div>

          <form className="space-y-6">
            {/* Target Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Group</label>
              <div className="grid grid-cols-3 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="target" className="peer sr-only" defaultChecked />
                  <div className="p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                    <Users className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <span className="text-sm font-medium">Farmers</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="target" className="peer sr-only" />
                  <div className="p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <span className="text-sm font-medium">Authorities</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="target" className="peer sr-only" />
                  <div className="p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                    <Users className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <span className="text-sm font-medium">All Users</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none">
                  <option>All Talukas</option>
                  <option>Khamgaon</option>
                  <option>Selu</option>
                  <option>Manwat</option>
                </select>
              </div>
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message Template</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none">
                  <option>Weather Warning (Heatwave)</option>
                  <option>Water Conservation Advisory</option>
                  <option>Tanker Schedule Update</option>
                  <option>Custom Message</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Message Content (Marathi/English)</label>
                <span className="text-xs text-slate-400">124/160 chars</span>
              </div>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none h-32"
                defaultValue="ALERT: Severe heatwave expected in next 48 hrs. Please delay sowing activities and ensure adequate hydration for livestock. - Dist. Admin"
              ></textarea>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button type="button" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Send className="w-5 h-5" />
                Send Alert Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Recent Broadcasts */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Broadcasts</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4 flex-1">
            {/* Broadcast 1 */}
            <div className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Heatwave Warning</h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Today, 09:30 AM
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sent
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">ALERT: Severe heatwave expected in next 48 hrs. Please delay sowing activities...</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Recipients</p>
                  <p className="text-sm font-bold text-slate-800">12.4k <span className="text-[10px] font-normal text-slate-500">Farmers</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Rate</p>
                  <p className="text-sm font-bold text-slate-800 text-emerald-600">98.2%</p>
                </div>
              </div>
            </div>

            {/* Broadcast 2 */}
            <div className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Water Supply Schedule</h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Yesterday, 14:15 PM
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sent
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">Tanker schedule updated for Selu taluka. Expected arrival between 2PM-4PM.</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Recipients</p>
                  <p className="text-sm font-bold text-slate-800">5.2k <span className="text-[10px] font-normal text-slate-500">All</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Rate</p>
                  <p className="text-sm font-bold text-slate-800 text-emerald-600">95.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
