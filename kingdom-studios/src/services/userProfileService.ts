/**
 * 👤 USER PROFILE SERVICE - KINGDOM STUDIOS
 * Handles all user profile operations through the unified API
 * 
 * This service provides user profile management functionality:
 * - Profile creation and loading
 * - Profile updates and preferences
 * - User preferences management
 * - Profile validation and error handling
 */

import { kingdomStudiosApi } from './unifiedApiService';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  faithMode: boolean;
  subscriptionTier: 'free' | 'pro' | 'sponsored';
  onboardingCompleted: boolean;
  preferences: {
    defaultPlatforms: string[];
    contentStyle: string;
    autoGenerateHashtags: boolean;
    notificationSettings: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacySettings: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showActivity: boolean;
    };
  };
  metadata: {
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    loginCount: number;
    timezone: string;
    language: string;
  };
}

export interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  faithMode?: boolean;
  onboardingCompleted?: boolean;
  preferences?: Partial<UserProfile['preferences']>;
  metadata?: Partial<UserProfile['metadata']>;
}

export class UserProfileService {
  private static instance: UserProfileService;

  private constructor() {}

  static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  /**
   * Get the current user's profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const result = await kingdomStudiosApi.getUserProfile();
      
      if (result.success && result.data) {
        return result.data as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('[UserProfile] Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Create a new user profile
   */
  async createUserProfile(profileData: Omit<UserProfile, 'uid' | 'metadata'>): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.createUserProfile(profileData);
      
      if (result.success) {
        console.log('[UserProfile] Profile created successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to create profile:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error creating user profile:', error);
      return false;
    }
  }

  /**
   * Update the current user's profile
   */
  async updateUserProfile(updates: ProfileUpdateData): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.updateUserProfile(updates);
      
      if (result.success) {
        console.log('[UserProfile] Profile updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update profile:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating user profile:', error);
      return false;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.updateUserProfile({ preferences });
      
      if (result.success) {
        console.log('[UserProfile] Preferences updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update preferences:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: UserProfile['preferences']['notificationSettings']): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile();
      if (!currentProfile) {
        console.error('[UserProfile] No profile found for notification settings update');
        return false;
      }

      const updatedPreferences = {
        ...currentProfile.preferences,
        notificationSettings: settings
      };

      const result = await kingdomStudiosApi.updateUserProfile({ preferences: updatedPreferences });
      
      if (result.success) {
        console.log('[UserProfile] Notification settings updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update notification settings:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating notification settings:', error);
      return false;
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings: UserProfile['preferences']['privacySettings']): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile();
      if (!currentProfile) {
        console.error('[UserProfile] No profile found for privacy settings update');
        return false;
      }

      const updatedPreferences = {
        ...currentProfile.preferences,
        privacySettings: settings
      };

      const result = await kingdomStudiosApi.updateUserProfile({ preferences: updatedPreferences });
      
      if (result.success) {
        console.log('[UserProfile] Privacy settings updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update privacy settings:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating privacy settings:', error);
      return false;
    }
  }

  /**
   * Update faith mode setting
   */
  async updateFaithMode(faithMode: boolean): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.updateUserProfile({ faithMode });
      
      if (result.success) {
        console.log('[UserProfile] Faith mode updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update faith mode:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating faith mode:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.updateUserProfile({ onboardingCompleted: true });
      
      if (result.success) {
        console.log('[UserProfile] Onboarding marked as completed');
        return true;
      }
      
      console.error('[UserProfile] Failed to mark onboarding as completed:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error marking onboarding as completed:', error);
      return false;
    }
  }

  /**
   * Update user metadata (last login, etc.)
   */
  async updateMetadata(metadata: Partial<UserProfile['metadata']>): Promise<boolean> {
    try {
      const result = await kingdomStudiosApi.updateUserProfile({ metadata });
      
      if (result.success) {
        console.log('[UserProfile] Metadata updated successfully');
        return true;
      }
      
      console.error('[UserProfile] Failed to update metadata:', result.error);
      return false;
    } catch (error) {
      console.error('[UserProfile] Error updating metadata:', error);
      return false;
    }
  }

  /**
   * Validate profile data
   */
  validateProfileData(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.displayName && profile.displayName.length < 2) {
      errors.push('Display name must be at least 2 characters');
    }

    if (profile.displayName && profile.displayName.length > 50) {
      errors.push('Display name must be less than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default profile preferences
   */
  getDefaultPreferences(): UserProfile['preferences'] {
    return {
      defaultPlatforms: ['instagram', 'facebook'],
      contentStyle: 'inspirational',
      autoGenerateHashtags: true,
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
      },
      privacySettings: {
        profileVisibility: 'public',
        showEmail: false,
        showActivity: true,
      },
    };
  }

  /**
   * Get default profile metadata
   */
  getDefaultMetadata(): UserProfile['metadata'] {
    return {
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      loginCount: 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
    };
  }
}

export const userProfileService = UserProfileService.getInstance(); 