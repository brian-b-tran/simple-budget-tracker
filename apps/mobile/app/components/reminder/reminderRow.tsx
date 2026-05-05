import { View, Text } from 'react-native';
import type { Reminder } from '../../types/reminderTypes';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { formatDate, formatTime } from '@/app/utils/dateUtils';
interface ReminderRowProps {
  reminder: Reminder;
}
export default function ReminderRow({ reminder }: ReminderRowProps) {
  return (
    <Card className='mb-1 mt-2'>
      <CardHeader>
        <View className='flex-row justify-between items-center'>
          <CardTitle>{reminder.title}</CardTitle>
          {reminder.recurring && <Text>{reminder.recurrenceFrequency}</Text>}
        </View>
        <CardDescription>
          <Text>
            {formatDate(reminder.dateTime) +
              ' ' +
              formatTime(reminder.dateTime)}
          </Text>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
