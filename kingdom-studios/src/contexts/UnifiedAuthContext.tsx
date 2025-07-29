import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { kingdomStudiosApi } from '../services/unifiedApiService';
import { userProfileService, UserProfile } from '../services/userProfileService';

/**
 * 🔐 UNIFIED AUTH CONTEXT - KINGDOM STUDIOS
 * Replaces Firebase authentication with unified API
 * 
 * This context provides authentication functionality through the unified API:
 * - User login and registration
 * - Auth state management
 * - User profile management
 * - Role-based access control
 */

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  tier: 'seed' | 'rooted' | 'commissioned' | 'mantled_pro' | 'kingdom_enterprise';
  role: 'user' | 'team_admin' | 'super_admin';
  isFounder?: boolean;
  organizationId?: string;
  faithMode: boolean;
  onboardingCompleted: boolean;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  subscriptionTier?: 'free' | 'pro' | 'sponsored';
}

interface AuthContextType {
  // User state
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string, faithMode?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // User management
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Admin functions
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFounder: boolean;
  
  // Subscription management
  subscriptionTier: string;
  isProUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile when user changes
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await userProfileService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('[Auth] Error loading user profile:', error);
    }
  };

  // Check for existing auth token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already authenticated
        const currentUser = await kingdomStudiosApi.getCurrentUser();
        if (currentUser.success && currentUser.data) {
          setUser(currentUser.data);
          // Load user profile
          await loadUserProfile(currentUser.data.uid);
        }
      } catch (error) {
        console.log('[Auth] No existing session found');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = await kingdomStudiosApi.login(email, password);
      
      if (result.success) {
        setUser(result.data.user);
        // Load user profile after successful login
        await loadUserProfile(result.data.user.uid);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    displayName: string, 
    faithMode: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = await kingdomStudiosApi.register(email, password, displayName, faithMode);
      
      if (result.success) {
        setUser(result.data.user);
        
        // Create user profile after successful registration
        const profileCreated = await userProfileService.createUserProfile({
          uid: result.data.user.uid,
          email: result.data.user.email,
          displayName: result.data.user.displayName,
          faithMode: faithMode,
          subscriptionTier: 'free',
          onboardingCompleted: false,
          preferences: userProfileService.getDefaultPreferences(),
        });
        
        if (profileCreated) {
          await loadUserProfile(result.data.user.uid);
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await kingdomStudiosApi.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
      setUserProfile(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const result = await kingdomStudiosApi.updateUserProfile(data);
      
      if (result.success && user) {
        setUser({ ...user, ...result.data });
      }
    } catch (error) {
      console.error('[Auth] Profile update error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
    try {
      const success = await userProfileService.updateUserProfile(data);
      
      if (success && userProfile) {
        setUserProfile({ ...userProfile, ...data });
      }
    } catch (error) {
      console.error('[Auth] User profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const result = await kingdomStudiosApi.getCurrentUser();
      
      if (result.success && result.data) {
        setUser(result.data);
        await loadUserProfile(result.data.uid);
      }
    } catch (error) {
      console.error('[Auth] User refresh error:', error);
    }
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'team_admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isFounder = user?.isFounder === true;
  const subscriptionTier = user?.subscriptionTier || 'free';
  const isProUser = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'sponsored';

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateUserProfile,
    refreshUser,
    isAdmin,
    isSuperAdmin,
    isFounder,
    subscriptionTier,
    isProUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 