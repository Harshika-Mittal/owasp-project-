import React, { useState } from 'react';
import { CalendarClock, ShieldCheck } from 'lucide-react';
import { PlannerEvent, SubjectAttendance, StudentProfile } from '../../types';
import { UnifiedPlanner } from './UnifiedPlanner';
import { AttendanceBunkCalculator } from './AttendanceBunkCalculator';
import { WhatsAppExtractorModal } from './WhatsAppExtractorModal';
import { detectScheduleClashes } from '../../utils/clashDetector';

interface AcademicsViewProps {
  events: PlannerEvent[];
  onAddEvent: (event: Omit<PlannerEvent, 'id'>) => void;
  onAddMultipleEvents: (events: Omit<PlannerEvent, 'id'>[]) => void;
  onToggleComplete: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  subjects: SubjectAttendance[];
  onUpdateSubjectAttendance: (id: string, attendedDelta: number, heldDelta: number) => void;
  profile: StudentProfile;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  events,
  onAddEvent,
  onAddMultipleEvents,
  onToggleComplete,
  onDeleteEvent,
  subjects,
  onUpdateSubjectAttendance,
  profile
}) => {
  const [subTab, setSubTab] = useState<'planner' | 'attendance'>('planner');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const clashes = detectScheduleClashes(events);
  const dangerSubjectsCount = subjects.filter(s => (s.attendedClasses / s.totalClassesHeld) * 100 < s.targetPercentage).length;

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-200/60 dark:border-ink-700/30 pb-px">
        <button
          onClick={() => setSubTab('planner')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all ${
            subTab === 'planner'
              ? 'border-accent-600 text-accent-600 dark:border-accent-400 dark:text-accent-400'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          <span>Unified Planner & Clashes</span>
          {clashes.length > 0 && (
            <span className="badge-warning">
              {clashes.length} clash
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('attendance')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all ${
            subTab === 'attendance'
              ? 'border-accent-600 text-accent-600 dark:border-accent-400 dark:text-accent-400'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Safe Bunk & Attendance Limits</span>
          {dangerSubjectsCount > 0 && (
            <span className="badge-danger">
              {dangerSubjectsCount} shortage
            </span>
          )}
        </button>
      </div>

      {subTab === 'planner' && (
        <UnifiedPlanner
          events={events}
          onAddEvent={onAddEvent}
          onToggleComplete={onToggleComplete}
          onDeleteEvent={onDeleteEvent}
          onOpenWhatsAppExtractor={() => setShowWhatsAppModal(true)}
        />
      )}

      {subTab === 'attendance' && (
        <AttendanceBunkCalculator
          subjects={subjects}
          onUpdateSubjectAttendance={onUpdateSubjectAttendance}
          profile={profile}
        />
      )}

      <WhatsAppExtractorModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onAddEvents={onAddMultipleEvents}
      />
    </div>
  );
};
