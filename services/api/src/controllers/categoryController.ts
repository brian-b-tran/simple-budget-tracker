import { Request, Response } from 'express';
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/categoryService';

export async function getAllCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await getAllCategoriesService(req.user!.userId);
    res.status(200).json(categories);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function createCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = await createCategoryService(
      req.user!.userId,
      req.body.categoryName
    );
    res.status(201).json({ category: category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function updateCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = await updateCategoryService(
      req.user!.userId,
      req.params.id as string,
      req.body.categoryName
    );
    res.status(200).json({ category: category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function deleteCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = await deleteCategoryService(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json({ category: category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
