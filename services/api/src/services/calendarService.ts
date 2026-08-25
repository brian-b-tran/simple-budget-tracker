import prisma from '../config/db';
import { CalendarEvent } from '../types/calendarEvent';

export async function getCalendarFeedService(
  userId: string,
  from: Date = new Date()
): Promise<Array<CalendarEvent>> {
  const [budgets, reminders] = await Promise.all([
    prisma.budget.findMany({
      where: {
        userId: userId,
        type: { in: ['VACATION', 'EVENT'] },
        startDate: { gte: from },
      },
    }),
    prisma.reminder.findMany({
      where: { userId: userId, dateTime: { gte: from } },
    }),
  ]);

  const calendarFeedFromBudgets: Array<CalendarEvent> = budgets.map(
    (budget) => {
      return {
        id: budget.id,
        type: 'BUDGET',
        title: budget.name,
        startDate: budget.startDate!,
        endDate: budget.endDate,
        metadata: {
          totalAmount: Number(budget.totalAmount),
          currency: budget.currency,
          budgetType: budget.type,
        },
      };
    }
  );

  const calendarFeedFromReminders: Array<CalendarEvent> = reminders.map(
    (reminder) => {
      return {
        id: reminder.id,
        type: 'REMINDER',
        title: reminder.title,
        startDate: reminder.dateTime,
        endDate: null,
        metadata: {
          recurring: reminder.recurring,
          recurrenceFrequency: reminder.recurrenceFrequency,
        },
      };
    }
  );

  return calendarFeedFromBudgets
    .concat(calendarFeedFromReminders)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
