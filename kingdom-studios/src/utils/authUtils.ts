import * as Facebook from 'expo-facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Types
export interface FacebookAuthResult {
  type: 'success' | 'cancel' | 'error';
  token?: string;
  expires?: number;
  permissions?: string[];
  declinedPermissions?: string[];
  userId?: string;
}

export interface GoogleAuthResult {
  type: 'success' | 'cancel' | 'error';
  accessToken?: string;
  idToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

// Constants
const FACEBOOK_APP_ID = Constants.expoConfig?.extra?.facebookAppId;
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId;
const GOOGLE_ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.googleAndroidClientId;
const GOOGLE_IOS_CLIENT_ID = Constants.expoConfig?.extra?.googleIosClientId;

// Storage keys
const STORAGE_KEYS = {
  FACEBOOK_TOKEN: 'facebook_access_token',
  FACEBOOK_USER_ID: 'facebook_user_id',
  FACEBOOK_PERMISSIONS: 'facebook_permissions',
  GOOGLE_TOKEN: 'google_access_token',
  GOOGLE_USER_ID: 'google_user_id',
} as const;

/**
 * Initialize Facebook SDK
 */
export const initFacebookSDK = async (): Promise<void> => {
  try {
    if (!FACEBOOK_APP_ID) {
      throw new Error('Facebook App ID not configured');
    }

    await Facebook.initializeAsync({
      appId: FACEBOOK_APP_ID,
      appName: 'Kingdom Studios',
      version: 'v18.0',
    });

    console.log('Facebook SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Facebook SDK:', error);
    throw error;
  }
};

/**
 * Sign in with Facebook with secure token handling
 */
export const signInWithFacebook = async (): Promise<FacebookAuthResult> => {
  try {
    if (!FACEBOOK_APP_ID) {
      throw new Error('Facebook App ID not configured');
    }

    // Request permissions (only basic ones that don't require App Review)
    const permissions = ['public_profile', 'email'];
    
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions,
    });

    if (result.type === 'success') {
      const { accessToken, expires, permissions: grantedPermissions, declinedPermissions } = result;
      
      // Store token securely
      await SecureStore.setItemAsync(STORAGE_KEYS.FACEBOOK_TOKEN, accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS, JSON.stringify(grantedPermissions));
      
      // Get user ID from token
      const userId = await getFacebookUserId(accessToken);
      if (userId) {
        await SecureStore.setItemAsync(STORAGE_KEYS.FACEBOOK_USER_ID, userId);
      }

      // Handle declined permissions
      if (declinedPermissions && declinedPermissions.length > 0) {
        console.warn('Some Facebook permissions were declined:', declinedPermissions);
        // You can show a message to the user about declined permissions
      }

      return {
        type: 'success',
        token: accessToken,
        expires,
        permissions: grantedPermissions,
        declinedPermissions,
        userId,
      };
    } else if (result.type === 'cancel') {
      return { type: 'cancel' };
    } else {
      throw new Error('Facebook login failed');
    }
  } catch (error) {
    console.error('Facebook login error:', error);
    return { type: 'error' };
  }
};

/**
 * Get Facebook user ID from access token
 */
const getFacebookUserId = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id`
    );
    const data = await response.json();
    return data.id || null;
  } catch (error) {
    console.error('Failed to get Facebook user ID:', error);
    return null;
  }
};

/**
 * Get stored Facebook access token
 */
export const getFacebookToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.FACEBOOK_TOKEN);
  } catch (error) {
    console.error('Failed to get Facebook token:', error);
    return null;
  }
};

/**
 * Get stored Facebook user ID
 */
export const getFacebookUserId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.FACEBOOK_USER_ID);
  } catch (error) {
    console.error('Failed to get Facebook user ID:', error);
    return null;
  }
};

/**
 * Get stored Facebook permissions
 */
export const getFacebookPermissions = async (): Promise<string[]> => {
  try {
    const permissions = await SecureStore.getItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS);
    return permissions ? JSON.parse(permissions) : [];
  } catch (error) {
    console.error('Failed to get Facebook permissions:', error);
    return [];
  }
};

/**
 * Check if Facebook token is valid
 */
export const isFacebookTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getFacebookToken();
    if (!token) return false;

    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    return response.ok;
  } catch (error) {
    console.error('Failed to validate Facebook token:', error);
    return false;
  }
};

/**
 * Logout from Facebook and clear stored data
 */
export const logoutFromFacebook = async (): Promise<void> => {
  try {
    // Clear stored data
    await SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_USER_ID);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS);
    
    // Logout from Facebook SDK
    await Facebook.logOutAsync();
    
    console.log('Facebook logout successful');
  } catch (error) {
    console.error('Facebook logout error:', error);
    throw error;
  }
};

/**
 * Request additional Facebook permissions
 */
export const requestAdditionalFacebookPermissions = async (
  additionalPermissions: string[]
): Promise<FacebookAuthResult> => {
  try {
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: additionalPermissions,
    });

    if (result.type === 'success') {
      // Update stored permissions
      const currentPermissions = await getFacebookPermissions();
      const newPermissions = [...new Set([...currentPermissions, ...result.permissions])];
      await SecureStore.setItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS, JSON.stringify(newPermissions));
      
      return {
        type: 'success',
        token: result.accessToken,
        expires: result.expires,
        permissions: newPermissions,
        declinedPermissions: result.declinedPermissions,
      };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to request additional permissions:', error);
    return { type: 'error' };
  }
};

/**
 * Re-request declined Facebook permissions
 */
export const reRequestDeclinedFacebookPermissions = async (
  declinedPermissions: string[]
): Promise<FacebookAuthResult> => {
  try {
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: declinedPermissions,
    });

    if (result.type === 'success') {
      // Update stored permissions
      const currentPermissions = await getFacebookPermissions();
      const newPermissions = [...new Set([...currentPermissions, ...result.permissions])];
      await SecureStore.setItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS, JSON.stringify(newPermissions));
      
      return {
        type: 'success',
        token: result.accessToken,
        expires: result.expires,
        permissions: newPermissions,
        declinedPermissions: result.declinedPermissions,
      };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to re-request declined permissions:', error);
    return { type: 'error' };
  }
};

// Google Auth Functions
export const useGoogleAuthRequest = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });

  return [request, response, promptAsync] as const;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (authResponse: any): Promise<GoogleAuthResult> => {
  try {
    if (authResponse?.type === 'success') {
      const { accessToken, idToken } = authResponse.authentication;
      
      // Store token securely
      await SecureStore.setItemAsync(STORAGE_KEYS.GOOGLE_TOKEN, accessToken);
      
      // Get user info
      const userInfo = await fetchGoogleUserInfo(accessToken);
      if (userInfo) {
        await SecureStore.setItemAsync(STORAGE_KEYS.GOOGLE_USER_ID, userInfo.id);
      }

      return {
        type: 'success',
        accessToken,
        idToken,
        user: userInfo,
      };
    } else if (authResponse?.type === 'cancel') {
      return { type: 'cancel' };
    } else {
      throw new Error('Google login failed');
    }
  } catch (error) {
    console.error('Google login error:', error);
    return { type: 'error' };
  }
};

/**
 * Fetch Google user info
 */
const fetchGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Google user info:', error);
    return null;
  }
};

/**
 * Logout from Google and clear stored data
 */
export const logoutFromGoogle = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_USER_ID);
    console.log('Google logout successful');
  } catch (error) {
    console.error('Google logout error:', error);
    throw error;
  }
};

/**
 * Clear all stored authentication data
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_USER_ID),
      SecureStore.deleteItemAsync(STORAGE_KEYS.FACEBOOK_PERMISSIONS),
      SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_USER_ID),
    ]);
    console.log('All auth data cleared');
  } catch (error) {
    console.error('Failed to clear auth data:', error);
    throw error;
  }
};








