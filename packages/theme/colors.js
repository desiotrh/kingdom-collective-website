/**
 * Kingdom Collective Design System - Colors
 * 
 * This module exports all brand colors and semantic color tokens
 * for consistent use across all Kingdom Collective applications.
 */

// Brand Colors
export const brandColors = {
  // Primary Brand Colors
  kingdomDark: '#0f172a',
  kingdomDarker: '#1e293b',
  kingdomNavy: '#0f172a',
  kingdomGold: '#D4AF37',       // Rich Metallic Gold (replaced bright yellow)
  kingdomGoldSoft: '#BFA05A',   // Warm Royal Gold
  kingdomGoldMatte: '#A78C3E',  // Luxe Matte Gold
  kingdomBronze: '#CD7F32',     // True Bronze
  kingdomBronzeDark: '#8C7853', // Dark Bronze
  kingdomBronzeCopper: '#B87333', // Deep Copper-Bronze
  kingdomOrange: '#f97316',
  kingdomGoldLight: '#fef3c7',
  kingdomOrangeLight: '#fed7aa',
  
  // Legacy Colors (for backward compatibility)
  navy: '#131416',
  blue: '#b7c6e0',
  gray: '#2d2f34',
  white: '#ffffff',
};

// Semantic Colors
export const semanticColors = {
  // Primary semantic colors
  primary: brandColors.kingdomGold,
  secondary: brandColors.kingdomBronze,
  accent: brandColors.kingdomDark,
  
  // Background colors
  background: brandColors.kingdomDark,
  surface: brandColors.kingdomDarker,
  
  // Text colors
  text: brandColors.white,
  textSecondary: brandColors.blue,
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Complete color palette
export const colors = {
  ...brandColors,
  ...semanticColors,
};

// Tailwind color configuration
export const tailwindColors = {
  colors: {
    // Kingdom Collective Brand Colors
    'kingdom-dark': brandColors.kingdomDark,
    'kingdom-darker': brandColors.kingdomDarker,
    'kingdom-navy': brandColors.kingdomNavy,
    'kingdom-gold': brandColors.kingdomGold,
    'kingdom-gold-soft': brandColors.kingdomGoldSoft,
    'kingdom-gold-matte': brandColors.kingdomGoldMatte,
    'kingdom-bronze': brandColors.kingdomBronze,
    'kingdom-bronze-dark': brandColors.kingdomBronzeDark,
    'kingdom-bronze-copper': brandColors.kingdomBronzeCopper,
    'kingdom-orange': brandColors.kingdomOrange,
    'kingdom-gold-light': brandColors.kingdomGoldLight,
    'kingdom-orange-light': brandColors.kingdomOrangeLight,
    
    // Legacy colors (for backward compatibility)
    navy: brandColors.navy,
    blue: brandColors.blue,
    gray: brandColors.gray,
    white: brandColors.white,
    
    // Semantic colors
    primary: semanticColors.primary,
    secondary: semanticColors.secondary,
    accent: semanticColors.accent,
    background: semanticColors.background,
    surface: semanticColors.surface,
    text: semanticColors.text,
    'text-secondary': semanticColors.textSecondary,
  },
};

export default colors; 