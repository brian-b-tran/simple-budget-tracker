import React, { useState } from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseRow from '../components/expense/ExpenseRow';
import { Expense } from '../types/expenseTypes';

export default function ExpensesScreen() {
  const {
    recentExpenses,
    refreshExpenses,
    expenseTotals,
    loadMoreExpenses,
    totalsLoading,
    refreshTotal,
    listLoading,
    errorState,
    hasMore,
  } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<CycleKey>('today');

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshExpenses();
    await refreshTotal();
    setRefreshing(false);
  }, []);

  const cycleOrder = ['today', 'week', 'month', 'year'] as const;

  type CycleKey = (typeof cycleOrder)[number];

  function cycleTotals() {
    setSelected((prev) => {
      const index = cycleOrder.indexOf(prev);
      const nextIndex = (index + 1) % cycleOrder.length;
      return cycleOrder[nextIndex];
    });
  }
  const displayedTotal = expenseTotals?.[selected] ?? 0;

  if (listLoading || totalsLoading) {
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
            ${displayedTotal.toFixed(2)}
          </Text>

          <Text>Showing: {selected}</Text>

          {/* Cycle button */}
          <TouchableOpacity onPress={cycleTotals}>
            <Text>Cycle</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Expenses */}
        {recentExpenses && recentExpenses.data.length > 0 ? (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Recent Expenses
            </Text>
            {recentExpenses.data.map((expense: Expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}

            <TouchableOpacity
              onPress={loadMoreExpenses}
              disabled={!hasMore}
              className={`h-14 rounded-xl items-center justify-center ${!hasMore ? 'hidden' : 'bg-slate-400'}`}
            >
              <Text className='text-white-400 text-xl'>Load More</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No Expenses yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
