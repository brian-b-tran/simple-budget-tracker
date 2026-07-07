import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../store/authContext';
import { ActivityIndicator, View } from 'react-native';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import { RootStackParamList } from '../types/navigationTypes';
import RecurringExpenseDetailScreen from '../screens/RecurringExpenseDetailScreen';
import BudgetDetailScreen from '../screens/BudgetDetailScreen';
import ReminderDetailScreen from '../screens/ReminderDetailScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  const { accessToken, isLoading, login, logout, register } = useAuth();
  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-slate-50'>
        <ActivityIndicator size='large' color='#4f46e5' />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {accessToken ? (
          <>
            <Stack.Screen name='Main' options={{ headerShown: false }}>
              {() => <MainTabs onLogout={logout} />}
            </Stack.Screen>

            <Stack.Screen name='ExpenseDetail' options={{ title: 'Details' }}>
              {() => <ExpenseDetailScreen />}
            </Stack.Screen>

            <Stack.Screen
              name='RecurringExpenseDetail'
              options={{ title: 'Details' }}
            >
              {() => <RecurringExpenseDetailScreen />}
            </Stack.Screen>

            <Stack.Screen name='BudgetDetail' options={{ title: 'Details' }}>
              {() => <BudgetDetailScreen />}
            </Stack.Screen>

            <Stack.Screen name='ReminderDetail' options={{ title: 'Details' }}>
              {() => <ReminderDetailScreen />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name='Auth' options={{ headerShown: false }}>
            {() => <AuthStack onLogin={login} onRegister={register} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
