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
import BudgetCard from '@/components/budget/BudgetCard';
import ExpenseRow from '@/components/expense/ExpenseRow';
import { Expense } from '../types/expenseTypes';
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshDash();
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
        <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
          Budgets
        </Text>
        {/* Budget Overview */}
        {activeBudgets &&
          activeBudgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
          Recent Expenses
        </Text>
        {/* Recent Expenses */}
        {recentExpenses &&
          recentExpenses.data.map((expense: Expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
        <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
          Upcoming Reminders
        </Text>
        {/* Upcoming Reminders */}
      </ScrollView>
    </SafeAreaView>
  );
}
