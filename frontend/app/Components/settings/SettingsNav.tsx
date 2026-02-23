'use client';
import { Sliders, Bell, Users, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { id: 'thresholds', label: 'VWSI Thresholds', icon: Sliders },
  { id: 'users', label: 'User Access', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'system', label: 'System Preferences', icon: SettingsIcon },
] as const;

export type SettingsTab = (typeof NAV_ITEMS)[number]['id'];

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  return (
    <div className="flex flex-col gap-2">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center justify-start gap-3 p-4 rounded-2xl text-sm font-bold transition-colors w-full h-auto ${
            activeTab === id
              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-none'
          }`}
          variant="ghost"
        >
          <Icon className="w-5 h-5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
