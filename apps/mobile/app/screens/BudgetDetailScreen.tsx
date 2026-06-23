import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { deleteBudget, getBudgetDetail } from '../services/budgetService';
import { BudgetDetail } from '../types/budgetTypes';
import SimpleProgress from '../components/ui/simpleProgress';
import { Category } from '../types/categoryTypes';
import { Progress } from '@/components/ui/progress';
import { Expense, ExpenseGroup } from '../types/expenseTypes';
import { groupExpenses } from '../utils/transactionGrouping';
import ExpenseRow from '../components/expense/ExpenseRow';
type BudgetDetailRouteProp = RouteProp<RootStackParamList, 'BudgetDetail'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function BudgetDetailScreen() {
  const route = useRoute<BudgetDetailRouteProp>();
  const { budgetId } = route.params;
  const navigation = useNavigation<NavProp>();
  const [budgetDetail, setBudgetDetail] = useState<BudgetDetail>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [groupedExpenses, setGroupedExpenses] = useState<ExpenseGroup[]>([]);
  const loadBudget = async () => {
    setIsLoading(true);
    try {
      const budget = await getBudgetDetail(budgetId);
      setBudgetDetail(budget);
      setGroupedExpenses(groupExpenses(budget.expenses.data));
    } catch (error: any) {
      setErrorState(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setErrorState(null);
    await loadBudget();
    setRefreshing(false);
  };

  const onDelete = async (id: string) => {
    try {
      setErrorState(null);
      await deleteBudget(id);
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
    loadBudget();
  }, [budgetId]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
      </SafeAreaView>
    );
  }

  if (errorState || !budgetDetail) {
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
        contentContainerStyle={{ flex: 1 }}
      >
        {/*Details */}
        <View className='flex center p-6 bg-white rounded-xl'>
          <View className=''>
            <Text className='text-xl font-bold text-slate-800'>Progress</Text>
            <SimpleProgress value={budgetDetail.percentageUsed} />
            <Text className='text-lg font-bold text-slate-800'>
              Spent: ${budgetDetail.totalSpent.toFixed(2)} of $
              {budgetDetail.totalAmount.toFixed(2)}
            </Text>
            <Text className='text-lg font-bold text-slate-800'>
              Remaining: ${budgetDetail.remaining.toFixed(2)}
            </Text>

            <Text className='text-lg font-bold text-slate-800'>
              Total: ${budgetDetail.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        {groupedExpenses.length > 0 ? (
          <View>
            <View className='flex center p-6 bg-white rounded-xl'>
              <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
                Category Breakdowns
              </Text>

              <View>
                {budgetDetail.categoryBreakdowns.map((cat) => (
                  <View key={cat.categoryId}>
                    <Text>{cat.categoryName}</Text>
                    <Text>
                      Spent: ${cat.spent.toFixed(2)} (%
                      {cat.percentageOfTotal.toFixed(1)})
                    </Text>
                    <SimpleProgress value={cat.percentageOfTotal} />
                  </View>
                ))}
              </View>
            </View>
            <View className='flex center p-6 bg-white rounded-xl'>
              <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
                Transactions in Budget
              </Text>
              <View>
                {groupedExpenses.map((group) => (
                  <View key={group.label}>
                    <Text className='text-slate-500 font-semibold mt-4 mb-1'>
                      {group.label}
                    </Text>
                    {group.expenses.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
              No Transactions in Budget Yet.
            </Text>
          </View>
        )}

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
            onPress={() => handleDelete(budgetDetail.id)}
          >
            <Text className='text-white font-bold'>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 
Budget progress 
Amount spent
Amount Remaining
Timeframe if exists
List of transactions filterable defaulted to groups of dates


sections:
Header: budget name, type, date range if exists
Progress section: SimpleProgress + spent/remaining/total
Category breakdown: list of categories with their percentage
Date range tabs: computed from budget dates (weekly or monthly)
Expense list: filtered by selected tab

*/
