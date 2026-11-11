import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CampusNotice } from '../../types';

interface SmartNoticeBoardProps {
  notices: CampusNotice[];
  onToggleBookmark: (id: string) => void;
}

export const SmartNoticeBoard: React.FC<SmartNoticeBoardProps> = ({
  notices,
  onToggleBookmark
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Notices' },
    { id: 'examination', label: 'Exams & COE' },
    { id: 'placement', label: 'Placements & Internships' },
    { id: 'academic', label: 'Academics & Library' },
    { id: 'hostel', label: 'Hostel & Mess' },
    { id: 'society', label: 'Societies & Fests' }
  ];

  const filteredNotices = notices.filter(n => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) ||
             n.aiSummary.toLowerCase().includes(q) ||
             n.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search circulars, exams, placement drives..."
            className="w-full pl-10 pr-4 py-2 text-body-sm bg-surface-50 dark:bg-surface-900 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-body-xs font-semibold shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'bg-surface-50 dark:bg-surface-900 text-ink-600 dark:text-ink-300 border border-ink-200/70 dark:border-ink-700/40 hover:bg-base-150 dark:hover:bg-base-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="card p-10 text-center text-body-md text-ink-400">
            No campus notices found matching your search.
          </div>
        ) : (
          filteredNotices.map(notice => {
            const isExpanded = expandedNoticeId === notice.id;

            return (
              <div
                key={notice.id}
                className="card-hover p-5 sm:p-6 space-y-4"
              >
                {/* Meta header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-accent">
                      {notice.category}
                    </span>
                    <span className="text-body-sm font-medium text-ink-600 dark:text-ink-300">
                      {notice.department}
                    </span>
                    <span className="text-body-xs text-ink-400">•</span>
                    <span className="text-body-xs text-ink-400">{notice.date}</span>
                    {notice.isImportant && (
                      <span className="badge-danger">
                        Important
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleBookmark(notice.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      notice.isBookmarked
                        ? 'bg-accent-50 text-accent-600 border-accent-200 dark:bg-accent-950/60 dark:text-accent-300 dark:border-accent-800'
                        : 'border-transparent text-ink-400 hover:text-ink-700 hover:bg-base-150 dark:hover:text-ink-200 dark:hover:bg-base-800'
                    }`}
                    title={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
                  >
                    <Bookmark className={`w-4 h-4 ${notice.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Title — Level 1 Heading */}
                <h3 className="font-display text-heading-md text-ink-900 dark:text-ink-50 leading-snug">
                  {notice.title}
                </h3>

                {/* AI Summary Capsule — High contrast pop */}
                <div className="p-4 rounded-xl bg-surface-150 dark:bg-accent-950/35 border border-accent-600/20 dark:border-accent-500/25 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-display text-sub-sm text-accent-700 dark:text-accent-300">
                    <Sparkles className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
                    <span>AI 2-Line Key Takeaway</span>
                  </div>
                  <p className="text-body-md text-ink-800 dark:text-ink-100 leading-relaxed">
                    {notice.aiSummary}
                  </p>

                  {/* Key Action Dates */}
                  {notice.keyActionDates && notice.keyActionDates.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {notice.keyActionDates.map((d, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-body-xs font-semibold bg-surface-50 dark:bg-surface-900 text-accent-700 dark:text-accent-300 rounded-lg border border-accent-200 dark:border-accent-800/60 shadow-card"
                        >
                          <Calendar className="w-3 h-3 text-accent-600 dark:text-accent-400" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expand / Collapse Full Circular Text */}
                <div>
                  <button
                    onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                    className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-ink-500 hover:text-accent-600 dark:text-ink-400 dark:hover:text-accent-400 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Official Circular Text' : 'View Full Official Circular Text'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 bg-base-100 dark:bg-base-950/70 rounded-xl border border-ink-200/70 dark:border-ink-700/40 text-body-sm text-ink-600 dark:text-ink-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {notice.originalText}
                      <div className="mt-3 pt-2.5 border-t border-ink-200/60 dark:border-ink-700/30 text-body-xs font-body text-ink-400">
                        Issued by: {notice.author} • Source: {notice.sourceChannel}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
