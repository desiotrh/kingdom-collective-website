import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';

const { width, height } = Dimensions.get('window');

interface RibbonAnimationProps {
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Ribbon opacity (default: 0.25) */
  opacity?: number;
  /** Number of ribbon layers (default: 3) */
  layers?: number;
  /** Whether to show the subtle glow effect */
  showGlow?: boolean;
}

/**
 * 🎗️ Elegant 3D Flowing Ribbon Animation Component
 * 
 * Creates smooth, sinusoidal ribbon paths that flow behind content.
 * Uses multiple layers for depth and subtle transparency.
 * Optimized for the Refined Flame theme.
 */
const RibbonAnimation: React.FC<RibbonAnimationProps> = ({
  speed = 1,
  opacity = 0.25,
  layers = 3,
  showGlow = true,
}) => {
  // Animation values for each ribbon layer
  const ribbonAnimations = useRef(
    Array.from({ length: layers }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Create smooth, continuous animations for each ribbon layer
    const animations = ribbonAnimations.map((ribbon, index) => {
      const layerDelay = index * 2000; // Stagger each layer by 2 seconds
      const layerSpeed = speed * (1 + index * 0.3); // Vary speed per layer
      
      return Animated.loop(
        Animated.parallel([
          // Horizontal sinusoidal movement
          Animated.timing(ribbon.translateX, {
            toValue: 1,
            duration: 8000 / layerSpeed,
            useNativeDriver: true,
          }),
          
          // Vertical wave motion
          Animated.timing(ribbon.translateY, {
            toValue: 1,
            duration: 6000 / layerSpeed,
            useNativeDriver: true,
          }),
          
          // Gentle rotation
          Animated.timing(ribbon.rotate, {
            toValue: 1,
            duration: 12000 / layerSpeed,
            useNativeDriver: true,
          }),
          
          // Subtle scaling for breathing effect
          Animated.sequence([
            Animated.timing(ribbon.scale, {
              toValue: 1.05,
              duration: 4000 / layerSpeed,
              useNativeDriver: true,
            }),
            Animated.timing(ribbon.scale, {
              toValue: 0.95,
              duration: 4000 / layerSpeed,
              useNativeDriver: true,
            }),
          ]),
        ]),
        { iterations: -1 }
      );
    });

    // Start animations with staggered delays
    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * 1000);
    });

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [speed, layers]);

  // Generate ribbon layers
  const renderRibbonLayer = (index: number) => {
    const ribbon = ribbonAnimations[index];
    const layerOpacity = opacity * (1 - index * 0.1); // Decrease opacity for back layers
    const layerHeight = 60 + index * 20; // Vary height
    const layerOffset = index * 100; // Vertical offset between layers

    // Interpolate animation values for smooth sinusoidal motion
    const translateX = ribbon.translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [-width * 0.3, width * 0.3],
    });

    const translateY = ribbon.translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 30],
    });

    const rotate = ribbon.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={`ribbon-layer-${index}`}
        style={[
          styles.ribbonLayer,
          {
            height: layerHeight,
            top: height * 0.2 + layerOffset,
            opacity: layerOpacity,
            transform: [
              { translateX },
              { translateY },
              { rotate },
              { scale: ribbon.scale },
            ],
          },
        ]}
      >
        {/* Glow effect behind ribbon */}
        {showGlow && (
          <View style={[styles.ribbonGlow, { height: layerHeight + 20 }]} />
        )}
        
        {/* Main ribbon with gradient */}
        <LinearGradient
          colors={[
            `rgba(212, 175, 55, ${layerOpacity})`,
            `rgba(244, 228, 188, ${layerOpacity * 0.6})`,
            `rgba(212, 175, 55, ${layerOpacity})`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.ribbon, { height: layerHeight }]}
        >
          {/* Ribbon highlight for 3D effect */}
          <View style={[styles.ribbonHighlight, { height: layerHeight * 0.3 }]} />
          
          {/* Ribbon shadow for depth */}
          <View style={[styles.ribbonShadow, { height: layerHeight * 0.2 }]} />
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: layers }, (_, index) => renderRibbonLayer(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Behind content but above background
  },
  
  ribbonLayer: {
    position: 'absolute',
    left: -width * 0.4,
    right: -width * 0.4,
    overflow: 'hidden',
  },
  
  ribbonGlow: {
    position: 'absolute',
    left: -10,
    right: -10,
    top: -10,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 50,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  
  ribbon: {
    flex: 1,
    borderRadius: 30,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  
  ribbonHighlight: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    right: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  
  ribbonShadow: {
    position: 'absolute',
    bottom: '20%',
    left: '30%',
    right: '15%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 10,
  },
});

export default RibbonAnimation;
