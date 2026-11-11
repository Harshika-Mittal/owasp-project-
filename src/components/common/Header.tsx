import React from 'react';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  Sparkles, 
  IndianRupee, 
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface HeaderProps {
  profile: StudentProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenQuickSearch: () => void;
  pendingLentCount: number;
  clashesCount: number;
  dangerSubjectsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  darkMode,
  toggleDarkMode,
  onOpenQuickSearch,
  pendingLentCount,
  clashesCount,
  dangerSubjectsCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-ink-200/60 dark:border-ink-700/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-accent-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-heading-lg text-ink-900 dark:text-ink-50 tracking-tight">
                  Omni<span className="font-display text-accent-600 dark:text-accent-400">Campus</span>
                </span>
                <span className="badge-accent">
                  Smart Life OS
                </span>
              </div>
              <p className="text-body-xs text-ink-400 hidden sm:block">
                All-in-one student finances, academics & campus hub
              </p>
            </div>
          </div>

          {/* Center search trigger */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <button
              onClick={onOpenQuickSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 text-body-sm text-ink-400 bg-base-100 hover:bg-base-150 dark:bg-base-800 dark:hover:bg-surface-700 rounded-xl border border-ink-200/60 dark:border-ink-700/30 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-ink-400" />
                <span>Search notices, expenses, notes, deadlines...</span>
              </div>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-caption font-mono bg-surface-50 dark:bg-surface-900 text-ink-400 rounded border border-ink-200/60 dark:border-ink-700/30">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right items: Quick Pills & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Action pills */}
            {dangerSubjectsCount > 0 && (
              <div className="hidden sm:flex badge-danger">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{dangerSubjectsCount} Shortage{dangerSubjectsCount > 1 ? 's' : ''}</span>
              </div>
            )}

            {clashesCount > 0 && (
              <div className="hidden sm:flex badge-warning">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{clashesCount} Clash{clashesCount > 1 ? 'es' : ''}</span>
              </div>
            )}

            {pendingLentCount > 0 && (
              <div className="hidden lg:flex badge-success">
                <IndianRupee className="w-3 h-3" />
                <span>{pendingLentCount} Lent Dues</span>
              </div>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn-ghost p-2"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-warning-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-ink-200/60 dark:border-ink-700/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white font-display text-body-xs font-bold flex items-center justify-center ring-2 ring-accent-500/20">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-body-sm font-semibold text-ink-900 dark:text-ink-50 leading-tight">
                  {profile.name}
                </p>
                <p className="text-caption text-ink-400">
                  Sem {profile.semester} • {profile.rollNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
