import React, { useState } from 'react';
import {
  Star,
  Download,
  Search,
  Plus,
  MessageCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { PeerNote, StudyPartnerPost, StudentProfile } from '../../types';
import { Modal } from '../common/Modal';

interface PeerNotesAndStudyProps {
  notes: PeerNote[];
  studyPartners: StudyPartnerPost[];
  onAddStudyPartner: (post: Omit<StudyPartnerPost, 'id' | 'createdDate'>) => void;
  profile: StudentProfile;
}

export const PeerNotesAndStudy: React.FC<PeerNotesAndStudyProps> = ({
  notes,
  studyPartners,
  onAddStudyPartner,
  profile
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'partners'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [connectPartner, setConnectPartner] = useState<StudyPartnerPost | null>(null);
  const [downloadedNoteId, setDownloadedNoteId] = useState<string | null>(null);

  // New partner post form
  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [preferredMode, setPreferredMode] = useState<'Library 3rd floor' | 'Hostel Common Room' | 'Discord / Google Meet'>('Library 3rd floor');
  const [contactHandle, setContactHandle] = useState('');

  const handleDownloadNote = (noteId: string) => {
    setDownloadedNoteId(noteId);
    setTimeout(() => {
      setDownloadedNoteId(prev => (prev === noteId ? null : prev));
    }, 2500);
  };

  const handlePostPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !goal.trim() || !contactHandle.trim()) return;

    onAddStudyPartner({
      authorName: profile.name,
      department: profile.department.split(' ')[0] || 'CSE',
      semester: profile.semester,
      subject: subject.trim(),
      goal: goal.trim(),
      preferredTime: preferredTime.trim() || 'Flexible hours',
      preferredMode,
      contactHandle: contactHandle.trim()
    });

    setSubject('');
    setGoal('');
    setPreferredTime('');
    setContactHandle('');
    setShowPartnerModal(false);
  };

  const filteredNotes = notes.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) ||
           n.subjectName.toLowerCase().includes(q) ||
           n.subjectCode.toLowerCase().includes(q) ||
           n.tags.some(t => t.toLowerCase().includes(q));
  });

  const filteredPartners = studyPartners.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.subject.toLowerCase().includes(q) ||
           p.goal.toLowerCase().includes(q) ||
           p.authorName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-base-200/80 dark:bg-base-900 border border-ink-200/60 dark:border-ink-700/30 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1.5 px-3.5 rounded-lg font-display text-sub-sm transition-all ${
              activeTab === 'notes'
                ? 'bg-surface-50 dark:bg-surface-800 text-accent-700 dark:text-accent-300 shadow-card'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
          >
            📚 Subject Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-1 py-1.5 px-3.5 rounded-lg font-display text-sub-sm transition-all ${
              activeTab === 'partners'
                ? 'bg-surface-50 dark:bg-surface-800 text-accent-700 dark:text-accent-300 shadow-card'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
          >
            🤝 Study Partners ({studyPartners.length})
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search subject, topic, notes..."
              className="w-full pl-10 pr-3.5 py-2 text-body-sm bg-surface-50 dark:bg-surface-900 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600 transition-all"
            />
          </div>

          {activeTab === 'partners' && (
            <button
              onClick={() => setShowPartnerModal(true)}
              className="btn-accent inline-flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Find Study Buddy</span>
            </button>
          )}
        </div>
      </div>

      {/* Notes View */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => {
            const isDownloaded = downloadedNoteId === note.id;

            return (
              <div
                key={note.id}
                className="card-hover p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge-accent font-mono">
                      {note.subjectCode} • Sem {note.semester}
                    </span>
                    <div className="inline-flex items-center gap-1 text-body-xs font-bold text-warning-600 dark:text-warning-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{note.rating}</span>
                    </div>
                  </div>

                  {/* Note Title — Level 2 Subheading */}
                  <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50 leading-snug">
                    {note.title}
                  </h4>

                  <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1">
                    By {note.authorName} ({note.department})
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-body-xs bg-base-150 dark:bg-base-800 text-ink-600 dark:text-ink-300 rounded-md border border-ink-200/50 dark:border-ink-700/30 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-ink-200/60 dark:border-ink-700/30 flex items-center justify-between gap-2">
                  <span className="text-body-xs text-ink-400">
                    {note.fileSize} • {note.downloads} downloads
                  </span>
                  {isDownloaded ? (
                    <span className="badge-success py-1 px-2.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Saved PDF</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDownloadNote(note.id)}
                      className="btn-accent-outline !px-3 !py-1.5 !text-body-xs inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Study Partners View */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map(partner => (
            <div
              key={partner.id}
              className="card-hover p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-display text-sub-md text-ink-900 dark:text-ink-50">
                    {partner.authorName} ({partner.department})
                  </span>
                  <span className="badge-neutral">
                    Sem {partner.semester}
                  </span>
                </div>

                <div className="font-display text-sub-sm text-accent-700 dark:text-accent-300">
                  Subject: {partner.subject}
                </div>

                <p className="text-body-md text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">
                  🎯 &ldquo;{partner.goal}&rdquo;
                </p>

                <div className="mt-3 space-y-1.5 text-body-xs text-ink-500 dark:text-ink-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 shrink-0" />
                    <span>Preferred Time: {partner.preferredTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 shrink-0" />
                    <span>Location: {partner.preferredMode}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-ink-200/60 dark:border-ink-700/30 flex items-center justify-between gap-2">
                <span className="text-body-xs text-ink-400">Posted on {partner.createdDate}</span>
                <button
                  onClick={() => setConnectPartner(partner)}
                  className="btn-accent !px-3.5 !py-1.5 !text-body-xs inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Details Modal */}
      {connectPartner && (
        <Modal
          isOpen={!!connectPartner}
          onClose={() => setConnectPartner(null)}
          title={`Connect with ${connectPartner.authorName}`}
          subtitle={`Study Buddy for ${connectPartner.subject}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-base-100 dark:bg-base-800/70 rounded-xl border border-ink-200/60 dark:border-ink-700/30 space-y-1.5">
              <span className="text-label uppercase tracking-wider text-ink-400 block">Goal</span>
              <p className="text-body-md text-ink-800 dark:text-ink-100">{connectPartner.goal}</p>
            </div>

            <div className="p-3.5 bg-accent-50 dark:bg-accent-950/40 rounded-xl border border-accent-200 dark:border-accent-800/60 space-y-1">
              <span className="text-label uppercase tracking-wider text-accent-700 dark:text-accent-300 block">Contact Handle</span>
              <div className="font-mono text-sub-lg font-bold text-ink-900 dark:text-ink-50">
                {connectPartner.contactHandle}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConnectPartner(null)}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Post Study Buddy Modal */}
      {showPartnerModal && (
        <Modal
          isOpen={showPartnerModal}
          onClose={() => setShowPartnerModal(false)}
          title="Find a Study Partner or Project Teammate"
          subtitle="Post what you're working on and connect with batchmates"
          maxWidth="md"
        >
          <form onSubmit={handlePostPartnerSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                Subject / Topic
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems Lab 6, DSA Graph algorithms"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
              />
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                What is your goal?
              </label>
              <textarea
                rows={2}
                required
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Solving 2 LeetCode medium questions daily, preparing midsem cheatsheet"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Preferred Time
                </label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  placeholder="e.g. Evenings 6-8 PM"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Preferred Location / Mode
                </label>
                <select
                  value={preferredMode}
                  onChange={e => setPreferredMode(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                >
                  <option value="Library 3rd floor">Library 3rd floor</option>
                  <option value="Hostel Common Room">Hostel Common Room</option>
                  <option value="Discord / Google Meet">Discord / Google Meet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                Your Contact Handle
              </label>
              <input
                type="text"
                required
                value={contactHandle}
                onChange={e => setContactHandle(e.target.value)}
                placeholder="e.g. @arjun_codes (Telegram) or +91 98765 43210 (WhatsApp)"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPartnerModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
              >
                Post Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
