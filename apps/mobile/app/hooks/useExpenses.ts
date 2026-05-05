import { useCallback, useEffect, useState } from 'react';
import { PaginatedExpense } from '../types/expenseTypes';
import { getFilteredExpenses } from '../services/expenseService';
import { FilterExpenseInput } from '@expense-app/types';

export function useExpenses() {
  const [recentExpenses, setRecentExpenses] = useState<PaginatedExpense>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterExpenseInput>({
    page: page,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [expenseTotals, setExpenseTotals] = useState({});
  const loadTotals = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Loading More Expenses.');
      const expenses = await getFilteredExpenses({
        ...filters,
        page: page + 1,
      });
      setPage((prev) => prev + 1);
      setRecentExpenses((prev) => ({
        ...expenses,
        data: [...(prev?.data ?? []), ...expenses.data],
      }));

      console.log(`Items Loaded: PaginatedExpenses: ${expenses.data.length}`);
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const loadMoreExpenses = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Loading More Expenses.');
      const expenses = await getFilteredExpenses({
        ...filters,
        page: page + 1,
      });
      setPage((prev) => prev + 1);
      setRecentExpenses((prev) => ({
        ...expenses,
        data: [...(prev?.data ?? []), ...expenses.data],
      }));

      console.log(`Items Loaded: PaginatedExpenses: ${expenses.data.length}`);
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentExpenses = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Loading Expenses.');
      const expenses = await getFilteredExpenses({
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
      });
      setRecentExpenses(expenses);
      console.log(`Items Loaded: PaginatedExpenses: ${expenses.data.length}`);
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRecentExpenses();
  }, []);

  return {
    recentExpenses,
    loadMoreExpenses,
    refreshExpenses: loadRecentExpenses,
    isLoading,
    errorState,
  };
}
