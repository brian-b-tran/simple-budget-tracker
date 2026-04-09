import { useEffect, useState } from 'react';
import { Budget } from '../types/budgetTypes';
import { PaginatedExpenses } from '../types/expenseTypes';
import { Reminder } from '../types/reminderTypes';
import { getAllBudgets } from '../services/budgetService';
import { getFilteredExpenses } from '../services/expenseService';
import { getUpcomingReminders } from '../services/reminderService';

export function useDashboard() {
  const [activeBudgets, setActiveBudgets] = useState<Budget[]>();
  const [recentExpenses, setRecentExpenses] = useState<PaginatedExpenses>();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [budgets, expenses, reminders] = await Promise.all([
          getAllBudgets(),
          getFilteredExpenses({ page: 1, limit: 10 }),
          getUpcomingReminders(),
        ]);
        setActiveBudgets(budgets);
        setRecentExpenses(expenses);
        setUpcomingReminders(reminders);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          'An unexpected error occurred while loading the dashboard.';
        setErrorState(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return {
    activeBudgets,
    recentExpenses,
    upcomingReminders,
    isLoading,
    errorState,
  };
}
