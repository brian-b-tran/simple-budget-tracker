import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatDate } from '../../utils/dateUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { RecurringExpense } from '@/app/types/recurringExpense';

interface RecurringExpenseRowProps {
  expense: RecurringExpense;
}
type NavProp = NativeStackNavigationProp<RootStackParamList>;
export default function ExpenseRow({ expense }: RecurringExpenseRowProps) {
  const navigation = useNavigation<NavProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('RecurringExpenseDetail', {
          recurringId: expense.id,
        })
      }
    >
      <Card className='mb-1 mt-1'>
        <CardHeader>
          <View className='flex-row justify-between items-center'>
            <CardTitle>
              {expense.type === 'EXPENSE' ? '-' : '+'}
              {new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: expense.currencyOriginal,
              }).format(expense.amountOriginal)}
            </CardTitle>
            <Text>{expense.currencyOriginal}</Text>
          </View>
          <CardDescription>
            <View>
              <Text>Next Occurrence: {formatDate(expense.nextRunDate)}</Text>
              <Text>Started: {formatDate(expense.startDate)}</Text>
              {expense.endDate ? (
                <Text>Ending on: {formatDate(expense.endDate)}</Text>
              ) : (
                <Text>No End Date</Text>
              )}
            </View>
          </CardDescription>
        </CardHeader>
      </Card>
    </TouchableOpacity>
  );
}
