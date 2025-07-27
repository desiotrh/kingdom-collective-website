import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera-tools"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="business-tools"
        options={{
          title: 'Business',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery-delivery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <Ionicons name="images" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketing"
        options={{
          title: 'Marketing',
          tabBarIcon: ({ color }) => <Ionicons name="share-social" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-enhancement"
        options={{
          title: 'AI Tools',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-session-planning"
        options={{
          title: 'Planning',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="client-experience"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="revenue-optimization"
        options={{
          title: 'Revenue',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community-networking"
        options={{
          title: 'Network',
          tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="VideoStudioRecorderScreen"
        options={{
          title: 'Video Studio',
          tabBarIcon: ({ color }) => <Ionicons name="videocam" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-photography-enhancement"
        options={{
          title: 'AI Enhance',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-workflow-tools"
        options={{
          title: 'Workflow',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="premium-faith-features"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => <Ionicons name="diamond" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="social-media-management"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <Ionicons name="share-social" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sponsorship"
        options={{
          title: 'Sponsorship',
          tabBarIcon: ({ color }) => <Ionicons name="heart-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advanced-analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mobile-enhancements"
        options={{
          title: 'Mobile',
          tabBarIcon: ({ color }) => <Ionicons name="phone-portrait" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
