import { ExpenseGroup, Settlement } from '../types';

export interface MemberBalance {
  memberId: string;
  name: string;
  paidAmount: number;
  owesAmount: number;
  netBalance: number; // positive = gets back, negative = owes
}

export function calculateGroupBalances(group: ExpenseGroup): {
  balances: MemberBalance[];
  settlements: Settlement[];
  totalGroupSpending: number;
} {
  const memberMap = new Map<string, string>();
  const paidMap = new Map<string, number>();
  const owesMap = new Map<string, number>();

  group.members.forEach(m => {
    memberMap.set(m.id, m.name);
    paidMap.set(m.id, 0);
    owesMap.set(m.id, 0);
  });

  let totalGroupSpending = 0;

  group.expenses.forEach(exp => {
    totalGroupSpending += exp.amount;
    const currentPaid = paidMap.get(exp.paidByMemberId) || 0;
    paidMap.set(exp.paidByMemberId, currentPaid + exp.amount);

    const splitCount = exp.splitAmongMemberIds.length;
    if (splitCount > 0) {
      const share = exp.amount / splitCount;
      exp.splitAmongMemberIds.forEach(memId => {
        const curOwes = owesMap.get(memId) || 0;
        owesMap.set(memId, curOwes + share);
      });
    }
  });

  const balances: MemberBalance[] = group.members.map(m => {
    const paid = paidMap.get(m.id) || 0;
    const owes = owesMap.get(m.id) || 0;
    const net = paid - owes;
    return {
      memberId: m.id,
      name: m.name,
      paidAmount: Math.round(paid * 100) / 100,
      owesAmount: Math.round(owes * 100) / 100,
      netBalance: Math.round(net * 100) / 100
    };
  });

  // Calculate simplified debt settlement transactions
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  balances.forEach(b => {
    if (b.netBalance < -0.01) {
      debtors.push({ id: b.memberId, amount: -b.netBalance });
    } else if (b.netBalance > 0.01) {
      creditors.push({ id: b.memberId, amount: b.netBalance });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    if (settledAmount > 0.01) {
      settlements.push({
        fromMemberId: debtor.id,
        toMemberId: creditor.id,
        amount: Math.round(settledAmount)
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return { balances, settlements, totalGroupSpending };
}

