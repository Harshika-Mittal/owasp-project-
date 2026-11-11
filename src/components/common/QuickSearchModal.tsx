import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  Calendar, 
  Bell, 
  BookOpen, 
  Utensils, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { 
  Expense, 
  PlannerEvent, 
  CampusNotice, 
  PeerNote, 
  ViewMode 
} from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  events: PlannerEvent[];
  notices: CampusNotice[];
  notes: PeerNote[];
  onNavigate: (view: ViewMode) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  expenses,
  events,
  notices,
  notes,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingNotices = q 
    ? notices.filter(n => n.title.toLowerCase().includes(q) || n.aiSummary.toLowerCase().includes(q)).slice(0, 3) 
    : [];

  const matchingEvents = q 
    ? events.filter(e => e.title.toLowerCase().includes(q) || (e.subjectCode && e.subjectCode.toLowerCase().includes(q))).slice(0, 3) 
    : [];

  const matchingExpenses = q 
    ? expenses.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).slice(0, 3) 
    : [];

  const matchingNotes = q 
    ? notes.filter(n => n.title.toLowerCase().includes(q) || n.subjectName.toLowerCase().includes(q)).slice(0, 3) 
    : [];

  const handleSelect = (view: ViewMode) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette box */}
      <div className="relative w-full max-w-2xl bg-surface-50 dark:bg-surface-900 rounded-3xl shadow-elevated border border-ink-200/60 dark:border-ink-700/30 overflow-hidden z-10 transition-all">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-ink-200/60 dark:border-ink-700/30 gap-3">
          <Search className="w-5 h-5 text-accent-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search circulars, exams, expenses, notes, canteen..."
            className="flex-1 text-body-sm bg-transparent border-0 focus:outline-none text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
          />
          <kbd className="px-2 py-0.5 text-caption font-mono bg-base-100 dark:bg-base-800 text-ink-400 rounded border border-ink-200/60 dark:border-ink-700/30">
            ESC
          </kbd>
        </div>

        {/* Results / Navigation Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!q ? (
            <div className="space-y-3">
              <span className="text-label uppercase tracking-wider text-ink-400 block">
                Quick Jump
              </span>
              <div className="grid grid-cols-2 gap-2 text-body-xs">
                <button
                  onClick={() => handleSelect('money')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-accent-50 dark:hover:bg-accent-950/30 text-ink-600 dark:text-ink-300 font-semibold transition-colors text-left"
                >
                  <Wallet className="w-4 h-4 text-accent-500" />
                  <span>Money & IOU Reminders</span>
                </button>
                <button
                  onClick={() => handleSelect('academics')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-accent-50 dark:hover:bg-accent-950/30 text-ink-600 dark:text-ink-300 font-semibold transition-colors text-left"
                >
                  <Calendar className="w-4 h-4 text-success-500" />
                  <span>Timetable & Bunk Calc</span>
                </button>
                <button
                  onClick={() => handleSelect('campus')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-accent-50 dark:hover:bg-accent-950/30 text-ink-600 dark:text-ink-300 font-semibold transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-accent-600" />
                  <span>Smart Notice Board</span>
                </button>
                <button
                  onClick={() => handleSelect('campus')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-accent-50 dark:hover:bg-accent-950/30 text-ink-600 dark:text-ink-300 font-semibold transition-colors text-left"
                >
                  <Utensils className="w-4 h-4 text-warning-500" />
                  <span>Canteen Live Rush</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-body-xs">
              {matchingNotices.length > 0 && (
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                    Notices & Circulars
                  </span>
                  <div className="space-y-1">
                    {matchingNotices.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect('campus')}
                        className="p-2.5 rounded-xl hover:bg-accent-50 dark:hover:bg-accent-950/30 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-ink-900 dark:text-ink-50">{n.title}</div>
                          <div className="text-caption text-ink-400 truncate max-w-md">{n.aiSummary}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingEvents.length > 0 && (
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                    Schedule & Deadlines
                  </span>
                  <div className="space-y-1">
                    {matchingEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleSelect('academics')}
                        className="p-2.5 rounded-xl hover:bg-accent-50 dark:hover:bg-accent-950/30 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-ink-900 dark:text-ink-50">{e.title}</div>
                          <div className="text-caption text-ink-400">{e.date} • {e.startTime}-{e.endTime}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingExpenses.length > 0 && (
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                    Expenses
                  </span>
                  <div className="space-y-1">
                    {matchingExpenses.map(exp => (
                      <div
                        key={exp.id}
                        onClick={() => handleSelect('money')}
                        className="p-2.5 rounded-xl hover:bg-accent-50 dark:hover:bg-accent-950/30 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-ink-900 dark:text-ink-50">{exp.title}</div>
                          <div className="text-caption text-ink-400">₹{exp.amount} • {exp.category} • {exp.date}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingNotes.length > 0 && (
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                    Notes
                  </span>
                  <div className="space-y-1">
                    {matchingNotes.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect('campus')}
                        className="p-2.5 rounded-xl hover:bg-accent-50 dark:hover:bg-accent-950/30 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-ink-900 dark:text-ink-50">{n.title}</div>
                          <div className="text-caption text-ink-400">{n.subjectName} ({n.subjectCode})</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingNotices.length === 0 && matchingEvents.length === 0 && matchingExpenses.length === 0 && matchingNotes.length === 0 && (
                <div className="p-8 text-center text-ink-400 text-body-xs">
                  No matches found for "{query}". Try searching for another topic or keyword!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
