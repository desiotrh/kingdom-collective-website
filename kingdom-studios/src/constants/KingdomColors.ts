// Kingdom Studios Color Palette
// Elegant royal colors with gold, silver, and sophisticated gradients

export const KingdomColors = {
  // Primary Kingdom Colors
  primary: {
    royalPurple: '#2D1B69',
    deepNavy: '#1A1A3A',
    midnight: '#0F0F23',
  },

  // Gold Palette
  gold: {
    bright: '#FFD700',    // Pure gold
    warm: '#FFC107',      // Warm gold
    amber: '#FF8F00',     // Deep amber
    pale: '#FFF8DC',      // Pale gold
  },

  // Silver Palette
  silver: {
    bright: '#C0C0C0',    // Pure silver
    light: '#E8E8E8',     // Light silver
    platinum: '#F5F5F5',  // Platinum
    steel: '#708090',     // Steel blue-silver
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    muted: '#9CA3AF',
    disabled: '#6B7280',
    inverse: '#1A1A3A',
  },

  // Background Colors
  background: {
    primary: '#0F0F23',
    secondary: '#1A1A3A',
    tertiary: '#2D1B69',
    overlay: 'rgba(15, 15, 35, 0.9)',
  },

  // Gradient Combinations
  gradients: {
    royalGold: ['#0F0F23', '#1A1A3A', '#2D1B69'],
    goldShimmer: ['#FFD700', '#FFC107', '#FF8F00'],
    silverShimmer: ['#C0C0C0', '#E8E8E8', '#F5F5F5'],
    elegantPurple: ['#2D1B69', '#4C1D95', '#6B46C1'],
    darkElegance: ['#000000', '#1A1A3A', '#2D1B69'],
    primary: ['#2D1B69', '#4C1D95', '#6B46C1'],
    secondary: ['#1A1A3A', '#2D1B69', '#4C1D95'],
    tertiary: ['#0F0F23', '#1A1A3A', '#2D1B69'],
    accent: ['#FFD700', '#FFC107', '#FF8F00'],
    cardBackground: ['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'],
    royalBackground: ['#000000', '#0F0F23', '#1A1A3A'],
  },

  // Accent Colors
  accent: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Basic Colors for compatibility
  black: '#000000',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  darkGray: '#374151',
  red: '#EF4444',
  green: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',

  // Opacity Variations
  opacity: {
    gold10: 'rgba(255, 215, 0, 0.1)',
    gold20: 'rgba(255, 215, 0, 0.2)',
    gold30: 'rgba(255, 215, 0, 0.3)',
    silver10: 'rgba(192, 192, 192, 0.1)',
    silver20: 'rgba(192, 192, 192, 0.2)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
  },

  // Mode-specific color schemes
  faith: {
    primary: '#2D1B69',
    secondary: '#4C1D95',
    accent: '#FFD700',
    background: '#0F0F23',
    surface: '#1A1A3A',
    text: '#FFFFFF',
    textSecondary: '#E5E7EB',
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  encouragement: {
    primary: '#4C1D95',
    secondary: '#6B46C1',
    accent: '#FFC107',
    background: '#1A1A3A',
    surface: '#2D1B69',
    text: '#FFFFFF',
    textSecondary: '#E5E7EB',
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  default: {
    primary: '#2D1B69',
    secondary: '#1A1A3A',
    accent: '#FFD700',
    background: '#0F0F23',
    surface: '#1A1A3A',
    text: '#FFFFFF',
    textSecondary: '#E5E7EB',
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Social Platform Colors (with kingdom twist)
  social: {
    google: '#EA4335',
    facebook: '#1877F2',
    apple: '#000000',
    instagram: '#E4405F',
    tiktok: '#000000',
    youtube: '#FF0000',
    twitter: '#1DA1F2',
    pinterest: '#BD081C',
    threads: '#000000',
    lemon8: '#FFD700',
    truthSocial: '#FF6B35',
  },
};

// Helper functions for creating gradients
export const createGradient = (colors: string[], direction = { x: 0, y: 0 }, end = { x: 1, y: 1 }) => ({
  colors,
  start: direction,
  end,
});

// Common gradient presets
export const KingdomGradients = {
  loginBackground: createGradient(KingdomColors.gradients.royalGold),
  goldButton: createGradient(KingdomColors.gradients.goldShimmer),
  silverButton: createGradient(KingdomColors.gradients.silverShimmer),
  cardBackground: createGradient(['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)']),
  royalOverlay: createGradient(['rgba(15, 15, 35, 0.95)', 'rgba(26, 26, 58, 0.9)']),
};

// Shadow presets for elevation
export const KingdomShadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  gold: {
    shadowColor: KingdomColors.gold.bright,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  silver: {
    shadowColor: KingdomColors.silver.bright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  elegant: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
};

export default KingdomColors;
