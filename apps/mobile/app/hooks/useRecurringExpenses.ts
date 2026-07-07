import { useCallback, useEffect, useState } from 'react';

import { FilterExpenseInput } from '@expense-app/types';
import { getFilteredRecurringExpenses } from '../services/recurringExpenseService';
import { PaginatedRecurringExpense } from '../types/recurringExpense';

export function useRecurringExpenses() {
  // list state
  const [recurringExpenses, setRecurringExpenses] =
    useState<PaginatedRecurringExpense>();
  const [listLoading, setListLoading] = useState(false);

  const [errorState, setErrorState] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterExpenseInput>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [hasMoreRecurring, setHasMoreRecurring] = useState(true);

  const loadMoreRecurring = async () => {
    try {
      setErrorState(null);
      console.log('Loading more expenses.');
      if (!hasMoreRecurring) return;

      const nextPage = filters.page + 1;

      const expenses = await getFilteredRecurringExpenses({
        ...filters,
        page: nextPage,
      });

      if (filters.page >= expenses.totalPages) {
        setHasMoreRecurring(false);
        return;
      }
      if (expenses.data.length === 0) {
        setHasMoreRecurring(false);
        return;
      }

      setFilters((prev) => ({ ...prev, page: nextPage }));
      setRecurringExpenses((prev) => ({
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

  const loadRecurringExpenses = useCallback(async (): Promise<void> => {
    try {
      setErrorState(null);
      setListLoading(true);
      setHasMoreRecurring(true);
      const expenses = await getFilteredRecurringExpenses({
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setFilters((prev) => ({ ...prev, page: 1 }));
      setRecurringExpenses(expenses);
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
    loadRecurringExpenses();
  }, [loadRecurringExpenses]);

  return {
    recurringExpenses,
    loadMoreRecurring,
    refreshRecurringExpenses: loadRecurringExpenses,
    listLoading,
    errorState,
    hasMoreRecurring,
  };
}
