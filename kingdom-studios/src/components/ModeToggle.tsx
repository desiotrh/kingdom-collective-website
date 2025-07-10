import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width } = Dimensions.get('window');

interface ModeToggleProps {
  style?: any;
  showDescription?: boolean;
  compact?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ 
  style, 
  showDescription = false, 
  compact = false 
}) => {
  const { 
    currentMode, 
    toggleMode, 
    modeConfig, 
    availableModes,
    isLoading 
  } = useDualMode();

  const faithMode = availableModes.faith;
  const encouragementMode = availableModes.encouragement;

  const handleToggle = async () => {
    if (!isLoading) {
      await toggleMode();
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactToggle, style]}
        onPress={handleToggle}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <BlurView intensity={20} style={styles.compactBlur}>
          <LinearGradient
            colors={[
              currentMode === 'faith' ? faithMode.primaryColor : encouragementMode.primaryColor,
              currentMode === 'faith' ? faithMode.accentColor : encouragementMode.accentColor,
            ]}
            style={styles.compactGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={currentMode === 'faith' ? 'heart' : 'star'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.compactText}>
              {currentMode === 'faith' ? 'Faith' : 'Encouragement'}
            </Text>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={handleToggle}
        disabled={isLoading}
        activeOpacity={0.9}
      >
        <BlurView intensity={25} style={styles.toggleBlur}>
          <LinearGradient
            colors={['rgba(15, 15, 35, 0.9)', 'rgba(45, 27, 105, 0.8)']}
            style={styles.toggleGradient}
          >
            {/* Faith Mode Side */}
            <View style={[
              styles.modeSection,
              currentMode === 'faith' && styles.activeModeSection
            ]}>
              <LinearGradient
                colors={
                  currentMode === 'faith'
                    ? [faithMode.primaryColor, faithMode.accentColor]
                    : ['transparent', 'transparent']
                }
                style={styles.modeSectionGradient}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={currentMode === 'faith' ? '#FFFFFF' : KingdomColors.text.secondary}
                />
                <Text style={[
                  styles.modeTitle,
                  currentMode === 'faith' && styles.activeModeTitle
                ]}>
                  Faith
                </Text>
                {showDescription && (
                  <Text style={[
                    styles.modeDescription,
                    currentMode === 'faith' && styles.activeModeDescription
                  ]}>
                    Christian creators with Kingdom language
                  </Text>
                )}
              </LinearGradient>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Encouragement Mode Side */}
            <View style={[
              styles.modeSection,
              currentMode === 'encouragement' && styles.activeModeSection
            ]}>
              <LinearGradient
                colors={
                  currentMode === 'encouragement'
                    ? [encouragementMode.primaryColor, encouragementMode.accentColor]
                    : ['transparent', 'transparent']
                }
                style={styles.modeSectionGradient}
              >
                <Ionicons
                  name="star"
                  size={24}
                  color={currentMode === 'encouragement' ? '#FFFFFF' : KingdomColors.text.secondary}
                />
                <Text style={[
                  styles.modeTitle,
                  currentMode === 'encouragement' && styles.activeModeTitle
                ]}>
                  Encouragement
                </Text>
                {showDescription && (
                  <Text style={[
                    styles.modeDescription,
                    currentMode === 'encouragement' && styles.activeModeDescription
                  ]}>
                    Universal wisdom and clean tone
                  </Text>
                )}
              </LinearGradient>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>

      {/* Current Mode Indicator */}
      <View style={styles.indicatorContainer}>
        <Text style={styles.currentModeText}>
          Current: {modeConfig.name}
        </Text>
        <View style={[
          styles.indicator,
          { backgroundColor: modeConfig.accentColor }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  toggleContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toggleBlur: {
    flex: 1,
  },
  toggleGradient: {
    flexDirection: 'row',
    padding: 4,
    minHeight: 80,
  },
  modeSection: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeModeSection: {
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modeSectionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  activeModeTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modeDescription: {
    fontSize: 11,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
  activeModeDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  separator: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  currentModeText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginRight: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Compact styles
  compactToggle: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactBlur: {
    flex: 1,
  },
  compactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default React.memo(ModeToggle);
