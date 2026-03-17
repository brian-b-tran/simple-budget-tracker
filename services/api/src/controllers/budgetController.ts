import { Request, Response } from 'express';
import {
  getBudgetService,
  getAllBudgetsService,
  createBudgetService,
  updateBudgetService,
  deleteBudgetService,
} from '../services/budgetServices';
import {
  createBudgetSchema,
  updateBudgetSchema,
} from '../validators/budgetValidators';

export async function getBudgetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const budget = await getBudgetService(
      req.user!.userId,
      req.params.id as string
    );

    res.status(200).json(budget);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Internal server error Budget endpoint.' });
    }
  }
}

export async function getAllBudgetsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const allBudgets = await getAllBudgetsService(req.user!.userId);
    res.status(200).json({ budgets: allBudgets });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Internal server error Budget endpoint.' });
    }
  }
}

export async function createBudgetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const budgetData = createBudgetSchema.safeParse(req.body);
    if (!budgetData.success) {
      res.status(400).json({ message: budgetData.error });
      return;
    }
    const newBudget = await createBudgetService(
      req.user!.userId,
      budgetData.data
    );

    res.status(201).json({ newBudget: newBudget });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Internal server error Budget endpoint.' });
    }
  }
}

export async function updateBudgetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const budgetData = updateBudgetSchema.safeParse(req.body);
    if (!budgetData.success) {
      res.status(400).json({ message: budgetData.error });
      return;
    }
    const updatedBudget = await updateBudgetService(
      req.user!.userId,
      req.params.id as string,
      budgetData.data
    );

    res.status(200).json({ updatedBudget: updatedBudget });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Internal server error Budget endpoint.' });
    }
  }
}

export async function deleteBudgetController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const budget = await deleteBudgetService(
      req.user!.userId,
      req.params.id as string
    );

    res.status(200).json(budget);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Internal server error Budget endpoint.' });
    }
  }
}
