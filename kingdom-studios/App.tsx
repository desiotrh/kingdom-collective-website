import React, { useEffect, Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AuthProvider } from './src/contexts/UnifiedAuthContext';
import { FaithModeProvider } from './src/contexts/FaithModeContext';
import { DualModeProvider } from './src/contexts/DualModeContext';
import { TierSystemProvider } from './src/contexts/TierSystemContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { AppProvider } from './src/contexts/AppContext';
import { PerformanceProvider } from './src/contexts/PerformanceContext';
import { LoadingSkeleton } from './src/components/LazyComponents';
import notificationService from './src/services/notificationService';
import { AIReflectBanner } from '../packages/ui/AIReflectBanner';

// Lazy load OnboardingNavigator for better initial load performance
const OnboardingNavigator = React.lazy(() => import('./src/navigation/OnboardingNavigator'));

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
                      <AIReflectBanner />
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
