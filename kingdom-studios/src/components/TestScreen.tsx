import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';

const TestScreen: React.FC = () => {
  console.log('TestScreen rendering');
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={KingdomColors.gradients.refinedFlame as [string, string]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>🔥 Test Screen</Text>
        <Text style={styles.subtitle}>If you can see this, the app is working!</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: KingdomColors.refined.softSand,
    textAlign: 'center',
  },
});

export default TestScreen;
