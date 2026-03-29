import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../store/authContext';
import { ActivityIndicator } from 'react-native';
const Stack = createNativeStackNavigator();

export function RootStack() {
  const { accessToken, isLoading, login, logout, register } = useAuth();
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {accessToken ? (
          <Stack.Screen name='Main'>
            {() => <MainTabs onLogout={logout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Auth'>
            {() => <AuthStack onLogin={login} onRegister={register} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
