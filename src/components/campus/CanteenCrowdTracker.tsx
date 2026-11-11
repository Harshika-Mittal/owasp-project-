import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  Flame
} from 'lucide-react';
import { CanteenLocation, MessDayMenu, CrowdLevel } from '../../types';

interface CanteenCrowdTrackerProps {
  canteens: CanteenLocation[];
  messMenu: MessDayMenu[];
  onUpdateCrowd: (canteenId: string, level: CrowdLevel, waitMinutes: number) => void;
}

export const CanteenCrowdTracker: React.FC<CanteenCrowdTrackerProps> = ({
  canteens,
  messMenu,
  onUpdateCrowd
}) => {
  const [activeTab, setActiveTab] = useState<'canteens' | 'mess'>('canteens');
  const [votedCanteenId, setVotedCanteenId] = useState<string | null>(null);

  const crowdBadges: Record<CrowdLevel, { label: string; badgeClass: string; dot: string }> = {
    low: { label: 'Empty / Fast (<3 mins)', badgeClass: 'badge-success', dot: 'bg-success-500' },
    moderate: { label: 'Moderate (8-12 mins)', badgeClass: 'badge-warning', dot: 'bg-warning-500' },
    high: { label: 'Heavy Rush (18-25 mins)', badgeClass: 'badge-warning', dot: 'bg-warning-600' },
    peak: { label: 'Packed (25+ mins wait)', badgeClass: 'badge-danger', dot: 'bg-danger-500' }
  };

  const handleStudentReport = (canteenId: string, level: CrowdLevel) => {
    const waitMap: Record<CrowdLevel, number> = {
      low: 3,
      moderate: 10,
      high: 20,
      peak: 30
    };
    onUpdateCrowd(canteenId, level, waitMap[level]);
    setVotedCanteenId(canteenId);
    setTimeout(() => setVotedCanteenId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Switcher */}
      <div className="inline-flex p-1 bg-base-200/80 dark:bg-base-900 border border-ink-200/60 dark:border-ink-700/30 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('canteens')}
          className={`flex-1 py-1.5 px-3.5 rounded-lg font-display text-sub-sm transition-all ${
            activeTab === 'canteens'
              ? 'bg-surface-50 dark:bg-surface-800 text-accent-700 dark:text-accent-300 shadow-card'
              : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
          }`}
        >
          ☕ Live Canteens ({canteens.length})
        </button>
        <button
          onClick={() => setActiveTab('mess')}
          className={`flex-1 py-1.5 px-3.5 rounded-lg font-display text-sub-sm transition-all ${
            activeTab === 'mess'
              ? 'bg-surface-50 dark:bg-surface-800 text-accent-700 dark:text-accent-300 shadow-card'
              : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
          }`}
        >
          🍽️ Hostel Mess Menu
        </button>
      </div>

      {/* Canteens Live Status View */}
      {activeTab === 'canteens' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {canteens.map(canteen => {
            const badge = crowdBadges[canteen.crowdLevel];

            return (
              <div
                key={canteen.id}
                className="card-hover p-5 sm:p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-heading-md text-ink-900 dark:text-ink-50">
                      {canteen.name}
                    </h3>
                    <span className="text-body-sm text-ink-500 dark:text-ink-400">
                      {canteen.building} • Open {canteen.openHours}
                    </span>
                  </div>

                  <div className={`${badge.badgeClass} shrink-0 py-1 px-2.5`}>
                    <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Estimated Wait & Peak hours — High-contrast Live Wait Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-base-100 dark:bg-base-800/70 rounded-xl border border-ink-200/50 dark:border-ink-700/30">
                    <span className="text-label uppercase tracking-wider text-ink-400 block">
                      Queue Wait Time
                    </span>
                    <span className="font-display text-display-md text-ink-900 dark:text-ink-50 block mt-0.5">
                      ~{canteen.estimatedWaitMinutes} mins
                    </span>
                    <span className="text-body-xs text-ink-400 block mt-0.5">
                      Updated {canteen.lastUpdated}
                    </span>
                  </div>

                  <div className="p-3.5 bg-base-100 dark:bg-base-800/70 rounded-xl border border-ink-200/50 dark:border-ink-700/30 flex flex-col justify-between">
                    <span className="text-label uppercase tracking-wider text-ink-400 block">
                      Peak Rush Hours
                    </span>
                    <span className="font-display text-sub-md text-ink-800 dark:text-ink-100 block mt-1.5">
                      {canteen.peakHours}
                    </span>
                  </div>
                </div>

                {/* Today's Special Dish */}
                <div className="p-3.5 bg-warning-50/80 dark:bg-warning-500/10 rounded-xl border border-warning-100 dark:border-warning-500/20 flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-warning-600 dark:text-warning-500 shrink-0" />
                  <div className="text-body-sm">
                    <span className="font-display text-sub-sm text-warning-700 dark:text-warning-500">
                      Today&apos;s Special:{' '}
                    </span>
                    <span className="text-ink-700 dark:text-ink-200 font-medium">
                      {canteen.todaySpecial}
                    </span>
                  </div>
                </div>

                {/* Hourly Rush Mini-Histogram */}
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block mb-2">
                    Hourly Rush Trend
                  </span>
                  <div className="flex items-end gap-1.5 h-12 pt-1">
                    {canteen.hourlyRush.map((slot, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={`w-full rounded-t-sm transition-all ${
                            slot.rushPercent > 80
                              ? 'bg-danger-500'
                              : slot.rushPercent > 50
                                ? 'bg-warning-500'
                                : 'bg-accent-500'
                          }`}
                          style={{ height: `${slot.rushPercent}%` }}
                          title={`${slot.hour}: ${slot.rushPercent}% capacity`}
                        />
                        <span className="text-caption text-ink-400">{slot.hour.replace(' ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Crowdsource Live Check-in */}
                <div className="pt-3 border-t border-ink-200/60 dark:border-ink-700/30 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-body-xs font-medium text-ink-500 dark:text-ink-400">
                    Are you there? Report live:
                  </span>
                  <div className="flex items-center gap-1.5 text-body-xs">
                    <button
                      onClick={() => handleStudentReport(canteen.id, 'low')}
                      className="px-2.5 py-1 bg-success-50 hover:bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500 border border-success-100 dark:border-success-500/20 rounded-lg font-semibold transition-colors"
                      title="No queue"
                    >
                      🟢 Empty
                    </button>
                    <button
                      onClick={() => handleStudentReport(canteen.id, 'moderate')}
                      className="px-2.5 py-1 bg-warning-50 hover:bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500 border border-warning-100 dark:border-warning-500/20 rounded-lg font-semibold transition-colors"
                      title="Medium queue"
                    >
                      🟡 Medium
                    </button>
                    <button
                      onClick={() => handleStudentReport(canteen.id, 'high')}
                      className="px-2.5 py-1 bg-danger-50 hover:bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-500 border border-danger-100 dark:border-danger-500/20 rounded-lg font-semibold transition-colors"
                      title="Huge queue"
                    >
                      🔴 Packed
                    </button>
                  </div>
                </div>

                {votedCanteenId === canteen.id && (
                  <div className="p-2.5 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 text-body-xs text-center text-success-700 dark:text-success-500 font-semibold">
                    ✅ Thanks for reporting! Live crowd wait time updated for fellow students.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hostel Mess Weekly Menu View */}
      {activeTab === 'mess' && (
        <div className="space-y-4">
          <div className="p-4 bg-accent-50/80 dark:bg-accent-950/35 border border-accent-200 dark:border-accent-800/50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-600 text-white shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display text-sub-md text-ink-900 dark:text-ink-50">
                  Central Hostel Mess Schedule
                </h4>
                <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-0.5">
                  Breakfast: 7:30 - 9:30 AM • Lunch: 12:30 - 2:30 PM • Snacks: 5:00 - 6:00 PM • Dinner: 8:00 - 10:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messMenu.map((m, idx) => {
              const isToday = m.day.includes('Today');

              return (
                <div
                  key={idx}
                  className={`p-5 space-y-3.5 ${
                    isToday
                      ? 'card border-accent-600 dark:border-accent-500 ring-2 ring-accent-600/15'
                      : 'card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-ink-200/60 dark:border-ink-700/30">
                    <h4 className={`font-display text-heading-md ${isToday ? 'text-accent-700 dark:text-accent-300' : 'text-ink-900 dark:text-ink-50'}`}>
                      {m.day}
                    </h4>
                    {isToday && (
                      <span className="badge-accent">
                        Today&apos;s Menu
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-label uppercase tracking-wider text-ink-400 block">
                        🍳 Breakfast
                      </span>
                      <p className="text-body-sm text-ink-800 dark:text-ink-100 mt-0.5">{m.breakfast}</p>
                    </div>

                    <div>
                      <span className="text-label uppercase tracking-wider text-ink-400 block">
                        🍛 Lunch
                      </span>
                      <p className="text-body-sm text-ink-800 dark:text-ink-100 mt-0.5">{m.lunch}</p>
                    </div>

                    <div>
                      <span className="text-label uppercase tracking-wider text-ink-400 block">
                        ☕ Evening Snacks
                      </span>
                      <p className="text-body-sm text-ink-800 dark:text-ink-100 mt-0.5">{m.snacks}</p>
                    </div>

                    <div>
                      <span className="text-label uppercase tracking-wider text-ink-400 block">
                        🍲 Dinner
                      </span>
                      <p className="text-body-sm text-ink-800 dark:text-ink-100 mt-0.5">{m.dinner}</p>
                    </div>
                  </div>

                  {m.special && (
                    <div className="pt-2.5 border-t border-ink-200/60 dark:border-ink-700/30 flex items-center gap-1.5 text-body-xs font-semibold text-accent-700 dark:text-accent-300">
                      <Sparkles className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 shrink-0" />
                      <span>Special: {m.special}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
