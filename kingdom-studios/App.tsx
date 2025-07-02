import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { FaithModeProvider } from './src/contexts/FaithModeContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { AppProvider } from './src/contexts/AppContext';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <AppProvider>
      <ProductProvider>
        <FaithModeProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <AuthNavigator />
            </NavigationContainer>
          </AuthProvider>
        </FaithModeProvider>
      </ProductProvider>
    </AppProvider>
  );
}
