import { SubjectAttendance } from '../types';

export interface AttendanceAnalysis {
  percentage: number;
  isSafe: boolean;
  status: 'critical' | 'warning' | 'safe' | 'excellent';
  safeBunksRemaining: number;
  classesNeededToRecover: number;
  statusMessage: string;
}

export function calculateAttendanceMetrics(
  attended: number,
  totalHeld: number,
  targetPercentage: number = 75
): AttendanceAnalysis {
  if (totalHeld <= 0) {
    return {
      percentage: 100,
      isSafe: true,
      status: 'excellent',
      safeBunksRemaining: 0,
      classesNeededToRecover: 0,
      statusMessage: 'No classes held yet'
    };
  }

  const percentage = (attended / totalHeld) * 100;
  const targetFraction = targetPercentage / 100;

  if (percentage >= targetPercentage) {
    // Current attendance is at or above target
    // Bunks formula: floor((attended - targetFraction * totalHeld) / targetFraction)
    const rawSafeBunks = (attended - targetFraction * totalHeld) / targetFraction;
    const safeBunksRemaining = Math.max(0, Math.floor(rawSafeBunks));

    let status: 'safe' | 'excellent' = 'safe';
    let statusMessage = `You can safely miss ${safeBunksRemaining} class${safeBunksRemaining === 1 ? '' : 'es'} without dropping below ${targetPercentage}%.`;

    if (percentage >= 85) {
      status = 'excellent';
    }

    if (safeBunksRemaining === 0) {
      statusMessage = `On the borderline! Missing even 1 next class will drop you below ${targetPercentage}%.`;
    }

    return {
      percentage: Number(percentage.toFixed(1)),
      isSafe: true,
      status,
      safeBunksRemaining,
      classesNeededToRecover: 0,
      statusMessage
    };
  } else {
    // Attendance is below target (Shortage!)
    // Recovery formula: ceil((targetFraction * totalHeld - attended) / (1 - targetFraction))
    const rawNeeded = (targetFraction * totalHeld - attended) / (1 - targetFraction);
    const classesNeededToRecover = Math.max(1, Math.ceil(rawNeeded));

    const status: 'critical' | 'warning' = percentage < (targetPercentage - 10) ? 'critical' : 'warning';
    const statusMessage = `Shortage alert! You must attend the next ${classesNeededToRecover} consecutive class${classesNeededToRecover === 1 ? '' : 'es'} to get back to ${targetPercentage}%.`;

    return {
      percentage: Number(percentage.toFixed(1)),
      isSafe: false,
      status,
      safeBunksRemaining: 0,
      classesNeededToRecover,
      statusMessage
    };
  }
}

export interface OverallAttendanceSummary {
  overallPercentage: number;
  totalAttended: number;
  totalHeld: number;
  subjectsInDanger: SubjectAttendance[];
  subjectsBorderline: SubjectAttendance[];
  subjectsSafe: SubjectAttendance[];
}

export function summarizeOverallAttendance(subjects: SubjectAttendance[]): OverallAttendanceSummary {
  let totalAttended = 0;
  let totalHeld = 0;
  const subjectsInDanger: SubjectAttendance[] = [];
  const subjectsBorderline: SubjectAttendance[] = [];
  const subjectsSafe: SubjectAttendance[] = [];

  subjects.forEach(sub => {
    totalAttended += sub.attendedClasses;
    totalHeld += sub.totalClassesHeld;

    const analysis = calculateAttendanceMetrics(sub.attendedClasses, sub.totalClassesHeld, sub.targetPercentage);
    if (!analysis.isSafe) {
      subjectsInDanger.push(sub);
    } else if (analysis.safeBunksRemaining <= 1) {
      subjectsBorderline.push(sub);
    } else {
      subjectsSafe.push(sub);
    }
  });

  const overallPercentage = totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : 100;

  return {
    overallPercentage,
    totalAttended,
    totalHeld,
    subjectsInDanger,
    subjectsBorderline,
    subjectsSafe
  };
}

