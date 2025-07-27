import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import AppLoading from 'expo-app-loading';
import { useFonts as useManrope, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts as useInter, Inter_400Regular } from '@expo-google-fonts/inter';
import LaunchpadTheme from '../../packages/theme/launchpadTheme';
import { FaithModeProvider } from '../../packages/hooks/useFaithMode';
import Svg, { Path } from 'react-native-svg';

function CrownCrossWatermark() {
    return (
        <Svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            style={{ position: 'absolute', opacity: 0.08, top: 60, left: 60 }}
        >
            <Path
                d="M110 20 L130 80 L200 80 L140 120 L160 200 L110 150 L60 200 L80 120 L20 80 L90 80 Z"
                fill="#F2C94C"
            />
            <Path
                d="M110 60 V180"
                stroke="#2C3E50"
                strokeWidth="8"
                strokeLinecap="round"
            />
            <Path
                d="M80 110 H140"
                stroke="#2C3E50"
                strokeWidth="8"
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default function App({ Component, pageProps }) {
    const [manropeLoaded] = useManrope({ Manrope_700Bold });
    const [interLoaded] = useInter({ Inter_400Regular });
    const fontsLoaded = manropeLoaded && interLoaded;

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <ThemeProvider theme={LaunchpadTheme}>
            <FaithModeProvider>
                <Component {...pageProps} />
                {/* In your App component, wrap main screens with watermark if faithMode is true */}
                {/* <CrownCrossWatermark /> */}
            </FaithModeProvider>
        </ThemeProvider>
    );
} 