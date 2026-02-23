'use client';
import { CheckCircle, AlertTriangle, Hourglass, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FeedItem } from '@/lib/api';

interface LiveFeedProps {
  feed: FeedItem[];
}

const statusIcon: Record<string, { icon: React.ElementType; bg: string; cls: string }> = {
  delivery:    { icon: CheckCircle,   bg: 'bg-emerald-50', cls: 'text-emerald-600' },
  breakdown:   { icon: AlertTriangle, bg: 'bg-white',      cls: 'text-red-500' },
  loading:     { icon: Hourglass,     bg: 'bg-orange-50',  cls: 'text-orange-500' },
  maintenance: { icon: Truck,         bg: 'bg-slate-100',  cls: 'text-slate-500' },
};

export function LiveFeed({ feed }: LiveFeedProps) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm flex-1 border border-slate-100 flex flex-col overflow-hidden min-h-[300px]">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Live Feed</h3>
        <div className="flex gap-2 text-xs">
          <Button variant="ghost" className="font-bold text-blue-600 h-auto p-0 text-xs">All</Button>
          <Button variant="ghost" className="text-slate-400 hover:text-slate-600 h-auto p-0 text-xs">Issues</Button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {feed.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No recent events.</p>
        ) : (
          feed.map((item, i) => {
            const s = statusIcon[item.type] ?? statusIcon.delivery;
            const Icon = s.icon;
            const isAlert = item.type === 'breakdown';
            return (
              <div
                key={i}
                className={`p-3 rounded-2xl transition-colors cursor-pointer group mb-2 ${
                  isAlert
                    ? 'bg-red-50/50 border border-red-100 hover:bg-red-50'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${s.bg} ${s.cls} flex items-center justify-center flex-shrink-0 ${isAlert ? 'shadow-sm' : 'group-hover:bg-white group-hover:shadow-sm'} border border-transparent group-hover:border-slate-100 transition-all`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                      <span className={`text-[10px] whitespace-nowrap ${isAlert ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.detail}</p>
                    {isAlert && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-100 text-red-700 text-[10px] font-bold rounded hover:bg-red-200 h-6 px-2">
                          Dispatch Help
                        </Button>
                        <Button size="sm" variant="outline" className="text-slate-600 text-[10px] font-bold rounded h-6 px-2">
                          View Map
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
