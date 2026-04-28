import React, { useState } from 'react';
import BudgetsScreen from '../screens/BudgetsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReminderScreen from '../screens/RemindersScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text } from 'react-native';
import AddExpenseModal from '../components/expense/AddExpenseModal';

const Tab = createBottomTabNavigator();
interface MainTabsProps {
  onLogout: () => void;
}
function MainTabs({ onLogout }: MainTabsProps) {
  const [expenseModalOpen, setExpenseModalOpen] = useState<boolean>(false);
  return (
    <View className='flex-1 m-0 p-0'>
      <Tab.Navigator>
        <Tab.Screen name='Dashboard'>{() => <DashboardScreen />}</Tab.Screen>
        <Tab.Screen name='Budgets'>{() => <BudgetsScreen />}</Tab.Screen>
        <Tab.Screen name='Expenses'>{() => <ExpensesScreen />}</Tab.Screen>
        <Tab.Screen name='Reminders'>{() => <ReminderScreen />}</Tab.Screen>
        <Tab.Screen name='Profile'>
          {() => <ProfileScreen onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => setExpenseModalOpen(true)}
        activeOpacity={1}
        style={{
          position: 'absolute',
          bottom: 70,
          alignSelf: 'center',
          width: 60,
          height: 30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}
      >
        <Text style={{ color: 'black', fontSize: 24, lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
      <AddExpenseModal
        visible={expenseModalOpen}
        onClose={(): void => setExpenseModalOpen(false)}
      ></AddExpenseModal>
    </View>
  );
}
export default MainTabs;
