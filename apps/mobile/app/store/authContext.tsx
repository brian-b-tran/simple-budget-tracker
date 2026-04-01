import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  loginService,
  logoutService,
  refreshAccessService,
  registerService,
} from '../services/authService';

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  register: (email: string, password: string) => void;
  login: (data: { email: string; password: string }) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    try {
      const token = await loginService(email, password);
      await SecureStore.setItemAsync('accessToken', token.access);
      setAccessToken(token.access);
    } catch (error) {
      console.error('Failed to login.', error);
    }
  };
  const register = async (email: string, password: string) => {
    try {
      await registerService(email, password);
    } catch (error) {
      console.error('Failed to register.', error);
    }
  };

  const logout = async () => {
    await logoutService();
    await SecureStore.deleteItemAsync('accessToken');
    setAccessToken(null);
  };

  const refresh = async () => {
    try {
      const newToken = await refreshAccessService();
      await SecureStore.setItemAsync('accessToken', newToken.access);
      setAccessToken(newToken.access);
    } catch (error) {
      console.error('Failed to refresh.', error);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true);
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error('Failed to load token from SecureStore', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        login,
        register,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
