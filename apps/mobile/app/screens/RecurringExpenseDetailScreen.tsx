import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useCallback, useEffect, useState } from 'react';
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
import { formatDate } from '../utils/dateUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EditExpenseModal from '../components/expense/EditExpenseModal';
import { RecurringExpense } from '../types/recurringExpense';
import {
  deleteRecurringExpense,
  getRecurringExpense,
} from '../services/recurringExpenseService';
type RecurringExpenseDetailRouteProp = RouteProp<
  RootStackParamList,
  'RecurringExpenseDetail'
>;

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

type NavProp = NativeStackNavigationProp<RootStackParamList>;
export default function RecurringExpenseDetailScreen() {
  const route = useRoute<RecurringExpenseDetailRouteProp>();
  const { recurringId } = route.params;
  const [detailedRecurringExpense, setDetailedRecurringExpense] =
    useState<RecurringExpense>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const navigation = useNavigation<NavProp>();

  const loadExpense = async () => {
    setIsLoading(true);
    try {
      const expense = await getRecurringExpense(recurringId);
      setDetailedRecurringExpense(expense);
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
      await deleteRecurringExpense(id);
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
  }, [recurringId]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
      </SafeAreaView>
    );
  }

  if (errorState || !detailedRecurringExpense) {
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
                currency: detailedRecurringExpense.currencyOriginal,
              }).format(detailedRecurringExpense.amountOriginal)}{' '}
            </Text>
            <Text className='text-md'>
              {detailedRecurringExpense.currencyOriginal}
            </Text>
          </View>

          <Text
            className={`text-2xl ${detailedRecurringExpense.type === 'EXPENSE' ? 'bg-rose-400' : 'bg-green-300'} rounded-xl text-center mt-4`}
          >
            {detailedRecurringExpense.type === 'EXPENSE' ? 'Expense' : 'Income'}
          </Text>

          {detailedRecurringExpense.categoryId && (
            <>
              <Text className='text-2xl bg-amber-100 rounded-xl text-center mt-2'>
                {detailedRecurringExpense.category
                  ? detailedRecurringExpense.category.name
                  : 'No Category'}
              </Text>
            </>
          )}

          <View className='text-2xl text-center mt-6'>
            <Text>
              Next Occurrence:
              {formatDate(detailedRecurringExpense.nextRunDate)}
            </Text>
            <Text>
              Started: {formatDate(detailedRecurringExpense.startDate)}
            </Text>
            {detailedRecurringExpense.endDate ? (
              <Text>
                Ending on: {formatDate(detailedRecurringExpense.endDate)}
              </Text>
            ) : (
              <Text>No End Date</Text>
            )}
          </View>

          {detailedRecurringExpense.budgetId && (
            <>
              <Text className='text-2xl mt-4 mb-4 bg-cyan-100 rounded-xl text-center mt-2'>
                {detailedRecurringExpense.budget?.name}
              </Text>
            </>
          )}

          <View className='bg-slate-100 min-h-[200px] p-2 rounded-xl mb-4'>
            <Text className='text-xl'>
              {detailedRecurringExpense.notes
                ? detailedRecurringExpense.notes
                : 'No notes.'}
            </Text>
          </View>

          <View className='mt-auto'>
            {
              <Text className='text-2xl'>
                {detailedRecurringExpense.interval > 1
                  ? `Recurring every ${detailedRecurringExpense?.interval} ${detailedRecurringExpense?.frequency === 'DAILY' ? 'days' : detailedRecurringExpense?.frequency === 'MONTHLY' ? 'months' : detailedRecurringExpense?.frequency === 'WEEKLY' ? 'weeks' : 'years'}.`
                  : `Recurring every ${detailedRecurringExpense?.frequency === 'DAILY' ? 'day' : detailedRecurringExpense?.frequency === 'MONTHLY' ? 'month' : detailedRecurringExpense?.frequency === 'WEEKLY' ? 'week' : 'year'}.`}
              </Text>
            }
          </View>
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
            onPress={() => handleDelete(detailedRecurringExpense.id)}
          >
            <Text className='text-white font-bold'>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <EditExpenseModal
        visible={editModalOpen}
        onClose={(): void => {
          setEditModalOpen(false);
          onRefresh();
        }}
        expense={detailedRecurringExpense}
      /> */}
    </SafeAreaView>
  );
}
