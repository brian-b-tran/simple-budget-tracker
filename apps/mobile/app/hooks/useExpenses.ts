import { useCallback, useEffect, useState } from 'react';
import { ExpenseTotals, PaginatedExpense } from '../types/expenseTypes';
import {
  getExpenseTotals,
  getFilteredExpenses,
} from '../services/expenseService';
import { FilterExpenseInput } from '@expense-app/types';

export function useExpenses() {
  // list state
  const [recentExpenses, setRecentExpenses] = useState<PaginatedExpense>();
  const [listLoading, setListLoading] = useState(false);

  // totals state
  const [expenseTotals, setExpenseTotals] = useState<ExpenseTotals>();
  const [totalsLoading, setTotalsLoading] = useState(false);

  const [errorState, setErrorState] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterExpenseInput>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [hasMore, setHasMore] = useState(true);
  const loadTotals = useCallback(async () => {
    try {
      setTotalsLoading(true);
      setErrorState(null);
      const totals = await getExpenseTotals();

      setExpenseTotals(totals);
    } catch (error: any) {
      setErrorState(error.message ?? 'Unexpected error');
    } finally {
      setTotalsLoading(false);
    }
  }, []);

  const loadMoreExpenses = async () => {
    try {
      setErrorState(null);
      console.log('Loading more expenses.');
      if (!hasMore) return;

      const nextPage = filters.page + 1;

      const expenses = await getFilteredExpenses({
        ...filters,
        page: nextPage,
      });

      if (filters.page >= expenses.totalPages) {
        setHasMore(false);
        return;
      }
      if (expenses.data.length === 0) {
        setHasMore(false);
        return;
      }

      setFilters((prev) => ({ ...prev, page: nextPage }));
      console.log(`Items Loaded: PaginatedExpenses: ${expenses.data.length}`);
      setRecentExpenses((prev) => ({
        ...expenses,
        data: [...(prev?.data ?? []), ...expenses.data],
      }));
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    }
  };

  const loadRecentExpenses = useCallback(async (): Promise<void> => {
    try {
      setErrorState(null);
      setListLoading(true);
      setHasMore(true);

      console.log('Loading Expenses.');
      const expenses = await getFilteredExpenses({
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setFilters((prev) => ({ ...prev, page: 1 }));
      setRecentExpenses(expenses);

      console.log(`Items Loaded: PaginatedExpenses: ${expenses.data.length}`);
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setListLoading(false);
    }
  }, [filters.limit, filters.sortBy, filters.sortOrder, filters.timeZone]);

  useEffect(() => {
    loadRecentExpenses();
  }, [loadRecentExpenses]);

  useEffect(() => {
    loadTotals();
  }, [loadTotals]);

  return {
    recentExpenses,
    expenseTotals,
    loadMoreExpenses,
    refreshExpenses: loadRecentExpenses,
    refreshTotal: loadTotals,
    totalsLoading,
    listLoading,
    errorState,
    hasMore,
  };
}
