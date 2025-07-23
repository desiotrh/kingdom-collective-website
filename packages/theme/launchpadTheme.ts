// Kingdom Launchpad Theme
export const LaunchpadColors = {
    sapphireBlue: '#2C3E50',
    gold: '#F2C94C',
    cloudWhite: '#F9FAFB',
    silverGray: '#E0E0E0',
};

export const LaunchpadFonts = {
    header: 'Manrope_700Bold', // fallback: 'Montserrat_800ExtraBold'
    body: 'Inter_400Regular', // fallback: 'Lato_400Regular'
};

export const LaunchpadSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const LaunchpadRadius = {
    sm: 6,
    md: 12,
    lg: 20,
};

export const LaunchpadShadows = {
    default: {
        shadowColor: '#2C3E50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    gold: {
        shadowColor: '#F2C94C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },
};

export const LaunchpadTheme = {
    colors: LaunchpadColors,
    fonts: LaunchpadFonts,
    spacing: LaunchpadSpacing,
    radius: LaunchpadRadius,
    shadows: LaunchpadShadows,
};

export default LaunchpadTheme; 