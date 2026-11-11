import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Sparkles,
  Filter,
  MapPin,
  BookOpen,
  Trash2,
  FileCode,
  PartyPopper
} from 'lucide-react';
import { PlannerEvent, EventType, PriorityLevel } from '../../types';
import { detectScheduleClashes } from '../../utils/clashDetector';
import { Modal } from '../common/Modal';

interface UnifiedPlannerProps {
  events: PlannerEvent[];
  onAddEvent: (event: Omit<PlannerEvent, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onOpenWhatsAppExtractor: () => void;
}

export const UnifiedPlanner: React.FC<UnifiedPlannerProps> = ({
  events,
  onAddEvent,
  onToggleComplete,
  onDeleteEvent,
  onOpenWhatsAppExtractor
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('assignment');
  const [subjectCode, setSubjectCode] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [notes, setNotes] = useState('');

  // Detect clashes
  const clashes = detectScheduleClashes(events);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddEvent({
      title: title.trim(),
      type,
      subjectCode: subjectCode.trim() || undefined,
      location: location.trim() || undefined,
      date,
      startTime,
      endTime,
      priority,
      source: 'manual',
      notes: notes.trim() || undefined
    });

    setTitle('');
    setSubjectCode('');
    setLocation('');
    setNotes('');
    setShowAddModal(false);
  };

  const filteredEvents = events.filter(e => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (filterPriority !== 'all' && e.priority !== filterPriority) return false;
    return true;
  }).sort((a, b) => {
    // Sort by date then start time
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const typeBadges: Record<EventType, { label: string; className: string; icon: React.ReactNode }> = {
    class: { label: 'Lecture', className: 'badge-accent', icon: <BookOpen className="w-3 h-3" /> },
    lab: { label: 'Lab Session', className: 'badge-neutral', icon: <FileCode className="w-3 h-3" /> },
    assignment: { label: 'Assignment Deadline', className: 'badge-warning', icon: <Clock className="w-3 h-3" /> },
    exam: { label: 'Exam / Quiz', className: 'badge-danger', icon: <AlertTriangle className="w-3 h-3" /> },
    society: { label: 'Society / Club', className: 'badge-accent', icon: <Sparkles className="w-3 h-3" /> },
    fest: { label: 'Campus Fest', className: 'badge-warning', icon: <PartyPopper className="w-3 h-3" /> }
  };

  const priorityBadges: Record<PriorityLevel, { label: string; className: string }> = {
    urgent: {
      label: 'Urgent',
      className: 'inline-flex items-center px-2 py-0.5 text-caption font-bold uppercase tracking-wider rounded-full bg-danger-600 text-white'
    },
    high: {
      label: 'High Priority',
      className: 'inline-flex items-center px-2 py-0.5 text-caption font-bold uppercase tracking-wider rounded-full bg-warning-600 text-white'
    },
    medium: { label: 'Medium', className: 'badge-accent' },
    low: { label: 'Low', className: 'badge-neutral' }
  };

  return (
    <div className="space-y-6">
      {/* Clash Alerts Banner */}
      {clashes.length > 0 && (
        <div className="p-5 bg-warning-50 dark:bg-warning-500/10 border border-warning-500/50 dark:border-warning-500/30 rounded-2xl shadow-card space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-warning-700 dark:text-warning-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-display text-heading-md text-warning-700 dark:text-warning-500">
                Detected {clashes.length} Schedule Clash{clashes.length > 1 ? 'es' : ''}!
              </h4>
            </div>
            <span className="badge-warning">Action Required</span>
          </div>

          <div className="space-y-2.5">
            {clashes.map((clash, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-surface-50 dark:bg-surface-900 rounded-xl border border-warning-500/30 dark:border-warning-500/20 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sub-md text-ink-900 dark:text-ink-50">
                    📅 {clash.event1.date}: "{clash.event1.title}" ⚡ "{clash.event2.title}"
                  </span>
                  <span className="badge-warning font-mono">
                    Time Overlap
                  </span>
                </div>
                <p className="text-body-sm text-ink-600 dark:text-ink-300">
                  {clash.clashReason}
                </p>
                <div className="p-2.5 bg-warning-50 dark:bg-warning-500/10 rounded-lg border border-warning-100 dark:border-warning-500/20 text-body-xs font-medium text-warning-700 dark:text-warning-500">
                  💡 Recommendation: {clash.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Header & Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
            Unified Academic & Event Planner
          </h3>
          <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-0.5">
            Never miss lab submissions, classes, or society workshops with automated clash resolution
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenWhatsAppExtractor}
            className="btn-accent-outline flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Extract from WhatsApp</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-accent flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="card p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-label uppercase tracking-wider text-ink-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['all', 'class', 'lab', 'assignment', 'exam', 'society', 'fest'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-body-xs capitalize transition-all shrink-0 ${
                filterType === t
                  ? 'bg-accent-600 text-white font-semibold shadow-sm'
                  : 'bg-base-100 dark:bg-base-800 text-ink-600 dark:text-ink-300 font-medium hover:bg-base-200 dark:hover:bg-surface-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-label uppercase tracking-wider text-ink-400">Priority:</span>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-body-xs font-medium bg-base-100 dark:bg-base-800 text-ink-800 dark:text-ink-100 rounded-xl border border-ink-200/60 dark:border-ink-700/30 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="card p-8 text-center text-body-sm text-ink-400">
            No events match the selected filters.
          </div>
        ) : (
          filteredEvents.map(event => {
            const typeBadge = typeBadges[event.type];
            const pBadge = priorityBadges[event.priority];
            const isClashing = clashes.some(c => c.event1.id === event.id || c.event2.id === event.id);

            return (
              <div
                key={event.id}
                className={`p-4 transition-all ${
                  event.isCompleted
                    ? 'card opacity-60 bg-base-150/60 dark:bg-base-900/50'
                    : isClashing
                      ? 'card border-warning-500/70 dark:border-warning-500/50 shadow-card-hover'
                      : 'card-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => onToggleComplete(event.id)}
                      className={`mt-1 p-1 rounded-lg border transition-colors ${
                        event.isCompleted
                          ? 'bg-success-600 border-success-600 text-white'
                          : 'border-ink-300 dark:border-ink-600 hover:border-accent-500 text-transparent'
                      }`}
                      title={event.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeBadge.className}>
                          {typeBadge.icon}
                          <span>{typeBadge.label}</span>
                        </span>

                        <span className={pBadge.className}>
                          {pBadge.label}
                        </span>

                        {isClashing && !event.isCompleted && (
                          <span className="badge-warning">
                            <AlertTriangle className="w-3 h-3" /> Time Clash
                          </span>
                        )}

                        {event.source === 'whatsapp_extracted' && (
                          <span className="badge-success">
                            WhatsApp Forward
                          </span>
                        )}
                      </div>

                      <h4
                        className={`font-display text-sub-lg mt-2 ${
                          event.isCompleted
                            ? 'line-through text-ink-400'
                            : 'text-ink-900 dark:text-ink-50'
                        }`}
                      >
                        {event.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-body-xs text-ink-600 dark:text-ink-300 mt-1.5">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
                          <span>{event.date}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-ink-400" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-danger-500" />
                            <span>{event.location}</span>
                          </span>
                        )}
                        {event.subjectCode && (
                          <span className="font-mono text-body-xs px-2 py-0.5 bg-base-100 dark:bg-base-800 text-ink-700 dark:text-ink-200 rounded-lg border border-ink-200/60 dark:border-ink-700/30">
                            {event.subjectCode}
                          </span>
                        )}
                      </div>

                      {event.notes && (
                        <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-2 bg-base-100 dark:bg-base-800/60 p-2.5 rounded-xl border border-ink-200/60 dark:border-ink-700/30">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="btn-ghost p-1.5 text-ink-400 hover:text-danger-600 dark:hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Add Event Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Academic or Society Event"
          subtitle="Clash detector will automatically warn you of conflicts"
          maxWidth="md"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Operating Systems Lab 4, Tech Fest Hackathon"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Event Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as EventType)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                >
                  <option value="class">Class / Lecture</option>
                  <option value="lab">Lab Session</option>
                  <option value="assignment">Assignment Deadline</option>
                  <option value="exam">Quiz / Exam</option>
                  <option value="society">Society / Club Activity</option>
                  <option value="fest">Campus Fest</option>
                </select>
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Subject Code (Optional)
                </label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                  placeholder="e.g. CS301"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Location / Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Lab 4, Audi 1"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
                />
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Bring hardcopy printout and signed ID card"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
              >
                Schedule Event
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
