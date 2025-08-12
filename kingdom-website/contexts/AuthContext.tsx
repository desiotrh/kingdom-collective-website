import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  selectedApps: string[];
  socialAccounts: SocialAccount[];
  preferences: {
    faithMode: boolean;
    notifications: boolean;
  };
  isOnboarded: boolean;
}

interface SocialAccount {
  provider: 'google' | 'facebook' | 'apple' | 'linkedin' | 'tiktok';
  connected: boolean;
  username?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  logout: () => void;
  updateSelectedApps: (apps: string[]) => void;
  connectSocialAccount: (provider: string, token: string) => Promise<void>;
  disconnectSocialAccount: (provider: string) => void;
  completeOnboarding: (selectedApps: string[], preferences: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('kingdom_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        selectedApps: [],
        socialAccounts: [],
        preferences: {
          faithMode: true,
          notifications: true,
        },
        isOnboarded: false,
      };
      
      setUser(newUser);
      localStorage.setItem('kingdom_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: `user@${provider}.com`,
        name: `${provider} User`,
        avatar: `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${provider.charAt(0).toUpperCase()}`,
        selectedApps: [],
        socialAccounts: [{
          provider: provider as any,
          connected: true,
          username: `@${provider}user`,
        }],
        preferences: {
          faithMode: true,
          notifications: true,
        },
        isOnboarded: false,
      };
      
      setUser(newUser);
      localStorage.setItem('kingdom_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Social login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kingdom_user');
  };

  const updateSelectedApps = (apps: string[]) => {
    if (user) {
      const updatedUser = { ...user, selectedApps: apps };
      setUser(updatedUser);
      localStorage.setItem('kingdom_user', JSON.stringify(updatedUser));
    }
  };

  const connectSocialAccount = async (provider: string, token: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        socialAccounts: [
          ...user.socialAccounts.filter(acc => acc.provider !== provider),
          {
            provider: provider as any,
            connected: true,
            accessToken: token,
          }
        ]
      };
      setUser(updatedUser);
      localStorage.setItem('kingdom_user', JSON.stringify(updatedUser));
    }
  };

  const disconnectSocialAccount = (provider: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        socialAccounts: user.socialAccounts.filter(acc => acc.provider !== provider)
      };
      setUser(updatedUser);
      localStorage.setItem('kingdom_user', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = (selectedApps: string[], preferences: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        selectedApps,
        preferences: { ...user.preferences, ...preferences },
        isOnboarded: true,
      };
      setUser(updatedUser);
      localStorage.setItem('kingdom_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    socialLogin,
    logout,
    updateSelectedApps,
    connectSocialAccount,
    disconnectSocialAccount,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 