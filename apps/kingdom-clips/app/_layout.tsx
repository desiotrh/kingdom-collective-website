import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AIReflectBanner } from 'packages/ui/AIReflectBanner';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FaithModeProvider } from '../../../packages/hooks/useFaithMode';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Anton: require('../assets/fonts/Anton-Regular.ttf'),
    BebasNeue: require('../assets/fonts/BebasNeue-Regular.ttf'),
    Urbanist: require('../assets/fonts/Urbanist-Regular.ttf'),
    DMSans: require('../assets/fonts/DMSans-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <FaithModeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <AIReflectBanner />
      </ThemeProvider>
    </FaithModeProvider>
  );
}
