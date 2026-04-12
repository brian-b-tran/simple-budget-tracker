import './global.css';
import { RootStack } from './app/navigation/AppNavigator';
import { AuthProvider } from './app/store/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function App() {
  return (
    <SafeAreaProvider className='flex-1'>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
