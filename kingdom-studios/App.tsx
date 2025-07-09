import React, { useEffect, Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { AuthProvider } from './src/contexts/AuthContext';
import { FaithModeProvider } from './src/contexts/FaithModeContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { AppProvider } from './src/contexts/AppContext';
import { PerformanceProvider } from './src/contexts/PerformanceContext';
import { LoadingSkeleton } from './src/components/LazyComponents';
import notificationService from './src/services/notificationService';

// Lazy load AuthNavigator for better initial load performance
const AuthNavigator = React.lazy(() => import('./src/navigation/AuthNavigator'));

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
      <PerformanceProvider>
        <AppProvider>
          <ProductProvider>
            <FaithModeProvider>
              <AuthProvider>
                <NavigationContainer>
                  <StatusBar style="light" />
                  <Suspense fallback={<LoadingSkeleton />}>
                    <AuthNavigator />
                  </Suspense>
                </NavigationContainer>
              </AuthProvider>
            </FaithModeProvider>
          </ProductProvider>
        </AppProvider>
      </PerformanceProvider>
    </StripeProvider>
  );
}
