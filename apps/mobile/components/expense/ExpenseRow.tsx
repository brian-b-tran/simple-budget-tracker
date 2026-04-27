import { Expense } from '@/app/types/expenseTypes';
import { View, Text } from 'react-native';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatTime } from '@/app/utils/dateUtils';
import { formatDate } from '../../app/utils/dateUtils';

interface ExpenseRowProps {
  expense: Expense;
}
export default function ExpenseRow({ expense }: ExpenseRowProps) {
  return (
    <Card>
      <CardHeader>
        <View className='flex-row justify-between items-center'>
          <CardTitle>${expense.amountOriginal}</CardTitle>
          <Text>{expense.currencyOriginal}</Text>
        </View>
        <CardDescription>
          <Text>
            {formatDate(expense.date) + ' ' + formatTime(expense.time)}
          </Text>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
