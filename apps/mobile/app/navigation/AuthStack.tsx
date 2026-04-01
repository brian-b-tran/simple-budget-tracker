import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

const Stack = createNativeStackNavigator();
interface AuthStackProps {
  onLogin: (data: { email: string; password: string }) => void;
  onRegister: (email: string, password: string) => void;
}

function AuthStack({ onLogin, onRegister }: AuthStackProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='LoginScreen'>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name='RegisterScreen'>
        {(props) => <RegisterScreen {...props} onRegister={onRegister} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
export default AuthStack;
