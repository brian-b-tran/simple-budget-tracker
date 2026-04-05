import api from './api';
import { Category } from '../types/categoryTypes';
import { handleError } from '../utils/serviceUtils';

export const getCategories = async (): Promise<Array<Category>> => {
  try {
    const { data } = await api.get<Array<Category>>(`/categories`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
export const createCategory = async (name: string): Promise<Category> => {
  try {
    const { data } = await api.post<Category>(`/categories`, name);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
export const updateCategory = async (
  categoryId: string,
  name: string
): Promise<Category> => {
  try {
    const { data } = await api.put<Category>(`/categories/${categoryId}`, name);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
export const deleteCategory = async (categoryId: string): Promise<Category> => {
  try {
    const { data } = await api.delete<Category>(`/categories/${categoryId}`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
