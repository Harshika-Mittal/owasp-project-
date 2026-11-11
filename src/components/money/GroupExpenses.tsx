import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  CheckCircle,
  Receipt,
  Wallet
} from 'lucide-react';
import { ExpenseGroup, GroupExpense, GroupMember, StudentProfile, ExpenseCategory } from '../../types';
import { calculateGroupBalances } from '../../utils/splitwise';
import { Modal } from '../common/Modal';

interface GroupExpensesProps {
  groups: ExpenseGroup[];
  onAddGroup: (newGroup: ExpenseGroup) => void;
  onAddGroupExpense: (groupId: string, expense: Omit<GroupExpense, 'id'>) => void;
  profile: StudentProfile;
}

export const GroupExpenses: React.FC<GroupExpensesProps> = ({
  groups,
  onAddGroup,
  onAddGroupExpense,
  profile
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  // New Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState<'hostel' | 'trip' | 'food' | 'project'>('hostel');
  const [memberNamesInput, setMemberNamesInput] = useState('');

  // New Expense Form
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidByMemberId, setPaidByMemberId] = useState('');
  const [selectedSplitMemberIds, setSelectedSplitMemberIds] = useState<string[]>([]);
  const [category, setCategory] = useState<ExpenseCategory>('canteen');

  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const { balances, settlements, totalGroupSpending } = currentGroup
    ? calculateGroupBalances(currentGroup)
    : { balances: [], settlements: [], totalGroupSpending: 0 };

  const handleOpenAddExpense = () => {
    if (!currentGroup) return;
    setExpenseDesc('');
    setExpenseAmount('');
    setPaidByMemberId(currentGroup.members[0]?.id || '');
    setSelectedSplitMemberIds(currentGroup.members.map(m => m.id));
    setShowAddExpenseModal(true);
  };

  const handleToggleMemberSplit = (memberId: string) => {
    if (selectedSplitMemberIds.includes(memberId)) {
      if (selectedSplitMemberIds.length > 1) {
        setSelectedSplitMemberIds(selectedSplitMemberIds.filter(id => id !== memberId));
      }
    } else {
      setSelectedSplitMemberIds([...selectedSplitMemberIds, memberId]);
    }
  };

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroup || !expenseDesc.trim() || !expenseAmount || selectedSplitMemberIds.length === 0) return;

    onAddGroupExpense(currentGroup.id, {
      groupId: currentGroup.id,
      description: expenseDesc.trim(),
      amount: parseFloat(expenseAmount),
      paidByMemberId,
      splitAmongMemberIds: selectedSplitMemberIds,
      date: new Date().toISOString().split('T')[0],
      category
    });

    setShowAddExpenseModal(false);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const extraMembers: GroupMember[] = memberNamesInput
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map((name, idx) => ({
        id: `mem-${Date.now()}-${idx}`,
        name
      }));

    const newGroup: ExpenseGroup = {
      id: `grp-${Date.now()}`,
      name: groupName.trim(),
      description: groupDescription.trim() || 'Shared expenses',
      type: groupType,
      members: [
        { id: `mem-user-${Date.now()}`, name: `${profile.name} (You)`, upiId: profile.upiId },
        ...extraMembers
      ],
      expenses: []
    };

    onAddGroup(newGroup);
    setSelectedGroupId(newGroup.id);
    setGroupName('');
    setGroupDescription('');
    setMemberNamesInput('');
    setShowCreateGroupModal(false);
  };

  const getMemberName = (id: string) => {
    return currentGroup?.members.find(m => m.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Group Selector & Creation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`shrink-0 transition-all ${
                group.id === currentGroup?.id
                  ? 'btn-accent'
                  : 'btn-ghost border border-ink-200/60 dark:border-ink-700/30 bg-surface-50 dark:bg-surface-900'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="btn-accent-outline flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Group</span>
          </button>

          {currentGroup && (
            <button
              onClick={handleOpenAddExpense}
              className="btn-accent flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Split Expense</span>
            </button>
          )}
        </div>
      </div>

      {currentGroup && (
        <>
          {/* Group Header Info */}
          <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="badge-accent">
                  {currentGroup.type}
                </span>
                <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
                  {currentGroup.name}
                </h3>
              </div>
              <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1">
                {currentGroup.description} • {currentGroup.members.length} members
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-label uppercase tracking-wider text-ink-400 block">
                Total Group Bill
              </span>
              <span className="font-display text-display-md text-ink-900 dark:text-ink-50 mt-0.5 block">
                ₹{totalGroupSpending}
              </span>
            </div>
          </div>

          {/* Balances & Settlement Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Net Balances */}
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-ink-200/60 dark:border-ink-700/30 pb-3">
                <h4 className="text-label uppercase tracking-wider text-ink-400 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-accent-600 dark:text-accent-400" /> Member Balances
                </h4>
                <span className="text-body-xs text-ink-400">Green = Gets back • Red = Owes</span>
              </div>

              <div className="space-y-3">
                {balances.map(b => (
                  <div key={b.memberId} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-base-150 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 font-display font-semibold flex items-center justify-center text-ink-700 dark:text-ink-200 text-body-xs">
                        {b.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-display text-sub-md text-ink-900 dark:text-ink-50 block">{b.name}</span>
                        <div className="text-body-xs text-ink-400">Paid ₹{b.paidAmount} in total</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-display text-heading-md ${
                        b.netBalance > 0
                          ? 'text-success-600 dark:text-success-500'
                          : b.netBalance < 0
                            ? 'text-danger-600 dark:text-danger-500'
                            : 'text-ink-400'
                      }`}>
                        {b.netBalance > 0 ? `+₹${b.netBalance}` : b.netBalance < 0 ? `-₹${Math.abs(b.netBalance)}` : 'Settled'}
                      </div>
                      <span className="text-body-xs text-ink-400">
                        {b.netBalance > 0 ? 'gets back' : b.netBalance < 0 ? 'owes to group' : 'all clear'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Simplified Settlements */}
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-ink-200/60 dark:border-ink-700/30 pb-3">
                <h4 className="text-label uppercase tracking-wider text-ink-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-accent-600 dark:text-accent-400" /> Simplified Debt Settlements
                </h4>
                <span className="badge-success">
                  Zero chasing hassle
                </span>
              </div>

              {settlements.length === 0 ? (
                <div className="p-6 text-center text-body-sm text-ink-400 flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-success-500/60" />
                  <span>Everyone is completely settled up! No outstanding dues.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {settlements.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-base-100 dark:bg-base-800 rounded-xl border border-ink-200/60 dark:border-ink-700/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-display text-sub-md text-ink-900 dark:text-ink-50 truncate">
                          {getMemberName(s.fromMemberId)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-accent-600 dark:text-accent-400 shrink-0" />
                        <span className="font-display text-sub-md text-ink-900 dark:text-ink-50 truncate">
                          {getMemberName(s.toMemberId)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-display text-heading-md text-accent-600 dark:text-accent-400">
                          ₹{s.amount}
                        </span>
                        <a
                          href={`upi://pay?pn=${encodeURIComponent(getMemberName(s.toMemberId))}&am=${s.amount}&cu=INR`}
                          className="btn-accent px-3 py-1.5 text-body-xs"
                        >
                          UPI
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Group Expense History */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ink-200/60 dark:border-ink-700/30">
              <h4 className="text-label uppercase tracking-wider text-ink-400">
                Group Expenses Ledger ({currentGroup.expenses.length})
              </h4>
            </div>

            <div className="divide-y divide-ink-200/60 dark:divide-ink-700/30">
              {currentGroup.expenses.length === 0 ? (
                <div className="p-8 text-center text-body-sm text-ink-400">
                  No expenses added to this group yet. Click "Split Expense" above!
                </div>
              ) : (
                currentGroup.expenses.map(exp => (
                  <div key={exp.id} className="p-4 flex items-center justify-between gap-3 hover:bg-base-100/60 dark:hover:bg-base-800/40 transition-colors">
                    <div>
                      <div className="font-display text-sub-md text-ink-900 dark:text-ink-50">{exp.description}</div>
                      <div className="text-body-xs text-ink-600 dark:text-ink-300 mt-0.5">
                        Paid by <span className="font-semibold text-ink-900 dark:text-ink-50">{getMemberName(exp.paidByMemberId)}</span> • Split among {exp.splitAmongMemberIds.length} members (₹{(exp.amount / exp.splitAmongMemberIds.length).toFixed(0)}/person) • {exp.date}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-heading-md text-ink-900 dark:text-ink-50">
                        ₹{exp.amount}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Split Expense Modal */}
      {showAddExpenseModal && currentGroup && (
        <Modal
          isOpen={showAddExpenseModal}
          onClose={() => setShowAddExpenseModal(false)}
          title={`Add Expense to "${currentGroup.name}"`}
          subtitle="Equally splits the cost and calculates net dues"
          maxWidth="md"
        >
          <form onSubmit={handleCreateExpenseSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Expense Description
              </label>
              <input
                type="text"
                required
                value={expenseDesc}
                onChange={e => setExpenseDesc(e.target.value)}
                placeholder="e.g. Domino's pizza, Tempo traveler, Wi-Fi recharge"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Total Bill (₹)
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
                />
              </div>

              <div>
                <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                  Who paid?
                </label>
                <select
                  value={paidByMemberId}
                  onChange={e => setPaidByMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
                >
                  {currentGroup.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Who splits */}
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Split among: ({selectedSplitMemberIds.length} members selected)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {currentGroup.members.map(m => {
                  const isChecked = selectedSplitMemberIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleToggleMemberSplit(m.id)}
                      className={`p-2.5 rounded-xl text-body-sm font-medium text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-accent-50 dark:bg-accent-950/40 border-accent-600 text-accent-700 dark:text-accent-300'
                          : 'bg-surface-50 dark:bg-base-800 border-ink-200/60 dark:border-ink-700/30 text-ink-600 dark:text-ink-300'
                      }`}
                    >
                      <span className="truncate">{m.name}</span>
                      {isChecked && <CheckCircle className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
              >
                Save & Split
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create New Group Modal */}
      {showCreateGroupModal && (
        <Modal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          title="Create Shared Expense Group"
          subtitle="Ideal for flatmates, road trips, or project teams"
          maxWidth="md"
        >
          <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Goa Trip, Flat 402 Groceries, Hackathon Team"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Group Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'hostel', label: 'Hostel' },
                  { id: 'trip', label: 'Trip' },
                  { id: 'food', label: 'Food' },
                  { id: 'project', label: 'Project' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setGroupType(t.id as any)}
                    className={`py-2 text-body-sm font-semibold rounded-xl border text-center transition-all ${
                      groupType === t.id
                        ? 'border-accent-600 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300'
                        : 'border-ink-200/60 dark:border-ink-700/30 text-ink-600 dark:text-ink-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Add Friends (Comma Separated)
              </label>
              <input
                type="text"
                value={memberNamesInput}
                onChange={e => setMemberNamesInput(e.target.value)}
                placeholder="e.g. Rohan, Dhruv, Priya, Aman"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
              <span className="text-body-xs text-ink-400 mt-1 block">
                You will automatically be added as the primary group member.
              </span>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Description (Optional)
              </label>
              <input
                type="text"
                value={groupDescription}
                onChange={e => setGroupDescription(e.target.value)}
                placeholder="e.g. All shared expenses for the semester"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
              >
                Create Group
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
