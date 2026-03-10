import prisma from '../config/db';
import { Category } from '../../generated/prisma/client';

export async function getAllCategoriesService(
  userId: string
): Promise<Array<Category>> {
  const categories = await prisma.category.findMany({
    where: { userId: userId },
  });

  return categories;
}

export async function createCategoryService(
  userId: string,
  categoryName: string
): Promise<Category> {
  if (
    await prisma.category.findUnique({
      where: { userId_name: { userId: userId, name: categoryName } },
    })
  ) {
    throw new Error('Category already exists.');
  }

  const newCategory = await prisma.category.create({
    data: {
      userId: userId,
      name: categoryName,
      isDefault: false,
    },
  });
  return newCategory;
}

export async function updateCategoryService(
  userId: string,
  categoryId: string,
  newName: string
): Promise<Category> {
  if (
    await prisma.category.findUnique({
      where: { userId_name: { userId: userId, name: newName } },
    })
  ) {
    throw new Error('Cannot update category name. Category already exists.');
  }
  const category = await prisma.category.findUnique({
    where: { id: categoryId, userId: userId },
  });
  if (!category) {
    throw new Error('Category not found.');
  }
  return await prisma.category.update({
    where: { id: categoryId, userId: userId },
    data: {
      name: newName,
    },
  });
}

export async function deleteCategoryService(
  userId: string,
  categoryId: string
): Promise<Category> {
  const expenseCount = await prisma.expense.count({
    where: { categoryId: categoryId },
  });
  if (expenseCount > 0) {
    throw new Error('Cannot delete category with linked expenses.');
  }
  const deleted = await prisma.category.delete({
    where: { id: categoryId, userId: userId },
  });

  return deleted;
}
