import { createContext, useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  loginService,
  logoutService,
  refreshAccessService,
  registerService,
} from '../services/authService';
import { setupInterceptors } from '../services/api';

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  register: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const accessTokenRef = useRef<string | null>(null);
  const login = async (email: string, password: string) => {
    try {
      console.log('trying to log in.');
      const token = await loginService(email, password);
      await SecureStore.setItemAsync('accessToken', token.access);
      setAccessToken(token.access);
    } catch (error) {
      //console.error('Failed to login.', error);
      throw error;
    }
  };
  const register = async (email: string, password: string) => {
    try {
      await registerService(email, password);
    } catch (error) {
      //console.error('Failed to register.', error);
      throw error;
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
      console.error('Refresh Failed.');
      throw error;
    }
  };
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  //useEffect on startup
  useEffect(() => {
    console.log('Auth startup');
    setupInterceptors(() => accessTokenRef.current, refresh, logout);
    const loadToken = async () => {
      setIsLoading(true);
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          await refresh();
        }
      } catch (error) {
        console.error('Failed to load token from SecureStore', error);
        await logout();
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
