import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_400Regular_Italic,
} from '@expo-google-fonts/raleway';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FaithModeProvider } from '@/contexts/FaithModeContext';
import { AIReflectBanner } from 'packages/ui/AIReflectBanner';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Playfair Display': PlayfairDisplay_400Regular,
    'Playfair Display Bold': PlayfairDisplay_700Bold,
    'Playfair Display Italic': PlayfairDisplay_400Regular_Italic,
    'Raleway': Raleway_400Regular,
    'Raleway Light': Raleway_300Light,
    'Raleway Medium': Raleway_500Medium,
    'Raleway Italic': Raleway_400Regular_Italic,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FaithModeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <AIReflectBanner />
      </FaithModeProvider>
    </ThemeProvider>
  );
}
