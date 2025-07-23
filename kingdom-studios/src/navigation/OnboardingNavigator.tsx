import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import FeatureShowcaseScreen from '../screens/FeatureShowcaseScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthNavigator from './AuthNavigator';
import TestScreen from '../components/TestScreen';
import { useAuth } from '../contexts/AuthContext';

export type OnboardingStackParamList = {
  Splash: undefined;
  FeatureShowcase: undefined;
  Login: undefined;
  AuthFlow: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'features' | 'login' | 'app'>('splash');
  const { user, isLoading, isGuestMode } = useAuth();
  const isAuthenticated = !!user || isGuestMode;

  console.log('OnboardingNavigator:', { user: !!user, isLoading, isGuestMode, isAuthenticated, currentScreen });

  // If user is already authenticated or in guest mode, skip onboarding
  if (isAuthenticated && !isLoading) {
    console.log('User authenticated, showing AuthNavigator');
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      {currentScreen === 'splash' && (
        <Stack.Screen name="Splash">
          {() => (
            <TestScreen />
          )}
        </Stack.Screen>
      )}
      
      {currentScreen === 'features' && (
        <Stack.Screen name="FeatureShowcase">
          {() => (
            <FeatureShowcaseScreen 
              onContinue={() => setCurrentScreen('login')} 
            />
          )}
        </Stack.Screen>
      )}
      
      {currentScreen === 'login' && (
        <Stack.Screen name="Login">
          {() => <LoginScreen />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
