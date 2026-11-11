import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  CalendarClock, 
  Building2, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { ViewMode } from '../../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  pendingRecoveryAmount: number;
  clashesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingRecoveryAmount,
  clashesCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      description: 'Cockpit overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'money' as ViewMode,
      label: 'Money & Splits',
      description: 'Expenses, IOU & Groups',
      icon: Wallet,
      badge: pendingRecoveryAmount > 0 ? `₹${pendingRecoveryAmount}` : null,
      badgeClass: 'badge-success'
    },
    {
      id: 'academics' as ViewMode,
      label: 'Time & Academics',
      description: 'Planner, Clashes & Attendance',
      icon: CalendarClock,
      badge: clashesCount > 0 ? `${clashesCount} clash` : null,
      badgeClass: 'badge-warning'
    },
    {
      id: 'campus' as ViewMode,
      label: 'Campus Community',
      description: 'Notices, Lost & Found, Canteen',
      icon: Building2,
      badge: 'Live',
      badgeClass: 'badge-accent'
    },
    {
      id: 'settings' as ViewMode,
      label: 'Settings & Data',
      description: 'Profile & JSON Backup',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-surface-50 dark:bg-surface-900 border-r border-ink-200/60 dark:border-ink-700/30 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-label uppercase tracking-wider text-ink-400">
          Main Modules
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/20'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-base-150 dark:hover:bg-base-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-ink-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{item.label}</div>
                  <div className={`text-caption ${isActive ? 'text-white/70' : 'text-ink-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
              {item.badge && (
                <span
                  className={`${
                    isActive
                      ? 'bg-white/20 text-white text-caption px-2 py-0.5 rounded-full font-semibold'
                      : item.badgeClass || 'badge-neutral'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* College Life Help Card */}
      <div className="p-3.5 bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-950/40 dark:to-surface-900 rounded-2xl border border-accent-200/60 dark:border-accent-800/30 mt-6">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-accent-600/10 dark:bg-accent-400/10 text-accent-600 dark:text-accent-400 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display text-sub-sm text-ink-900 dark:text-ink-50">Smart Bunk & Clashes</h4>
            <p className="text-caption text-ink-600 dark:text-ink-300 mt-0.5 leading-snug">
              Sync timetable, extract WhatsApp notices, and calculate safe attendance limits in 1 tap.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
