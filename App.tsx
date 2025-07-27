import React, { useEffect, Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AuthProvider } from './kingdom-studios/src/contexts/AuthContext';
import { FaithModeProvider } from './kingdom-studios/src/contexts/FaithModeContext';
import { DualModeProvider } from './kingdom-studios/src/contexts/DualModeContext';
import { TierSystemProvider } from './kingdom-studios/src/contexts/TierSystemContext';
import { NotificationProvider } from './kingdom-studios/src/contexts/NotificationContext';
import { ProductProvider } from './kingdom-studios/src/contexts/ProductContext';
import { AppProvider } from './kingdom-studios/src/contexts/AppContext';
import { PerformanceProvider } from './kingdom-studios/src/contexts/PerformanceContext';
import { LoadingSkeleton } from './kingdom-studios/src/components/LazyComponents';
import notificationService from './kingdom-studios/src/services/notificationService';

// Lazy load OnboardingNavigator for better initial load performance
const OnboardingNavigator = React.lazy(() => import('./kingdom-studios/src/navigation/OnboardingNavigator'));

export default function App() {
  useEffect(() => {
    // Initialize notification service (skip on web for now)
    if (Platform.OS !== 'web') {
      const initializeServices = async () => {
        try {
          await notificationService.initialize();
          console.log('Notification service initialized');
        } catch (error) {
          console.error('Failed to initialize notification service:', error);
        }
      };

      initializeServices();
    }
  }, []);

  return (
    <PerformanceProvider>
      <AppProvider>
        <ProductProvider>
          <NotificationProvider>
            <DualModeProvider>
              <TierSystemProvider>
                <FaithModeProvider>
                  <AuthProvider>
                    <NavigationContainer>
                      <StatusBar style="light" />
                      <Suspense fallback={<LoadingSkeleton />}>
                        <OnboardingNavigator />
                      </Suspense>
                    </NavigationContainer>
                  </AuthProvider>
                </FaithModeProvider>
              </TierSystemProvider>
            </DualModeProvider>
          </NotificationProvider>
        </ProductProvider>
      </AppProvider>
    </PerformanceProvider>
  );
}
