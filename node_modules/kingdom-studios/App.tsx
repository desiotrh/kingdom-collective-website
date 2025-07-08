import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { AuthProvider } from './src/contexts/AuthContext';
import { FaithModeProvider } from './src/contexts/FaithModeContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { AppProvider } from './src/contexts/AppContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import notificationService from './src/services/notificationService';

// Type override for extra config
type AppConfig = typeof Constants.expoConfig & {
  extra?: {
    stripePublishableKey: string;
  };
};

export default function App() {
  const stripePublishableKey = (Constants.expoConfig as AppConfig).extra?.stripePublishableKey || '';

  useEffect(() => {
    // Initialize notification service
    const initializeServices = async () => {
      try {
        await notificationService.initialize();
        console.log('Notification service initialized');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <AppProvider>
        <ProductProvider>
          <FaithModeProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <AuthNavigator />
              </NavigationContainer>
            </AuthProvider>
          </FaithModeProvider>
        </ProductProvider>
      </AppProvider>
    </StripeProvider>
  );
}
