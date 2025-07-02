import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Global app state and settings
interface AppState {
  isFirstTime: boolean;
  hasCompletedOnboarding: boolean;
  subscriptionTier: 'free' | 'pro' | 'sponsored';
  subscriptionExpiry?: Date;
  sponsorInfo?: {
    sponsorName: string;
    sponsorEmail: string;
    activationDate: Date;
    expiryDate: Date;
  };
  userPreferences: {
    defaultPlatforms: string[];
    contentStyle: 'casual' | 'professional' | 'inspirational';
    autoGenerateHashtags: boolean;
  };
}

interface AppContextType {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => Promise<void>;
  checkSubscriptionStatus: () => boolean;
  requestSponsorship: (userEmail: string, message?: string) => Promise<void>;
  activateSponsorship: (sponsorInfo: AppState['sponsorInfo']) => Promise<void>;
  isLoading: boolean;
}

const defaultAppState: AppState = {
  isFirstTime: true,
  hasCompletedOnboarding: false,
  subscriptionTier: 'free',
  userPreferences: {
    defaultPlatforms: ['Instagram', 'Facebook'],
    contentStyle: 'inspirational',
    autoGenerateHashtags: true,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isLoading, setIsLoading] = useState(true);

  // Load app state on startup
  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsed.subscriptionExpiry) {
          parsed.subscriptionExpiry = new Date(parsed.subscriptionExpiry);
        }
        if (parsed.sponsorInfo?.activationDate) {
          parsed.sponsorInfo.activationDate = new Date(parsed.sponsorInfo.activationDate);
        }
        if (parsed.sponsorInfo?.expiryDate) {
          parsed.sponsorInfo.expiryDate = new Date(parsed.sponsorInfo.expiryDate);
        }
        setAppState({ ...defaultAppState, ...parsed });
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppState = async (updates: Partial<AppState>): Promise<void> => {
    try {
      const newState = { ...appState, ...updates };
      setAppState(newState);
      await AsyncStorage.setItem('appState', JSON.stringify(newState));
    } catch (error) {
      console.error('Error updating app state:', error);
      throw error;
    }
  };

  const checkSubscriptionStatus = (): boolean => {
    if (appState.subscriptionTier === 'free') return false;
    if (appState.subscriptionTier === 'sponsored' && appState.sponsorInfo?.expiryDate) {
      return new Date() < appState.sponsorInfo.expiryDate;
    }
    if (appState.subscriptionExpiry) {
      return new Date() < appState.subscriptionExpiry;
    }
    return appState.subscriptionTier === 'pro';
  };

  const requestSponsorship = async (userEmail: string, message?: string): Promise<void> => {
    try {
      // In a real app, this would send an email or API request
      console.log('Sponsorship request sent:', { userEmail, message });
      
      // For now, we'll just log it and show success
      // TODO: Integrate with email service or backend API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // You could integrate with EmailJS or a backend API here
      // Example: await emailService.sendSponsorshipRequest(userEmail, message);
      
    } catch (error) {
      console.error('Error requesting sponsorship:', error);
      throw error;
    }
  };

  const activateSponsorship = async (sponsorInfo: AppState['sponsorInfo']): Promise<void> => {
    try {
      await updateAppState({
        subscriptionTier: 'sponsored',
        sponsorInfo,
      });
      
      // Send welcome message
      console.log('Sponsorship activated! Welcome message sent.');
      // TODO: Send actual welcome email/notification
      
    } catch (error) {
      console.error('Error activating sponsorship:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    appState,
    updateAppState,
    checkSubscriptionStatus,
    requestSponsorship,
    activateSponsorship,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper functions for subscription limits
export const getSubscriptionLimits = (tier: AppState['subscriptionTier']) => {
  switch (tier) {
    case 'free':
      return {
        maxProducts: 5,
        maxScheduledPosts: 3,
        aiGenerations: 10,
        analytics: false,
        communityAccess: false,
      };
    case 'pro':
    case 'sponsored':
      return {
        maxProducts: Infinity,
        maxScheduledPosts: Infinity,
        aiGenerations: Infinity,
        analytics: true,
        communityAccess: true,
      };
  }
};
