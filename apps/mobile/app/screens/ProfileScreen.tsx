import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../store/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
interface ProfileScreenProps {
  onLogout: () => void;
}
export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await onLogout();
    setIsLoggingOut(false);
  };
  return (
    <SafeAreaView>
      <View
        style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          className={`p-4 h-14 rounded-xl items-center justify-center ${isLoggingOut ? 'bg-indigo-400' : 'bg-indigo-600'}`}
        >
          {isLoggingOut ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-white font-bold text-lg'>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
