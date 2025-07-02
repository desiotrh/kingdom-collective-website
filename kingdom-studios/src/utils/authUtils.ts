import * as Google from 'expo-auth-session/providers/google';
import { AuthRequest } from 'expo-auth-session';
import * as Facebook from 'expo-facebook';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { app, auth } from '../config/firebase';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

// Type override to silence TS warning about 'extra'
type AppConfig = typeof Constants.expoConfig & {
  extra?: {
    googleClientId: string;
    googleAndroidClientId: string;
    googleIosClientId: string;
    facebookAppId: string;
  };
};

const extra = (Constants.expoConfig as AppConfig).extra;

if (!extra) {
  throw new Error('Expo config "extra" is undefined. Check your app.config.js and .env.');
}

// Use the auth instance from firebase config

// Google Auth Request Hook
export const useGoogleAuthRequest = () => {
  return Google.useAuthRequest({
    clientId: extra.googleClientId,
    androidClientId: extra.googleAndroidClientId,
    iosClientId: extra.googleIosClientId,
    scopes: ['profile', 'email'],
  });
};

// Sign in with Google
export const signInWithGoogle = async (response: any) => {
  if (response?.type === 'success' && response.authentication?.idToken) {
    const credential = GoogleAuthProvider.credential(response.authentication.idToken);
    return signInWithCredential(auth, credential);
  } else {
    throw new Error('Google authentication failed.');
  }
};

// Initialize Facebook SDK
export const initFacebookSDK = async () => {
  try {
    // Facebook SDK temporarily disabled due to compatibility issues
    console.warn('Facebook SDK initialization skipped - temporarily disabled');
  } catch (err) {
    console.error('Facebook SDK init failed:', err);
    throw err;
  }
};

// Sign in with Facebook (temporarily disabled)
export const signInWithFacebook = async () => {
  try {
    throw new Error('Facebook authentication is temporarily disabled. Please use Google sign-in instead.');
  } catch (err) {
    console.error('Facebook login error:', err);
    throw err;
  }
};
