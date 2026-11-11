import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  IndianRupee,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { LentItem, StudentProfile } from '../../types';
import { Modal } from '../common/Modal';

interface LentMoneyLedgerProps {
  lentItems: LentItem[];
  onAddLentItem: (item: Omit<LentItem, 'id' | 'remindersSent'>) => void;
  onSettleItem: (id: string) => void;
  onUpdateReminderStatus: (id: string) => void;
  profile: StudentProfile;
}

export const LentMoneyLedger: React.FC<LentMoneyLedgerProps> = ({
  lentItems,
  onAddLentItem,
  onSettleItem,
  onUpdateReminderStatus,
  profile
}) => {
  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed' | 'settled'>('lent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderModalItem, setReminderModalItem] = useState<LentItem | null>(null);
  const [reminderTone, setReminderTone] = useState<'chill' | 'upi' | 'urgent'>('chill');
  const [copied, setCopied] = useState(false);

  // New item form
  const [personName, setPersonName] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'lent' | 'borrowed'>('lent');
  const [reason, setReason] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !amount || !reason.trim()) return;

    onAddLentItem({
      personName: personName.trim(),
      personPhone: personPhone.trim() || undefined,
      amount: parseFloat(amount),
      type,
      reason: reason.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      dueDate: dueDate || undefined
    });

    setPersonName('');
    setPersonPhone('');
    setAmount('');
    setReason('');
    setDueDate('');
    setShowAddModal(false);
  };

  // Reminder message generators
  const generateReminderText = (item: LentItem, tone: 'chill' | 'upi' | 'urgent'): string => {
    const upiPart = profile.upiId ? ` My UPI ID: ${profile.upiId}` : '';

    if (tone === 'chill') {
      return `Hey ${item.personName}! Hope classes are going well. Whenever you get a free min, could you please send the ₹${item.amount} for "${item.reason}"? No rush at all, just keeping tabs! 🙌${upiPart}`;
    } else if (tone === 'upi') {
      return `Hey ${item.personName}, quick reminder for ₹${item.amount} (${item.reason}). You can send it directly to my UPI ID: ${profile.upiId || 'arjun@upi'} or let me know if you need a QR code. Thanks! ✨`;
    } else {
      return `Hey ${item.personName}, running a bit tight on pocket money this week! 😅 Could you please clear the ₹${item.amount} from "${item.reason}" whenever you can today? Would really help out! 🙏${upiPart}`;
    }
  };

  const currentReminderText = reminderModalItem
    ? generateReminderText(reminderModalItem, reminderTone)
    : '';

  const handleCopyMessage = () => {
    if (!currentReminderText) return;
    navigator.clipboard.writeText(currentReminderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (reminderModalItem) {
      onUpdateReminderStatus(reminderModalItem.id);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!reminderModalItem) return;
    const phone = reminderModalItem.personPhone ? reminderModalItem.personPhone.replace(/[^\d]/g, '') : '';
    const encodedText = encodeURIComponent(currentReminderText);
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, '_blank');
    onUpdateReminderStatus(reminderModalItem.id);
  };

  // Metrics
  const totalLentPending = lentItems
    .filter(i => i.type === 'lent' && i.status !== 'settled')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalBorrowedPending = lentItems
    .filter(i => i.type === 'borrowed' && i.status !== 'settled')
    .reduce((sum, i) => sum + i.amount, 0);

  const displayedItems = lentItems.filter(item => {
    if (activeTab === 'settled') return item.status === 'settled';
    return item.type === activeTab && item.status !== 'settled';
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 rounded-2xl shadow-card flex items-center justify-between">
          <div>
            <span className="text-label uppercase tracking-wider text-success-700 dark:text-success-500 block">
              Friends Owe You (To Recover)
            </span>
            <div className="font-display text-display-md text-success-700 dark:text-success-500 mt-1">
              ₹{totalLentPending}
            </div>
            <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-1">
              Across {lentItems.filter(i => i.type === 'lent' && i.status !== 'settled').length} recorded loans
            </p>
          </div>
          <div className="p-3 bg-success-100 dark:bg-success-500/20 rounded-xl text-success-700 dark:text-success-500">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-500/20 rounded-2xl shadow-card flex items-center justify-between">
          <div>
            <span className="text-label uppercase tracking-wider text-warning-700 dark:text-warning-500 block">
              You Owe Friends (Pay Back)
            </span>
            <div className="font-display text-display-md text-warning-700 dark:text-warning-500 mt-1">
              ₹{totalBorrowedPending}
            </div>
            <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-1">
              Across {lentItems.filter(i => i.type === 'borrowed' && i.status !== 'settled').length} dues
            </p>
          </div>
          <div className="p-3 bg-warning-100 dark:bg-warning-500/20 rounded-xl text-warning-700 dark:text-warning-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sub-tabs */}
        <div className="flex p-1 bg-base-150 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl max-w-md w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('lent')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              activeTab === 'lent'
                ? 'bg-surface-50 dark:bg-surface-900 text-accent-600 dark:text-accent-400 shadow-card'
                : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'
            }`}
          >
            They Owe Me ({lentItems.filter(i => i.type === 'lent' && i.status !== 'settled').length})
          </button>
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              activeTab === 'borrowed'
                ? 'bg-surface-50 dark:bg-surface-900 text-accent-600 dark:text-accent-400 shadow-card'
                : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'
            }`}
          >
            I Owe ({lentItems.filter(i => i.type === 'borrowed' && i.status !== 'settled').length})
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-sub-sm transition-all ${
              activeTab === 'settled'
                ? 'bg-surface-50 dark:bg-surface-900 text-accent-600 dark:text-accent-400 shadow-card'
                : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'
            }`}
          >
            Settled History
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-accent flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Loan / IOU</span>
        </button>
      </div>

      {/* Ledger Cards List */}
      <div className="space-y-3">
        {displayedItems.length === 0 ? (
          <div className="card p-8 text-center text-ink-400 text-body-sm">
            No active records in this tab. All dues are clear! 🎉
          </div>
        ) : (
          displayedItems.map(item => (
            <div
              key={item.id}
              className="card-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  item.type === 'lent'
                    ? 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500'
                    : 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-500'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50">
                      {item.personName}
                    </h4>
                    {item.status === 'settled' ? (
                      <span className="badge-neutral">
                        Settled
                      </span>
                    ) : item.status === 'reminded' ? (
                      <span className="badge-warning">
                        Reminded ({item.remindersSent}x)
                      </span>
                    ) : (
                      <span className="badge-success">
                        <ShieldCheck className="w-3 h-3" /> Confirmed Record
                      </span>
                    )}
                  </div>

                  <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1">
                    "{item.reason}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 text-body-xs text-ink-400 mt-1.5">
                    <span>Lent on: {item.date}</span>
                    {item.dueDate && (
                      <>
                        <span>•</span>
                        <span className="text-warning-600 dark:text-warning-500 font-medium">Due: {item.dueDate}</span>
                      </>
                    )}
                    {item.lastRemindedDate && (
                      <>
                        <span>•</span>
                        <span className="text-accent-600 dark:text-accent-400">Last reminded: {item.lastRemindedDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-ink-200/60 dark:border-ink-700/30">
                <div className="sm:text-right">
                  <div className={`font-display text-heading-lg ${
                    item.type === 'lent'
                      ? 'text-success-600 dark:text-success-500'
                      : 'text-warning-600 dark:text-warning-500'
                  }`}>
                    {item.type === 'lent' ? '+' : '-'}₹{item.amount}
                  </div>
                  <span className="text-label uppercase tracking-wider text-ink-400 block">
                    {item.type === 'lent' ? 'They owe you' : 'You owe them'}
                  </span>
                </div>

                {item.status !== 'settled' && (
                  <div className="flex items-center gap-2">
                    {/* Polite Reminder button (only for money you lent) */}
                    {item.type === 'lent' && (
                      <button
                        onClick={() => {
                          setReminderModalItem(item);
                          setReminderTone('chill');
                        }}
                        className="btn-accent-outline flex items-center gap-1.5 py-1.5 px-3"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Polite Reminder</span>
                        <span className="sm:hidden">Remind</span>
                      </button>
                    )}

                    {/* Settle Up button */}
                    <button
                      onClick={() => onSettleItem(item.id)}
                      className="btn-ghost border border-ink-200/60 dark:border-ink-700/30 hover:bg-success-600 hover:text-white hover:border-success-600 dark:hover:bg-success-600 dark:hover:text-white flex items-center gap-1.5 py-1.5 px-3"
                      title="Mark as paid and settled"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Settle Up</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Polite Automated Reminder Modal */}
      {reminderModalItem && (
        <Modal
          isOpen={!!reminderModalItem}
          onClose={() => setReminderModalItem(null)}
          title="Send Polite & Non-Awkward Reminder"
          subtitle={`Friend: ${reminderModalItem.personName} • Amount: ₹${reminderModalItem.amount}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-body-sm text-ink-600 dark:text-ink-300">
              Asking friends for repayment can feel uncomfortable. Select a calibrated tone to generate a courteous message and send via WhatsApp with 1 tap.
            </p>

            {/* Tone selector pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'chill', label: '😎 Chill & Friendly', desc: 'No rush / soft check-in' },
                { id: 'upi', label: '⚡ Direct UPI Ping', desc: 'Includes your UPI ID & QR' },
                { id: 'urgent', label: '🙏 Month-End Low Cash', desc: 'Gentle urgent plea' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setReminderTone(t.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    reminderTone === t.id
                      ? 'border-accent-600 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300'
                      : 'border-ink-200/60 dark:border-ink-700/30 bg-surface-50 dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800/70 text-ink-700 dark:text-ink-200'
                  }`}
                >
                  <div className="font-display text-sub-sm">{t.label}</div>
                  <div className="text-body-xs text-ink-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Generated Message Preview Card */}
            <div className="p-4 bg-base-100 dark:bg-base-800 rounded-xl border border-ink-200/60 dark:border-ink-700/30 text-body-sm font-mono text-ink-900 dark:text-ink-50 leading-relaxed whitespace-pre-wrap">
              {currentReminderText}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopyMessage}
                className="btn-accent-outline flex-1 flex items-center justify-center gap-1.5 py-2.5"
              >
                {copied ? <Check className="w-4 h-4 text-success-600 dark:text-success-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="btn-accent flex-1 flex items-center justify-center gap-1.5 py-2.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Loan Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Record Confirmed Informal Loan"
          subtitle="Keep a fair mutual record so no one forgets or takes a loss"
          maxWidth="md"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Type of Transaction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('lent')}
                  className={`py-2 px-3 text-body-sm font-semibold rounded-xl border transition-all ${
                    type === 'lent'
                      ? 'bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-500 border-success-500'
                      : 'border-ink-200/60 dark:border-ink-700/30 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  I Lent Money (They owe me)
                </button>
                <button
                  type="button"
                  onClick={() => setType('borrowed')}
                  className={`py-2 px-3 text-body-sm font-semibold rounded-xl border transition-all ${
                    type === 'borrowed'
                      ? 'bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-500 border-warning-500'
                      : 'border-ink-200/60 dark:border-ink-700/30 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  I Borrowed Money (I owe them)
                </button>
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Friend's Name
              </label>
              <input
                type="text"
                required
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Expected Return Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
                />
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                WhatsApp Phone Number (Optional)
              </label>
              <input
                type="text"
                value={personPhone}
                onChange={e => setPersonPhone(e.target.value)}
                placeholder="e.g. 9876543210 (for 1-click WhatsApp)"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                What was it for?
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Canteen bill split, Zomato pizza, Fest pass"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

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
                Confirm & Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
