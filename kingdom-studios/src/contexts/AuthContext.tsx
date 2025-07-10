import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, ApiResponse } from '../services/apiClient';

// Types for user data
export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  photoURL?: string;
  faithMode?: boolean;
  profile?: {
    bio?: string;
    preferences?: Record<string, any>;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  connectionStatus: 'online' | 'offline' | 'connecting';
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, faithMode?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const TOKEN_KEY = 'kingdom_studios_token';
const USER_KEY = 'kingdom_studios_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('connecting');

  // Check backend connection status
  const checkConnection = async (): Promise<boolean> => {
    try {
      setConnectionStatus('connecting');
      const isHealthy = await apiClient.healthCheck();
      setConnectionStatus(isHealthy ? 'online' : 'offline');
      return isHealthy;
    } catch (error) {
      setConnectionStatus('offline');
      return false;
    }
  };

  // Load stored authentication data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        // Check backend connection first
        await checkConnection();

        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          // Parse and set user data
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Verify token is still valid if we're online
          if (connectionStatus === 'online') {
            try {
              const profileResponse = await apiClient.get<User>('/auth/profile');
              if (profileResponse.success && profileResponse.data) {
                // Update user data if profile fetch was successful
                setUser(profileResponse.data);
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profileResponse.data));
              }
            } catch (error) {
              // Token might be invalid, clear stored data
              console.error('Profile verification failed:', error);
              await clearStoredAuth();
            }
          }
        }
      } catch (error) {
        console.error('Failed to load stored authentication:', error);
        await clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();

    // Set up periodic connection checks
    const connectionCheckInterval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  // Helper function to clear stored authentication data
  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
      setUser(null);
      apiClient.clearCache();
    } catch (error) {
      console.error('Failed to clear stored auth:', error);
    }
  };

  // Login function with enterprise API client
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        return { success: false, error: 'No connection to server. Please check your internet connection.' };
      }

      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEY, token),
          SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
        ]);
        
        setUser(user);
        return { success: true };
      }
      
      return { success: false, error: response.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with enterprise API client
  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    faithMode?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        return { success: false, error: 'No connection to server. Please check your internet connection.' };
      }

      const response = await apiClient.register({
        email,
        password,
        name: `${firstName} ${lastName}`,
        faithMode,
      } as any);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEY, token),
          SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
        ]);
        
        setUser(user);
        return { success: true };
      }
      
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call backend logout if connected
      if (connectionStatus === 'online') {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Backend logout error:', error);
        }
      }
      
      // Clear local storage
      await clearStoredAuth();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user profile
  const refreshProfile = async (): Promise<void> => {
    try {
      if (connectionStatus !== 'online' || !user) return;

      const response = await apiClient.get<User>('/auth/profile');
      if (response.success && response.data) {
        setUser(response.data);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  // Compute derived state
  const isAuthenticated = !!user && apiClient.isAuthenticated();

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    connectionStatus,
    login,
    register,
    logout,
    refreshProfile,
    checkConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
