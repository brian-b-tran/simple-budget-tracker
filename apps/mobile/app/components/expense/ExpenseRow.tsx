import { Expense, FormattedExpenseAmount } from '@/app/types/expenseTypes';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatTime } from '@/app/utils/dateUtils';
import { formatDate } from '../../utils/dateUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/app/store/authContext';
import { formatCurrency, formatExpenseAmount } from '@/app/utils/currencyUtils';
import { useState } from 'react';

interface ExpenseRowProps {
  expense: Expense;
}

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExpenseRow({ expense }: ExpenseRowProps) {
  const navigation = useNavigation<NavProp>();
  const { userProfile } = useAuth();
  const { amountOriginalString, amountConvertedString } = formatExpenseAmount(
    expense,
    userProfile?.currency ?? 'CAD'
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ExpenseDetail', { expenseId: expense.id })
      }
    >
      <Card className='mb-1 mt-1'>
        <CardHeader>
          <View className='flex-row justify-between items-center'>
            <CardTitle>
              {expense.type === 'EXPENSE' ? '-' : '+'}
              {amountOriginalString}
              {amountConvertedString && (
                <Text className='text-slate-400 text-sm'>
                  {amountConvertedString}
                </Text>
              )}
            </CardTitle>
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
