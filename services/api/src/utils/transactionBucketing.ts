import { daysBetween } from '@expense-app/shared/utils/dateRanges';
import { ExpenseGroup } from '../types/expense';
import { Expense } from '../../generated/prisma/client';

/**
 * Returns a day label for a transaction relative to the start of a Vacation.
 */
export function getVacationDayLabel(
  expenseDate: Date,
  budgetStartDate: Date,
  budgetEndDate: Date
): string {
  let numDaysDiff = daysBetween(budgetStartDate, expenseDate);
  let tripSpan = daysBetween(budgetStartDate, budgetEndDate);
  if (numDaysDiff < 0) {
    return 'Pre-Trip';
  } else if (numDaysDiff > tripSpan) {
    return 'Post-Trip';
  }

  return `Day ${numDaysDiff + 1}`;
}

export function groupExpensesByVacationDay(
  expenses: Expense[],
  budgetStartDate: Date,
  budgetEndDate: Date
): ExpenseGroup[] {
  let tripSpan = daysBetween(budgetStartDate, budgetEndDate);
  const buckets = new Map<string, Expense[]>();

  for (const expense of expenses) {
    const label = getVacationDayLabel(
      new Date(expense.date),
      budgetStartDate,
      budgetEndDate
    );
    if (!buckets.has(label)) {
      buckets.set(label, []);
    }
    buckets.get(label)!.push(expense);
  }

  const orderedLabels = [
    ...(buckets.has('Pre-Trip') ? ['Pre-Trip'] : []),
    ...Array.from({ length: tripSpan + 1 }, (_, i) => `Day ${i + 1}`),
    ...(buckets.has('Post-Trip') ? ['Post-Trip'] : []),
  ];

  const groupedExpenses: ExpenseGroup[] = Array.from(
    orderedLabels,
    (label) => ({ label, expenses: buckets.get(label) ?? [] })
  );

  return groupedExpenses;
}
