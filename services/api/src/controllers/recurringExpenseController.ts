import { Request, Response } from 'express';
import {
  createRecurringExpenseBackendSchema,
  updateRecurringExpenseBackendSchema,
} from '@expense-app/types';
import {
  getRecurringExpenseService,
  getAllRecurringExpenseService,
  createRecurringExpenseService,
  updateRecurringExpenseService,
  deleteRecurringExpenseService,
} from '../services/recurringExpenseService';

export async function getRecurringExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const recurringExpense = await getRecurringExpenseService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json(recurringExpense);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function getAllRecurringExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const RecurringExpenses = await getAllRecurringExpenseService(
      req.user!.userId
    );
    res.status(200).json(RecurringExpenses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function createRecurringExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  const data = createRecurringExpenseBackendSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: data.error });
    return;
  }
  try {
    const newRecurringExpense = await createRecurringExpenseService(
      req.user!.userId,
      data.data
    );
    res.status(201).json({ recurringExpense: newRecurringExpense });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function updateRecurringExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  const data = updateRecurringExpenseBackendSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: data.error });
    return;
  }
  try {
    const updatedRecurringExpense = await updateRecurringExpenseService(
      req.user!.userId,
      req.params.id as string,
      data.data
    );
    res.status(200).json({ recurringExpense: updatedRecurringExpense });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Service Error.' });
    }
  }
}

export async function deleteRecurringExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deleted = await deleteRecurringExpenseService(
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
