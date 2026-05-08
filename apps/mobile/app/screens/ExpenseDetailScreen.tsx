import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useCallback, useEffect, useState } from 'react';
import { Expense } from '../types/expenseTypes';
import { getExpense } from '../services/expenseService';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, formatTime } from '../utils/dateUtils';
type ExpenseDetailRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

/**  
  id: string;
  userId: string;
  amountOriginal: number;
  currencyOriginal: string;
  amountBase?: number;
  exchangeRateUsed?: number;
  categoryId: string;
  budgetId?: string;
  recurringExpenseId?: string;
  notes?: string;
  date: string;
  time: string;
  type: 'EXPENSE' | 'INCOME';
  createdAt: string;
  updatedAt: string;
*/

export default function ExpenseDetailScreen() {
  const route = useRoute<ExpenseDetailRouteProp>();
  const { expenseId } = route.params;
  const [detailedExpense, setDetailedExpense] = useState<Expense>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpense = async () => {
    setIsLoading(true);
    try {
      const expense = await getExpense(expenseId);
      setDetailedExpense(expense);
    } catch (error: any) {
      setErrorState(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpense();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadExpense();
  }, [expenseId]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
      </SafeAreaView>
    );
  }

  if (errorState || !detailedExpense) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
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
    <SafeAreaView className='flex-1'>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        {detailedExpense && (
          <View className='flex center p-6'>
            <Text>{detailedExpense.amountOriginal}</Text>
            <Text>{detailedExpense.currencyOriginal}</Text>

            <Text>{detailedExpense.type}</Text>
            <Text>
              {formatDate(detailedExpense.date) +
                ' ' +
                formatTime(detailedExpense.time)}
            </Text>

            {detailedExpense.budgetId && (
              <>
                <Text>{detailedExpense.budgetId}</Text>
                <Text>{detailedExpense.budget?.name}</Text>
              </>
            )}

            {detailedExpense.categoryId && (
              <>
                <Text>{detailedExpense.categoryId}</Text>
                <Text>{detailedExpense.category?.name}</Text>
              </>
            )}

            <Text>{detailedExpense.notes}</Text>
            <Text>${detailedExpense.amountBase}</Text>
            <Text>{detailedExpense.recurringExpenseId}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
