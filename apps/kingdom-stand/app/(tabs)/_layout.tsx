import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0B1020' },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: '#0B1020', borderTopColor: '#FFD700' },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: () => '📄',
        }}
      />
      <Tabs.Screen
        name="prepare"
        options={{
          title: 'Prepare',
          tabBarIcon: () => '📝',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'FAQ',
          tabBarIcon: () => '💬',
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: () => '👨‍👩‍👧',
        }}
      />
      <Tabs.Screen
        name="lawyers"
        options={{
          title: 'Lawyers',
          tabBarIcon: () => '👩‍⚖️',
        }}
      />
      <Tabs.Screen
        name="calm"
        options={{
          title: 'Calm',
          tabBarIcon: () => '🧘',
        }}
      />
    </Tabs>
  );
}
