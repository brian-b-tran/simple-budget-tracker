import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './app/navigation/AppNavigator';
import { AuthProvider } from './app/store/authContext';
export default function App() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
