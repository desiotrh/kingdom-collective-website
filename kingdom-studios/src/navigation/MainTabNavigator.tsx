import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { MainTabParamList } from '../types/navigation';
import AppMenu from '../components/AppMenu';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import AIStudioScreen from '../screens/ai-studio/AIStudioScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import DesignStudioScreen from '../screens/design-studio/DesignStudioScreen';
import StorefrontScreen from '../screens/storefront/StorefrontScreen';
import ForgeCommunityScreen from '../screens/ForgeCommunityScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label }) => (
  <View style={styles.tabIconContainer}>
    {focused && (
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
        style={styles.tabIconGradient}
      />
    )}
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

const MenuIcon: React.FC<{ focused: boolean }> = ({ focused }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <View style={styles.tabIconContainer}>
          {focused && (
            <LinearGradient
              colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
              style={styles.tabIconGradient}
            />
          )}
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={focused ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            More
          </Text>
        </View>
      </TouchableOpacity>
      <AppMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
};

const MainTabNavigator: React.FC = () => {
  const { faithMode } = useFaithMode();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: KingdomColors.primary.royalPurple,
        tabBarInactiveTintColor: KingdomColors.text.secondary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="👑"
              label={faithMode ? "Kingdom" : "Dashboard"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AIStudio"
        component={AIStudioScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="🤖"
              label="AI Studio"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="📦"
              label="Products"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Design"
        component={DesignStudioScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="🎨"
              label="Design"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Storefront"
        component={StorefrontScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="🛍️"
              label="Store"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={ForgeCommunityScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              icon="🔥"
              label={faithMode ? "Forge" : "Community"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={View} // Placeholder component since we handle navigation in the icon
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MenuIcon focused={focused} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Custom navigation handling can be added here
            // e.preventDefault();
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: KingdomColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.gray,
    height: 90,
    paddingBottom: 20,
    paddingTop: 10,
    elevation: 10,
    shadowColor: KingdomColors.primary.royalPurple,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
    minWidth: 60,
  },
  tabIconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.1,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  tabLabelFocused: {
    color: KingdomColors.primary.royalPurple,
    fontWeight: '600',
  },
});

export default MainTabNavigator;
