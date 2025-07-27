import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ribbonRotation = useRef(new Animated.Value(0)).current;
  const ribbonScale = useRef(new Animated.Value(1)).current;
  const ribbonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the sophisticated animation sequence
    const animationSequence = Animated.sequence([
      // Ribbons fade in first
      Animated.timing(ribbonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Logo entrance with elegant scale
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Tagline fade in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Enhanced ribbon animation with more dramatic movement
    const ribbonAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(ribbonRotation, {
          toValue: 1,
          duration: 6000, // Faster rotation for more visible effect
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(ribbonScale, {
            toValue: 1.08, // More dramatic scaling
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(ribbonScale, {
            toValue: 0.95,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Start animations
    animationSequence.start();
    ribbonAnimation.start();

    // Complete after 3.5 seconds
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
      ribbonAnimation.stop();
    };
  }, []);

  const ribbonRotationDegree = ribbonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={KingdomColors.gradients.refinedFlame as [string, string]}
        style={styles.backgroundGradient}
      >
        {/* Animated 3D Silk Ribbon Effect - ENHANCED */}
        <Animated.View
          style={[
            styles.ribbonContainer,
            {
              opacity: ribbonOpacity,
              transform: [
                { rotate: ribbonRotationDegree },
                { scale: ribbonScale }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={KingdomColors.gradients.goldShimmer as [string, string]}
            style={styles.ribbon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ribbonShadow} />
            <View style={styles.ribbonHighlight} />
            <View style={styles.ribbonCore} />
          </LinearGradient>
        </Animated.View>

        {/* Secondary ribbons for enhanced depth */}
        <Animated.View
          style={[
            styles.ribbonContainer,
            styles.secondaryRibbon,
            {
              opacity: ribbonOpacity,
              transform: [
                { rotate: ribbonRotationDegree },
                { scale: ribbonScale }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[KingdomColors.refined.dustyGold, KingdomColors.refined.gold]}
            style={[styles.ribbon, { opacity: 0.6 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ribbonShadow} />
          </LinearGradient>
        </Animated.View>

        {/* Third ribbon layer for maximum 3D effect */}
        <Animated.View
          style={[
            styles.ribbonContainer,
            styles.thirdRibbon,
            {
              opacity: ribbonOpacity,
              transform: [
                {
                  rotate: ribbonRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['90deg', '450deg'],
                  })
                },
                { scale: ribbonScale }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={KingdomColors.gradients.royalGold as [string, string]}
            style={[styles.ribbon, { opacity: 0.4, height: 40 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.ribbonShadow, { borderRadius: 20 }]} />
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              }
            ]}
          >
            <LinearGradient
              colors={KingdomColors.gradients.goldShimmer as [string, string]}
              style={styles.logoBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={require('../../assets/KingdomStudiosLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>

          {/* App Name & Tagline */}
          <Animated.View style={{ opacity: taglineOpacity }}>
            <Text style={styles.appName}>Kingdom Studios</Text>
            <Text style={styles.tagline}>
              Create with Purpose. Share with Power. Build What Matters.
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.refined.maroon,
  },
  backgroundGradient: {
    flex: 1,
  },

  // ===========================================
  // 🎀 3D RIBBON ANIMATION - ENHANCED
  // ===========================================
  ribbonContainer: {
    position: 'absolute',
    top: height * 0.15,
    left: -width * 0.5,
    right: -width * 0.5,
    height: 80, // Increased height for more visibility
    zIndex: 1,
  },
  secondaryRibbon: {
    top: height * 0.70,
    height: 60,
    transform: [{ rotate: '180deg' }],
  },
  thirdRibbon: {
    top: height * 0.45,
    height: 40,
  },
  ribbon: {
    flex: 1,
    borderRadius: 40,
    shadowColor: KingdomColors.refined.gold,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  ribbonShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 34,
  },
  ribbonHighlight: {
    position: 'absolute',
    top: 12,
    left: '15%',
    right: '50%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
  },
  ribbonCore: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    marginTop: -2,
  },

  // ===========================================
  // 📱 MAIN CONTENT
  // ===========================================
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...KingdomShadows.large,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif', // Elegant serif font
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: KingdomColors.refined.softSand,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 28,
    fontFamily: 'serif', // Elegant serif font
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SplashScreen;
