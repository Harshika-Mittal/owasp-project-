import React from 'react';
import { 
  IndianRupee, 
  CalendarClock, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Utensils, 
  ArrowRight, 
  Coffee, 
  Users, 
  Search, 
  BookOpen, 
  CheckCircle2,
  Flame
} from 'lucide-react';
import { 
  StudentProfile, 
  Expense, 
  LentItem, 
  PlannerEvent, 
  SubjectAttendance, 
  CampusNotice, 
  CanteenLocation, 
  ViewMode 
} from '../../types';
import { detectScheduleClashes } from '../../utils/clashDetector';
import { summarizeOverallAttendance, calculateAttendanceMetrics } from '../../utils/attendanceCalculator';

interface DashboardViewProps {
  profile: StudentProfile;
  expenses: Expense[];
  lentItems: LentItem[];
  events: PlannerEvent[];
  subjects: SubjectAttendance[];
  notices: CampusNotice[];
  canteens: CanteenLocation[];
  onNavigate: (view: ViewMode) => void;
  onOpenWhatsAppExtractor: () => void;
  onQuickLogExpense: (title: string, amount: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  expenses,
  lentItems,
  events,
  subjects,
  notices,
  canteens,
  onNavigate,
  onOpenWhatsAppExtractor,
  onQuickLogExpense
}) => {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingAllowance = Math.max(0, profile.monthlyAllowance - totalSpent);

  const pendingLentItems = lentItems.filter(i => i.type === 'lent' && i.status !== 'settled');
  const totalLentPending = pendingLentItems.reduce((acc, curr) => acc + curr.amount, 0);

  const clashes = detectScheduleClashes(events);
  const attendanceSummary = summarizeOverallAttendance(subjects);

  // Today's events
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = events
    .filter(e => !e.isCompleted)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 4);

  // Urgent notice
  const urgentNotice = notices.find(n => n.isImportant) || notices[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-accent-950 dark:bg-surface-900 border border-accent-900/60 dark:border-accent-700/30 text-ink-50 rounded-3xl shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center px-3 py-1 text-label uppercase tracking-wider bg-accent-500/15 rounded-full border border-accent-400/25 text-accent-200">
            Welcome back, {profile.name} • Sem {profile.semester} {profile.department.split(' ')[0]}
          </span>
          <h2 className="font-display text-display-md sm:text-display-lg text-ink-50 mt-3">
            Smart Campus &amp; Student Life OS
          </h2>
          <p className="text-body-md sm:text-body-lg text-ink-300 mt-2 leading-relaxed max-w-xl">
            One cockpit to solve spending leaks, awkward lent money, timetable clashes, safe bunk limits, and buried notices.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenWhatsAppExtractor}
              className="btn-accent flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Extract WhatsApp Deadlines</span>
            </button>

            <button
              onClick={() => onNavigate('academics')}
              className="flex items-center gap-2 px-4 py-2 text-body-sm font-semibold bg-white/10 hover:bg-white/15 text-ink-50 rounded-xl border border-white/15 backdrop-blur-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <span>Attendance Bunk Meter</span>
            </button>
          </div>
        </div>

        {/* Subtle ambient teal glow */}
        <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-16 -bottom-16 w-56 h-56 rounded-full bg-accent-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Clash Warning Card (if any) */}
      {clashes.length > 0 && (
        <div className="p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-500/30 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warning-100 dark:bg-warning-500/20 rounded-xl text-warning-700 dark:text-warning-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sub-md text-ink-900 dark:text-ink-50">
                Schedule Overlap Detected ({clashes.length} clash)
              </h4>
              <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-0.5">
                &ldquo;{clashes[0].event1.title}&rdquo; clashes with &ldquo;{clashes[0].event2.title}&rdquo;.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('academics')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-body-sm font-semibold bg-warning-100 hover:bg-warning-200/80 dark:bg-warning-500/20 dark:hover:bg-warning-500/30 text-warning-700 dark:text-warning-500 rounded-xl transition-all shrink-0"
          >
            <span>Resolve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Monthly Budget Burn */}
        <div
          onClick={() => onNavigate('money')}
          className="card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-label uppercase tracking-wider text-ink-400">
              Spending Velocity
            </span>
            <div className="p-2 bg-accent-50 dark:bg-accent-950/60 rounded-xl text-accent-600 dark:text-accent-400 group-hover:scale-105 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-display-md text-ink-900 dark:text-ink-50 mt-3">
            ₹{totalSpent}
          </div>
          <div className="flex items-center justify-between text-body-xs text-ink-500 dark:text-ink-400 mt-1.5">
            <span>Buffer: ₹{remainingAllowance}</span>
            <span className="text-accent-600 dark:text-accent-400 font-semibold">Details →</span>
          </div>
        </div>

        {/* KPI 2: Friends Owe You (Unrecovered Debt) */}
        <div
          onClick={() => onNavigate('money')}
          className="card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-label uppercase tracking-wider text-ink-400">
              Lent Money (IOU)
            </span>
            <div className="p-2 bg-success-50 dark:bg-success-500/10 rounded-xl text-success-600 dark:text-success-500 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-display-md text-accent-600 dark:text-accent-400 mt-3">
            ₹{totalLentPending}
          </div>
          <div className="flex items-center justify-between text-body-xs text-ink-500 dark:text-ink-400 mt-1.5">
            <span>{pendingLentItems.length} friends owe you</span>
            <span className="text-accent-600 dark:text-accent-400 font-semibold">Remind →</span>
          </div>
        </div>

        {/* KPI 3: Attendance Safety Status */}
        <div
          onClick={() => onNavigate('academics')}
          className="card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-label uppercase tracking-wider text-ink-400">
              Attendance Safe Limit
            </span>
            <div className={`p-2 rounded-xl group-hover:scale-105 transition-transform ${
              attendanceSummary.overallPercentage >= 75
                ? 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500'
                : 'bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-500'
            }`}>
              {attendanceSummary.overallPercentage >= 75 ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className={`font-display text-display-md mt-3 ${
            attendanceSummary.overallPercentage >= 75
              ? 'text-success-600 dark:text-success-500'
              : 'text-danger-600 dark:text-danger-500'
          }`}>
            {attendanceSummary.overallPercentage}%
          </div>
          <div className="flex items-center justify-between text-body-xs text-ink-500 dark:text-ink-400 mt-1.5">
            <span>
              {attendanceSummary.subjectsInDanger.length > 0
                ? `${attendanceSummary.subjectsInDanger.length} in shortage!`
                : 'Safe zone'}
            </span>
            <span className="text-accent-600 dark:text-accent-400 font-semibold">Bunk Calc →</span>
          </div>
        </div>

        {/* KPI 4: Live Canteen Wait Time */}
        <div
          onClick={() => onNavigate('campus')}
          className="card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-label uppercase tracking-wider text-ink-400">
              Main Canteen Rush
            </span>
            <div className="p-2 bg-warning-50 dark:bg-warning-500/10 rounded-xl text-warning-600 dark:text-warning-500 group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-display-md text-ink-900 dark:text-ink-50 mt-3">
            ~{canteens[0]?.estimatedWaitMinutes || 15} mins
          </div>
          <div className="flex items-center justify-between text-body-xs text-ink-500 dark:text-ink-400 mt-1.5">
            <span className="capitalize">{canteens[0]?.crowdLevel} rush right now</span>
            <span className="text-accent-600 dark:text-accent-400 font-semibold">Menu &amp; Rush →</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Section: Upcoming Timeline & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Deadlines & Priority Agenda */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CalendarClock className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
                Upcoming Academic Deadlines &amp; Agenda
              </h3>
            </div>
            <button
              onClick={() => onNavigate('academics')}
              className="btn-ghost flex items-center gap-1 text-accent-600 dark:text-accent-400"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="card-hover p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-accent-50 dark:bg-accent-950/60 border border-accent-200/60 dark:border-accent-800/40 flex flex-col items-center justify-center text-accent-700 dark:text-accent-300 shrink-0">
                    <span className="text-caption uppercase tracking-wider leading-none">{event.date.split('-')[1]}</span>
                    <span className="font-display text-heading-md leading-none mt-1">{event.date.split('-')[2]}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge-neutral">
                        {event.type}
                      </span>
                      {event.priority === 'urgent' && (
                        <span className="badge-danger">
                          Urgent
                        </span>
                      )}
                      {event.subjectCode && (
                        <span className="text-body-xs font-mono font-medium text-accent-600 dark:text-accent-400">
                          {event.subjectCode}
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-sub-md text-ink-800 dark:text-ink-100 mt-1.5">
                      {event.title}
                    </h4>

                    <div className="flex items-center gap-3 text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
                      <span className="font-mono">{event.startTime} - {event.endTime}</span>
                      {event.location && <span>• {event.location}</span>}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <button
                    onClick={() => onNavigate('academics')}
                    className="btn-ghost p-2 text-ink-400 hover:text-accent-600 dark:hover:text-accent-400"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Notice Capsule Preview */}
          {urgentNotice && (
            <div className="card p-5 bg-surface-150/70 dark:bg-surface-800/80 border-accent-200/70 dark:border-accent-800/40 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  <span className="text-label uppercase tracking-wider text-accent-700 dark:text-accent-300">
                    Latest Campus Circular (AI Summarized)
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('campus')}
                  className="text-body-xs font-semibold text-accent-600 dark:text-accent-400 hover:underline shrink-0"
                >
                  View All Notices →
                </button>
              </div>

              <h4 className="font-display text-sub-lg text-ink-800 dark:text-ink-100">
                {urgentNotice.title}
              </h4>
              <p className="text-body-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                {urgentNotice.aiSummary}
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Live Campus Pulse */}
        <div className="space-y-4">
          <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
            Quick 1-Tap Actions
          </h3>

          {/* Quick Expense buttons */}
          <div className="card p-4 space-y-3">
            <span className="text-label uppercase tracking-wider text-ink-400 block">
              Log Common Student Expense
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onQuickLogExpense("Nescafe Chai & Samosa", 35)}
                className="p-3 bg-base-100 dark:bg-base-800/80 hover:bg-accent-50 dark:hover:bg-accent-950/40 text-left rounded-xl border border-ink-200/60 dark:border-ink-700/40 hover:border-accent-500/40 transition-all"
              >
                <div className="font-display text-sub-sm text-ink-800 dark:text-ink-100">☕ Chai &amp; Samosa</div>
                <div className="font-display text-heading-md text-accent-600 dark:text-accent-400 mt-0.5">₹35</div>
              </button>

              <button
                onClick={() => onQuickLogExpense("Assignment Xerox & Binding", 45)}
                className="p-3 bg-base-100 dark:bg-base-800/80 hover:bg-accent-50 dark:hover:bg-accent-950/40 text-left rounded-xl border border-ink-200/60 dark:border-ink-700/40 hover:border-accent-500/40 transition-all"
              >
                <div className="font-display text-sub-sm text-ink-800 dark:text-ink-100">📄 Xerox / Print</div>
                <div className="font-display text-heading-md text-accent-600 dark:text-accent-400 mt-0.5">₹45</div>
              </button>

              <button
                onClick={() => onQuickLogExpense("Shared Auto to Metro", 40)}
                className="p-3 bg-base-100 dark:bg-base-800/80 hover:bg-accent-50 dark:hover:bg-accent-950/40 text-left rounded-xl border border-ink-200/60 dark:border-ink-700/40 hover:border-accent-500/40 transition-all"
              >
                <div className="font-display text-sub-sm text-ink-800 dark:text-ink-100">🛺 Metro Auto</div>
                <div className="font-display text-heading-md text-accent-600 dark:text-accent-400 mt-0.5">₹40</div>
              </button>

              <button
                onClick={() => onQuickLogExpense("Hostel Late Snack", 70)}
                className="p-3 bg-base-100 dark:bg-base-800/80 hover:bg-accent-50 dark:hover:bg-accent-950/40 text-left rounded-xl border border-ink-200/60 dark:border-ink-700/40 hover:border-accent-500/40 transition-all"
              >
                <div className="font-display text-sub-sm text-ink-800 dark:text-ink-100">🌙 Night Snack</div>
                <div className="font-display text-heading-md text-accent-600 dark:text-accent-400 mt-0.5">₹70</div>
              </button>
            </div>
          </div>

          {/* Live Canteens Rush Status Box */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-label uppercase tracking-wider text-ink-400 block">
                Live Canteen Wait Times
              </span>
              <span className="badge-success">Live</span>
            </div>

            <div className="space-y-2">
              {canteens.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-base-100 dark:bg-base-800/70">
                  <span className="font-display text-sub-sm text-ink-800 dark:text-ink-100 truncate max-w-[140px]">
                    {c.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sub-md text-ink-900 dark:text-ink-50">~{c.estimatedWaitMinutes}m</span>
                    <span className={`w-2 h-2 rounded-full ${
                      c.crowdLevel === 'low' ? 'bg-success-500' : c.crowdLevel === 'moderate' ? 'bg-warning-500' : 'bg-danger-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Mess Special */}
          <div className="card p-4 bg-surface-150/70 dark:bg-surface-800/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-warning-600 dark:text-warning-500" />
              <span className="font-display text-sub-sm text-ink-800 dark:text-ink-100">Hostel Mess Tonight</span>
            </div>
            <p className="text-body-sm text-ink-600 dark:text-ink-300">
              Egg Curry / Shahi Paneer with Ice Cream Scoop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

