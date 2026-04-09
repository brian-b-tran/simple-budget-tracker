import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDashboard } from '../hooks/useDashboard';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const {
    activeBudgets,
    recentExpenses,
    upcomingReminders,
    isLoading,
    errorState,
  } = useDashboard();

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className=''>
          <ActivityIndicator size='large' color='#00ff00' />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  if (errorState) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <ScrollView refreshControl={<RefreshControl refreshing={true} />}>
            <Text>An error occurred please refresh the page!</Text>
            <Text>{errorState}</Text>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='bg-slate-50'>
      <View>
        <Text>Dashboard</Text>
      </View>
      <View>
        <Text>Recent Expenses</Text>
      </View>
      <View>
        <Text>Budgets</Text>
      </View>
      <View>
        <Text>Upcoming Reminders</Text>
      </View>
    </ScrollView>
  );
}
