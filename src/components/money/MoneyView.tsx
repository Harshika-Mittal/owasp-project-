import React, { useState } from 'react';
import { Wallet, Users, Users2 } from 'lucide-react';
import { Expense, LentItem, ExpenseGroup, StudentProfile, GroupExpense } from '../../types';
import { PersonalExpenses } from './PersonalExpenses';
import { LentMoneyLedger } from './LentMoneyLedger';
import { GroupExpenses } from './GroupExpenses';

interface MoneyViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  lentItems: LentItem[];
  onAddLentItem: (item: Omit<LentItem, 'id' | 'remindersSent'>) => void;
  onSettleItem: (id: string) => void;
  onUpdateReminderStatus: (id: string) => void;
  groups: ExpenseGroup[];
  onAddGroup: (group: ExpenseGroup) => void;
  onAddGroupExpense: (groupId: string, expense: Omit<GroupExpense, 'id'>) => void;
  profile: StudentProfile;
}

export const MoneyView: React.FC<MoneyViewProps> = (props) => {
  const [subTab, setSubTab] = useState<'personal' | 'lent' | 'groups'>('personal');

  const pendingLentCount = props.lentItems.filter(i => i.type === 'lent' && i.status !== 'settled').length;

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation bar */}
      <div className="flex border-b border-ink-200/60 dark:border-ink-700/30 overflow-x-auto">
        <button
          onClick={() => setSubTab('personal')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-sm border-b-2 shrink-0 transition-all ${
            subTab === 'personal'
              ? 'border-accent-600 text-accent-600 dark:text-accent-400'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Personal Expenses</span>
        </button>

        <button
          onClick={() => setSubTab('lent')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-sm border-b-2 shrink-0 transition-all ${
            subTab === 'lent'
              ? 'border-accent-600 text-accent-600 dark:text-accent-400'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Lent Money & Reminders</span>
          {pendingLentCount > 0 && (
            <span className="badge-success">
              {pendingLentCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('groups')}
          className={`flex items-center gap-2 py-3 px-4 font-display text-sub-sm border-b-2 shrink-0 transition-all ${
            subTab === 'groups'
              ? 'border-accent-600 text-accent-600 dark:text-accent-400'
              : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Group Expense Splits</span>
          <span className="badge-accent">
            {props.groups.length}
          </span>
        </button>
      </div>

      {/* Render selected sub-tab */}
      {subTab === 'personal' && (
        <PersonalExpenses
          expenses={props.expenses}
          onAddExpense={props.onAddExpense}
          onDeleteExpense={props.onDeleteExpense}
          profile={props.profile}
        />
      )}

      {subTab === 'lent' && (
        <LentMoneyLedger
          lentItems={props.lentItems}
          onAddLentItem={props.onAddLentItem}
          onSettleItem={props.onSettleItem}
          onUpdateReminderStatus={props.onUpdateReminderStatus}
          profile={props.profile}
        />
      )}

      {subTab === 'groups' && (
        <GroupExpenses
          groups={props.groups}
          onAddGroup={props.onAddGroup}
          onAddGroupExpense={props.onAddGroupExpense}
          profile={props.profile}
        />
      )}
    </div>
  );
};
