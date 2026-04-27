import React from 'react';
import { View, Text } from 'react-native';
import { BudgetSummary } from '../../app/types/budgetTypes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SimpleProgress from '../ui/simpleProgress';

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

export default function BudgetCard({ budget }: BudgetCardProps) {
  return (
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
          Spent: ${budget.totalSpent} of ${budget.totalAmount}
        </Text>
      </CardContent>
      <CardFooter>
        <Text>Remaining: ${budget.remaining}</Text>
      </CardFooter>
    </Card>
  );
}
