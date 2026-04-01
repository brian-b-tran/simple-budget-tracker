import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator();
interface AuthStackProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

function AuthStack({ onLogin, onRegister }: AuthStackProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login'>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name='Register'>
        {(props) => <RegisterScreen {...props} onRegister={onRegister} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
export default AuthStack;
