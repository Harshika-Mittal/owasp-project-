import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Coffee,
  FileText,
  BookOpen,
  Car,
  Home,
  Send,
  HelpCircle,
  Sparkles,
  PieChart,
  Tag
} from 'lucide-react';
import { Expense, ExpenseCategory, StudentProfile } from '../../types';
import { parseUpiSms } from '../../utils/smartParser';

interface PersonalExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  profile: StudentProfile;
}

export const PersonalExpenses: React.FC<PersonalExpensesProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  profile
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSmsParser, setShowSmsParser] = useState(false);
  const [smsInput, setSmsInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('canteen');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [note, setNote] = useState('');

  const quickPresets = [
    { title: "Chai & Samosa", amount: 35, category: 'canteen' as ExpenseCategory, method: 'UPI' as const },
    { title: "Nescafe Maggi & Cold Coffee", amount: 80, category: 'canteen' as ExpenseCategory, method: 'UPI' as const },
    { title: "Assignment Printouts & Xerox", amount: 45, category: 'printout' as ExpenseCategory, method: 'UPI' as const },
    { title: "Lab Manual & Record Sheets", amount: 110, category: 'academic' as ExpenseCategory, method: 'Cash' as const },
    { title: "Shared Auto to Metro", amount: 40, category: 'travel' as ExpenseCategory, method: 'UPI' as const }
  ];

  const handleQuickAdd = (preset: typeof quickPresets[0]) => {
    onAddExpense({
      title: preset.title,
      amount: preset.amount,
      category: preset.category,
      paymentMethod: preset.method,
      date: new Date().toISOString().split('T')[0],
      note: 'Added via quick preset'
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onAddExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      note: note.trim() || undefined
    });

    setTitle('');
    setAmount('');
    setNote('');
    setShowAddForm(false);
  };

  const handleParseSms = () => {
    const parsed = parseUpiSms(smsInput);
    if (parsed) {
      onAddExpense({
        title: parsed.title,
        amount: parsed.amount,
        category: parsed.category,
        paymentMethod: 'UPI',
        date: parsed.date,
        upiRef: parsed.upiRef,
        note: `Auto-extracted from UPI message`
      });
      setSmsInput('');
      setShowSmsParser(false);
    }
  };

  // Category statistics
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingAllowance = Math.max(0, profile.monthlyAllowance - totalSpent);
  const percentUsed = Math.min(100, Math.round((totalSpent / profile.monthlyAllowance) * 100));

  const categoryTotals: Record<ExpenseCategory, number> = {
    canteen: 0,
    stationery: 0,
    printout: 0,
    travel: 0,
    hostel: 0,
    upi_transfer: 0,
    academic: 0,
    misc: 0
  };

  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
    canteen: <Coffee className="w-4 h-4 text-warning-600 dark:text-warning-500" />,
    printout: <FileText className="w-4 h-4 text-accent-600 dark:text-accent-400" />,
    stationery: <Tag className="w-4 h-4 text-ink-600 dark:text-ink-300" />,
    travel: <Car className="w-4 h-4 text-success-600 dark:text-success-500" />,
    hostel: <Home className="w-4 h-4 text-accent-600 dark:text-accent-400" />,
    academic: <BookOpen className="w-4 h-4 text-accent-700 dark:text-accent-300" />,
    upi_transfer: <Send className="w-4 h-4 text-ink-700 dark:text-ink-200" />,
    misc: <HelpCircle className="w-4 h-4 text-ink-400" />
  };

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Allowance & Budget Progress Banner */}
      <div className="bg-ink-900 dark:bg-surface-900 text-white rounded-2xl p-6 shadow-elevated border border-ink-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-label uppercase tracking-wider text-ink-300 block">
              Monthly Student Budget Tracker
            </span>
            <div className="flex items-baseline gap-2.5 mt-1.5">
              <span className="font-display text-display-md text-white">₹{totalSpent}</span>
              <span className="text-body-sm text-ink-300">spent of ₹{profile.monthlyAllowance} allowance</span>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-label uppercase tracking-wider text-ink-400 block">
              Remaining Balance
            </span>
            <span className="font-display text-display-lg text-accent-400 mt-0.5 block">
              ₹{remainingAllowance}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-2">
          <div className="w-full bg-ink-200 dark:bg-ink-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-accent-600 transition-all duration-500"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-body-xs text-ink-300">
            <span>{percentUsed}% spent</span>
            <span>{100 - percentUsed}% buffer remaining</span>
          </div>
        </div>
      </div>

      {/* Action Bar & Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-heading-lg text-ink-900 dark:text-ink-50">
            Everyday Small Expenses
          </h3>
          <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-0.5">
            Never lose track of canteen snacks, UPIs, and printouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSmsParser(!showSmsParser)}
            className="btn-accent-outline flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paste UPI SMS</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-accent flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Quick 1-tap presets pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
        <span className="text-label uppercase tracking-wider text-ink-400 shrink-0">
          ⚡ 1-Tap Log:
        </span>
        {quickPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAdd(preset)}
            className="btn-ghost border border-ink-200/60 dark:border-ink-700/30 bg-surface-50 dark:bg-surface-900 flex items-center gap-1.5 py-1.5 px-3 shrink-0"
          >
            <span className="text-body-sm text-ink-700 dark:text-ink-200 font-normal">{preset.title}</span>
            <span className="font-display font-semibold text-accent-600 dark:text-accent-400">₹{preset.amount}</span>
          </button>
        ))}
      </div>

      {/* SMS Parser Card Drawer */}
      {showSmsParser && (
        <div className="card p-5 bg-accent-50/60 dark:bg-surface-900 border-accent-200 dark:border-accent-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-600 dark:text-accent-400" />
              <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50">
                Smart UPI SMS Auto-Extractor
              </h4>
            </div>
            <span className="text-label uppercase tracking-wider text-ink-400">Paste bank debited SMS</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="e.g. Paid Rs. 75.00 to Nescafe Canteen on 10-Nov via UPI ref 438910..."
              className="flex-1 px-3 py-2 text-body-sm bg-surface-50 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
            />
            <button
              onClick={handleParseSms}
              disabled={!smsInput.trim()}
              className="btn-accent disabled:opacity-50"
            >
              Extract & Log
            </button>
          </div>
          <p className="text-body-xs text-ink-600 dark:text-ink-300">
            💡 Tip: Automatically infers amount, category (Canteen/Xerox/Travel/Mess), and UPI reference.
          </p>
        </div>
      )}

      {/* Manual Add Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleManualSubmit} className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-200/60 dark:border-ink-700/30">
            <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50">Log New Expense</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-ghost py-1 px-2.5 text-body-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Description / Item
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Canteen Lunch, Xerox"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

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
                placeholder="0.00"
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              />
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              >
                <option value="canteen">Canteen & Snacks</option>
                <option value="printout">Printouts & Xerox</option>
                <option value="stationery">Stationery & Lab Goods</option>
                <option value="travel">Travel (Auto/Metro)</option>
                <option value="hostel">Hostel & Mess Extras</option>
                <option value="academic">Academic & Books</option>
                <option value="upi_transfer">UPI Transfer</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="text-label uppercase tracking-wider text-ink-400 block mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as 'UPI' | 'Cash' | 'Card')}
                className="w-full px-3 py-2 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-600 text-ink-900 dark:text-ink-50"
              >
                <option value="UPI">UPI (GPay/PhonePe/Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Card">Debit / ATM Card</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="btn-accent"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Category breakdown chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Canteen & Food',
            cat: 'canteen',
            amount: categoryTotals.canteen,
            bg: 'bg-warning-50 dark:bg-warning-500/10 border-warning-100 dark:border-warning-500/20'
          },
          {
            label: 'Print & Xerox',
            cat: 'printout',
            amount: categoryTotals.printout,
            bg: 'bg-accent-50 dark:bg-accent-950/40 border-accent-200/60 dark:border-accent-800/40'
          },
          {
            label: 'Stationery & Books',
            cat: 'stationery',
            amount: categoryTotals.stationery + categoryTotals.academic,
            bg: 'bg-surface-150 dark:bg-surface-900 border-ink-200/60 dark:border-ink-700/30'
          },
          {
            label: 'Hostel & Others',
            cat: 'hostel',
            amount: categoryTotals.hostel + categoryTotals.travel + categoryTotals.upi_transfer + categoryTotals.misc,
            bg: 'bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20'
          }
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-4 rounded-2xl border shadow-card`}>
            <span className="font-display text-sub-sm text-ink-800 dark:text-ink-200 block">{item.label}</span>
            <span className="font-display text-heading-lg text-ink-900 dark:text-ink-50 mt-1 block">
              ₹{item.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Expenses History List */}
      <div className="space-y-3">
        <div className="card px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PieChart className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <h4 className="font-display text-sub-lg text-ink-900 dark:text-ink-50">Recent Transactions</h4>
            <span className="badge-neutral">{filteredExpenses.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label uppercase tracking-wider text-ink-400 hidden sm:inline">Filter:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-body-sm bg-base-100 dark:bg-base-800 text-ink-800 dark:text-ink-200 rounded-xl border border-ink-200/60 dark:border-ink-700/30 focus:outline-none focus:ring-2 focus:ring-accent-600"
            >
              <option value="all">All Categories</option>
              <option value="canteen">Canteen</option>
              <option value="printout">Printout / Xerox</option>
              <option value="stationery">Stationery</option>
              <option value="travel">Travel</option>
              <option value="hostel">Hostel</option>
              <option value="academic">Academic</option>
              <option value="upi_transfer">UPI Transfer</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-0.5">
          {filteredExpenses.length === 0 ? (
            <div className="card p-8 text-center text-ink-400 text-body-sm">
              No expenses recorded in this category yet.
            </div>
          ) : (
            filteredExpenses.map(expense => (
              <div
                key={expense.id}
                className="card-hover px-4 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 shrink-0">
                    {categoryIcons[expense.category]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sub-md text-ink-900 dark:text-ink-50 truncate">
                      {expense.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-body-xs text-ink-400 mt-0.5">
                      <span>{expense.date}</span>
                      <span>•</span>
                      <span className="font-mono">{expense.paymentMethod}</span>
                      {expense.upiRef && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-caption">Ref: {expense.upiRef.substring(0, 8)}...</span>
                        </>
                      )}
                      {expense.note && (
                        <>
                          <span>•</span>
                          <span className="italic truncate max-w-[160px]">{expense.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display text-heading-md text-ink-900 dark:text-ink-50">
                    ₹{expense.amount}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="btn-ghost p-1.5 text-ink-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
