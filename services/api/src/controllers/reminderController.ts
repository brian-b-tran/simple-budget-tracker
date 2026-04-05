import { Request, Response } from 'express';
import {
  createReminderBackendSchema,
  updateReminderBackendSchema,
} from '@expense-app/types';
import {
  getReminderService,
  getAllRemindersService,
  createReminderService,
  updateReminderService,
  deleteReminderService,
  getUpcomingRemindersService,
} from '../services/reminderService';

export async function getReminderController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reminder = await getReminderService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json(reminder);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function getAllRemindersController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reminders = await getAllRemindersService(req.user!.userId);
    res.status(200).json(reminders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}
export async function createReminderController(
  req: Request,
  res: Response
): Promise<void> {
  const data = createReminderBackendSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: 'Invalid inputs.', error: data.error });
    return;
  }

  try {
    const newReminder = await createReminderService(
      req.user!.userId,
      data.data
    );
    res.status(201).json({ message: 'Created.', new: newReminder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function updateReminderController(
  req: Request,
  res: Response
): Promise<void> {
  const data = updateReminderBackendSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: 'Invalid inputs.', error: data.error });
    return;
  }

  try {
    const newReminder = await updateReminderService(
      req.user!.userId,
      req.params.id as string,
      data.data
    );
    res.status(200).json({ message: 'Updated.', new: newReminder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function deleteReminderController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deleted = await deleteReminderService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json(deleted);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function getUpcomingRemindersController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reminders = await getUpcomingRemindersService(req.user!.userId);
    res.status(200).json(reminders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}
