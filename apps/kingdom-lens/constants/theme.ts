/**
 * Kingdom Lens Theme System
 * 
 * Brand Colors:
 * - Matte Black: #181818
 * - Bronze: #B18C57
 * - Soft White: #F7F6F3
 * - Dust Gold: #D6B874
 */

export const KingdomLensColors = {
    // Primary Brand Colors
    matteBlack: '#181818',
    bronze: '#B18C57',
    softWhite: '#F7F6F3',
    dustGold: '#D6B874',

    // Extended Palette
    darkBronze: '#8B6B3F',
    lightBronze: '#C4A67A',
    warmGray: '#E8E4E0',
    charcoal: '#2A2A2A',

    // Semantic Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
};

export const Typography = {
    // Font Families
    headerFont: 'EB Garamond, serif',
    bodyFont: 'Sora, sans-serif',

    // Font Sizes
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,

    // Font Weights
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    glow: {
        shadowColor: KingdomLensColors.dustGold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};

export const LightTheme = {
    colors: {
        primary: KingdomLensColors.bronze,
        secondary: KingdomLensColors.dustGold,
        background: KingdomLensColors.softWhite,
        surface: '#FFFFFF',
        text: KingdomLensColors.matteBlack,
        textSecondary: '#666666',
        border: '#E5E5E5',
        overlay: 'rgba(24, 24, 24, 0.7)',
        success: KingdomLensColors.success,
        warning: KingdomLensColors.warning,
        error: KingdomLensColors.error,
        info: KingdomLensColors.info,
    },
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
};

export const DarkTheme = {
    colors: {
        primary: KingdomLensColors.dustGold,
        secondary: KingdomLensColors.bronze,
        background: KingdomLensColors.matteBlack,
        surface: KingdomLensColors.charcoal,
        text: KingdomLensColors.softWhite,
        textSecondary: '#CCCCCC',
        border: '#404040',
        overlay: 'rgba(0, 0, 0, 0.8)',
        success: KingdomLensColors.success,
        warning: KingdomLensColors.warning,
        error: KingdomLensColors.error,
        info: KingdomLensColors.info,
    },
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
};

// Faith Mode Theme Extensions
export const FaithModeTheme = {
    watermark: '✝️',
    overlayText: 'For His Glory',
    cameraMode: 'Glory Shot Mode',
    prompts: [
        'Capture His light in every frame',
        'Let your lens reflect His beauty',
        'Photograph with purpose and praise',
    ],
};

// Encouragement Mode Theme Extensions
export const EncouragementModeTheme = {
    watermark: '🕊',
    overlayText: 'Rooted in Truth',
    cameraMode: 'Identity Mode',
    prompts: [
        'Capture identity, not perfection',
        'Your unique perspective matters',
        'Create with confidence and courage',
    ],
};

export type Theme = typeof LightTheme;
export type FaithModeThemeType = typeof FaithModeTheme;
export type EncouragementModeThemeType = typeof EncouragementModeTheme; 