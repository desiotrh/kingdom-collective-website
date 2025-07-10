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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
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
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={KingdomColors.gradients.royalBackground}
        style={styles.container}
      >
        {/* Background Pattern Overlay */}
        <View style={styles.backgroundPattern} />
        
        {/* 3D Ribbon Effect */}
        <View style={styles.ribbonContainer}>
          <LinearGradient
            colors={KingdomColors.gradients.goldShimmer}
            style={styles.ribbon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ribbonShadow} />
            <Text style={styles.ribbonText}>KINGDOM STUDIOS</Text>
          </LinearGradient>
        </View>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={KingdomColors.gradients.goldShimmer}
                style={styles.logoBackground}
              >
                <Image
                  source={require('../../assets/KingdomStudiosLogo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
              <LinearGradient
                colors={KingdomColors.gradients.goldShimmer}
                style={styles.titleGradient}
              >
                <Text style={styles.title}>Kingdom Studios</Text>
              </LinearGradient>
              <Text style={styles.subtitle}>
                Create • Inspire • Build Your Digital Kingdom
              </Text>
            </View>

            {/* Login Buttons Section */}
            <View style={styles.buttonContainer}>
              {/* Google Sign In */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleGooglePress}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="logo-google" size={24} color={KingdomColors.gold.bright} />
                    {googleLoading ? (
                      <ActivityIndicator color={KingdomColors.gold.bright} size="small" style={styles.loader} />
                    ) : (
                      <Text style={styles.buttonText}>Continue with Google</Text>
                    )}
                  </View>
                  <View style={styles.buttonShine} />
                </LinearGradient>
              </TouchableOpacity>

              {/* Facebook Sign In */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleFacebookPress}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[KingdomColors.primary.deepNavy, KingdomColors.primary.midnight]}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="logo-facebook" size={24} color={KingdomColors.gold.bright} />
                    {facebookLoading ? (
                      <ActivityIndicator color={KingdomColors.gold.bright} size="small" style={styles.loader} />
                    ) : (
                      <Text style={styles.buttonText}>Continue with Facebook</Text>
                    )}
                  </View>
                  <View style={styles.buttonShine} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <Text style={styles.bottomText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </SafeAreaView>

        {/* Floating Decorative Elements */}
        <View style={styles.floatingElement1} />
        <View style={styles.floatingElement2} />
        <View style={styles.floatingElement3} />
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  ribbonContainer: {
    position: 'absolute',
    top: 60,
    left: -50,
    right: -50,
    height: 80,
    transform: [{ rotate: '-5deg' }],
    zIndex: 1,
  },
  ribbon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  ribbonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transform: [{ translateY: 3 }],
  },
  ribbonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.primary.midnight,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 120,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: KingdomColors.gold.bright,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: KingdomColors.primary.midnight,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 40,
  },
  button: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: KingdomColors.gold.bright,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonText: {
    color: KingdomColors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  loader: {
    marginLeft: 12,
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  bottomSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Floating decorative elements
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: KingdomColors.opacity.gold10,
    borderWidth: 1,
    borderColor: KingdomColors.opacity.gold20,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '25%',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.silver10,
    borderWidth: 1,
    borderColor: KingdomColors.opacity.silver20,
  },
  floatingElement3: {
    position: 'absolute',
    top: '35%',
    left: 40,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: KingdomColors.opacity.white10,
    borderWidth: 1,
    borderColor: KingdomColors.opacity.white20,
  },
});

export default React.memo(LoginScreen);
