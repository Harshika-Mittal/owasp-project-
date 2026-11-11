import React, { useState, useEffect } from 'react';
import { 
  defaultStudentProfile, 
  defaultExpenses, 
  defaultLentItems, 
  defaultExpenseGroups, 
  defaultPlannerEvents, 
  defaultAttendanceSubjects, 
  defaultCampusNotices, 
  defaultPeerNotes, 
  defaultStudyPartners, 
  defaultLostFoundItems, 
  defaultCanteens, 
  defaultMessWeeklyMenu 
} from './data/defaultData';
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
  MessDayMenu, 
  ViewMode, 
  GroupExpense,
  CrowdLevel 
} from './types';
import { loadFromStorage, saveToStorage, clearOmniCampusStorage } from './utils/storage';
import { detectScheduleClashes } from './utils/clashDetector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { MoneyView } from './components/money/MoneyView';
import { AcademicsView } from './components/academics/AcademicsView';
import { CampusView } from './components/campus/CampusView';
import { SettingsView } from './components/settings/SettingsView';
import { WhatsAppExtractorModal } from './components/academics/WhatsAppExtractorModal';

export const App: React.FC = () => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return loadFromStorage('dark_mode', false);
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWhatsAppExtractorOpen, setIsWhatsAppExtractorOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return loadFromStorage('profile', defaultStudentProfile);
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    return loadFromStorage('expenses', defaultExpenses);
  });

  const [lentItems, setLentItems] = useState<LentItem[]>(() => {
    return loadFromStorage('lent_items', defaultLentItems);
  });

  const [groups, setGroups] = useState<ExpenseGroup[]>(() => {
    return loadFromStorage('groups', defaultExpenseGroups);
  });

  const [events, setEvents] = useState<PlannerEvent[]>(() => {
    return loadFromStorage('events', defaultPlannerEvents);
  });

  const [subjects, setSubjects] = useState<SubjectAttendance[]>(() => {
    return loadFromStorage('subjects', defaultAttendanceSubjects);
  });

  const [notices, setNotices] = useState<CampusNotice[]>(() => {
    return loadFromStorage('notices', defaultCampusNotices);
  });

  const [notes, setNotes] = useState<PeerNote[]>(() => {
    return loadFromStorage('notes', defaultPeerNotes);
  });

  const [studyPartners, setStudyPartners] = useState<StudyPartnerPost[]>(() => {
    return loadFromStorage('study_partners', defaultStudyPartners);
  });

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => {
    return loadFromStorage('lost_found', defaultLostFoundItems);
  });

  const [canteens, setCanteens] = useState<CanteenLocation[]>(() => {
    return loadFromStorage('canteens', defaultCanteens);
  });

  const [messMenu, setMessMenu] = useState<MessDayMenu[]>(() => {
    return loadFromStorage('mess_menu', defaultMessWeeklyMenu);
  });

  // Sync to localStorage
  useEffect(() => { saveToStorage('dark_mode', darkMode); }, [darkMode]);
  useEffect(() => { saveToStorage('profile', profile); }, [profile]);
  useEffect(() => { saveToStorage('expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('lent_items', lentItems); }, [lentItems]);
  useEffect(() => { saveToStorage('groups', groups); }, [groups]);
  useEffect(() => { saveToStorage('events', events); }, [events]);
  useEffect(() => { saveToStorage('subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('notices', notices); }, [notices]);
  useEffect(() => { saveToStorage('notes', notes); }, [notes]);
  useEffect(() => { saveToStorage('study_partners', studyPartners); }, [studyPartners]);
  useEffect(() => { saveToStorage('lost_found', lostFoundItems); }, [lostFoundItems]);
  useEffect(() => { saveToStorage('canteens', canteens); }, [canteens]);

  // Dark mode effect on root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Computed Indicators
  const pendingLentItems = lentItems.filter(i => i.type === 'lent' && i.status !== 'settled');
  const pendingRecoveryAmount = pendingLentItems.reduce((acc, curr) => acc + curr.amount, 0);
  const clashes = detectScheduleClashes(events);
  const dangerSubjectsCount = subjects.filter(s => (s.attendedClasses / s.totalClassesHeld) * 100 < s.targetPercentage).length;

  // Handlers: Money
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleAddLentItem = (itemData: Omit<LentItem, 'id' | 'remindersSent'>) => {
    const newItem: LentItem = {
      ...itemData,
      id: `lent-${Date.now()}`,
      remindersSent: 0
    };
    setLentItems(prev => [newItem, ...prev]);
  };

  const handleSettleItem = (id: string) => {
    setLentItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'settled',
          settledDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const handleUpdateReminderStatus = (id: string) => {
    setLentItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'reminded',
          remindersSent: item.remindersSent + 1,
          lastRemindedDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const handleAddGroup = (newGroup: ExpenseGroup) => {
    setGroups(prev => [...prev, newGroup]);
  };

  const handleAddGroupExpense = (groupId: string, expenseData: Omit<GroupExpense, 'id'>) => {
    const newGroupExpense: GroupExpense = {
      ...expenseData,
      id: `gexp-${Date.now()}`
    };
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          expenses: [newGroupExpense, ...g.expenses]
        };
      }
      return g;
    }));
  };

  // Handlers: Academics
  const handleAddEvent = (eventData: Omit<PlannerEvent, 'id'>) => {
    const newEvent: PlannerEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleAddMultipleEvents = (newEventsData: Omit<PlannerEvent, 'id'>[]) => {
    const newItems: PlannerEvent[] = newEventsData.map((d, idx) => ({
      ...d,
      id: `evt-${Date.now()}-${idx}`
    }));
    setEvents(prev => [...prev, ...newItems]);
  };

  const handleToggleComplete = (id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, isCompleted: !e.isCompleted };
      }
      return e;
    }));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateSubjectAttendance = (id: string, attendedDelta: number, heldDelta: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const attended = Math.max(0, s.attendedClasses + attendedDelta);
        const held = Math.max(attended, s.totalClassesHeld + heldDelta);
        return {
          ...s,
          attendedClasses: attended,
          totalClassesHeld: held
        };
      }
      return s;
    }));
  };

  // Handlers: Campus
  const handleToggleNoticeBookmark = (id: string) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, isBookmarked: !n.isBookmarked };
      }
      return n;
    }));
  };

  const handleAddStudyPartner = (postData: Omit<StudyPartnerPost, 'id' | 'createdDate'>) => {
    const newPost: StudyPartnerPost = {
      ...postData,
      id: `partner-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setStudyPartners(prev => [newPost, ...prev]);
  };

  const handleAddLostFoundItem = (itemData: Omit<LostFoundItem, 'id' | 'status'>) => {
    const newItem: LostFoundItem = {
      ...itemData,
      id: `lf-${Date.now()}`,
      status: 'open'
    };
    setLostFoundItems(prev => [newItem, ...prev]);
  };

  const handleClaimLostFoundItem = (id: string) => {
    setLostFoundItems(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, status: 'claimed' };
      }
      return i;
    }));
  };

  const handleUpdateCanteenCrowd = (canteenId: string, level: CrowdLevel, waitMinutes: number) => {
    setCanteens(prev => prev.map(c => {
      if (c.id === canteenId) {
        return {
          ...c,
          crowdLevel: level,
          estimatedWaitMinutes: waitMinutes,
          lastUpdated: 'Just now (student verified)'
        };
      }
      return c;
    }));
  };

  // Handlers: Backup & Export
  const handleExportData = () => {
    const backup = {
      profile,
      expenses,
      lentItems,
      groups,
      events,
      subjects,
      notices,
      notes,
      studyPartners,
      lostFoundItems,
      canteens,
      messMenu,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `omnicampus-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.expenses) setExpenses(parsed.expenses);
          if (parsed.lentItems) setLentItems(parsed.lentItems);
          if (parsed.groups) setGroups(parsed.groups);
          if (parsed.events) setEvents(parsed.events);
          if (parsed.subjects) setSubjects(parsed.subjects);
          if (parsed.notices) setNotices(parsed.notices);
          if (parsed.lostFoundItems) setLostFoundItems(parsed.lostFoundItems);
          alert("OmniCampus data restored successfully from backup!");
        } catch (err) {
          alert("Invalid JSON backup file format.");
        }
      };
    }
  };

  const handleResetData = () => {
    if (confirm("Reset all data back to the default smart campus demo data?")) {
      clearOmniCampusStorage();
      setProfile(defaultStudentProfile);
      setExpenses(defaultExpenses);
      setLentItems(defaultLentItems);
      setGroups(defaultExpenseGroups);
      setEvents(defaultPlannerEvents);
      setSubjects(defaultAttendanceSubjects);
      setNotices(defaultCampusNotices);
      setNotes(defaultPeerNotes);
      setStudyPartners(defaultStudyPartners);
      setLostFoundItems(defaultLostFoundItems);
      setCanteens(defaultCanteens);
      setMessMenu(defaultMessWeeklyMenu);
      alert("App data reset to default demo successfully!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 dark:bg-base-950 text-ink-800 dark:text-ink-100 transition-colors">
      {/* Top Navbar */}
      <Header
        profile={profile}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenQuickSearch={() => setIsSearchOpen(true)}
        pendingLentCount={pendingLentItems.length}
        clashesCount={clashes.length}
        dangerSubjectsCount={dangerSubjectsCount}
      />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          pendingRecoveryAmount={pendingRecoveryAmount}
          clashesCount={clashes.length}
        />

        {/* View Space Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              profile={profile}
              expenses={expenses}
              lentItems={lentItems}
              events={events}
              subjects={subjects}
              notices={notices}
              canteens={canteens}
              onNavigate={setCurrentView}
              onOpenWhatsAppExtractor={() => setIsWhatsAppExtractorOpen(true)}
              onQuickLogExpense={(title, amount) => handleAddExpense({
                title,
                amount,
                category: 'canteen',
                paymentMethod: 'UPI',
                date: new Date().toISOString().split('T')[0]
              })}
            />
          )}

          {currentView === 'money' && (
            <MoneyView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              lentItems={lentItems}
              onAddLentItem={handleAddLentItem}
              onSettleItem={handleSettleItem}
              onUpdateReminderStatus={handleUpdateReminderStatus}
              groups={groups}
              onAddGroup={handleAddGroup}
              onAddGroupExpense={handleAddGroupExpense}
              profile={profile}
            />
          )}

          {currentView === 'academics' && (
            <AcademicsView
              events={events}
              onAddEvent={handleAddEvent}
              onAddMultipleEvents={handleAddMultipleEvents}
              onToggleComplete={handleToggleComplete}
              onDeleteEvent={handleDeleteEvent}
              subjects={subjects}
              onUpdateSubjectAttendance={handleUpdateSubjectAttendance}
              profile={profile}
            />
          )}

          {currentView === 'campus' && (
            <CampusView
              notices={notices}
              onToggleBookmark={handleToggleNoticeBookmark}
              notes={notes}
              studyPartners={studyPartners}
              onAddStudyPartner={handleAddStudyPartner}
              lostFoundItems={lostFoundItems}
              onAddLostFoundItem={handleAddLostFoundItem}
              onClaimLostFoundItem={handleClaimLostFoundItem}
              canteens={canteens}
              messMenu={messMenu}
              onUpdateCrowd={handleUpdateCanteenCrowd}
              profile={profile}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette / Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        expenses={expenses}
        events={events}
        notices={notices}
        notes={notes}
        onNavigate={setCurrentView}
      />

      {/* Standalone WhatsApp Extractor Modal */}
      <WhatsAppExtractorModal
        isOpen={isWhatsAppExtractorOpen}
        onClose={() => setIsWhatsAppExtractorOpen(false)}
        onAddEvents={handleAddMultipleEvents}
      />
    </div>
  );
};
export default App;

