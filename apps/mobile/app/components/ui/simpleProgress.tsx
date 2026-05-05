import { View } from 'react-native';

interface SimpleProgressProps {
  value: number; // 0-100
}

export default function SimpleProgress({ value }: SimpleProgressProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <View className='w-full h-2 bg-slate-200 rounded-full overflow-hidden'>
      <View
        className='h-full bg-blue-500 rounded-full'
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}
