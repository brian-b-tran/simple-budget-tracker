import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, View, Text } from 'react-native';

export default function DefaultDateTimePicker() {
  const [date, setDate] = useState<Date>(new Date(1598051730000));

  const showMode = (currentMode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (
        event: DateTimePickerEvent,
        selectedDate: Date = new Date(1598051730000)
      ) => setDate(selectedDate),
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <Button onPress={showDatepicker} title='Show date picker!' />
      <Button onPress={showTimepicker} title='Show time picker!' />
      <Text>selected: {date.toLocaleString()}</Text>
    </View>
  );
}
