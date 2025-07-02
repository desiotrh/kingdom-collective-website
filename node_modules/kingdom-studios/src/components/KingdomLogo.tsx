import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';

interface KingdomLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
  showGlow?: boolean;
  glowIntensity?: number;
}

const KingdomLogo: React.FC<KingdomLogoProps> = ({ 
  size = 'medium', 
  style, 
  showGlow = true, 
  glowIntensity = 0.2 
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 60, height: 60, borderRadius: 30 },
          image: { width: 50, height: 50, borderRadius: 25 },
        };
      case 'large':
        return {
          container: { width: 140, height: 140, borderRadius: 70 },
          image: { width: 120, height: 120, borderRadius: 60 },
        };
      default: // medium
        return {
          container: { width: 100, height: 100, borderRadius: 50 },
          image: { width: 80, height: 80, borderRadius: 40 },
        };
    }
  };

  const sizeStyle = getSizeStyle();

  return (
    <View style={[
      styles.container, 
      sizeStyle.container,
      style
    ]}>
      <Image 
        source={require('../../assets/KingdomStudiosLogo.png')}
        style={[styles.image, sizeStyle.image]}
        resizeMode="contain"
      />
      {showGlow && (
        <LinearGradient
          colors={[
            KingdomColors.gold.bright,
            KingdomColors.gold.warm,
            KingdomColors.gold.amber
          ]}
          style={[
            styles.glow,
            sizeStyle.container,
            { opacity: glowIntensity }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
    ...KingdomShadows.elegant,
  },
  image: {
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default KingdomLogo;
