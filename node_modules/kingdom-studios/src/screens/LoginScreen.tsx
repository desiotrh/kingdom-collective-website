import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, Polygon } from 'react-native-svg';
import {
  signInWithGoogle,
  signInWithFacebook,
  useGoogleAuthRequest,
  initFacebookSDK,
} from '../utils/authUtils';
import { useAuth } from '../contexts/AuthContext';
import { KingdomColors, KingdomGradients, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { AnalyticsService } from '../services/AnalyticsService';
import { apiClient } from '../services/apiClient';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [faithMode, setFaithMode] = useState(false);
  
  const [request, response, promptAsync] = useGoogleAuthRequest();
  const { login, register } = useAuth();

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

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (isRegistering && (!firstName.trim() || !lastName.trim())) {
      Alert.alert('Error', 'Please enter your first and last name.');
      return;
    }

    setLoading(true);
    try {
      // Track auth attempt
      AnalyticsService.getInstance().trackEvent(
        isRegistering ? 'registration_attempt' : 'login_attempt', 
        1, 
        { 
          method: 'email',
          faithMode: faithMode,
        }
      );

      let result;
      if (isRegistering) {
        result = await register(email.trim(), password, firstName.trim(), lastName.trim(), faithMode);
      } else {
        result = await login(email.trim(), password);
      }

      if (result.success) {
        // Track successful auth
        AnalyticsService.getInstance().trackEvent(
          isRegistering ? 'registration_success' : 'login_success', 
          1, 
          { 
            method: 'email',
            faithMode: faithMode,
          }
        );
        
        Alert.alert('Success', isRegistering ? 'Account created successfully!' : 'Logged in successfully!');
        // Navigation will be handled automatically by AuthNavigator
      } else {
        // Track failed auth
        AnalyticsService.getInstance().trackEvent(
          isRegistering ? 'registration_failed' : 'login_failed', 
          1, 
          { 
            method: 'email',
            error: result.error,
            faithMode: faithMode,
          }
        );
        
        Alert.alert('Error', result.error || `${isRegistering ? 'Registration' : 'Login'} failed.`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      // Track error
      AnalyticsService.getInstance().trackEvent(
        isRegistering ? 'registration_error' : 'login_error', 
        1, 
        { 
          method: 'email',
          error: error instanceof Error ? error.message : 'Unknown error',
          faithMode: faithMode,
        }
      );
      
      Alert.alert('Error', `${isRegistering ? 'Registration' : 'Login'} failed.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (authResponse: any) => {
    setGoogleLoading(true);
    try {
      AnalyticsService.getInstance().trackEvent('login_attempt', 1, { 
        method: 'google',
        faithMode: faithMode,
      });
      
      await signInWithGoogle(authResponse);
      
      AnalyticsService.getInstance().trackEvent('login_success', 1, { 
        method: 'google',
        faithMode: faithMode,
      });
      
      Alert.alert('Success', 'Logged in successfully!');
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.error('Google login error:', error);
      
      AnalyticsService.getInstance().trackEvent('login_failed', 1, { 
        method: 'google',
        error: error instanceof Error ? error.message : 'Unknown error',
        faithMode: faithMode,
      });
      
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
      AnalyticsService.getInstance().trackEvent('login_attempt', 1, { 
        method: 'facebook',
        faithMode: faithMode,
      });
      
      await signInWithFacebook();
      
      AnalyticsService.getInstance().trackEvent('login_success', 1, { 
        method: 'facebook',
        faithMode: faithMode,
      });
      
      Alert.alert('Success', 'Logged in successfully!');
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.error('Facebook login error:', error);
      
      AnalyticsService.getInstance().trackEvent('login_failed', 1, { 
        method: 'facebook',
        error: error instanceof Error ? error.message : 'Unknown error',
        faithMode: faithMode,
      });
      
      Alert.alert('Error', 'Login failed.');
    } finally {
      setFacebookLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setFaithMode(false);
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
      
      {/* 3D Ribbon-Like Background using SVG */}
      <View style={styles.ribbonContainer}>
        {/* Ribbon 1 - Top diagonal flowing ribbon */}
        <View style={{ position: 'absolute', top: -50, left: -100, right: 0, height: 400, transform: [{ rotate: '15deg' }] }}>
          <Svg height="400" width={width + 200} style={{ opacity: 0.3 }}>
            <Defs>
              <SvgLinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFD700" stopOpacity="0.6" />
                <Stop offset="0.5" stopColor="#FFA500" stopOpacity="0.4" />
                <Stop offset="1" stopColor="#FF8C00" stopOpacity="0.2" />
              </SvgLinearGradient>
            </Defs>
            <Path d="M0 150 Q150 80 350 120 T700 100 Q800 95 900 110 L950 180 Q850 165 750 170 T400 190 Q200 220 50 200 Z" fill="url(#grad1)" />
          </Svg>
        </View>
        
        {/* Ribbon 2 - Middle curved ribbon with 3D effect */}
        <View style={{ position: 'absolute', top: 150, left: -50, right: 0, height: 300, transform: [{ rotate: '-8deg' }] }}>
          <Svg height="300" width={width + 100} style={{ opacity: 0.25 }}>
            <Defs>
              <SvgLinearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#C0C0C0" stopOpacity="0.5" />
                <Stop offset="0.3" stopColor="#E6E6FA" stopOpacity="0.4" />
                <Stop offset="0.7" stopColor="#DDA0DD" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#9370DB" stopOpacity="0.2" />
              </SvgLinearGradient>
            </Defs>
            <Path d="M0 100 Q200 60 400 90 T800 85 L850 140 Q650 145 450 150 T100 155 Z" fill="url(#grad2)" />
          </Svg>
        </View>
        
        {/* Ribbon 3 - Bottom flowing ribbon */}
        <View style={{ position: 'absolute', bottom: 50, left: 0, right: -80, height: 350, transform: [{ rotate: '25deg' }] }}>
          <Svg height="350" width={width + 150} style={{ opacity: 0.2 }}>
            <Defs>
              <SvgLinearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFD700" stopOpacity="0.4" />
                <Stop offset="0.4" stopColor="#FFEB3B" stopOpacity="0.3" />
                <Stop offset="0.8" stopColor="#FFC107" stopOpacity="0.2" />
                <Stop offset="1" stopColor="#FF9800" stopOpacity="0.1" />
              </SvgLinearGradient>
            </Defs>
            <Path d="M0 200 Q150 150 300 180 Q450 210 600 185 T900 175 L950 230 Q750 235 550 240 T200 250 Z" fill="url(#grad3)" />
          </Svg>
        </View>
        
        {/* Additional depth ribbons for 3D effect */}
        <View style={{ position: 'absolute', top: 80, right: -120, height: 250, transform: [{ rotate: '45deg' }] }}>
          <Svg height="250" width="200" style={{ opacity: 0.15 }}>
            <Defs>
              <SvgLinearGradient id="grad4" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#4A90E2" stopOpacity="0.4" />
                <Stop offset="0.5" stopColor="#7B68EE" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#9932CC" stopOpacity="0.2" />
              </SvgLinearGradient>
            </Defs>
            <Polygon points="0,50 150,30 180,80 200,140 170,180 20,200 0,150" fill="url(#grad4)" />
          </Svg>
        </View>
        
        {/* Left side accent ribbon */}
        <View style={{ position: 'absolute', top: 300, left: -60, height: 200, transform: [{ rotate: '-30deg' }] }}>
          <Svg height="200" width="150" style={{ opacity: 0.18 }}>
            <Defs>
              <SvgLinearGradient id="grad5" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#C0C0C0" stopOpacity="0.5" />
                <Stop offset="0.6" stopColor="#B0C4DE" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#778899" stopOpacity="0.2" />
              </SvgLinearGradient>
            </Defs>
            <Path d="M0 80 Q50 40 100 60 Q130 80 140 120 Q135 160 110 180 Q70 190 30 170 Q5 150 0 120 Z" fill="url(#grad5)" />
          </Svg>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.authTitle}>
                {isRegistering ? 'CREATE YOUR ACCOUNT' : 'LOGIN TO YOUR ACCOUNT'}
              </Text>
              <Text style={styles.authSubtitle}>
                {isRegistering ? 'Join the Kingdom Studios community' : 'Enter your login information'}
              </Text>

              {/* Email/Password Form */}
              <View style={styles.formContainer}>
                {isRegistering && (
                  <View style={styles.nameRow}>
                    <View style={styles.nameInput}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="First Name"
                        placeholderTextColor={KingdomColors.text.muted}
                        value={firstName}
                        onChangeText={setFirstName}
                        editable={!isLoading}
                        autoCapitalize="words"
                      />
                    </View>
                    <View style={styles.nameInput}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Last Name"
                        placeholderTextColor={KingdomColors.text.muted}
                        value={lastName}
                        onChangeText={setLastName}
                        editable={!isLoading}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor={KingdomColors.text.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={KingdomColors.text.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>

                {isRegistering && (
                  <TouchableOpacity
                    style={styles.faithModeContainer}
                    onPress={() => setFaithMode(!faithMode)}
                    disabled={isLoading}
                  >
                    <View style={[styles.checkbox, faithMode && styles.checkboxChecked]}>
                      {faithMode && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.faithModeText}>
                      Enable Faith Mode - Filter content to align with Christian values
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryLoginButton}
                  onPress={handleEmailAuth}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {loading ? (
                      <ActivityIndicator color={KingdomColors.text.primary} size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {isRegistering ? 'CREATE ACCOUNT' : 'LOGIN'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
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
                      <Text style={styles.socialButtonIcon}>F</Text>
                      <Text style={styles.socialButtonText}>FACEBOOK</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.signupSection}>
                <Text style={styles.signupText}>
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <Text style={styles.signupLink} onPress={toggleAuthMode}>
                    {isRegistering ? 'Sign In' : 'Sign Up'}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
