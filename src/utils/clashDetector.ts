import { PlannerEvent, EventClash } from '../types';

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function detectScheduleClashes(events: PlannerEvent[]): EventClash[] {
  const clashes: EventClash[] = [];

  // Group events by date
  const eventsByDate = new Map<string, PlannerEvent[]>();
  for (const event of events) {
    if (!eventsByDate.has(event.date)) {
      eventsByDate.set(event.date, []);
    }
    eventsByDate.get(event.date)!.push(event);
  }

  // Detect pairwise overlaps on the same date
  for (const [, dateEvents] of eventsByDate) {
    if (dateEvents.length < 2) continue;

    for (let i = 0; i < dateEvents.length; i++) {
      for (let j = i + 1; j < dateEvents.length; j++) {
        const e1 = dateEvents[i];
        const e2 = dateEvents[j];

        // Skip completed events or end-of-day deadline placeholders
        if (e1.isCompleted || e2.isCompleted) continue;

        const start1 = parseTimeToMinutes(e1.startTime);
        const end1 = parseTimeToMinutes(e1.endTime);
        const start2 = parseTimeToMinutes(e2.startTime);
        const end2 = parseTimeToMinutes(e2.endTime);

        // Strict overlap: max(start1, start2) < min(end1, end2)
        const overlapStart = Math.max(start1, start2);
        const overlapEnd = Math.min(end1, end2);

        if (overlapStart < overlapEnd) {
          // Identify clash
          let clashReason = `Time overlap: "${e1.title}" (${e1.startTime}-${e1.endTime}) conflicts with "${e2.title}" (${e2.startTime}-${e2.endTime}).`;
          let suggestedAction = "Review event priorities to choose which session to attend or request an alternate lab/meeting slot.";

          if (e1.type === 'lab' || e2.type === 'lab') {
            clashReason = `Academic conflict: Lab attendance is mandatory for marks and cannot be easily compensated.`;
            suggestedAction = `Prioritize the lab session (${e1.type === 'lab' ? e1.title : e2.title}) and contact your society/club head for permission or alternate task distribution.`;
          } else if (e1.type === 'exam' || e2.type === 'exam') {
            clashReason = `Critical exam clash! An exam is scheduled during this time window.`;
            suggestedAction = `Exam attendance is compulsory. Inform event organizers immediately.`;
          }

          clashes.push({
            event1: e1,
            event2: e2,
            clashReason,
            suggestedAction
          });
        }
      }
    }
  }

  return clashes;
}

