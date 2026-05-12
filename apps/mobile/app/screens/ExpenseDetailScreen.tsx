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
  TouchableOpacity,
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
    <SafeAreaView className='flex-1 bg-slate-50 pl-4 pr-4 h-full'>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        {detailedExpense && (
          <View className='flex center p-6 bg-white rounded-xl'>
            <View className='flex-row center text-center justify-center mt-4'>
              <Text className='text-4xl'>
                {new Intl.NumberFormat('en-CA', {
                  style: 'currency',
                  currency: detailedExpense.currencyOriginal,
                }).format(detailedExpense.amountOriginal)}{' '}
              </Text>
              <Text className='text-md'>
                {detailedExpense.currencyOriginal}
              </Text>
            </View>

            <Text
              className={`text-2xl ${detailedExpense.type === 'EXPENSE' ? 'bg-rose-400' : 'bg-green-300'} rounded-xl text-center mt-4`}
            >
              {detailedExpense.type === 'EXPENSE' ? 'Expense' : 'Income'}
            </Text>

            {detailedExpense.categoryId && (
              <>
                <Text className='text-2xl bg-amber-100 rounded-xl text-center mt-2'>
                  {detailedExpense.category
                    ? detailedExpense.category.name
                    : 'No Category'}
                </Text>
              </>
            )}

            <Text className='text-2xl text-center mt-6'>
              {formatDate(detailedExpense.date)}
            </Text>

            <Text className='text-2xl text-center mb-4'>
              {formatTime(detailedExpense.time)}
            </Text>

            {detailedExpense.budgetId && (
              <>
                <Text className='text-2xl mt-4 mb-4 bg-cyan-100 rounded-xl text-center mt-2'>
                  {detailedExpense.budget?.name}
                </Text>
              </>
            )}
            <View className='bg-slate-100 min-h-[200px] p-2 rounded-xl mb-4'>
              <Text className='text-xl'>
                {detailedExpense.notes ? detailedExpense.notes : 'No notes.'}
              </Text>
            </View>

            {detailedExpense.recurringExpenseId && (
              <View className='mt-auto'>
                {
                  <Text className='text-2xl'>
                    {detailedExpense.recurringExpense!.interval > 1
                      ? `Recurring every ${detailedExpense.recurringExpense?.interval} ${detailedExpense.recurringExpense?.frequency === 'DAILY' ? 'days' : detailedExpense.recurringExpense?.frequency === 'MONTHLY' ? 'months' : detailedExpense.recurringExpense?.frequency === 'WEEKLY' ? 'weeks' : 'years'}.`
                      : `Recurring every ${detailedExpense.recurringExpense?.frequency === 'DAILY' ? 'day' : detailedExpense.recurringExpense?.frequency === 'MONTHLY' ? 'month' : detailedExpense.recurringExpense?.frequency === 'WEEKLY' ? 'week' : 'year'}.`}
                  </Text>
                }
              </View>
            )}
          </View>
        )}
        <View className='p-4 flex-row gap-4 mt-6 relative bottom-0'>
          <TouchableOpacity className='flex-1 h-14 rounded-xl items-center justify-center bg-slate-300'>
            <Text className='text-white font-bold'>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex-1 h-14 rounded-xl items-center justify-center bg-slate-600'>
            <Text className='text-white font-bold'>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
