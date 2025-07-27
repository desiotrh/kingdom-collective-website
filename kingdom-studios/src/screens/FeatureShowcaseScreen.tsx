import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FeatureShowcaseScreenProps {
  onContinue: () => void;
}

const FeatureShowcaseScreen: React.FC<FeatureShowcaseScreenProps> = ({ onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const ribbonRotation = useRef(new Animated.Value(0)).current;
  const ribbonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous ribbon animation
    const ribbonAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(ribbonRotation, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(ribbonScale, {
            toValue: 1.02,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(ribbonScale, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    ribbonAnimation.start();

    return () => {
      ribbonAnimation.stop();
    };
  }, []);

  const ribbonRotationDegree = ribbonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const features = [
    {
      icon: 'diamond-outline',
      title: 'Premium Design Tools',
      description: 'Professional design suite with AI-powered creation',
      color: KingdomColors.refined.gold,
    },
    {
      icon: 'trending-up-outline',
      title: 'Growth Analytics',
      description: 'Track your creative success with detailed insights',
      color: KingdomColors.refined.dustyGold,
    },
    {
      icon: 'people-outline',
      title: 'Creator Community',
      description: 'Connect with like-minded creators and innovators',
      color: KingdomColors.refined.gold,
    },
    {
      icon: 'flash-outline',
      title: 'AI-Powered Magic',
      description: 'Transform ideas into reality with cutting-edge AI',
      color: KingdomColors.refined.dustyGold,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={KingdomColors.gradients.refinedFlame as [string, string]}
        style={styles.backgroundGradient}
      >
        {/* Animated 3D Silk Ribbons */}
        <Animated.View
          style={[
            styles.ribbonContainer,
            styles.topRibbon,
            {
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
          </LinearGradient>
        </Animated.View>

        {/* Bottom ribbon moving opposite direction */}
        <Animated.View
          style={[
            styles.ribbonContainer,
            styles.bottomRibbon,
            {
              transform: [
                {
                  rotate: ribbonRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '540deg'],
                  })
                },
                { scale: ribbonScale }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[KingdomColors.refined.dustyGold, KingdomColors.refined.gold]}
            style={[styles.ribbon, { opacity: 0.4 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ribbonShadow} />
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Unlock Your Creative Power</Text>
              <Text style={styles.subtitle}>
                Everything you need to build, create, and succeed in the digital world
              </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureCard,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + (index * 10)],
                        })
                      }],
                    }
                  ]}
                >
                  <LinearGradient
                    colors={[
                      'rgba(212, 175, 55, 0.1)',
                      'rgba(212, 175, 55, 0.05)',
                    ]}
                    style={styles.featureCardGradient}
                  >
                    <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                      <Ionicons name={feature.icon as any} size={32} color={feature.color} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <Text style={styles.ctaText}>Ready to transform your creative journey?</Text>

              <TouchableOpacity onPress={onContinue} style={styles.continueButton}>
                <LinearGradient
                  colors={KingdomColors.gradients.goldShimmer as [string, string]}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.continueButtonText}>Begin Your Journey</Text>
                  <Ionicons name="arrow-forward" size={20} color={KingdomColors.refined.black} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
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
  // 🎀 3D RIBBON ANIMATIONS
  // ===========================================
  ribbonContainer: {
    position: 'absolute',
    left: -width * 0.4,
    right: -width * 0.4,
    height: 50,
    zIndex: 1,
  },
  topRibbon: {
    top: height * 0.12,
  },
  bottomRibbon: {
    bottom: height * 0.18,
  },
  ribbon: {
    flex: 1,
    borderRadius: 25,
    shadowColor: KingdomColors.refined.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  ribbonShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  ribbonHighlight: {
    position: 'absolute',
    top: 6,
    left: '20%',
    right: '60%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
  },

  // ===========================================
  // 📱 MAIN CONTENT
  // ===========================================
  content: {
    flex: 1,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: height * 0.12,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'serif',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: KingdomColors.refined.softSand,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: width * 0.85,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ===========================================
  // 🎯 FEATURES GRID
  // ===========================================
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  featureCardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 16,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: KingdomColors.refined.softSand,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },

  // ===========================================
  // 🚀 CTA SECTION
  // ===========================================
  ctaSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '600',
    color: KingdomColors.refined.gold,
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: width * 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  continueButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.refined.black,
    marginRight: 8,
  },
});

export default FeatureShowcaseScreen;
