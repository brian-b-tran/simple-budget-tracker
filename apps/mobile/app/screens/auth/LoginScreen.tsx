import React from 'react';
import { View, Text } from 'react-native';
interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}
function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
    </View>
  );
}
export default LoginScreen;
