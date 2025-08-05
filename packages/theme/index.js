/**
 * Kingdom Collective Design System
 * 
 * This package provides shared design tokens and configurations
 * while allowing each app to maintain its unique style and personality.
 */

// Import all theme modules
export { default as colors, brandColors, semanticColors, tailwindColors } from './colors.js';
export { default as typography } from './typography.js';
export { default as animations } from './animations.js';

// Import animation utilities
import { getAppAnimations, getAppKeyframes } from './animations.js';

// Base theme configuration that apps can extend
export const baseTheme = {
  colors: {
    // Kingdom Collective Brand Colors (shared across all apps)
    'kingdom-dark': '#0f172a',
    'kingdom-darker': '#1e293b',
    'kingdom-navy': '#0f172a',
    'kingdom-gold': '#facc15',
    'kingdom-orange': '#f97316',
    'kingdom-gold-light': '#fef3c7',
    'kingdom-orange-light': '#fed7aa',
    
    // Semantic colors (can be customized per app)
    primary: '#facc15', // kingdom-gold
    secondary: '#f97316', // kingdom-orange
    accent: '#0f172a', // kingdom-dark
    background: '#0f172a',
    surface: '#1e293b',
    text: '#ffffff',
    'text-secondary': '#b7c6e0',
  },
  fontFamily: {
    sans: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
    display: ['Space Grotesk', 'sans-serif'],
    body: ['Noto Sans', 'sans-serif'],
  },
  animation: {
    'fade-in': 'fadeIn 0.5s ease-in-out',
    'slide-up': 'slideUp 0.5s ease-out',
    'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'glow': 'glow 2s ease-in-out infinite',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    glow: {
      '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))' },
      '50%': { filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))' },
    },
  },
};

/**
 * Create a custom theme by extending the base theme
 * @param {Object} customTheme - Custom theme overrides
 * @returns {Object} Extended theme configuration
 */
export function createTheme(customTheme = {}) {
  return {
    ...baseTheme,
    ...customTheme,
    colors: {
      ...baseTheme.colors,
      ...customTheme.colors,
    },
    animation: {
      ...baseTheme.animation,
      ...customTheme.animation,
    },
    keyframes: {
      ...baseTheme.keyframes,
      ...customTheme.keyframes,
    },
  };
}

/**
 * App-specific theme configurations
 * Each app can have its own personality while maintaining brand consistency
 */
export const appThemes = {
  // Kingdom Voice - Focus on audio/voice features
  voice: createTheme({
    colors: {
      // Voice-specific accent colors
      'voice-accent': '#8b5cf6', // Purple for voice features
      'voice-secondary': '#a855f7',
    },
    animation: {
      ...getAppAnimations('voice'),
    },
    keyframes: {
      ...getAppKeyframes('voice'),
    },
  }),

  // Kingdom Circle - Community-focused
  circle: createTheme({
    colors: {
      // Community-focused colors
      'community-primary': '#10b981', // Green for community
      'community-secondary': '#059669',
    },
    animation: {
      ...getAppAnimations('circle'),
    },
    keyframes: {
      ...getAppKeyframes('circle'),
    },
  }),

  // Kingdom Lens - Photo/media focused
  lens: createTheme({
    colors: {
      // Media-focused colors
      'media-accent': '#06b6d4', // Cyan for media
      'media-secondary': '#0891b2',
    },
    animation: {
      ...getAppAnimations('lens'),
    },
    keyframes: {
      ...getAppKeyframes('lens'),
    },
  }),

  // Kingdom Clips - Video/content creation
  clips: createTheme({
    colors: {
      // Video-focused colors
      'video-primary': '#ef4444', // Red for video
      'video-secondary': '#dc2626',
    },
    animation: {
      ...getAppAnimations('clips'),
    },
    keyframes: {
      ...getAppKeyframes('clips'),
    },
  }),

  // Kingdom Launchpad - App launcher
  launchpad: createTheme({
    colors: {
      // Launcher-specific colors
      'launch-primary': '#f59e0b', // Amber for launching
      'launch-secondary': '#d97706',
    },
    animation: {
      ...getAppAnimations('launchpad'),
    },
    keyframes: {
      ...getAppKeyframes('launchpad'),
    },
  }),
};

/**
 * Get theme for a specific app
 * @param {string} appName - Name of the app
 * @returns {Object} App-specific theme
 */
export function getAppTheme(appName) {
  return appThemes[appName] || baseTheme;
}

/**
 * Get complete Tailwind configuration for an app
 * @param {string} appName - Name of the app
 * @returns {Object} Complete Tailwind config
 */
export function getTailwindConfig(appName) {
  const theme = getAppTheme(appName);
  
  return {
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: theme,
    },
    plugins: [],
  };
}

/**
 * Get CSS variables for the theme
 * @param {string} appName - Name of the app
 * @returns {Object} CSS variables object
 */
export function getCSSVariables(appName) {
  const theme = getAppTheme(appName);
  const variables = {};
  
  // Convert colors to CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--color-${key.replace(/-/g, '-')}`] = value;
  });
  
  return variables;
}

export default baseTheme; 