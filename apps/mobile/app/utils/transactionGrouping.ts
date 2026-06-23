import { Expense, ExpenseGroup } from '../types/expenseTypes';
import { getWeekStart } from '../../../../packages/shared/utils/dateRanges';

function getWeekLabel(transactionDate: Date): string {
  //get the UTC mondays of current week and week of the transaction
  const currentWeekStart = getWeekStart(
    new Date(),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const transactionWeekStart = getWeekStart(
    transactionDate,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  //find the difference in weeks and return the label relative to current week
  const diffWeeks =
    (currentWeekStart.getTime() - transactionWeekStart.getTime()) /
    (1000 * 60 * 60 * 24 * 7);

  switch (diffWeeks) {
    case 0:
      return 'This Week';
    case 1:
      return 'Last Week';
    case 2:
      return 'Two Weeks Ago';
    default:
      const transactionWeekYear = transactionWeekStart.getFullYear();
      const thisYear = new Date().getFullYear();

      // thisYear - 1 = last year
      if (transactionWeekYear === thisYear - 1) return 'Last Year';

      // thisYear < last year return the year as label
      if (transactionWeekYear < thisYear - 1)
        return String(transactionWeekYear);

      //this year but not within week thresholds return the month as label
      return transactionWeekStart.toLocaleString('default', { month: 'long' });
  }
}

/**
 * Groups a list of transactions into labeled sections by time period relative to the current week.
 * @param expenses - Must be sorted by date descending (newest first)
 */

export function groupExpenses(expenses: Expense[]): ExpenseGroup[] {
  if (expenses.length === 0) {
    return [];
  }

  const groups = new Map<string, Expense[]>();
  for (const expense of expenses) {
    const label = getWeekLabel(new Date(expense.date));
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(expense);
  }
  const groupedExpenses: ExpenseGroup[] = Array.from(
    groups,
    ([label, expenses]) => ({ label, expenses })
  );

  return groupedExpenses;
}
