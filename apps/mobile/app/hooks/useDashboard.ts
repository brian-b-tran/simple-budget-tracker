import { useCallback, useEffect, useState } from 'react';
import { BudgetSummary } from '../types/budgetTypes';
import { PaginatedExpenses } from '../types/expenseTypes';
import { Reminder } from '../types/reminderTypes';
import { getAllBudgets } from '../services/budgetService';
import { getFilteredExpenses } from '../services/expenseService';
import { getUpcomingReminders } from '../services/reminderService';

export function useDashboard() {
  const [activeBudgets, setActiveBudgets] = useState<BudgetSummary[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<PaginatedExpenses>();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      console.log('Loading Dashboard');
      const [budgets, expenses, reminders] = await Promise.all([
        getAllBudgets(),
        getFilteredExpenses({ page: 1, limit: 10 }),
        getUpcomingReminders(),
      ]);
      setActiveBudgets(budgets);
      setRecentExpenses(expenses);
      setUpcomingReminders(reminders);
      console.log(
        `Items Loaded: Budgets: ${budgets.length}, Expenses: ${expenses.data.length}, Reminders: ${reminders.length}`
      );
    } catch (error: any) {
      const errorMsg = error.message
        ? error.message
        : 'Unexpected Error occurred.';
      setErrorState(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    activeBudgets,
    recentExpenses,
    upcomingReminders,
    refreshDash: loadDashboard,
    isLoading,
    errorState,
  };
}
