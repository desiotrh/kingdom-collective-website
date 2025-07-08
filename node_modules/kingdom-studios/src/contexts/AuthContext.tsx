import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthAPI, User, APIResponse, AuthResponse } from '../services/backendAPI';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, faithMode?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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

  // Load stored authentication data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          // Set token in API service
          AuthAPI.setToken(storedToken);
          
          // Parse and set user data
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Verify token is still valid by fetching current profile
          const profileResponse = await AuthAPI.getProfile();
          if (profileResponse.success && profileResponse.data?.user) {
            // Update user data if profile fetch was successful
            setUser(profileResponse.data.user);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profileResponse.data.user));
          } else {
            // Token is invalid, clear stored data
            await clearStoredAuth();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to load stored auth:', error);
        await clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Helper function to clear stored authentication data
  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
      AuthAPI.clearToken();
    } catch (error) {
      console.error('Failed to clear stored auth:', error);
    }
  };

  // Helper function to store authentication data
  const storeAuthData = async (token: string, userData: User) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData)),
      ]);
      AuthAPI.setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: APIResponse<AuthResponse> = await AuthAPI.login(email, password);
      
      if (response.success && response.data) {
        await storeAuthData(response.data.token, response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    faithMode: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: APIResponse<AuthResponse> = await AuthAPI.register(
        email, 
        password, 
        firstName, 
        lastName, 
        faithMode
      );
      
      if (response.success && response.data) {
        await storeAuthData(response.data.token, response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call backend logout endpoint
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Always clear local data
      await clearStoredAuth();
      setUser(null);
    }
  };

  // Refresh user profile
  const refreshProfile = async (): Promise<void> => {
    try {
      const response = await AuthAPI.getProfile();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
