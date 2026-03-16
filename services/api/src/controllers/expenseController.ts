import { Request, Response } from 'express';
import { filterExpenseSchema } from '../validators/expenseValidators';
import {
  getAllExpensesService,
  getExpenseService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
  filterExpenseService,
} from '../services/expenseServices';
import {
  createExpenseValidationSchema,
  updateExpenseValidationSchema,
} from '../validators/expenseValidators';

export async function getAllExpensesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const expenses = await getAllExpensesService(req.user!.userId);
    res.status(200).json({ expenses: expenses });
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
    res.status(200).json({ expense: expense });
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
  const body = createExpenseValidationSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error });
    return;
  }

  try {
    const expense = await createExpenseService(req.user!.userId, body.data);
    res.status(201).json({ expense: expense });
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
  const body = updateExpenseValidationSchema.safeParse(req.body);
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
    res.status(200).json({ expense: expense });
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
    res.status(200).json({ expenses: expenses });
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
