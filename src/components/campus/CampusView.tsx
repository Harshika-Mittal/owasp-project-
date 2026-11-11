import React, { useState } from 'react';
import { Bell, BookOpen, Search, Utensils } from 'lucide-react';
import { CampusNotice, PeerNote, StudyPartnerPost, LostFoundItem, CanteenLocation, MessDayMenu, StudentProfile, CrowdLevel } from '../../types';
import { SmartNoticeBoard } from './SmartNoticeBoard';
import { PeerNotesAndStudy } from './PeerNotesAndStudy';
import { LostAndFound } from './LostAndFound';
import { CanteenCrowdTracker } from './CanteenCrowdTracker';

interface CampusViewProps {
  notices: CampusNotice[];
  onToggleBookmark: (id: string) => void;
  notes: PeerNote[];
  studyPartners: StudyPartnerPost[];
  onAddStudyPartner: (post: Omit<StudyPartnerPost, 'id' | 'createdDate'>) => void;
  lostFoundItems: LostFoundItem[];
  onAddLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'status'>) => void;
  onClaimLostFoundItem: (id: string) => void;
  canteens: CanteenLocation[];
  messMenu: MessDayMenu[];
  onUpdateCrowd: (canteenId: string, level: CrowdLevel, waitMinutes: number) => void;
  profile: StudentProfile;
}

export const CampusView: React.FC<CampusViewProps> = (props) => {
  const [subTab, setSubTab] = useState<'notices' | 'notes' | 'lostfound' | 'canteen'>('notices');

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1 border-b border-ink-200/70 dark:border-ink-700/40 pb-px overflow-x-auto">
        <button
          onClick={() => setSubTab('notices')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all shrink-0 ${
            subTab === 'notices'
              ? 'border-accent-600 dark:border-accent-400 text-accent-700 dark:text-accent-300'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Smart Notice Board (AI Summaries)</span>
          <span className="badge-accent">
            {props.notices.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('notes')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all shrink-0 ${
            subTab === 'notes'
              ? 'border-accent-600 dark:border-accent-400 text-accent-700 dark:text-accent-300'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes & Study Buddy</span>
        </button>

        <button
          onClick={() => setSubTab('lostfound')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all shrink-0 ${
            subTab === 'lostfound'
              ? 'border-accent-600 dark:border-accent-400 text-accent-700 dark:text-accent-300'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Lost & Found Hub</span>
          <span className="badge-danger">
            {props.lostFoundItems.filter(i => i.status !== 'claimed').length} open
          </span>
        </button>

        <button
          onClick={() => setSubTab('canteen')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-md border-b-2 transition-all shrink-0 ${
            subTab === 'canteen'
              ? 'border-accent-600 dark:border-accent-400 text-accent-700 dark:text-accent-300'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Canteen Rush & Mess Menu</span>
          <span className="badge-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            Live
          </span>
        </button>
      </div>

      {subTab === 'notices' && (
        <SmartNoticeBoard
          notices={props.notices}
          onToggleBookmark={props.onToggleBookmark}
        />
      )}

      {subTab === 'notes' && (
        <PeerNotesAndStudy
          notes={props.notes}
          studyPartners={props.studyPartners}
          onAddStudyPartner={props.onAddStudyPartner}
          profile={props.profile}
        />
      )}

      {subTab === 'lostfound' && (
        <LostAndFound
          items={props.lostFoundItems}
          onAddItem={props.onAddLostFoundItem}
          onClaimItem={props.onClaimLostFoundItem}
        />
      )}

      {subTab === 'canteen' && (
        <CanteenCrowdTracker
          canteens={props.canteens}
          messMenu={props.messMenu}
          onUpdateCrowd={props.onUpdateCrowd}
        />
      )}
    </div>
  );
};
