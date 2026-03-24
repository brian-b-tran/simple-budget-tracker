import React from 'react';
import { View, Text } from 'react-native';
interface ProfileScreenProps {
  onLogout: () => void;
}
export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile</Text>
    </View>
  );
}
