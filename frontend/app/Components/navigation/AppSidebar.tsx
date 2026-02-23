"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplet,
  LayoutDashboard,
  Truck,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  Sparkles,
  Bell,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/Components/auth/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Tanker Fleet", href: "/tracking", icon: Truck },
  { name: "AI Insights", href: "/ai-insights", icon: Sparkles },
  { name: "SMS Alerts", href: "/alerts", icon: MessageSquare },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Derive display name and role label from auth state, fall back to placeholder
  const displayName = user?.name ?? "Rajesh Patil";
  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "official"
      ? "District Water Officer"
      : user?.role === "user"
      ? "Field User"
      : "District Water Officer";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-20 shadow-sm hidden md:flex h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Droplet className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">AquaGov</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-4 mb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <Input
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-100 focus-visible:border-blue-400 h-9"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 mt-2">
        <p className="px-3 pt-2 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer mb-1 text-sm font-medium",
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-l-none pl-2"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 mr-3",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="mx-4 w-auto" />

      {/* Profile Footer */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <Image
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            src="https://picsum.photos/seed/user/100/100"
            width={36}
            height={36}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
