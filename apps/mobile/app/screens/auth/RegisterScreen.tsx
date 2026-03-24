import React from 'react';
import { View, Text } from 'react-native';
interface RegisterScreenProps {
  onLogin: () => void;
}
function RegisterScreen({ onLogin }: RegisterScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
    </View>
  );
}
export default RegisterScreen;
