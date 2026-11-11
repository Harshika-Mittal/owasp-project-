export type ViewMode = 'dashboard' | 'money' | 'academics' | 'campus' | 'settings';

// =================== MONEY MODULE ===================
export type ExpenseCategory = 
  | 'canteen' 
  | 'stationery' 
  | 'printout' 
  | 'travel' 
  | 'hostel' 
  | 'upi_transfer' 
  | 'academic' 
  | 'misc';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string or YYYY-MM-DD
  paymentMethod: 'UPI' | 'Cash' | 'Card';
  note?: string;
  upiRef?: string;
}

export type DebtStatus = 'pending' | 'confirmed' | 'reminded' | 'settled';

export interface LentItem {
  id: string;
  personName: string;
  personPhone?: string;
  amount: number;
  type: 'lent' | 'borrowed'; // lent = they owe me; borrowed = I owe them
  reason: string;
  date: string;
  status: DebtStatus;
  dueDate?: string;
  remindersSent: number;
  lastRemindedDate?: string;
  settledDate?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  phone?: string;
  upiId?: string;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidByMemberId: string;
  splitAmongMemberIds: string[];
  date: string;
  category: ExpenseCategory;
}

export interface ExpenseGroup {
  id: string;
  name: string;
  description: string;
  type: 'hostel' | 'trip' | 'food' | 'project';
  members: GroupMember[];
  expenses: GroupExpense[];
}

export interface Settlement {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

// =================== ACADEMICS & TIME MODULE ===================
export type EventType = 'class' | 'lab' | 'assignment' | 'exam' | 'society' | 'fest';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface PlannerEvent {
  id: string;
  title: string;
  type: EventType;
  subjectCode?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  priority: PriorityLevel;
  source: 'timetable' | 'whatsapp_extracted' | 'manual' | 'society_portal';
  isCompleted?: boolean;
  notes?: string;
}

export interface EventClash {
  event1: PlannerEvent;
  event2: PlannerEvent;
  clashReason: string;
  suggestedAction: string;
}

export interface SubjectAttendance {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  attendedClasses: number;
  totalClassesHeld: number;
  targetPercentage: number; // usually 75%
  credits: number;
  color: string;
}

// =================== CAMPUS INFORMATION MODULE ===================
export type NoticeCategory = 'academic' | 'examination' | 'placement' | 'hostel' | 'society' | 'admin';

export interface CampusNotice {
  id: string;
  title: string;
  category: NoticeCategory;
  department: string;
  date: string;
  originalText: string;
  aiSummary: string; // 2-sentence capsule summary
  keyActionDates?: string[];
  isImportant: boolean;
  isBookmarked?: boolean;
  author: string;
  sourceChannel: string; // e.g. "College ERP", "Dean Academics Circ.", "Placement Cell"
}

export interface PeerNote {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  department: string;
  authorName: string;
  rating: number; // 1-5
  downloads: number;
  fileSize: string;
  tags: string[];
  previewUrl?: string;
}

export interface StudyPartnerPost {
  id: string;
  authorName: string;
  department: string;
  semester: number;
  subject: string;
  goal: string; // e.g. "Prepping for Mid-Sem", "LeetCode Graph Algorithms"
  preferredTime: string;
  preferredMode: 'Library 3rd floor' | 'Hostel Common Room' | 'Discord / Google Meet';
  contactHandle: string; // Discord / WhatsApp / Telegram
  createdDate: string;
}

export type LostFoundType = 'lost' | 'found';
export type ItemCategory = 'id_card' | 'electronics' | 'keys' | 'bottle' | 'calculator' | 'stationery' | 'bag' | 'other';
export type ItemStatus = 'open' | 'claimed' | 'resolved';

export interface LostFoundItem {
  id: string;
  type: LostFoundType;
  title: string;
  category: ItemCategory;
  location: string;
  date: string;
  description: string;
  contactContact: string;
  contactName: string;
  securityQuestion?: string; // For verification before returning
  status: ItemStatus;
  reward?: string;
}

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'peak';

export interface CanteenLocation {
  id: string;
  name: string;
  building: string;
  crowdLevel: CrowdLevel;
  estimatedWaitMinutes: number;
  lastUpdated: string;
  peakHours: string;
  openHours: string;
  todaySpecial: string;
  hourlyRush: { hour: string; rushPercent: number }[];
}

export interface MessDayMenu {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  special?: string;
}

// =================== USER PROFILE ===================
export interface StudentProfile {
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  defaultTargetAttendance: number;
  monthlyAllowance: number;
  upiId: string;
}

