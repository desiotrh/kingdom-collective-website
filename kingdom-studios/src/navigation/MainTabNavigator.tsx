/**
 * 📱 Main Tab Navigator - Updated with Enhanced Features
 * Includes tier-based access control and Faith Mode support
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import ContentGeneratorScreen from '../screens/ContentGeneratorScreen';
import CommunityHubScreen from '../screens/CommunityHubScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import EnhancedFeaturesScreen from '../screens/EnhancedFeaturesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import icons (you'll need to install react-native-vector-icons)
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { isFaithMode } = useFaithMode();

  const getUserTier = (): 'free' | 'pro' | 'enterprise' => {
    if (isGuest) return 'free';
    return user?.tier || 'free';
  };

  const canAccessFeature = (requiredTier: 'free' | 'pro' | 'enterprise'): boolean => {
    const userTier = getUserTier();
    const tierOrder = { free: 0, pro: 1, enterprise: 2 };
    return tierOrder[userTier] >= tierOrder[requiredTier];
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Create':
              iconName = 'plus-circle';
              break;
            case 'Community':
              iconName = 'account-group';
              break;
            case 'Analytics':
              iconName = 'chart-line';
              break;
            case 'Enhanced':
              iconName = 'rocket-launch';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: KingdomColors.primary,
        tabBarInactiveTintColor: KingdomColors.textSecondary,
        tabBarStyle: {
          backgroundColor: KingdomColors.surface,
          borderTopColor: KingdomColors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: KingdomColors.surface,
          borderBottomColor: KingdomColors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: KingdomColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Create"
        component={ContentGeneratorScreen}
        options={{
          title: 'Create',
        }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityHubScreen}
        options={{
          title: 'Community',
          tabBarLabel: 'Community',
        }}
      />

      {canAccessFeature('pro') && (
        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            title: 'Analytics',
            tabBarLabel: 'Analytics',
          }}
        />
      )}

      <Tab.Screen
        name="Enhanced"
        component={EnhancedFeaturesScreen}
        options={{
          title: 'Enhanced Features',
          tabBarLabel: 'Enhanced',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="rocket-launch"
              size={size}
              color={focused ? KingdomColors.primary : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
