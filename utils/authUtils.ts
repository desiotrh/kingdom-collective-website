import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';

const {
  googleClientId,
  googleAndroidClientId,
  googleIosClientId,
  facebookAppId,
} = Constants.manifest?.extra || {};

export const useGoogleAuthRequest = () => {
  return Google.useAuthRequest({
    expoClientId: googleClientId,
    androidClientId: googleAndroidClientId,
    iosClientId: googleIosClientId,
    scopes: ['profile', 'email'],
  });
};

export async function initFacebookSDK() {
  try {
    await Facebook.initializeAsync({ appId: facebookAppId });
  } catch (error) {
    console.error('Facebook SDK initialization error:', error);
  }
}

export async function signInWithGoogle(promptAsync: () => Promise<any>) {
  try {
    const result = await promptAsync();
    if (result?.type === 'success') {
      return result.authentication;
    }
    return null;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return null;
  }
}

export async function signInWithFacebook(): Promise<string | null> {
  try {
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    if (result.type === 'success') {
      return result.token;
    }
    return null;
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    return null;
  }
}
