import { Expense } from '@/app/types/expenseTypes';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatTime } from '@/app/utils/dateUtils';
import { formatDate } from '../../utils/dateUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/types/navigationTypes';
import { useNavigation } from '@react-navigation/native';

interface ExpenseRowProps {
  expense: Expense;
}
type NavProp = NativeStackNavigationProp<RootStackParamList>;
export default function ExpenseRow({ expense }: ExpenseRowProps) {
  const navigation = useNavigation<NavProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ExpenseDetail', { expenseId: expense.id })
      }
    >
      <Card className='mb-1 mt-1'>
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
    </TouchableOpacity>
  );
}
