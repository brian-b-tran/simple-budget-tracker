import { Request, Response } from 'express';
import {
  filterExpenseSchema,
  getExpenseTotalsQuerySchema,
} from '@expense-app/types';
import {
  getAllExpensesService,
  getExpenseService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
  filterExpenseService,
  getExpenseTotalsService,
} from '../services/expenseService';
import {
  createExpenseBackendSchema,
  updateExpenseBackendSchema,
} from '@expense-app/types';

export async function getAllExpensesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const expenses = await getAllExpensesService(req.user!.userId);
    res.status(200).json(expenses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function getExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const expense = await getExpenseService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json(expense);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function createExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  const body = createExpenseBackendSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error });
    return;
  }

  try {
    const expense = await createExpenseService(req.user!.userId, body.data);
    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function updateExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  const body = updateExpenseBackendSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error });
    return;
  }

  try {
    const expense = await updateExpenseService(
      req.user!.userId,
      req.params.id as string,
      body.data
    );
    res.status(200).json(expense);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function deleteExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const expenses = await deleteExpenseService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json(expenses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function filterExpenseController(
  req: Request,
  res: Response
): Promise<void> {
  const filter = filterExpenseSchema.safeParse(req.query);
  if (!filter.success) {
    res.status(400).json({ message: 'Invalid filter parameters.' });
    return;
  }
  try {
    const filteredExpense = await filterExpenseService(
      req.user!.userId,
      filter.data
    );
    res.status(200).json(filteredExpense);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function getExpenseTotalsController(
  req: Request,
  res: Response
): Promise<void> {
  const result = getExpenseTotalsQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({ message: 'Must provide a timeZone in Request.' });
    return;
  }

  const { timeZone } = result.data;

  try {
    const totals = await getExpenseTotalsService(req.user!.userId, timeZone);
    res.status(200).json(totals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
