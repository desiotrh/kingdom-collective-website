import React, { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';

// Lazy loading for heavy components
export const LazyContentGeneratorScreen = React.lazy(() => 
  import('../screens/ContentGeneratorScreen')
);

export const LazyCreatorDashboardScreen = React.lazy(() => 
  import('../screens/CreatorDashboardScreen')
);

export const LazyDashboardScreen = React.lazy(() => 
  import('../screens/DashboardScreen')
);

export const LazyProductSyncScreen = React.lazy(() => 
  import('../screens/ProductSyncScreen')
);

export const LazySponsorshipsScreen = React.lazy(() => 
  import('../screens/SponsorshipsScreen')
);

export const LazyForgeCommunityScreen = React.lazy(() => 
  import('../screens/ForgeCommunityScreen')
);

// Loading skeleton component
export const LoadingSkeleton: React.FC = () => (
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: KingdomColors.dark.background,
  }}>
    <ActivityIndicator size="large" color={KingdomColors.gold} />
  </View>
);

// Optimized Suspense wrapper
export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSkeleton />}>
    {children}
  </Suspense>
);
