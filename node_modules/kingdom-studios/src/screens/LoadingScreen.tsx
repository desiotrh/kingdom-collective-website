import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for loading spinner
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy, KingdomColors.primary.royalPurple]}
        style={styles.gradient}
      >
        {/* Background Decorations */}
        <View style={styles.decorations}>
          <View style={[styles.decoration, styles.decoration1]} />
          <View style={[styles.decoration, styles.decoration2]} />
          <View style={[styles.decoration, styles.decoration3]} />
          <View style={[styles.decoration, styles.decoration4]} />
        </View>

        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}>
          {/* Kingdom Logo */}
          <View style={styles.logoContainer}>
            <KingdomLogo size="large" />
          </View>

          {/* Custom Loading Spinner */}
          <View style={styles.loadingSection}>
            <Animated.View style={[
              styles.loadingRing,
              { transform: [{ rotate: spin }] }
            ]}>
              <LinearGradient
                colors={[KingdomColors.gold.bright, KingdomColors.gold.warm, KingdomColors.silver.bright]}
                style={styles.ringGradient}
              />
            </Animated.View>
            
            <View style={styles.loadingCenter}>
              <Text style={styles.loadingIcon}>👑</Text>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textSection}>
            <Text style={styles.loadingText}>Kingdom Studios</Text>
            <Text style={styles.subText}>Preparing your royal experience...</Text>
            
            {/* Loading dots animation */}
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        scale: rotateAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange: index === 0 ? [1, 1.5, 1, 1] :
                                      index === 1 ? [1, 1, 1.5, 1] :
                                                    [1, 1, 1, 1.5],
                        })
                      }]
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decoration: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  decoration1: {
    width: 200,
    height: 200,
    backgroundColor: KingdomColors.gold.bright,
    top: -50,
    right: -100,
  },
  decoration2: {
    width: 150,
    height: 150,
    backgroundColor: KingdomColors.silver.bright,
    bottom: 100,
    left: -75,
  },
  decoration3: {
    width: 100,
    height: 100,
    backgroundColor: KingdomColors.gold.warm,
    top: height * 0.3,
    right: -50,
  },
  decoration4: {
    width: 120,
    height: 120,
    backgroundColor: KingdomColors.silver.steel,
    bottom: -60,
    right: width * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  loadingSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 4,
  },
  ringGradient: {
    flex: 1,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  loadingCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: KingdomColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 24,
  },
  textSection: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subText: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: KingdomColors.gold.bright,
  },
});

export default LoadingScreen;
