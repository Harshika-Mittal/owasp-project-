import { ExpenseCategory, PlannerEvent, PriorityLevel, EventType } from '../types';

export interface ParsedUpiExpense {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  upiRef?: string;
  rawText: string;
}

export function parseUpiSms(rawText: string): ParsedUpiExpense | null {
  const text = rawText.trim();
  if (!text) return null;

  // Extract amount: Rs. 140 or INR 140 or Rs 140.00 or ₹140
  const amountMatch = text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i) || 
                      text.match(/debited by\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                      text.match(/paid\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  
  let amount = 0;
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Extract recipient / merchant
  let merchant = "Campus Merchant";
  const toMatch = text.match(/(?:to|vpa|paid to|sent to|at)\s+([A-Za-z0-9&@.\-_ ]+?)(?:\s+on|\s+ref|\s+upi|\s+for|\.|$)/i);
  if (toMatch && toMatch[1]) {
    merchant = toMatch[1].trim().replace(/\b(the|a|an)\b/gi, '').trim();
    if (merchant.length > 35) merchant = merchant.substring(0, 35);
  }

  // Extract UPI Ref / UTR
  let upiRef: string | undefined;
  const refMatch = text.match(/(?:ref(?:erence)?\s*(?:no\.?|num)?|utr|txn\s*id)\s*[:=]?\s*([A-Za-z0-9]{8,18})/i);
  if (refMatch && refMatch[1]) {
    upiRef = refMatch[1];
  }

  // Infer category from merchant keywords
  let category: ExpenseCategory = 'misc';
  const lower = text.toLowerCase();

  if (lower.includes('canteen') || lower.includes('nescafe') || lower.includes('maggi') || 
      lower.includes('swiggy') || lower.includes('zomato') || lower.includes('food') || 
      lower.includes('cafe') || lower.includes('dhaba') || lower.includes('chai') || lower.includes('coffee')) {
    category = 'canteen';
  } else if (lower.includes('print') || lower.includes('xerox') || lower.includes('binding') || lower.includes('photocopy')) {
    category = 'printout';
  } else if (lower.includes('stationery') || lower.includes('book') || lower.includes('pen') || lower.includes('register') || lower.includes('calculator')) {
    category = 'stationery';
  } else if (lower.includes('auto') || lower.includes('uber') || lower.includes('ola') || lower.includes('metro') || lower.includes('bus') || lower.includes('rickshaw')) {
    category = 'travel';
  } else if (lower.includes('hostel') || lower.includes('mess') || lower.includes('laundry') || lower.includes('room') || lower.includes('rent')) {
    category = 'hostel';
  } else if (lower.includes('fee') || lower.includes('exam') || lower.includes('college') || lower.includes('lab') || lower.includes('tuition')) {
    category = 'academic';
  } else if (lower.includes('upi') || lower.includes('transfer') || lower.includes('sent to')) {
    category = 'upi_transfer';
  }

  const today = new Date().toISOString().split('T')[0];

  return {
    title: merchant ? `${merchant}` : "Campus Expense",
    amount: amount || 50,
    category,
    date: today,
    upiRef,
    rawText
  };
}

export interface ParsedWhatsAppEvent {
  title: string;
  type: EventType;
  subjectCode?: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: PriorityLevel;
  notes: string;
  detectedSubject?: string;
}

export function parseWhatsAppMessage(message: string): ParsedWhatsAppEvent[] {
  const lines = message.split('\n').filter(l => l.trim().length > 0);
  const events: ParsedWhatsAppEvent[] = [];
  const today = new Date();

  // Helper date resolver
  const resolveTargetDate = (text: string): string => {
    const lower = text.toLowerCase();
    const d = new Date(today);
    
    if (lower.includes('today')) {
      return d.toISOString().split('T')[0];
    }
    if (lower.includes('tomorrow')) {
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    }
    
    // Day of week match
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (lower.includes(days[i])) {
        const currentDay = d.getDay();
        let diff = i - currentDay;
        if (diff <= 0) diff += 7; // next occurring day
        d.setDate(d.getDate() + diff);
        return d.toISOString().split('T')[0];
      }
    }

    // Specific date format like 14 Nov, 14/11, Nov 14
    const dateMatch = lower.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(nov|dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct)/i);
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const monthNames: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const month = monthNames[dateMatch[2].toLowerCase().substring(0, 3)] ?? today.getMonth();
      const specificDate = new Date(today.getFullYear(), month, day);
      return specificDate.toISOString().split('T')[0];
    }

    // Default 2 days from now
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  // Helper time resolver
  const resolveTime = (text: string): { startTime: string; endTime: string } => {
    const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? timeMatch[2] : '00';
      const meridian = timeMatch[3].toLowerCase();
      if (meridian === 'pm' && hours < 12) hours += 12;
      if (meridian === 'am' && hours === 12) hours = 0;
      const formattedHours = hours.toString().padStart(2, '0');
      const start = `${formattedHours}:${minutes}`;
      const endHours = Math.min(23, hours + 1).toString().padStart(2, '0');
      return { startTime: start, endTime: `${endHours}:${minutes}` };
    }

    if (text.toLowerCase().includes('midnight') || text.toLowerCase().includes('11:59')) {
      return { startTime: '23:59', endTime: '23:59' };
    }

    return { startTime: '10:00', endTime: '11:00' };
  };

  // Check subjects
  const knownSubjects: Record<string, { code: string; name: string }> = {
    'os': { code: 'CS301', name: 'Operating Systems' },
    'operating system': { code: 'CS301', name: 'Operating Systems' },
    'dbms': { code: 'CS302', name: 'Database Management Systems' },
    'database': { code: 'CS302', name: 'Database Management Systems' },
    'cn': { code: 'CS303', name: 'Computer Networks' },
    'network': { code: 'CS303', name: 'Computer Networks' },
    'se': { code: 'CS304', name: 'Software Engineering' },
    'algo': { code: 'CS305L', name: 'Algorithms Lab' },
    'lab': { code: 'LAB', name: 'Practical Lab' }
  };

  const inferSubject = (text: string) => {
    const lower = text.toLowerCase();
    for (const key of Object.keys(knownSubjects)) {
      if (lower.includes(key)) {
        return knownSubjects[key];
      }
    }
    return { code: 'GEN', name: 'General Course' };
  };

  // If text contains multiple sentences or bullet points, extract individual items
  const chunks = message.split(/(?:\r?\n)+|(?<=\.)\s+(?=[A-Z0-9])/);

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (trimmed.length < 10) continue;
    const lower = trimmed.toLowerCase();

    // Determine type
    let type: EventType = 'assignment';
    if (lower.includes('lab') || lower.includes('file submission') || lower.includes('experiment')) {
      type = 'lab';
    } else if (lower.includes('quiz') || lower.includes('midsem') || lower.includes('exam') || lower.includes('test')) {
      type = 'exam';
    } else if (lower.includes('society') || lower.includes('club') || lower.includes('workshop') || lower.includes('hackathon')) {
      type = 'society';
    } else if (lower.includes('fest') || lower.includes('orientation') || lower.includes('cultural')) {
      type = 'fest';
    } else if (lower.includes('lecture') || lower.includes('class') || lower.includes('extra class')) {
      type = 'class';
    }

    // Determine priority
    let priority: PriorityLevel = 'medium';
    if (lower.includes('urgent') || lower.includes('mandatory') || lower.includes('strict') || lower.includes('must submit') || lower.includes('exam') || lower.includes('no extension')) {
      priority = 'urgent';
    } else if (lower.includes('important') || lower.includes('lab') || lower.includes('graded')) {
      priority = 'high';
    } else if (lower.includes('optional') || lower.includes('fest')) {
      priority = 'low';
    }

    const { startTime, endTime } = resolveTime(trimmed);
    const date = resolveTargetDate(trimmed);
    const subInfo = inferSubject(trimmed);

    // Clean title
    let title = trimmed.replace(/^(CR note:|Notice:|Attention:|Dear students,|Guys,|Guys|Reminder:)\s*/i, '');
    if (title.length > 55) {
      title = title.substring(0, 52) + '...';
    }

    events.push({
      title,
      type,
      subjectCode: subInfo.code,
      detectedSubject: subInfo.name,
      date,
      startTime,
      endTime,
      priority,
      notes: `Extracted from chat: "${trimmed.substring(0, 100)}..."`
    });
  }

  // If no detailed chunks split, treat the full message as 1 event
  if (events.length === 0 && message.trim().length > 0) {
    const { startTime, endTime } = resolveTime(message);
    const date = resolveTargetDate(message);
    const subInfo = inferSubject(message);
    events.push({
      title: message.substring(0, 45) + '...',
      type: 'assignment',
      subjectCode: subInfo.code,
      detectedSubject: subInfo.name,
      date,
      startTime,
      endTime,
      priority: 'high',
      notes: message
    });
  }

  return events;
}

