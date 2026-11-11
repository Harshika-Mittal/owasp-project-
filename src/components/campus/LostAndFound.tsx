import React, { useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { LostFoundItem, LostFoundType, ItemCategory } from '../../types';
import { Modal } from '../common/Modal';

interface LostAndFoundProps {
  items: LostFoundItem[];
  onAddItem: (item: Omit<LostFoundItem, 'id' | 'status'>) => void;
  onClaimItem: (id: string) => void;
}

export const LostAndFound: React.FC<LostAndFoundProps> = ({
  items,
  onAddItem,
  onClaimItem
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [claimModalItem, setClaimModalItem] = useState<LostFoundItem | null>(null);
  const [verificationAnswer, setVerificationAnswer] = useState('');

  // Form states
  const [reportType, setReportType] = useState<LostFoundType>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('calculator');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactContact, setContactContact] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [reward, setReward] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) return;

    onAddItem({
      type: reportType,
      title: title.trim(),
      category,
      location: location.trim(),
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      contactName: contactName.trim() || 'Anonymous Student',
      contactContact: contactContact.trim() || 'Campus Security Desk',
      securityQuestion: securityQuestion.trim() || undefined,
      reward: reward.trim() || undefined
    });

    setTitle('');
    setLocation('');
    setDescription('');
    setContactName('');
    setContactContact('');
    setSecurityQuestion('');
    setReward('');
    setShowAddModal(false);
  };

  const handleConfirmClaim = () => {
    if (!claimModalItem) return;
    onClaimItem(claimModalItem.id);
    setClaimModalItem(null);
    setVerificationAnswer('');
  };

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) ||
             item.location.toLowerCase().includes(q) ||
             item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const categoryLabels: Record<ItemCategory, string> = {
    id_card: 'College ID Card',
    calculator: 'Scientific Calculator',
    electronics: 'Charger / Earbuds',
    bottle: 'Water Bottle',
    keys: 'Room / Bike Keys',
    stationery: 'Notebooks / Files',
    bag: 'Bag / Pouch',
    other: 'Other Item'
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type toggle */}
        <div className="inline-flex p-1 bg-base-200/80 dark:bg-base-900 border border-ink-200/60 dark:border-ink-700/30 rounded-xl max-w-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              filterType === 'all'
                ? 'bg-surface-50 dark:bg-surface-800 text-accent-700 dark:text-accent-300 shadow-card'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterType('lost')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              filterType === 'lost'
                ? 'bg-surface-50 dark:bg-surface-800 text-danger-600 dark:text-danger-500 shadow-card'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
          >
            🔍 Lost
          </button>
          <button
            onClick={() => setFilterType('found')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              filterType === 'found'
                ? 'bg-surface-50 dark:bg-surface-800 text-success-600 dark:text-success-500 shadow-card'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
          >
            ✨ Found
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search calculator, bottle, ID card..."
              className="w-full pl-10 pr-3.5 py-2 text-body-sm bg-surface-50 dark:bg-surface-900 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600 transition-all"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-accent inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Item</span>
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="card col-span-full p-10 text-center text-body-md text-ink-400">
            No items reported in this section.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-5 flex flex-col justify-between gap-4 ${
                item.status === 'claimed'
                  ? 'card opacity-65'
                  : item.type === 'lost'
                    ? 'card-hover border-l-4 border-l-danger-500'
                    : 'card-hover border-l-4 border-l-success-500'
              }`}
            >
              <div>
                {/* Status badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={item.type === 'lost' ? 'badge-danger' : 'badge-success'}>
                      {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </span>

                    <span className="text-body-xs font-medium text-ink-400">
                      {categoryLabels[item.category]}
                    </span>
                  </div>

                  {item.status === 'claimed' && (
                    <span className="badge-neutral">
                      Claimed
                    </span>
                  )}
                </div>

                {/* Item Title — Level 2 Subheading */}
                <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50 leading-snug">
                  {item.title}
                </h4>

                {/* Description — Level 3 Body */}
                <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 space-y-1.5 text-body-xs text-ink-500 dark:text-ink-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-danger-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                    <span>Reported: {item.date}</span>
                  </div>
                </div>

                {item.reward && (
                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-500 rounded-xl text-body-xs font-semibold border border-warning-100 dark:border-warning-500/20">
                    <Gift className="w-3.5 h-3.5 text-warning-600 dark:text-warning-500 shrink-0" />
                    <span>Reward: {item.reward}</span>
                  </div>
                )}
              </div>

              {/* Action footer */}
              <div className="pt-3 border-t border-ink-200/60 dark:border-ink-700/30 flex items-center justify-between gap-2">
                <span className="text-body-xs text-ink-400">
                  By {item.contactName}
                </span>

                {item.status !== 'claimed' && (
                  <button
                    onClick={() => setClaimModalItem(item)}
                    className="btn-accent-outline !px-3 !py-1.5 !text-body-xs"
                  >
                    {item.type === 'found' ? 'Claim This Item' : 'Found / Contact'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Claim & Verification Modal */}
      {claimModalItem && (
        <Modal
          isOpen={!!claimModalItem}
          onClose={() => setClaimModalItem(null)}
          title={`Claim / Contact for "${claimModalItem.title}"`}
          subtitle="Anti-fraud verification process"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-base-100 dark:bg-base-800/70 rounded-xl border border-ink-200/60 dark:border-ink-700/30 space-y-1">
              <span className="text-label uppercase tracking-wider text-ink-400 block">Location Last Seen / Kept</span>
              <p className="text-body-md font-medium text-ink-800 dark:text-ink-100">{claimModalItem.location}</p>
            </div>

            {claimModalItem.securityQuestion ? (
              <div className="p-3.5 bg-warning-50 dark:bg-warning-500/10 rounded-xl border border-warning-100 dark:border-warning-500/20 space-y-2">
                <div className="flex items-center gap-1.5 font-display text-sub-sm text-warning-700 dark:text-warning-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security Verification Question</span>
                </div>
                <p className="text-body-sm text-ink-700 dark:text-ink-200">{claimModalItem.securityQuestion}</p>
                <input
                  type="text"
                  value={verificationAnswer}
                  onChange={e => setVerificationAnswer(e.target.value)}
                  placeholder="Answer to verify ownership..."
                  className="w-full px-3.5 py-2 text-body-sm bg-surface-50 dark:bg-surface-900 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>
            ) : null}

            <div className="p-3.5 bg-accent-50 dark:bg-accent-950/40 rounded-xl border border-accent-200 dark:border-accent-800/60 space-y-1">
              <span className="text-label uppercase tracking-wider text-accent-700 dark:text-accent-300 block">Contact Coordinator</span>
              <div className="font-display text-sub-lg text-ink-900 dark:text-ink-50">
                {claimModalItem.contactName}
              </div>
              <div className="text-body-sm font-mono text-ink-600 dark:text-ink-300">
                {claimModalItem.contactContact}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClaimModalItem(null)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClaim}
                className="btn-accent"
              >
                Mark as Claimed / Recovered
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Item Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Report Lost or Found Campus Item"
          subtitle="Helps batchmates quickly recover misplaced ID cards, calculators & valuables"
          maxWidth="md"
        >
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                Report Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`py-2.5 px-3 font-display text-sub-sm rounded-xl border transition-all ${
                    reportType === 'lost'
                      ? 'bg-danger-50 dark:bg-danger-500/15 text-danger-700 dark:text-danger-500 border-danger-500'
                      : 'border-ink-200/80 dark:border-ink-700/40 text-ink-600 dark:text-ink-300 hover:bg-base-100 dark:hover:bg-base-800'
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`py-2.5 px-3 font-display text-sub-sm rounded-xl border transition-all ${
                    reportType === 'found'
                      ? 'bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500 border-success-500'
                      : 'border-ink-200/80 dark:border-ink-700/40 text-ink-600 dark:text-ink-300 hover:bg-base-100 dark:hover:bg-base-800'
                  }`}
                >
                  I Found Something
                </button>
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                Item Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991EX Calculator with NASA sticker"
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Item Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                >
                  <option value="calculator">Scientific Calculator</option>
                  <option value="id_card">Student ID Card</option>
                  <option value="electronics">Electronics / Charger / Earbuds</option>
                  <option value="bottle">Water Bottle</option>
                  <option value="keys">Keys</option>
                  <option value="stationery">Stationery / Lab File</option>
                  <option value="bag">Bag / Backpack</option>
                  <option value="other">Other Item</option>
                </select>
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Location (Where lost / found)
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Audi 2, Library 3rd Floor desk 12"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                Detailed Description & Identifiers
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Color, brand, identifying marks, scratches..."
                className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Tanvi or Security Desk"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Contact Handle / Phone
                </label>
                <input
                  type="text"
                  value={contactContact}
                  onChange={e => setContactContact(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or Telegram"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>
            </div>

            {reportType === 'lost' ? (
              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={e => setReward(e.target.value)}
                  placeholder="e.g. Treat at Nescafe Canteen / ₹200"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>
            ) : (
              <div>
                <label className="text-label uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1.5">
                  Security Question for Verification (Optional)
                </label>
                <input
                  type="text"
                  value={securityQuestion}
                  onChange={e => setSecurityQuestion(e.target.value)}
                  placeholder="e.g. What is the roll number on the ID card? or keychain color?"
                  className="w-full px-3.5 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/80 dark:border-ink-700/40 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
              >
                Post Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
