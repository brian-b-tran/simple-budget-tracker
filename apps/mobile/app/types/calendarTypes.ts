import { Budget } from './budgetTypes';
export type BudgetCalendarEvent = {
  id: string;
  type: 'BUDGET';
  title: string;
  startDate: string;
  endDate: string | null;
  metadata: {
    totalAmount: number;
    currency: string;
    budgetType: Budget;
  };
};

export type CalendarEvent = BudgetCalendarEvent;
// Later: export type CalendarEvent = BudgetCalendarEvent | SomeOtherCalendarEvent;
