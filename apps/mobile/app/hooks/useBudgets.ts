import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { BudgetSummary } from '../types/budgetTypes';
import { getAllBudgets } from '../services/budgetService';
export function useBudgets() {
  const [budgetSummaries, setBudgetsSummaries] = useState<BudgetSummary[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState<boolean>(false);

  const loadBudgetSummaries = useCallback(async (): Promise<void> => {
    setErrorState(null);
    setIsLoadingBudgets(true);
    try {
      const budgets = await getAllBudgets();
      setBudgetsSummaries(budgets);
      console.log(`Budgets Loaded: PaginatedExpenses: ${budgets.length}`);
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setIsLoadingBudgets(false);
    }
  }, []);

  useEffect(() => {
    loadBudgetSummaries();
  }, []);

  return {
    budgetSummaries,
    errorState,
    isLoadingBudgets,
    refreshBudgetSummaries: loadBudgetSummaries,
  };
}
