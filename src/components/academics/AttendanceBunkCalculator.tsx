import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { SubjectAttendance, StudentProfile } from '../../types';
import { calculateAttendanceMetrics, summarizeOverallAttendance } from '../../utils/attendanceCalculator';

interface AttendanceBunkCalculatorProps {
  subjects: SubjectAttendance[];
  onUpdateSubjectAttendance: (id: string, attendedDelta: number, heldDelta: number) => void;
  profile: StudentProfile;
}

export const AttendanceBunkCalculator: React.FC<AttendanceBunkCalculatorProps> = ({
  subjects,
  onUpdateSubjectAttendance,
  profile
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [simulatedBunks, setSimulatedBunks] = useState<number>(1);
  const [simulatedAttends, setSimulatedAttends] = useState<number>(0);

  const summary = summarizeOverallAttendance(subjects);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Simulation calculation for selected subject
  const currentAnalysis = selectedSubject
    ? calculateAttendanceMetrics(selectedSubject.attendedClasses, selectedSubject.totalClassesHeld, selectedSubject.targetPercentage)
    : null;

  const simulatedTotalHeld = selectedSubject
    ? selectedSubject.totalClassesHeld + simulatedBunks + simulatedAttends
    : 0;

  const simulatedAttended = selectedSubject
    ? selectedSubject.attendedClasses + simulatedAttends
    : 0;

  const simulatedPercentage = simulatedTotalHeld > 0
    ? Number(((simulatedAttended / simulatedTotalHeld) * 100).toFixed(1))
    : 100;

  return (
    <div className="space-y-6">
      {/* Overall Attendance Cockpit */}
      <div className="p-6 bg-base-900 dark:bg-surface-900 text-ink-50 rounded-2xl shadow-elevated border border-ink-800 dark:border-ink-700/40 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-accent-600/15 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-label uppercase tracking-wider text-accent-400">
                Semester Attendance Health
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 text-caption font-bold uppercase tracking-wider rounded-full border ${
                summary.overallPercentage >= 75
                  ? 'bg-success-500/15 text-success-100 border-success-500/40'
                  : 'bg-danger-500/15 text-danger-100 border-danger-500/40'
              }`}>
                {summary.overallPercentage >= 75 ? 'Safe from Debarment' : 'Shortage Alert'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="font-display text-display-lg sm:text-display-xl text-white">
                {summary.overallPercentage}%
              </span>
              <span className="text-body-sm text-ink-300">
                ({summary.totalAttended} attended of {summary.totalHeld} total lectures)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="px-3.5 py-2.5 bg-base-800/90 dark:bg-base-950/70 rounded-xl border border-ink-700/50 text-center">
              <span className="text-label uppercase tracking-wider text-ink-400 block">Shortage</span>
              <span className="font-display text-heading-md text-danger-500 mt-0.5 block">
                {summary.subjectsInDanger.length} subj
              </span>
            </div>

            <div className="px-3.5 py-2.5 bg-base-800/90 dark:bg-base-950/70 rounded-xl border border-ink-700/50 text-center">
              <span className="text-label uppercase tracking-wider text-ink-400 block">Borderline</span>
              <span className="font-display text-heading-md text-warning-500 mt-0.5 block">
                {summary.subjectsBorderline.length} subj
              </span>
            </div>

            <div className="px-3.5 py-2.5 bg-base-800/90 dark:bg-base-950/70 rounded-xl border border-ink-700/50 text-center">
              <span className="text-label uppercase tracking-wider text-ink-400 block">Safe Zone</span>
              <span className="font-display text-heading-md text-success-500 mt-0.5 block">
                {summary.subjectsSafe.length} subj
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Subject Bunk Limit Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
              Subject-wise Safe Bunk Calculator
            </h3>
            <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-0.5">
              Target minimum: {profile.defaultTargetAttendance}% mandatory attendance limit
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => {
            const metrics = calculateAttendanceMetrics(
              subject.attendedClasses,
              subject.totalClassesHeld,
              subject.targetPercentage
            );

            const isBorderline = metrics.isSafe && metrics.safeBunksRemaining <= 1;

            return (
              <div
                key={subject.id}
                className={`card-hover p-5 ${
                  !metrics.isSafe
                    ? 'border-danger-500/60 dark:border-danger-500/40'
                    : isBorderline
                      ? 'border-warning-500/60 dark:border-warning-500/40'
                      : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-label uppercase tracking-wider text-accent-600 dark:text-accent-400 block">
                      {subject.subjectCode} • {subject.credits} Credits
                    </span>
                    <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50 leading-snug mt-0.5">
                      {subject.subjectName}
                    </h4>
                    <span className="text-body-xs text-ink-400 block mt-0.5">
                      {subject.facultyName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-display text-display-md block ${
                      !metrics.isSafe
                        ? 'text-danger-600 dark:text-danger-500'
                        : isBorderline
                          ? 'text-warning-600 dark:text-warning-500'
                          : 'text-success-600 dark:text-success-500'
                    }`}>
                      {metrics.percentage}%
                    </span>
                    <span className="text-body-xs text-ink-400 block">
                      {subject.attendedClasses}/{subject.totalClassesHeld} held
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 w-full bg-base-200 dark:bg-base-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      !metrics.isSafe
                        ? 'bg-danger-500'
                        : isBorderline
                          ? 'bg-warning-500'
                          : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(100, metrics.percentage)}%` }}
                  />
                </div>

                {/* Calculation Verdict Badge */}
                <div className="mt-3.5">
                  {metrics.isSafe ? (
                    <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                      metrics.safeBunksRemaining > 0
                        ? 'bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20'
                        : 'bg-warning-50 dark:bg-warning-500/10 border-warning-100 dark:border-warning-500/20'
                    }`}>
                      <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${
                        metrics.safeBunksRemaining > 0
                          ? 'text-success-600 dark:text-success-500'
                          : 'text-warning-600 dark:text-warning-500'
                      }`} />
                      <div>
                        <div className={`font-display text-sub-md ${
                          metrics.safeBunksRemaining > 0
                            ? 'text-success-700 dark:text-success-500'
                            : 'text-warning-700 dark:text-warning-500'
                        }`}>
                          {metrics.safeBunksRemaining > 0
                            ? `Can safely bunk ${metrics.safeBunksRemaining} class${metrics.safeBunksRemaining > 1 ? 'es' : ''}`
                            : 'Borderline! Cannot miss any next class'}
                        </div>
                        <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-0.5">
                          {metrics.statusMessage}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 bg-danger-50 dark:bg-danger-500/10 p-3 rounded-xl border border-danger-100 dark:border-danger-500/20">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-danger-600 dark:text-danger-500 mt-0.5" />
                      <div>
                        <div className="font-display text-sub-md text-danger-700 dark:text-danger-500">
                          Shortage: Must attend {metrics.classesNeededToRecover} class{metrics.classesNeededToRecover > 1 ? 'es' : ''}
                        </div>
                        <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-0.5">
                          {metrics.statusMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Daily Attendance Logger */}
                <div className="mt-3.5 pt-3 border-t border-ink-200/60 dark:border-ink-700/30 flex items-center justify-between">
                  <span className="text-label uppercase tracking-wider text-ink-400">Log Today:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateSubjectAttendance(subject.id, 1, 1)}
                      className="px-2.5 py-1 text-body-xs font-semibold bg-success-50 hover:bg-success-100 text-success-700 dark:bg-success-500/10 dark:hover:bg-success-500/20 dark:text-success-500 rounded-lg border border-success-100 dark:border-success-500/20 transition-colors"
                      title="Attended lecture today"
                    >
                      + Attended
                    </button>
                    <button
                      onClick={() => onUpdateSubjectAttendance(subject.id, 0, 1)}
                      className="px-2.5 py-1 text-body-xs font-semibold bg-danger-50 hover:bg-danger-100 text-danger-700 dark:bg-danger-500/10 dark:hover:bg-danger-500/20 dark:text-danger-500 rounded-lg border border-danger-100 dark:border-danger-500/20 transition-colors"
                      title="Missed lecture today"
                    >
                      - Missed
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What-If Bunk Simulator */}
      {selectedSubject && currentAnalysis && (
        <div className="card p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-200/60 dark:border-ink-700/30 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <h4 className="font-display text-heading-md text-ink-900 dark:text-ink-50">
                Interactive "What-If" Bunk & Recovery Simulator
              </h4>
            </div>
            <span className="text-body-xs text-ink-400">
              Simulate upcoming decisions before bunking
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Subject Selector & Sliders */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Select Subject to Simulate:
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.subjectCode} - {s.subjectName} (Current: {((s.attendedClasses / s.totalClassesHeld) * 100).toFixed(1)}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider 1: Classes to BUNK */}
              <div>
                <div className="flex justify-between items-center text-body-sm mb-1.5">
                  <span className="font-semibold text-danger-600 dark:text-danger-500">
                    Upcoming classes you plan to BUNK:
                  </span>
                  <span className="font-mono text-sub-md text-ink-900 dark:text-ink-50">
                    {simulatedBunks} classes
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simulatedBunks}
                  onChange={e => setSimulatedBunks(parseInt(e.target.value, 10))}
                  className="w-full accent-danger-500 h-2 bg-base-200 dark:bg-base-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Classes to ATTEND */}
              <div>
                <div className="flex justify-between items-center text-body-sm mb-1.5">
                  <span className="font-semibold text-success-600 dark:text-success-500">
                    Upcoming classes you plan to ATTEND:
                  </span>
                  <span className="font-mono text-sub-md text-ink-900 dark:text-ink-50">
                    {simulatedAttends} classes
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={simulatedAttends}
                  onChange={e => setSimulatedAttends(parseInt(e.target.value, 10))}
                  className="w-full accent-success-500 h-2 bg-base-200 dark:bg-base-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated Outcome Display */}
            <div className="p-5 bg-base-100 dark:bg-base-800/80 rounded-2xl border border-ink-200/60 dark:border-ink-700/30 text-center space-y-2">
              <span className="text-label uppercase tracking-wider text-ink-400 block">
                Projected Attendance
              </span>

              <div className={`font-display text-display-lg ${
                simulatedPercentage >= selectedSubject.targetPercentage
                  ? 'text-ink-900 dark:text-ink-50'
                  : 'text-danger-600 dark:text-danger-500'
              }`}>
                {simulatedPercentage}%
              </div>

              <div className="text-body-sm text-ink-600 dark:text-ink-300">
                Currently: <span className="font-semibold text-ink-900 dark:text-ink-100">{currentAnalysis.percentage}%</span>
                <span className={`ml-1.5 font-semibold ${
                  simulatedPercentage >= currentAnalysis.percentage
                    ? 'text-success-600 dark:text-success-500'
                    : 'text-danger-600 dark:text-danger-500'
                }`}>
                  ({simulatedPercentage >= currentAnalysis.percentage ? '+' : ''}{(simulatedPercentage - currentAnalysis.percentage).toFixed(1)}%)
                </span>
              </div>

              <div className="pt-1.5">
                <span className={
                  simulatedPercentage >= selectedSubject.targetPercentage
                    ? 'badge-success px-3 py-1'
                    : 'badge-danger px-3 py-1'
                }>
                  {simulatedPercentage >= selectedSubject.targetPercentage
                    ? '✅ Above 75% limit'
                    : '⚠️ Shortage Risk'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
