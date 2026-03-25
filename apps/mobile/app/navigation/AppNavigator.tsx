import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export function RootStack() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name='Main'>
            {() => <MainTabs onLogout={() => setIsAuthenticated(false)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Auth'>
            {() => <AuthStack onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
