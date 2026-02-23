'use client'
import { Bell, Menu, Plus, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();
  
  const getTitle = () => {
    switch (pathname) {
      case '/': return { title: 'Good Morning, Rajesh', breadcrumb: 'Dashboard > Operational Status' };
      case '/tracking': return { title: 'Live Fleet Tracking', breadcrumb: 'Dashboard > Tracking' };
      case '/analytics': return { title: 'Analytics & Reports', breadcrumb: 'Dashboard > Analytics' };
      case '/alerts': return { title: 'SMS Alert Management', breadcrumb: 'Communication > Configuration' };
      case '/ai-insights': return { title: 'AI Insights', breadcrumb: 'Home > AI Insights' };
      case '/settings': return { title: 'System Configuration', breadcrumb: 'Settings > Drought Thresholds' };
      case '/users': return { title: 'User Access Management', breadcrumb: 'Settings > Users' };
      case '/notifications': return { title: 'Notification Center', breadcrumb: 'Home > Notifications' };
      default: return { title: 'Dashboard', breadcrumb: 'Home' };
    }
  };

  const { title, breadcrumb } = getTitle();

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 flex-shrink-0 z-10 pt-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
          <span>{breadcrumb}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {pathname === '/' && (
          <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <select className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Beed District</option>
            </select>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <select className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Taluka: All</option>
            </select>
          </div>
        )}
        <Link href="/notifications" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Link>
        <button className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-blue-200">
          <Plus className="w-5 h-5" />
        </button>
        <Link href="/ai-insights" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </Link>
      </div>
    </header>
  );
}
