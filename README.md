# OmniCampus — Smart Campus & Student Life OS

> **A unified student life dashboard built to eliminate everyday student friction across Money, Time & Academics, and Campus Community.**

Students face several everyday problems that are small on their own but add up to a lot of stress, lost money, and lost time. **OmniCampus** addresses every one of these challenges in a single, high-performance web application.

---

## 🎯 Problem Statement & Solution Mapping

### 1. 💰 MONEY & EXPENSES
| Problem | OmniCampus Solution |
| :--- | :--- |
| **No visibility on spending**: Small frequent payments (canteen chai, UPI, stationery, Xerox, auto) drain allowances without a trace. | **Smart Expense Tracker & Budget Gauge**: Categorized logging with 1-tap quick presets ("Chai & Samosa ₹35", "Lab manual printout ₹45"), monthly allowance progress bar, and an automated **UPI SMS Parser** that extracts amount, merchant, and category from bank SMS texts. |
| **Lent money is hard to recover**: Informal loans between friends lack records, and asking for repayment feels awkward, so students eat the loss. | **Confirmed IOU Debt Ledger & Polite Reminder Generator**: Tracks who owes you money with status confirmation. Features an automated reminder generator with **3 student-friendly calibrated tones** (Chill Buddy, Direct UPI QR, Gentle Month-End) with 1-click **Copy Message** and direct **Open in WhatsApp** links. |
| **Group expenses are messy**: On hostel trips, late-night Swiggy orders, and room essentials, one person pays and has to chase everyone. | **Group Expense Splitter (Splitwise-style)**: Create groups (Hostel Flat, Trips, Projects), multi-member splits, and an automated **simplified debt algorithm** that reduces complex webs of debt into the minimum direct payments. |

---

### 2. ⏳ TIME & ACADEMICS
| Problem | OmniCampus Solution |
| :--- | :--- |
| **Event overload & clashes**: Fests, society workshops, lab files, and exams overlap without warning. | **Unified Planner with Clash Detection Engine**: Single agenda combining lectures, labs, submissions, exams, and society events. Automatically detects overlapping time intervals on the same day and suggests academic-priority conflict resolutions. |
| **Timetable & deadline chaos**: CR notes, tutorial submissions, and quiz reschedules are buried in noisy WhatsApp forwards. | **WhatsApp Forward & Notice Extractor**: Paste raw forwarded messages from class WhatsApp groups. The smart parser extracts titles, subjects, dates (e.g. "tomorrow 3pm", "this Friday 4pm"), times, and urgency levels into your schedule with 1 tap. |
| **Attendance anxiety**: Students don't know how many classes they can safely bunk before falling below the 75% shortage limit. | **Safe Bunk & Recovery Calculator**: Per-subject tracking with exact mathematical limits: calculates how many classes you can safely *bunk* without dropping below 75%, or if in shortage, how many consecutive classes you must *attend* to recover. Includes an interactive **"What-If" slider simulator**. |

---

### 3. 🏛️ CAMPUS INFORMATION & COMMUNITY
| Problem | OmniCampus Solution |
| :--- | :--- |
| **Important notices buried**: Circulars get lost under hundreds of group chats. | **Smart Notice Board with AI 2-Line Capsules**: Searchable and categorized by Exams, Placement, Hostel, and Academics. Generates concise 2-sentence key takeaways with highlighted action dates and bookmarking. |
| **Finding good notes & study partners is hard**: Scrambling for topper notes or finding people to prepare for midsems or DSA. | **Peer Notes & Study Partner Discovery**: Subject-wise notes repository with ratings and downloads, plus a matchmaking board where students post study requests (e.g. LeetCode grind, lab partners) with preferred locations (Library / Discord / Hostel). |
| **Lost valuables hard to recover**: Lost ID cards, scientific calculators, chargers, and bottles. | **Campus Lost & Found Hub**: Filter by category, location, and lost vs found. Includes an **Anti-Fraud Security Question modal** (e.g. verifying sticker or roll number) before claim verification. |
| **Canteen & mess crowding**: Unpredictable queues waste 20-30 minutes between lectures. | **Live Canteen Rush Meter & Mess Menu**: Real-time queue wait-time indicators (🟢 <3 mins, 🟡 8-12 mins, 🔴 20+ mins), peak hour hourly trend graphs, student crowdsourced live check-in, and the full weekly hostel mess menu with today's special. |

---

## 🧮 Mathematical Formulations

### Safe Bunk Attendance Formula
Let:
- $A$ = Classes attended so far
- $H$ = Total classes held so far
- $T$ = Target attendance ratio (e.g., $0.75$ for 75%)

**Case 1: Currently Safe ($A / H \ge T$)**
$$\text{Safe Bunks Remaining} = \left\lfloor \frac{A - T \cdot H}{T} \right\rfloor$$

**Case 2: Shortage Deficit ($A / H < T$)**
$$\text{Consecutive Classes to Attend} = \left\lceil \frac{T \cdot H - A}{1 - T} \right\rceil$$

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v24+)
- npm

### Installation & Launch
```bash
# Clone or open project directory
cd "owasp project"

# Install dependencies (already installed)
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore OmniCampus!

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark mode & responsive breakpoints
- **Icons**: Lucide React
- **State & Storage**: Browser LocalStorage engine with JSON export, import, and demo reset
- **Bundler**: Vite 6
- **Architecture**: Modular component architecture with clean separation between Money, Academics, Campus Community, and Dashboard modules.

