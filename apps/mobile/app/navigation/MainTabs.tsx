import React from 'react';
import BudgetsScreen from '../screens/BudgetsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReminderScreen from '../screens/RemindersScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
interface MainTabsProps {
  onLogout: () => void;
}
function MainTabs({ onLogout }: MainTabsProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Dashboard'>{() => <DashboardScreen />}</Tab.Screen>
      <Tab.Screen name='Budgets'>{() => <BudgetsScreen />}</Tab.Screen>
      <Tab.Screen name='Expenses'>{() => <ExpensesScreen />}</Tab.Screen>
      <Tab.Screen name='Reminders'>{() => <ReminderScreen />}</Tab.Screen>
      <Tab.Screen name='Profile'>
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
export default MainTabs;
