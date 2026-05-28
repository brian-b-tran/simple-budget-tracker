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
import { Expense } from '../types/expenseTypes';
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
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const loadBudget = async () => {
    setIsLoading(true);
    try {
      const budget = await getBudgetDetail(budgetId);
      setBudgetDetail(budget);
      setGroupedExpenses(groupExpensesByDate(budget.expenses.data));
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
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        {/*Details */}
        <View className='flex center p-6 bg-white rounded-xl'>
          <View className=''>
            <Text className='h1'>Progress</Text>
            <SimpleProgress value={budgetDetail.percentageUsed} />
            <Text className='h2'>
              Spent: ${budgetDetail.totalSpent.toFixed(2)} of $
              {budgetDetail.totalAmount.toFixed(2)}
            </Text>
            <Text className='h2'>
              Remaining: ${budgetDetail.remaining.toFixed(2)}
            </Text>

            <Text className='h2'>
              Total: ${budgetDetail.totalAmount.toFixed(2)}
            </Text>
          </View>
          <View className=''>
            <Text className='h1'>Category Breakdowns</Text>
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

The grouping function needs to:

Take the flat expenses array from BudgetDetail
Determine if the budget is weekly-grouped or monthly-grouped (based on date span)
Group expenses into buckets by week or month
Label each bucket with a human-readable heading


grouping function for weeks or months depending on budget timeframes

Current week → "This Week"
Previous week → "Last Week"
2 weeks ago → "Two Weeks Ago"
Anything older → "Week of [date]" e.g. "Week of Mar 3"

Current month → "This Month"
Previous month → "Last Month"
Anything older → the month name e.g. "March", "February"
*/

let groupExpensesByDate = (expenses: Expense[]): Expense[] => {
  return [];
};
