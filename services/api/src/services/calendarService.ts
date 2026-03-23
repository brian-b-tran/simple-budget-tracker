import prisma from '../config/db';
import { CalendarEvent } from '../types/calendarEvent';

export async function getCalendarFeedService(
  userId: string
): Promise<Array<CalendarEvent>> {
  const [budgets, reminders] = await Promise.all([
    await prisma.budget.findMany({
      where: {
        userId: userId,
        type: { in: ['VACATION', 'EVENT'] },
        startDate: { not: null },
      },
    }),
    await prisma.reminder.findMany({
      where: { userId: userId, dateTime: { gte: new Date() } },
      orderBy: { dateTime: 'asc' },
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
          totalAmount: budget.totalAmount,
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
