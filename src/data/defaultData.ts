import {
  StudentProfile,
  Expense,
  LentItem,
  ExpenseGroup,
  PlannerEvent,
  SubjectAttendance,
  CampusNotice,
  PeerNote,
  StudyPartnerPost,
  LostFoundItem,
  CanteenLocation,
  MessDayMenu
} from '../types';

export const defaultStudentProfile: StudentProfile = {
  name: "Arjun Verma",
  rollNumber: "22BCSE104",
  department: "Computer Science & Engineering",
  semester: 5,
  defaultTargetAttendance: 75,
  monthlyAllowance: 8500,
  upiId: "arjun.verma@okhdfcbank"
};

export const defaultExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Nescafe Canteen Chai & Cheese Maggi",
    amount: 75,
    category: "canteen",
    date: "2026-11-10",
    paymentMethod: "UPI",
    upiRef: "438910248190",
    note: "Quick snack with Rohan between OS and CN lectures"
  },
  {
    id: "exp-2",
    title: "Operating Systems Lab File Printout & Spiral Binding",
    amount: 140,
    category: "printout",
    date: "2026-11-09",
    paymentMethod: "UPI",
    upiRef: "438872910382",
    note: "Central Xerox counter - 42 pages color graphs"
  },
  {
    id: "exp-3",
    title: "Stationery Shop (Record sheets & Casio battery)",
    amount: 120,
    category: "stationery",
    date: "2026-11-08",
    paymentMethod: "Cash",
    note: "Gate 2 stationery store"
  },
  {
    id: "exp-4",
    title: "Shared Auto to Metro Station",
    amount: 40,
    category: "travel",
    date: "2026-11-08",
    paymentMethod: "UPI",
    note: "Split with batchmates"
  },
  {
    id: "exp-5",
    title: "Hostel Late Night Swiggy Order (Biryani)",
    amount: 320,
    category: "canteen",
    date: "2026-11-07",
    paymentMethod: "UPI",
    note: "Room 304 study session"
  },
  {
    id: "exp-6",
    title: "UPI to Dhruv (Canteen samosa advance)",
    amount: 60,
    category: "upi_transfer",
    date: "2026-11-06",
    paymentMethod: "UPI",
    upiRef: "438620914812"
  },
  {
    id: "exp-7",
    title: "Computer Networks Textbook Second Hand",
    amount: 350,
    category: "academic",
    date: "2026-11-04",
    paymentMethod: "Cash",
    note: "Bought from 4th year senior (Karan)"
  },
  {
    id: "exp-8",
    title: "Hostel Laundry Tokens",
    amount: 90,
    category: "hostel",
    date: "2026-11-02",
    paymentMethod: "UPI"
  }
];

export const defaultLentItems: LentItem[] = [
  {
    id: "lent-1",
    personName: "Rohan Sharma",
    personPhone: "+91 98765 43210",
    amount: 350,
    type: "lent",
    reason: "Late night Zomato pizza split (paid via my UPI)",
    date: "2026-11-05",
    status: "confirmed",
    dueDate: "2026-11-12",
    remindersSent: 1,
    lastRemindedDate: "2026-11-08"
  },
  {
    id: "lent-2",
    personName: "Dhruv Gupta",
    personPhone: "+91 98112 34567",
    amount: 220,
    type: "lent",
    reason: "DBMS Lab Manual & Xerox combo at Main gate",
    date: "2026-11-07",
    status: "pending",
    dueDate: "2026-11-11",
    remindersSent: 0
  },
  {
    id: "lent-3",
    personName: "Priya Nair",
    personPhone: "+91 99234 56789",
    amount: 500,
    type: "lent",
    reason: "Fest T-shirt registration (she forgot GPay PIN)",
    date: "2026-10-29",
    status: "reminded",
    dueDate: "2026-11-05",
    remindersSent: 2,
    lastRemindedDate: "2026-11-09"
  },
  {
    id: "lent-4",
    personName: "Sameer Khan",
    personPhone: "+91 98345 67890",
    amount: 150,
    type: "borrowed", // I owe Sameer
    reason: "Auto fare when my phone battery died",
    date: "2026-11-09",
    status: "confirmed",
    dueDate: "2026-11-15",
    remindersSent: 0
  }
];

export const defaultExpenseGroups: ExpenseGroup[] = [
  {
    id: "grp-1",
    name: "Room 304 Hostel Boys",
    description: "Daily mess extras, late-night munchies, room cleaning supplies, detergent",
    type: "hostel",
    members: [
      { id: "mem-1", name: "Arjun (You)", upiId: "arjun.verma@okhdfcbank" },
      { id: "mem-2", name: "Rohan", upiId: "rohan.sharma@paytm" },
      { id: "mem-3", name: "Dhruv", upiId: "dhruv99@ybl" },
      { id: "mem-4", name: "Kabir", upiId: "kabir.mehta@axis" }
    ],
    expenses: [
      {
        id: "gexp-1",
        groupId: "grp-1",
        description: "Room Wi-Fi & Water Dispenser Refill",
        amount: 800,
        paidByMemberId: "mem-1",
        splitAmongMemberIds: ["mem-1", "mem-2", "mem-3", "mem-4"],
        date: "2026-11-01",
        category: "hostel"
      },
      {
        id: "gexp-2",
        groupId: "grp-1",
        description: "Midnight Domino's Pizza & Cold Drinks",
        amount: 960,
        paidByMemberId: "mem-2",
        splitAmongMemberIds: ["mem-1", "mem-2", "mem-3", "mem-4"],
        date: "2026-11-06",
        category: "canteen"
      },
      {
        id: "gexp-3",
        groupId: "grp-1",
        description: "Blinkit Snacks (Chips, Biscuits, Milk)",
        amount: 450,
        paidByMemberId: "mem-1",
        splitAmongMemberIds: ["mem-1", "mem-2", "mem-3"],
        date: "2026-11-09",
        category: "canteen"
      }
    ]
  },
  {
    id: "grp-2",
    name: "Weekend Manali Getaway",
    description: "Tempo traveler hire, cottage stay, riverside cafe bill",
    type: "trip",
    members: [
      { id: "mem-1", name: "Arjun (You)", upiId: "arjun.verma@okhdfcbank" },
      { id: "mem-2", name: "Rohan" },
      { id: "mem-5", name: "Aman" },
      { id: "mem-6", name: "Tanvi" }
    ],
    expenses: [
      {
        id: "gexp-201",
        groupId: "grp-2",
        description: "Tempo Traveler Advance Booking",
        amount: 4800,
        paidByMemberId: "mem-1",
        splitAmongMemberIds: ["mem-1", "mem-2", "mem-5", "mem-6"],
        date: "2026-11-03",
        category: "travel"
      },
      {
        id: "gexp-202",
        groupId: "grp-2",
        description: "Highway Dhaba Dinner & Tea",
        amount: 1400,
        paidByMemberId: "mem-5",
        splitAmongMemberIds: ["mem-1", "mem-2", "mem-5", "mem-6"],
        date: "2026-11-04",
        category: "canteen"
      }
    ]
  }
];

export const defaultPlannerEvents: PlannerEvent[] = [
  {
    id: "evt-1",
    title: "Operating Systems Lecture (Virtual Memory & Paging)",
    type: "class",
    subjectCode: "CS301",
    location: "Lecture Hall Block B - 302",
    date: "2026-11-11",
    startTime: "09:00",
    endTime: "10:00",
    priority: "high",
    source: "timetable",
    isCompleted: false
  },
  {
    id: "evt-2",
    title: "Database Management Systems Lab",
    type: "lab",
    subjectCode: "CS302L",
    location: "Software Lab 4",
    date: "2026-11-11",
    startTime: "14:00",
    endTime: "16:00",
    priority: "urgent",
    source: "timetable",
    isCompleted: false,
    notes: "Submission of Experiment 6: Normalization & B+ Trees"
  },
  {
    id: "evt-3",
    title: "Robotics Society Hackathon Orientation & Bot Testing",
    type: "society",
    location: "Mechanical Workshop & Seminar Hall 1",
    date: "2026-11-11",
    startTime: "15:00", // CLASH with DBMS Lab!
    endTime: "17:00",
    priority: "medium",
    source: "society_portal",
    isCompleted: false,
    notes: "Mandatory for core team recruits"
  },
  {
    id: "evt-4",
    title: "Computer Networks Assignment 3 (Subnetting & RIP)",
    type: "assignment",
    subjectCode: "CS303",
    location: "Google Classroom Portal",
    date: "2026-11-12",
    startTime: "23:59",
    endTime: "23:59",
    priority: "urgent",
    source: "whatsapp_extracted",
    isCompleted: false,
    notes: "Extracted from CR forward: 'Hard deadline, no extensions permitted by Dr. Sharma'"
  },
  {
    id: "evt-5",
    title: "Annual Tech Fest 'Innovate 2026' Inaugural Talk",
    type: "fest",
    location: "Main Campus Auditorium",
    date: "2026-11-13",
    startTime: "10:30",
    endTime: "12:30",
    priority: "low",
    source: "society_portal",
    isCompleted: false
  },
  {
    id: "evt-6",
    title: "Software Engineering Surprise Quiz Preparation",
    type: "exam",
    subjectCode: "CS304",
    location: "Room 105",
    date: "2026-11-14",
    startTime: "11:00",
    endTime: "12:00",
    priority: "high",
    source: "whatsapp_extracted",
    isCompleted: false
  }
];

export const defaultAttendanceSubjects: SubjectAttendance[] = [
  {
    id: "att-1",
    subjectCode: "CS301",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Rao",
    attendedClasses: 28,
    totalClassesHeld: 34,
    targetPercentage: 75,
    credits: 4,
    color: "#6366f1" // indigo
  },
  {
    id: "att-2",
    subjectCode: "CS302",
    subjectName: "Database Management Systems",
    facultyName: "Prof. Sunita Menon",
    attendedClasses: 26,
    totalClassesHeld: 35, // 74.2% -> In danger zone! (<75%)
    targetPercentage: 75,
    credits: 4,
    color: "#ef4444" // red
  },
  {
    id: "att-3",
    subjectCode: "CS303",
    subjectName: "Computer Networks",
    facultyName: "Dr. K. Sharma",
    attendedClasses: 31,
    totalClassesHeld: 36, // 86.1% -> Safe zone
    targetPercentage: 75,
    credits: 3,
    color: "#10b981" // green
  },
  {
    id: "att-4",
    subjectCode: "CS304",
    subjectName: "Software Engineering & Agile",
    facultyName: "Prof. Rajesh Goel",
    attendedClasses: 22,
    totalClassesHeld: 28, // 78.5% -> Borderline safe
    targetPercentage: 75,
    credits: 3,
    color: "#f59e0b" // amber
  },
  {
    id: "att-5",
    subjectCode: "CS305L",
    subjectName: "Advanced Algorithms Lab",
    facultyName: "Dr. Arvind Rao",
    attendedClasses: 11,
    totalClassesHeld: 12, // 91.6% -> Very safe
    targetPercentage: 75,
    credits: 2,
    color: "#8b5cf6" // purple
  }
];

export const defaultCampusNotices: CampusNotice[] = [
  {
    id: "not-1",
    title: "Mid-Semester Examination Schedule & Admit Card Verification",
    category: "examination",
    department: "Controller of Examinations",
    date: "2026-11-10",
    isImportant: true,
    author: "Dr. V. K. Nambiar (COE)",
    sourceChannel: "Official College ERP Notification",
    aiSummary: "Mid-Sem exams start Nov 24. Clear pending dues and collect verified Admit Cards from the Academic Office before Nov 20 to avoid exam debarment.",
    keyActionDates: ["Admit Card deadline: Nov 20, 2026", "Exams commence: Nov 24, 2026"],
    originalText: "All UG and PG students are hereby notified that the Odd Semester Mid-Term Examinations for the Academic Session 2026-27 will commence from 24th November 2026. Students must verify their student portal for any attendance shortages or pending library/hostel fees. Admit cards will be distributed through respective department HOD offices between 15th to 20th November from 10:00 AM to 4:00 PM. No student shall be admitted to the examination hall without physical verified admit cards."
  },
  {
    id: "not-2",
    title: "Google & Microsoft Campus Internship Drive 2027 Batch Pre-Placement Talk",
    category: "placement",
    department: "Training & Placement Cell",
    date: "2026-11-09",
    isImportant: true,
    author: "Placement Director",
    sourceChannel: "T&P Portal Telegram / Notice",
    aiSummary: "Mandatory PPT for 3rd year CSE/ECE eligible candidates on Nov 14 at 4 PM in Audi 1. Resume freeze cutoff is Nov 12 midnight on Superset portal.",
    keyActionDates: ["Resume freeze: Nov 12, 11:59 PM", "PPT: Nov 14, 4:00 PM (Audi 1)"],
    originalText: "The Training & Placement Cell invites eligible 3rd-year B.Tech students (CSE, IT, ECE with CGPA >= 7.5 and no active backlogs) to the Joint PPT for upcoming Summer 2027 Software Engineering internships. Students must ensure their verified resumes are locked on the Superset portal prior to the deadline. Formal dress code strictly enforced."
  },
  {
    id: "not-3",
    title: "Hostel Geyser & Central Boiler Maintenance Hours",
    category: "hostel",
    department: "Chief Warden Office",
    date: "2026-11-08",
    isImportant: false,
    author: "Chief Warden",
    sourceChannel: "Hostel Notice Board",
    aiSummary: "Morning hot water supply in Hostels 1 to 4 will run strictly from 6:00 AM to 9:30 AM due to scheduled maintenance this week.",
    keyActionDates: ["Maintenance period: Nov 8 - Nov 15"],
    originalText: "Due to routine seasonal maintenance of boilers and solar water heating grids across Boys Hostel 1, 2, 3 and Girls Hostel 1, hot water supply in morning hours is regulated strictly between 06:00 to 09:30 AM. Evening warm water will be available from 06:30 to 08:30 PM."
  },
  {
    id: "not-4",
    title: "Library Book Amnesty & Return Without Fine Week",
    category: "academic",
    department: "Central Library",
    date: "2026-11-07",
    isImportant: false,
    author: "Chief Librarian",
    sourceChannel: "Library Circulation Desk",
    aiSummary: "Return overdue books without any late fees between Nov 10 and Nov 17 at the Central Library main counter.",
    keyActionDates: ["Zero fine window: Nov 10 - Nov 17, 2026"],
    originalText: "In honor of National Book Week, the Central Library announces a 100% fine waiver on all overdue textbooks and reference volumes. Students can return pending books at Counter 2 with zero penalty and renew semester book bank allocations."
  }
];

export const defaultPeerNotes: PeerNote[] = [
  {
    id: "note-1",
    title: "Operating Systems Hand-Written Topper Notes (Virtual Memory, Scheduling & Deadlocks)",
    subjectCode: "CS301",
    subjectName: "Operating Systems",
    semester: 5,
    department: "Computer Science",
    authorName: "Ananya Iyer (9.8 CGPA)",
    rating: 4.9,
    downloads: 342,
    fileSize: "14.2 MB",
    tags: ["Handwritten", "Formula Sheet", "PyQ Solutions", "Semaphore Examples"]
  },
  {
    id: "note-2",
    title: "Computer Networks Short Summary Notes & Protocol Packet Headers Cheatsheet",
    subjectCode: "CS303",
    subjectName: "Computer Networks",
    semester: 5,
    department: "Computer Science",
    authorName: "Karan Singhal",
    rating: 4.8,
    downloads: 215,
    fileSize: "6.8 MB",
    tags: ["TCP/IP", "Subnetting Guide", "Wireshark CheatSheet"]
  },
  {
    id: "note-3",
    title: "DBMS Complete SQL Queries, Normalization & Transaction Concurrency Guide",
    subjectCode: "CS302",
    subjectName: "DBMS",
    semester: 5,
    department: "Computer Science",
    authorName: "Siddharth Sen",
    rating: 4.7,
    downloads: 189,
    fileSize: "8.5 MB",
    tags: ["SQL DDL/DML", "BCNF Proofs", "Lab Experiment Codes"]
  }
];

export const defaultStudyPartners: StudyPartnerPost[] = [
  {
    id: "partner-1",
    authorName: "Meera Sen",
    department: "CSE",
    semester: 5,
    subject: "Computer Networks & Subnetting",
    goal: "Preparing for Mid-sem quiz + resolving numericals together",
    preferredTime: "Every evening 6:00 PM - 8:00 PM",
    preferredMode: "Library 3rd floor",
    contactHandle: "@meera_sen (Telegram) / WhatsApp",
    createdDate: "2026-11-10"
  },
  {
    id: "partner-2",
    authorName: "Kartik Patel",
    department: "ECE / CSE",
    semester: 5,
    subject: "DSA LeetCode Grind",
    goal: "Targeting 2 medium problems daily (Binary Search, DP, Graphs) for summer internships",
    preferredTime: "Night 10:00 PM - 12:00 AM",
    preferredMode: "Discord / Google Meet",
    contactHandle: "kartik_codes#4092 (Discord)",
    createdDate: "2026-11-09"
  },
  {
    id: "partner-3",
    authorName: "Rahul Saxena",
    department: "CSE",
    semester: 5,
    subject: "Operating Systems (Lab 6)",
    goal: "Building POSIX shared memory IPC program",
    preferredTime: "Wednesday afternoon 3:00 PM",
    preferredMode: "Hostel Common Room",
    contactHandle: "+91 99881 23456 (WhatsApp)",
    createdDate: "2026-11-08"
  }
];

export const defaultLostFoundItems: LostFoundItem[] = [
  {
    id: "lf-1",
    type: "lost",
    title: "Casio fx-991EX Scientific Calculator with Blue Sticker",
    category: "calculator",
    location: "Lecture Hall Complex B, 3rd Floor (Room 302)",
    date: "2026-11-10",
    description: "Has a small dark blue NASA sticker on the front sliding lid. Very urgently needed for upcoming mid-sems!",
    contactName: "Tanya Roy",
    contactContact: "+91 98761 09876",
    status: "open",
    reward: "Treat at Nescafe Canteen!"
  },
  {
    id: "lf-2",
    type: "found",
    title: "Student College ID Card & Metro Pass in Leather Pouch",
    category: "id_card",
    location: "Main Canteen Billing Counter near juice counter",
    date: "2026-11-09",
    description: "Belongs to 2nd year student. Has RFID card and Delhi Metro Smart Card inside.",
    contactName: "Sunil (Canteen Staff) / Submitted to Security Desk",
    contactContact: "Security Gate 1 Main Desk",
    securityQuestion: "What is the roll number and lanyard color?",
    status: "open"
  },
  {
    id: "lf-3",
    type: "lost",
    title: "Black Anker 65W Fast Charger & Braided Type-C Cable",
    category: "electronics",
    location: "Central Library Silent Reading Zone, Desk #44",
    date: "2026-11-08",
    description: "Left plugged into floor power strip around 5:30 PM on Sunday evening.",
    contactName: "Aditya Mishra",
    contactContact: "@aditya_mishra (Telegram)",
    status: "open"
  },
  {
    id: "lf-4",
    type: "found",
    title: "Milton Insulated Metal Water Bottle (Matte Olive Green)",
    category: "bottle",
    location: "Basketball Court Bleachers",
    date: "2026-11-07",
    description: "Found after inter-branch tournament match.",
    contactName: "Sports Secretary",
    contactContact: "+91 98450 12345",
    status: "claimed"
  }
];

export const defaultCanteens: CanteenLocation[] = [
  {
    id: "cant-1",
    name: "Main Student Canteen",
    building: "Central Student Activity Centre",
    crowdLevel: "high",
    estimatedWaitMinutes: 20,
    lastUpdated: "5 mins ago",
    peakHours: "1:00 PM - 2:30 PM & 5:00 PM - 6:30 PM",
    openHours: "8:30 AM - 9:30 PM",
    todaySpecial: "Chole Bhature with sweet lassi & Pav Bhaji",
    hourlyRush: [
      { hour: "9 AM", rushPercent: 25 },
      { hour: "11 AM", rushPercent: 40 },
      { hour: "1 PM", rushPercent: 95 },
      { hour: "2 PM", rushPercent: 85 },
      { hour: "4 PM", rushPercent: 50 },
      { hour: "5 PM", rushPercent: 90 },
      { hour: "7 PM", rushPercent: 60 },
      { hour: "9 PM", rushPercent: 35 }
    ]
  },
  {
    id: "cant-2",
    name: "Nescafe Kiosk & Bakery",
    building: "Academic Block 1 Lawn",
    crowdLevel: "moderate",
    estimatedWaitMinutes: 8,
    lastUpdated: "2 mins ago",
    peakHours: "11:00 AM - 11:30 AM & 3:30 PM - 4:15 PM",
    openHours: "8:00 AM - 11:00 PM",
    todaySpecial: "Cold Coffee Frappe with Peri-Peri French Fries",
    hourlyRush: [
      { hour: "9 AM", rushPercent: 30 },
      { hour: "11 AM", rushPercent: 80 },
      { hour: "1 PM", rushPercent: 45 },
      { hour: "3 PM", rushPercent: 75 },
      { hour: "5 PM", rushPercent: 60 },
      { hour: "8 PM", rushPercent: 40 }
    ]
  },
  {
    id: "cant-3",
    name: "Campus Café & Juice Corner",
    building: "Sports Complex Ground Floor",
    crowdLevel: "low",
    estimatedWaitMinutes: 3,
    lastUpdated: "Just now",
    peakHours: "5:30 PM - 7:00 PM",
    openHours: "10:00 AM - 10:00 PM",
    todaySpecial: "Fresh Mosambi & Watermelon Juice + Grilled Paneer Sandwich",
    hourlyRush: [
      { hour: "11 AM", rushPercent: 20 },
      { hour: "1 PM", rushPercent: 35 },
      { hour: "4 PM", rushPercent: 40 },
      { hour: "6 PM", rushPercent: 70 },
      { hour: "8 PM", rushPercent: 30 }
    ]
  },
  {
    id: "cant-4",
    name: "Hostel Night Canteen",
    building: "Hostel Block 3 Courtyard",
    crowdLevel: "low",
    estimatedWaitMinutes: 4,
    lastUpdated: "10 mins ago",
    peakHours: "10:30 PM - 1:30 AM",
    openHours: "8:00 PM - 2:30 AM",
    todaySpecial: "Egg Bhurji, Cheese Paratha & Hot Masala Chai",
    hourlyRush: [
      { hour: "8 PM", rushPercent: 25 },
      { hour: "10 PM", rushPercent: 70 },
      { hour: "11 PM", rushPercent: 95 },
      { hour: "12 AM", rushPercent: 90 },
      { hour: "1 AM", rushPercent: 60 }
    ]
  }
];

export const defaultMessWeeklyMenu: MessDayMenu[] = [
  {
    day: "Monday",
    breakfast: "Aloo Paratha with Curd, Pickle, Boiled Eggs / Banana, Tea/Coffee",
    lunch: "Rajma Masala, Steamed Basmati Rice, Jeera Aloo, Boondi Raita, Chapati",
    snacks: "Samosa with Mint Chutney, Ginger Tea",
    dinner: "Paneer Butter Masala / Chicken Curry, Dal Tadka, Rice, Roti, Gulab Jamun",
    special: "Gulab Jamun (2 pcs)"
  },
  {
    day: "Tuesday",
    breakfast: "Idli Sambar with Coconut Chutney, Vada, Tea/Coffee",
    lunch: "Kadhi Pakoda, Khichdi / Steamed Rice, Aloo Gobhi, Salad, Chapati",
    snacks: "Veg Cutlet with Tomato Ketchup, Tea",
    dinner: "Mix Veg Handi, Dal Makhani, Pulao, Chapati, Kheer",
    special: "Badam Kheer"
  },
  {
    day: "Wednesday (Today)",
    breakfast: "Poha with Roasted Peanuts & Sev, Sprouts, Boiled Egg, Tea/Coffee",
    lunch: "Chole Bhature / Rice with Punjabi Dal, Cucumber Onion Salad, Roti",
    snacks: "Bread Pakoda with Green Chutney, Tea",
    dinner: "Egg Curry / Shahi Paneer, Dal Fry, Jeera Rice, Tandoori Roti, Ice Cream",
    special: "Vanilla Ice Cream Scoop"
  },
  {
    day: "Thursday",
    breakfast: "Uttapam with Tomato Onion Sambhar, Chutney, Fruit, Tea",
    lunch: "Black Chana Masala, Lauki Kofta Curry, Rice, Curd, Chapati",
    snacks: "Bhel Puri / Maggi (rotation), Tea",
    dinner: "Veg Biryani with Mirchi Salan / Chicken Biryani, Raita, Rasgulla",
    special: "Biryani Night"
  },
  {
    day: "Friday",
    breakfast: "Methi Thepla / Poori Bhaji, Boiled Egg / Apple, Tea",
    lunch: "Dal Maharani, Bhindi Masala, Steamed Rice, Papad, Chapati",
    snacks: "Pav Bhaji, Lemonade",
    dinner: "Dum Aloo Kashmiri, Yellow Moong Dal, Jeera Rice, Chapati, Custard",
    special: "Fruit Custard"
  },
  {
    day: "Saturday",
    breakfast: "Masala Dosa with Sambar & Coconut Chutney, Tea",
    lunch: "Yellow Dal Fry, Baingan Bharta / Aloo Shimla Mirch, Rice, Roti",
    snacks: "French Fries / Pakoda, Hot Tea",
    dinner: "Special Paneer Do Pyaza, Dal Tadka, Peas Pulao, Butter Naan, Halwa",
    special: "Moong Dal Halwa"
  },
  {
    day: "Sunday",
    breakfast: "Chole Kulche with Pickled Onions, Fresh Fruit, Tea",
    lunch: "Sunday Special Feast: Matar Paneer, Dal Makhani, Veg Pulao, Roti",
    snacks: "Cookies & Masala Chai",
    dinner: "Light Khichdi, Kadhi, Papad, Achar, Fresh Fruit",
    special: "Sunday Light Comfort Meal"
  }
];

