import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useCallback, useEffect, useState } from 'react';
import { Expense } from '../types/expenseTypes';
import { deleteExpense, getExpense } from '../services/expenseService';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, formatTime } from '../utils/dateUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EditExpenseModal from '../components/expense/EditExpenseModal';

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
type ExpenseDetailRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExpenseDetailScreen() {
  const route = useRoute<ExpenseDetailRouteProp>();
  const { expenseId } = route.params;
  const [detailedExpense, setDetailedExpense] = useState<Expense>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const navigation = useNavigation<NavProp>();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpense();
    setRefreshing(false);
    setErrorState(null);
  };

  const onDelete = async (id: string) => {
    try {
      setErrorState(null);
      await deleteExpense(id);
      navigation.goBack();
    } catch (error: any) {
      setErrorState(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Deleting Permanently',
      'Are you sure you want to delete this?',
      [
        {
          text: 'Back',
          style: 'cancel',
        },
        { text: 'Confirm', onPress: async () => await onDelete(id) },
      ]
    );
  };

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
        {/*Details */}
        <View className='flex center p-6 bg-white rounded-xl'>
          <View className='flex-row center text-center justify-center mt-4'>
            <Text className='text-4xl'>
              {new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: detailedExpense.currencyOriginal,
              }).format(detailedExpense.amountOriginal)}{' '}
            </Text>
            <Text className='text-md'>{detailedExpense.currencyOriginal}</Text>
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
        {/*Edit and Delete */}
        <View className='p-4 flex-row gap-4 mt-6 relative bottom-0'>
          <TouchableOpacity
            className='flex-1 h-14 rounded-xl items-center justify-center bg-slate-300'
            onPress={() => setEditModalOpen(true)}
          >
            <Text className='text-white font-bold'>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 h-14 rounded-xl items-center justify-center bg-slate-600'
            onPress={() => handleDelete(detailedExpense.id)}
          >
            <Text className='text-white font-bold'>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditExpenseModal
        visible={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          onRefresh();
        }}
        expense={detailedExpense}
      />
    </SafeAreaView>
  );
}
