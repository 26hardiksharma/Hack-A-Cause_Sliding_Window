"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const routeMeta: Record<string, { title: string; breadcrumb: string }> = {
  "/":             { title: "Good Morning, Rajesh", breadcrumb: "Dashboard > Operational Status" },
  "/tracking":     { title: "Live Fleet Tracking",  breadcrumb: "Dashboard > Tracking" },
  "/analytics":    { title: "Analytics & Reports",  breadcrumb: "Dashboard > Analytics" },
  "/alerts":       { title: "SMS Alert Management", breadcrumb: "Communication > Configuration" },
  "/ai-insights":  { title: "AI Insights",          breadcrumb: "Home > AI Insights" },
  "/settings":     { title: "System Configuration", breadcrumb: "Settings > Drought Thresholds" },
  "/users":        { title: "User Access Management", breadcrumb: "Settings > Users" },
  "/notifications":{ title: "Notification Center",  breadcrumb: "Home > Notifications" },
};

export function AppHeader() {
  const pathname = usePathname();
  const { title, breadcrumb } = routeMeta[pathname] ?? { title: "Dashboard", breadcrumb: "Home" };

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 flex-shrink-0 z-10 pt-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">{breadcrumb}</p>
      </div>

      <div className="flex items-center gap-4">
        {pathname === "/" && (
          <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <select className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Beed District</option>
            </select>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <select className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Taluka: All</option>
            </select>
          </div>
        )}

        <Link
          href="/notifications"
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm relative transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Link>

        <Button
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-200 w-10 h-10"
        >
          <Plus className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-medium text-sm h-auto"
          asChild
        >
          <Link href="/ai-insights">
            <Sparkles className="w-4 h-4" />
            AI Assistant
          </Link>
        </Button>
      </div>
    </header>
  );
}
