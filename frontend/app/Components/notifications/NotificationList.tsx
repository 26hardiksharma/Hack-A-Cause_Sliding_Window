'use client';
import { Bell, CheckCircle, AlertTriangle, Info, Check, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function NotificationList() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Notification Center</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              You have <span className="text-red-500 font-bold">3 unread</span> critical alerts.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium shadow-sm h-8">
            <Check className="w-4 h-4" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" className="text-xs font-medium shadow-sm h-8">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Today */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Today</h3>
            <div className="space-y-2">
              {/* Unread - Critical */}
              <div className="bg-white p-4 rounded-xl border-l-4 border-l-red-500 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800">VWSI Escalation: Khamgaon</h4>
                      <span className="text-xs font-medium text-slate-400 mr-4">12m ago</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                      Khamgaon village VWSI has jumped to <span className="font-bold text-red-600">0.63 (Severe)</span>. Immediate tanker reallocation is required to meet the 70% coverage mandate.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 h-7">Review Allocation</Button>
                      <Button variant="outline" size="sm" className="text-xs font-medium h-7">Acknowledge</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unread - Orange */}
              <div className="bg-white p-4 rounded-xl border-l-4 border-l-orange-400 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white shadow-sm" />
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800">Tanker Breakdown: Route R-07</h4>
                      <span className="text-xs font-medium text-slate-400 mr-4">45m ago</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                      Tanker MH-14-AB-1234 reported a breakdown near Selu. Estimated delay: 3 hours. 2 villages pending delivery.
                    </p>
                    <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border-blue-200 hover:bg-blue-100 h-7">Re-optimize Route</Button>
                  </div>
                </div>
              </div>

              {/* Read - Green */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800">Weekly Allocation Approved</h4>
                      <span className="text-xs font-medium text-slate-400">2h ago</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      State authority has approved the tanker allocation plan for Week 08-2026. Dispatch schedules have been generated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Yesterday */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Yesterday</h3>
            <div className="space-y-2">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800">SMS Campaign Completed</h4>
                      <span className="text-xs font-medium text-slate-400">Yesterday, 4:30 PM</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      &quot;Drought Advisory - Phase 2&quot; campaign finished sending. 12,450 messages delivered successfully (98.2% success rate).
                    </p>
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
