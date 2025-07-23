/**
 * 🎨 Kingdom Colors - Updated Warm Color Scheme
 * No purple, no dark overload, warm and inviting palette
 */

export const KingdomColors = {
  // Primary Colors - Warm and Inviting
  primary: '#8B4513', // Saddle Brown - Warm, earthy primary
  secondary: '#D2691E', // Chocolate - Complementary warm tone
  accent: '#FF8C00', // Dark Orange - Energetic accent

  // Faith Mode Colors - Encouraging and Uplifting
  faith: '#2E8B57', // Sea Green - Calming faith color
  faithLight: '#90EE90', // Light Green - Soft faith accent
  faithDark: '#228B22', // Forest Green - Deep faith tone

  // Surface Colors - Warm and Welcoming
  background: '#FFF8DC', // Cornsilk - Warm, light background
  surface: '#FAF0E6', // Linen - Soft surface color
  card: '#FFFFFF', // Pure White - Clean card background

  // Text Colors - High Contrast and Readable
  text: '#2F2F2F', // Dark Gray - Primary text
  textSecondary: '#6B6B6B', // Medium Gray - Secondary text
  textTertiary: '#9B9B9B', // Light Gray - Tertiary text
  textInverse: '#FFFFFF', // White - Text on dark backgrounds

  // Status Colors - Clear and Accessible
  success: '#4CAF50', // Green - Success states
  warning: '#FF9800', // Orange - Warning states
  error: '#F44336', // Red - Error states
  info: '#2196F3', // Blue - Information states

  // Tier Colors - Premium Feel
  premium: '#FFD700', // Gold - Premium tier
  premiumLight: '#FFF8DC', // Light gold
  premiumDark: '#B8860B', // Dark gold

  // Border and Divider Colors
  border: '#E0E0E0', // Light Gray - Subtle borders
  divider: '#F5F5F5', // Very Light Gray - Dividers

  // Interactive States
  pressed: '#E8E8E8', // Light Gray - Pressed state
  hover: '#F0F0F0', // Very Light Gray - Hover state
  selected: '#FFF3E0', // Light Orange - Selected state

  // Gradient Colors
  gradientStart: '#8B4513', // Primary
  gradientEnd: '#D2691E', // Secondary
  faithGradientStart: '#2E8B57', // Faith
  faithGradientEnd: '#90EE90', // Faith Light

  // Shadow Colors
  shadow: 'rgba(139, 69, 19, 0.1)', // Primary with opacity
  shadowLight: 'rgba(139, 69, 19, 0.05)', // Light shadow
  shadowDark: 'rgba(139, 69, 19, 0.2)', // Dark shadow

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  overlayLight: 'rgba(0, 0, 0, 0.3)', // Light overlay

  // Special Purpose Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Accessibility Colors
  accessibilityFocus: '#FF6B35', // High contrast focus color
  accessibilityText: '#1A1A1A', // High contrast text

  // Animation Colors
  animationPrimary: '#8B4513',
  animationSecondary: '#D2691E',
  animationFaith: '#2E8B57',

  // Legacy Support (for backward compatibility)
  oldPrimary: '#8B4513',
  oldSecondary: '#D2691E',
  oldAccent: '#FF8C00',
};

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getTierColor = (tier: 'free' | 'pro' | 'enterprise'): string => {
  switch (tier) {
    case 'free':
      return KingdomColors.success;
    case 'pro':
      return KingdomColors.primary;
    case 'enterprise':
      return KingdomColors.premium;
    default:
      return KingdomColors.textSecondary;
  }
};

export const getFaithModeColor = (isActive: boolean): string => {
  return isActive ? KingdomColors.faith : KingdomColors.textSecondary;
};

export const getAccessibilityColor = (isHighContrast: boolean): string => {
  return isHighContrast ? KingdomColors.accessibilityText : KingdomColors.text;
};
