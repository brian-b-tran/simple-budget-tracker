import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDashboard } from '../hooks/useDashboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import BudgetCard from '@/app/components/budget/BudgetCard';
import ExpenseRow from '@/app/components/expense/ExpenseRow';
import { Expense } from '../types/expenseTypes';
import { Reminder } from '../types/reminderTypes';
import ReminderRow from '../components/reminder/reminderRow';
export default function DashboardScreen() {
  const {
    activeBudgets,
    recentExpenses,
    upcomingReminders,
    refreshDash,
    isLoading,
    errorState,
  } = useDashboard();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshDash();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#ffff00' />
      </SafeAreaView>
    );
  }
  if (errorState) {
    return (
      <SafeAreaView className='flex-1'>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        >
          <View>
            <Text className='align-center text-center'>
              An error occurred please refresh the page!
            </Text>
            <Text className='align-center text-center'>{errorState}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className='flex-1 bg-slate-50'>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className='flex-1'
        contentContainerStyle={{ padding: 4 }}
      >
        {/* Greeting */}
        <View className='mb-6 ml-6 mr-6'>
          <Text className='text-3xl font-bold text-slate-800'>
            Hello there! 👋
          </Text>
          <Text className='text-slate-500 mt-1'>
            Here's your financial overview
          </Text>
        </View>
        {/* Budget Overview */}
        {activeBudgets && activeBudgets.length > 0 ? (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Budgets
            </Text>
            {activeBudgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No budgets yet</Text>
        )}

        {/* Recent Expenses */}
        {recentExpenses && recentExpenses.data.length > 0 ? (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Recent Expenses
            </Text>
            {recentExpenses.data.map((expense: Expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No Expenses yet</Text>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders && upcomingReminders.length > 0 ? (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Reminders
            </Text>
            {upcomingReminders.map((reminder: Reminder) => (
              <ReminderRow key={reminder.id} reminder={reminder} />
            ))}
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No Reminders yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
