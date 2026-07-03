import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useBudgets } from '../hooks/useBudgets';
import { SafeAreaView } from 'react-native-safe-area-context';
import BudgetCard from '../components/budget/BudgetCard';
import { useFocusEffect } from '@react-navigation/native';
import AddBudgetModal from '../components/budget/budgetForms/AddBudgetModal';
export default function BudgetsScreen() {
  const {
    budgetSummaries,
    errorState,
    isLoadingBudgets,
    refreshBudgetSummaries,
  } = useBudgets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

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
        {/* Budget Overview */}
        {budgetSummaries && budgetSummaries.length > 0 ? (
          <View>
            {/* <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              Budgets
            </Text> */}
            {budgetSummaries.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </View>
        ) : (
          <Text className='text-slate-400 ml-6 mt-2'>No budgets yet</Text>
        )}
        <TouchableOpacity
          onPress={() => setCreateModalOpen(true)}
          className={`h-14 rounded-xl items-center justify-center mt-4 bg-slate-400`}
        >
          <Text className='text-white-400 text-xl'>Add New Budget</Text>
        </TouchableOpacity>
      </ScrollView>
      <AddBudgetModal
        visible={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      ></AddBudgetModal>
    </SafeAreaView>
  );
}
