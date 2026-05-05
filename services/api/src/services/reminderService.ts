import prisma from '../config/db';
import type { Reminder } from '../../generated/prisma/client';
import type {
  CreateReminderBackendInput,
  UpdateReminderBackendInput,
} from '@expense-app/types';

export async function getReminderService(
  userId: string,
  id: string
): Promise<Reminder> {
  const reminder = await prisma.reminder.findUnique({
    where: { userId: userId, id: id },
  });

  if (!reminder) {
    throw new Error('No such reminder has been found.');
  }

  return reminder;
}

export async function getAllRemindersService(
  userId: string
): Promise<Array<Reminder>> {
  const reminders = await prisma.reminder.findMany({
    where: { userId: userId },
  });

  return reminders;
}

export async function createReminderService(
  userId: string,
  data: CreateReminderBackendInput
): Promise<Reminder> {
  const newReminder = await prisma.reminder.create({
    data: {
      userId: userId,
      title: data.title,
      dateTime: data.dateTime,
      recurring: data.recurring,
      recurrenceFrequency: data.recurrenceFrequency,
      notes: data.notes,
      interval: data.interval,
    },
  });

  return newReminder;
}

export async function updateReminderService(
  userId: string,
  id: string,
  data: UpdateReminderBackendInput
): Promise<Reminder> {
  if (
    !(await prisma.reminder.findUnique({
      where: { userId: userId, id: id },
    }))
  ) {
    throw new Error('Could not find this reminder.');
  }

  const reminder = await prisma.reminder.update({
    where: { userId: userId, id: id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.dateTime && { dateTime: data.dateTime }),
      ...(data.recurring && { recurring: data.recurring }),
      ...(data.recurrenceFrequency && {
        recurrenceFrequency: data.recurrenceFrequency,
      }),
      ...(data.notes && { notes: data.notes }),
      ...(data.interval && { interval: data.interval }),
    },
  });
  if (!reminder) {
    throw new Error('Error editing Reminder.');
  }
  return reminder;
}
export async function deleteReminderService(
  userId: string,
  id: string
): Promise<Reminder> {
  if (
    !(await prisma.reminder.findUnique({
      where: { userId: userId, id: id },
    }))
  ) {
    throw new Error('Could not find this reminder.');
  }
  const reminder = await prisma.reminder.delete({
    where: { userId: userId, id: id },
  });

  return reminder;
}

export async function getUpcomingRemindersService(
  userId: string
): Promise<Array<Reminder>> {
  const reminders = await prisma.reminder.findMany({
    where: { userId: userId, dateTime: { gte: new Date() } },
    orderBy: { dateTime: 'asc' },
  });

  return reminders;
}
