import React, { lazy, Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});

// Loading fallback component
const LoadingFallback = () => {
  return React.createElement(View, { style: styles.loadingContainer },
    React.createElement(ActivityIndicator, { size: "large", color: "#6366f1" })
  );
};

// Lazy load heavy components
export const LazyContentGeneratorScreen = lazy(() => import('../screens/ContentGeneratorScreen'));
export const LazyVideoRecordingScreen = lazy(() => import('../screens/VideoRecordingScreen'));
export const LazyPhotoVideoFiltersScreen = lazy(() => import('../screens/PhotoVideoFiltersScreen'));
export const LazyCanvaDesignToolScreen = lazy(() => import('../screens/CanvaDesignToolScreen'));
export const LazyEcommerceStoreBuilderScreen = lazy(() => import('../screens/EcommerceStoreBuilderScreen'));
export const LazyPodcastShortsHubScreen = lazy(() => import('../screens/PodcastShortsHubScreen'));
export const LazyWebinarHostingScreen = lazy(() => import('../screens/WebinarHostingScreen'));
export const LazyWorkflowAutomationScreen = lazy(() => import('../screens/WorkflowAutomationScreen'));
export const LazyAnalyticsScreen = lazy(() => import('../screens/AnalyticsScreen'));
export const LazyAdvancedProjectManagementScreen = lazy(() => import('../screens/AdvancedProjectManagementScreen'));

// HOC for wrapping lazy components with Suspense
export const withLazyLoading = <T extends {}>(LazyComponent: React.LazyExoticComponent<React.ComponentType<T>>) => {
  return (props: T) => {
    return React.createElement(Suspense, { fallback: React.createElement(LoadingFallback) },
      React.createElement(LazyComponent, props)
    );
  };
};

// Helper function to create lazy screens
export const createLazyScreen = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  return withLazyLoading(LazyComponent);
};
