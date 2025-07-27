import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

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
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-entry"
        options={{
          title: 'New Entry',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="devotional-generator"
        options={{
          title: 'Devotional',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book-planner"
        options={{
          title: 'Book Plan',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved-entries"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dream-tracker"
        options={{
          title: 'Dreams',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="moon.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="VideoStudioRecorderScreen"
        options={{
          title: 'Podcast Studio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mic.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="podcast-recording"
        options={{
          title: 'Recording',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="record.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-enhancements"
        options={{
          title: 'AI Enhance',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="video-podcasting"
        options={{
          title: 'Video',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="video" color={color} />,
        }}
      />
      <Tabs.Screen
        name="social-media-management"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.and.arrow.up" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sponsorship"
        options={{
          title: 'Sponsorship',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
