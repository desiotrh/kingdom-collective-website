import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/UnifiedAuthContext';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoadingScreen from '../screens/LoadingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminMonitoringScreen from '../screens/AdminMonitoringScreen';
import { AIGenerationTestScreen } from '../screens/AIGenerationTestScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { SubscriptionUpgradeScreen } from '../screens/SubscriptionUpgradeScreen';
import SocialMediaManagementScreen from '../screens/SocialMediaManagementScreen';
import EmailMarketingManagementScreen from '../screens/EmailMarketingManagementScreen';
import AdvancedAnalyticsScreen from '../screens/AdvancedAnalyticsScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      {isAuthenticated ? (
        // User is signed in - Main app with tab navigation
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="AdminMonitoring" 
            component={AdminMonitoringScreen}
            options={{
              title: 'System Monitoring',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AIGenerationTest" 
            component={AIGenerationTestScreen}
            options={{
              title: 'AI Generation Test',
              headerShown: true,
              headerStyle: { backgroundColor: '#000000' },
              headerTintColor: '#FFFFFF',
            }}
          />
          <Stack.Screen 
            name="NotificationSettings" 
            component={NotificationSettingsScreen}
            options={{
              title: 'Notification Settings',
              headerShown: true,
              headerStyle: { backgroundColor: '#000000' },
              headerTintColor: '#FFFFFF',
            }}
          />
          <Stack.Screen 
            name="SubscriptionUpgrade" 
            component={SubscriptionUpgradeScreen}
            options={{
              title: 'Upgrade Your Plan',
              headerShown: true,
              headerStyle: { backgroundColor: '#000000' },
              headerTintColor: '#FFFFFF',
            }}
          />
          <Stack.Screen 
            name="SocialMediaManagement" 
            component={SocialMediaManagementScreen}
            options={{
              title: 'Social Media Hub',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EmailMarketingManagement" 
            component={EmailMarketingManagementScreen}
            options={{
              title: 'Email Marketing Hub',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AdvancedAnalyticsDashboard" 
            component={AdvancedAnalyticsScreen}
            options={{
              title: 'Advanced Analytics',
              headerShown: false,
            }}
          />
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              title: 'Welcome to Kingdom Studios',
            }}
          />
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{
              title: 'Welcome',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
