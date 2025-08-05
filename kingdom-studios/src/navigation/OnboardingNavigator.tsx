import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import FeatureShowcaseScreen from '../screens/FeatureShowcaseScreen';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../contexts/UnifiedAuthContext';

export type OnboardingStackParamList = {
  Splash: undefined;
  FeatureShowcase: undefined;
  Login: undefined;
  AuthFlow: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  const { user, isLoading, isGuestMode } = useAuth();
  const isAuthenticated = !!user || isGuestMode;

  console.log('OnboardingNavigator:', { user: !!user, isLoading, isGuestMode, isAuthenticated });

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If user is already authenticated or in guest mode, show main app
  if (isAuthenticated) {
    console.log('User authenticated, showing AuthNavigator');
    return <AuthNavigator />;
  }

  // Show onboarding flow for new users
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="FeatureShowcase" component={FeatureShowcaseScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
