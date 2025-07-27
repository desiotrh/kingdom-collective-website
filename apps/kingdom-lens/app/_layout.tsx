import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Kingdom Lens specific imports
import { KingdomColors } from '../../kingdom-studios/src/constants/KingdomColors';

const KingdomLensLayout = () => {
  const [faithMode, setFaithMode] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={darkMode ? ['#1a1a2e', '#16213e'] : ['#ffffff', '#f8f9fa']}
        style={styles.container}
      >
        <StatusBar style={darkMode ? 'light' : 'dark'} />

        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
            },
            headerTintColor: darkMode ? '#ffffff' : '#1a1a2e',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: () => (
              <View style={styles.headerControls}>
                <View style={styles.toggleRow}>
                  <Text style={[styles.toggleLabel, { color: darkMode ? '#ffffff' : '#1a1a2e' }]}>
                    Faith Mode
                  </Text>
                  <Switch
                    value={faithMode}
                    onValueChange={setFaithMode}
                    trackColor={{ false: '#767577', true: KingdomColors.primary }}
                    thumbColor={faithMode ? '#ffffff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={[styles.toggleLabel, { color: darkMode ? '#ffffff' : '#1a1a2e' }]}>
                    Dark Mode
                  </Text>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#767577', true: KingdomColors.primary }}
                    thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
                  />
                </View>
              </View>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: '📸 Kingdom Lens',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="projects"
            options={{
              title: 'Photo Projects',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="prophetic"
            options={{
              title: 'Prophetic Lens',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="workflow"
            options={{
              title: 'Workflow & Contracts',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="studio"
            options={{
              title: 'Mobile Studio',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="store"
            options={{
              title: 'Photo Store',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="analytics"
            options={{
              title: 'Analytics',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="client-portal"
            options={{
              title: 'Client Portal',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="community"
            options={{
              title: 'Community',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerShown: true,
            }}
          />
        </Stack>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  toggleLabel: {
    fontSize: 12,
    marginRight: 4,
  },
});

export default KingdomLensLayout;
