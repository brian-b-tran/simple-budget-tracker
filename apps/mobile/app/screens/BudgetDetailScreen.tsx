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
import { deleteBudget, getBudget } from '../services/budgetService';
import { BudgetSummary } from '../types/budgetTypes';

type BudgetDetailRouteProp = RouteProp<RootStackParamList, 'BudgetDetail'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function BudgetDetailScreen() {
  const route = useRoute<BudgetDetailRouteProp>();
  const { budgetId } = route.params;
  const navigation = useNavigation<NavProp>();
  const [budgetDetail, setBudgetDetail] = useState<BudgetSummary>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const loadBudget = async () => {
    setIsLoading(true);
    try {
      const budget = await getBudget(budgetId);
      setBudgetDetail(budget);
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
      //await deleteBudget(id);
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
        <View className='flex center p-6 bg-white rounded-xl'></View>

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
