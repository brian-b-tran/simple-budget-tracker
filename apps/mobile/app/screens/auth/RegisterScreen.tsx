import React from 'react';
import { View, Text } from 'react-native';
interface RegisterScreenProps {
  onRegister: (email: string, password: string) => void;
}
function RegisterScreen({ onRegister }: RegisterScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
    </View>
  );
}
export default RegisterScreen;
