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
import EditBudgetModal from '../components/budget/budgetForms/EditBudgetModal';
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
        className='flex-1'
        contentContainerStyle={{ padding: 4 }}
      >
        <View className='mb-2'>
          <Text className='text-2xl font-bold text-slate-800 text-center'>
            {budgetDetail.name}
          </Text>
        </View>
        <View className='flex gap-5'>
          {/*Details */}
          <View className='flex center p-6 bg-white rounded-xl'>
            <Text className='text-lg font-bold text-slate-800'>
              Spent: ${budgetDetail.totalSpent.toFixed(2)} of $
              {budgetDetail.totalAmount.toFixed(2)}
            </Text>
            <SimpleProgress value={budgetDetail.percentageUsed} />

            <Text className='text-lg font-bold text-slate-800 mt-2'>
              ${budgetDetail.remaining.toFixed(2)} remaining.
            </Text>
          </View>

          {budgetDetail.categoryBreakdown &&
          budgetDetail.categoryBreakdown.length > 0 ? (
            <View className='flex center p-6 bg-white rounded-xl'>
              <Text className='text-xl font-bold text-slate-800'>
                Category Breakdowns
              </Text>

              <View className='mb-2'>
                {budgetDetail.categoryBreakdown.map((cat) => (
                  <View key={cat.categoryId} className='mb-2 mt-2'>
                    <View className='flex-row justify-between'>
                      <Text className='font-bold text-slate-800'>
                        {cat.categoryName}
                      </Text>
                      <Text className='text-slate-600 ml-auto'>
                        ${cat.spent.toFixed(2)} (%
                        {cat.percentageOfTotal.toFixed(1)})
                      </Text>
                    </View>

                    <SimpleProgress value={cat.percentageOfTotal} />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text className='text-xl font-bold text-slate-800'>
                No Breakdowns Available in Budget Yet.
              </Text>
            </View>
          )}

          {groupedExpenses.length > 0 ? (
            <View className='flex center p-6 bg-white rounded-xl'>
              <Text className='text-2xl font-bold text-slate-800 text-center'>
                Transactions in Budget
              </Text>
              <View>
                {groupedExpenses.map((group) => (
                  <View key={group.label}>
                    <Text className='text-slate-500 font-semibold mt-4 mb-1 text-right'>
                      {group.label}
                    </Text>
                    {group.expenses.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text className='text-2xl font-bold text-slate-800 ml-6 mr-6 mt-4'>
                No Transactions in Budget Yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
      <EditBudgetModal
        budget={budgetDetail}
        visible={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          onRefresh();
        }}
      ></EditBudgetModal>
    </SafeAreaView>
  );
}
