/**
 * Kingdom Collective Design System - Typography
 * 
 * This module exports typography configurations and utilities
 * for consistent text styling across all Kingdom Collective applications.
 */

// Font Families
export const fontFamilies = {
  sans: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
  display: ['Space Grotesk', 'sans-serif'],
  body: ['Noto Sans', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
};

// Font Sizes with Line Heights
export const fontSizes = {
  'xs': ['0.75rem', { lineHeight: '1rem' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.5rem' }],
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
  '7xl': ['4.5rem', { lineHeight: '1' }],
  '8xl': ['6rem', { lineHeight: '1' }],
  '9xl': ['8rem', { lineHeight: '1' }],
};

// Font Weights
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Typography Scale
export const typographyScale = {
  // Headings
  h1: {
    fontSize: '3rem',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.25rem',
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.875rem',
    lineHeight: '1.2',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: '1.5rem',
    lineHeight: '1.3',
    fontWeight: '600',
    letterSpacing: '0em',
  },
  h5: {
    fontSize: '1.25rem',
    lineHeight: '1.4',
    fontWeight: '500',
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '1.125rem',
    lineHeight: '1.5',
    fontWeight: '500',
    letterSpacing: '0em',
  },
  
  // Body Text
  body: {
    fontSize: '1rem',
    lineHeight: '1.6',
    fontWeight: '400',
    letterSpacing: '0em',
  },
  'body-large': {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    fontWeight: '400',
    letterSpacing: '0em',
  },
  'body-small': {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '400',
    letterSpacing: '0em',
  },
  
  // Special Text
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: '400',
    letterSpacing: '0.025em',
  },
  overline: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: '500',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
};

// Tailwind typography configuration
export const tailwindTypography = {
  fontFamily: fontFamilies,
  fontSize: fontSizes,
  fontWeight: fontWeights,
  letterSpacing: letterSpacing,
};

// Typography utilities for components
export const typographyUtilities = {
  // Heading utilities
  'text-heading-primary': 'text-4xl md:text-6xl font-bold leading-tight tracking-[-0.033em] text-white',
  'text-heading-secondary': 'text-2xl sm:text-3xl font-bold leading-tight text-white',
  'text-heading-tertiary': 'text-xl sm:text-2xl font-semibold leading-tight text-white',
  
  // Body text utilities
  'text-body-primary': 'text-white text-sm sm:text-base font-normal leading-relaxed',
  'text-body-secondary': 'text-white/70 text-sm sm:text-base leading-relaxed',
  'text-body-large': 'text-white text-base sm:text-lg font-normal leading-relaxed',
  
  // Special text utilities
  'text-caption': 'text-white/60 text-xs leading-relaxed',
  'text-overline': 'text-white/80 text-xs font-medium tracking-widest uppercase',
};

export default {
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacing,
  typographyScale,
  tailwindTypography,
  typographyUtilities,
}; 