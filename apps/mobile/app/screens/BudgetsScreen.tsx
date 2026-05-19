import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useBudgets } from '../hooks/useBudgets';
import { SafeAreaView } from 'react-native-safe-area-context';
import BudgetCard from '../components/budget/BudgetCard';
import { useFocusEffect } from '@react-navigation/native';
export default function BudgetsScreen() {
  const {
    budgetSummaries,
    errorState,
    isLoadingBudgets,
    refreshBudgetSummaries,
  } = useBudgets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBudgetSummaries();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshBudgetSummaries();
    }, [refreshBudgetSummaries])
  );

  if (isLoadingBudgets) {
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
        {budgetSummaries && budgetSummaries.length > 0 ? (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Budgets
            </Text>
            {budgetSummaries.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No budgets yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
