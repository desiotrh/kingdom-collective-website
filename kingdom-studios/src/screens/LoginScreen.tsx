import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import {
  signInWithGoogle,
  signInWithFacebook,
  useGoogleAuthRequest,
  initFacebookSDK,
} from '../utils/authUtils';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  
  const { continueAsGuest } = useAuth();
  const [request, response, promptAsync] = useGoogleAuthRequest();

  // Initialize Facebook SDK on mount
  useEffect(() => {
    const initFacebook = async () => {
      try {
        await initFacebookSDK();
      } catch (error) {
        console.error('Facebook SDK initialization failed:', error);
      }
    };
    initFacebook();
  }, []);

  // Handle Google auth response
  useEffect(() => {
    if (response) {
      handleGoogleSignIn(response);
    }
  }, [response]);

  const handleGoogleSignIn = async (authResponse: any) => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle(authResponse);
      Alert.alert('Success', 'Logged in successfully!');
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Login failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGooglePress = async () => {
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google auth prompt error:', error);
      Alert.alert('Error', 'Login failed.');
      setGoogleLoading(false);
    }
  };

  const handleFacebookPress = async () => {
    setFacebookLoading(true);
    try {
      await signInWithFacebook();
      Alert.alert('Success', 'Logged in successfully!');
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Error', 'Login failed.');
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleGuestPress = () => {
    continueAsGuest();
  };

  const isLoading = loading || googleLoading || facebookLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={KingdomColors.gradients.refinedFlame as [string, string]}
        style={styles.backgroundGradient}
      >
        <View style={styles.mainContent}>
          {/* Welcome Header */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to access your creative workspace</Text>
          </View>

          {/* Authentication Buttons */}
          <View style={styles.authSection}>
            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleGooglePress}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={KingdomColors.gradients.royalGold as [string, string]}
                style={styles.authButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.authButtonContent}>
                  <View style={styles.authIconContainer}>
                    <Ionicons name="logo-google" size={24} color={KingdomColors.refined.black} />
                  </View>
                  {googleLoading ? (
                    <ActivityIndicator color={KingdomColors.refined.black} size="small" />
                  ) : (
                    <Text style={styles.authButtonText}>Continue with Google</Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Facebook Sign In */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleFacebookPress}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={KingdomColors.gradients.darkDepth as [string, string]}
                style={[styles.authButtonGradient, styles.secondaryButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.authButtonContent}>
                  <View style={[styles.authIconContainer, styles.secondaryIconContainer]}>
                    <Ionicons name="logo-facebook" size={24} color={KingdomColors.refined.gold} />
                  </View>
                  {facebookLoading ? (
                    <ActivityIndicator color={KingdomColors.refined.gold} size="small" />
                  ) : (
                    <Text style={[styles.authButtonText, styles.secondaryButtonText]}>Continue with Facebook</Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Guest Access */}
            <TouchableOpacity
              style={[styles.authButton, styles.guestButton]}
              onPress={handleGuestPress}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={KingdomColors.gradients.refinedFlame as [string, string]}
                style={[styles.authButtonGradient, styles.guestButtonGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.authButtonContent}>
                  <View style={[styles.authIconContainer, styles.guestIconContainer]}>
                    <Ionicons name="eye-outline" size={24} color={KingdomColors.refined.softGold} />
                  </View>
                  <Text style={[styles.authButtonText, styles.guestButtonText]}>Continue as Guest</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.footerLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.refined.maroon,
  },
  backgroundGradient: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },

  // ===========================================
  // � WELCOME SECTION
  // ===========================================
  welcomeSection: {
    marginBottom: 60,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'serif',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: KingdomColors.refined.softSand,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: width * 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ===========================================
  // 🔐 AUTH SECTION
  // ===========================================
  authSection: {
    marginBottom: 40,
  },
  authButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  authButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: KingdomColors.refined.gold,
  },
  authButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  secondaryIconContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  authButtonText: {
    color: KingdomColors.refined.black,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: KingdomColors.refined.gold,
  },
  guestButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  guestButtonGradient: {
    opacity: 0.7,
  },
  guestIconContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  guestButtonText: {
    color: KingdomColors.refined.softGold,
    fontSize: 16,
    fontWeight: '500',
  },

  // ===========================================
  // 📐 FOOTER SECTION
  // ===========================================
  footer: {
    paddingTop: 32,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: KingdomColors.refined.dustyGold,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
  footerLink: {
    color: KingdomColors.refined.gold,
    fontWeight: '600',
  },
});

export default React.memo(LoginScreen);
