import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BudgetSummary } from '../../types/budgetTypes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SimpleProgress from '../ui/simpleProgress';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/types/navigationTypes';

interface BudgetCardProps {
  budget: BudgetSummary;
}
/** Example:
    "id": "ba1c0159-c70e-4487-99d4-8f537929cc20",
    "userId": "bccf7ae8-30ee-441f-b1c6-453d61f1bd25",
    "name": "Main Monthly",
    "type": "MONTHLY",
    "currency": "CAD",
    "totalAmount": "4000",
    "startDate": null,
    "endDate": null,
    "startTime": null,
    "endTime": null,
    "notes": null,
    "createdAt": "2026-04-11T02:25:53.736Z",
    "updatedAt": "2026-04-11T02:25:53.736Z",
    "totalSpent": 0,
    "remaining": 4000,
    "percentageUsed": 0,
    "categoryBreakdown": [] */
type NavProp = NativeStackNavigationProp<RootStackParamList>;
export default function BudgetCard({ budget }: BudgetCardProps) {
  const navigation = useNavigation<NavProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BudgetDetail', { budgetId: budget.id })
      }
    >
      <Card className='mt-2'>
        <CardHeader>
          <View className='flex-row justify-between items-center'>
            <CardTitle>{budget.name}</CardTitle>
            <Text>{budget.type}</Text>
          </View>
          <CardDescription>{budget.currency}</CardDescription>
        </CardHeader>

        <CardContent>
          <SimpleProgress value={budget.percentageUsed} />
          <Text>
            Spent: ${budget.totalSpent.toFixed(2)} of $
            {budget.totalAmount.toFixed(2)}
          </Text>
        </CardContent>
        <CardFooter>
          <Text>Remaining: ${budget.remaining.toFixed(2)}</Text>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
}
