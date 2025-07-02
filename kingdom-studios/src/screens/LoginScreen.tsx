import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  signInWithGoogle,
  signInWithFacebook,
  useGoogleAuthRequest,
  initFacebookSDK,
} from '../utils/authUtils';
import { KingdomColors, KingdomGradients, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  
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

  const isLoading = loading || googleLoading || facebookLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Geometric Angular Ribbons like reference */}
      <View style={styles.ribbonContainer}>
        {/* Large angular ribbon - top right */}
        <View style={styles.angularRibbon1}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={styles.angularRibbonGradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
        
        {/* Medium angular ribbon - middle left */}
        <View style={styles.angularRibbon2}>
          <LinearGradient
            colors={[KingdomColors.silver.bright, KingdomColors.silver.light]}
            style={styles.angularRibbonGradient2}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
        
        {/* Small angular ribbon - bottom */}
        <View style={styles.angularRibbon3}>
          <LinearGradient
            colors={[KingdomColors.gold.amber, KingdomColors.gold.warm]}
            style={styles.angularRibbonGradient3}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <KingdomLogo size="medium" showGlow={true} glowIntensity={0.3} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>KINGDOM</Text>
            <Text style={styles.appNameSecondary}>STUDIOS</Text>
          </View>
          <Text style={styles.tagline}>Build. Share. Thrive</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.authCard}>
          <Text style={styles.welcomeTitle}>Build. Share. Thrive</Text>
          <Text style={styles.welcomeSubtitle}>Launch your vision. Impact the world</Text>
          <Text style={styles.authTitle}>LOGIN TO YOUR ACCOUNT</Text>
          <Text style={styles.authSubtitle}>Enter your login information</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryLoginButton}
              onPress={handleGooglePress}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {googleLoading ? (
                  <ActivityIndicator color={KingdomColors.text.primary} size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>LOGIN</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGooglePress}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.socialButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.socialButtonIcon}>G</Text>
                  <Text style={styles.socialButtonText}>GOOGLE</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleFacebookPress}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.socialButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.socialButtonIcon}>A</Text>
                  <Text style={styles.socialButtonText}>APPLE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.primary.midnight,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  // Angular ribbon 1 - Large top-right geometric shape
  angularRibbon1: {
    position: 'absolute',
    top: 50,
    right: -80,
    width: 200,
    height: 300,
    opacity: 0.15,
  },
  angularRibbonGradient1: {
    flex: 1,
    transform: [
      { skewX: '-15deg' },
      { skewY: '10deg' },
      { rotate: '25deg' }
    ],
  },
  // Angular ribbon 2 - Medium left geometric shape
  angularRibbon2: {
    position: 'absolute',
    top: 200,
    left: -60,
    width: 150,
    height: 250,
    opacity: 0.12,
  },
  angularRibbonGradient2: {
    flex: 1,
    transform: [
      { skewX: '20deg' },
      { skewY: '-8deg' },
      { rotate: '-20deg' }
    ],
  },
  // Angular ribbon 3 - Small bottom geometric shape
  angularRibbon3: {
    position: 'absolute',
    bottom: 100,
    right: -40,
    width: 120,
    height: 180,
    opacity: 0.18,
  },
  angularRibbonGradient3: {
    flex: 1,
    transform: [
      { skewX: '10deg' },
      { skewY: '15deg' },
      { rotate: '35deg' }
    ],
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: KingdomColors.gold.bright,
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: KingdomColors.opacity.gold30,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  appNameSecondary: {
    fontSize: 28,
    fontWeight: '300',
    color: KingdomColors.silver.bright,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: -2,
  },
  tagline: {
    fontSize: 13,
    color: KingdomColors.text.muted,
    marginTop: 6,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KingdomColors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  authTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: KingdomColors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1,
  },
  authSubtitle: {
    fontSize: 13,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryLoginButton: {
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: KingdomColors.primary.royalPurple,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: KingdomColors.text.primary,
    letterSpacing: 1.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: KingdomColors.text.muted,
    fontSize: 11,
    marginHorizontal: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialButtonGradient: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  socialButtonIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  socialButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.text.muted,
    letterSpacing: 1,
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textAlign: 'center',
  },
  signupLink: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
});

export default LoginScreen;
