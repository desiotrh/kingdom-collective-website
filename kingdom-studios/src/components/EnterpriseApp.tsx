/**
 * Frontend Enterprise Optimizations for Kingdom Studios App
 * React Native/Expo optimizations for 10K-100K+ users
 */

import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from './ErrorBoundary';
import { PerformanceMonitor } from './PerformanceMonitor';
import { OfflineNotice } from './OfflineNotice';
import { LoadingScreen } from '../screens/LoadingScreen';

// Lazy load navigation for better startup performance
const AuthNavigator = lazy(() => import('../navigation/AuthNavigator'));

const App = () => {
  // Memoize navigation config to prevent unnecessary re-renders
  const navigationConfig = useMemo(() => ({
    initialRouteName: 'Loading',
    screenOptions: {
      headerShown: false,
      // Enable hardware back gesture on Android
      gestureEnabled: true,
      // Optimize animations
      animationTypeForReplace: 'pop',
      animation: 'slide_from_right',
    }
  }), []);

  // Error recovery callback
  const handleError = useCallback((error: Error, errorInfo: any) => {
    console.error('App error:', error, errorInfo);
    // Report to crash analytics
    // FirebaseCrashlytics.recordError(error);
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <PerformanceMonitor>
        <AuthProvider>
          <NavigationContainer>
            <Suspense fallback={<LoadingScreen />}>
              <AuthNavigator />
            </Suspense>
            <OfflineNotice />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </PerformanceMonitor>
    </ErrorBoundary>
  );
};

export default App;
