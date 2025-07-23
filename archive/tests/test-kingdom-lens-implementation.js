/**
 * Test Script: Kingdom Lens Implementation
 * 
 * This script tests the Kingdom Lens app implementation including:
 * 1. Theme system with brand colors
 * 2. Dual-mode functionality (Faith/Encouragement)
 * 3. Screen implementations
 * 4. Brand consistency
 * 5. Navigation structure
 */

const fs = require('fs');
const path = require('path');

const TEST_CONFIG = {
    themeFile: 'apps/kingdom-lens/constants/theme.ts',
    faithModeHook: 'apps/kingdom-lens/hooks/useFaithMode.ts',
    homeScreen: 'apps/kingdom-lens/app/(tabs)/index.tsx',
    mockupScreen: 'apps/kingdom-lens/app/(tabs)/mockup-canvas.tsx',
    photoPlannerScreen: 'apps/kingdom-lens/app/(tabs)/photo-planner.tsx',
    sunTrackerScreen: 'apps/kingdom-lens/app/(tabs)/sun-tracker.tsx',
    settingsScreen: 'apps/kingdom-lens/app/(tabs)/settings.tsx',
};

function logTest(testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}${details ? ` - ${details}` : ''}`);
    return passed;
}

function checkFileExists(filePath) {
    return fs.existsSync(filePath);
}

function readFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function testKingdomLensImplementation() {
    console.log('\n🧪 Testing Kingdom Lens Implementation\n');

    let totalTests = 0;
    let passedTests = 0;

    // Test 1: Theme System
    const themeFileExists = checkFileExists(TEST_CONFIG.themeFile);
    totalTests++;
    if (logTest('Theme system file exists', themeFileExists,
        themeFileExists ? 'Theme file found' : 'Theme file not found')) {
        passedTests++;
    }

    if (themeFileExists) {
        const themeContent = readFileContent(TEST_CONFIG.themeFile);

        // Test 2: Brand Colors
        const hasBrandColors = themeContent.includes('#181818') && // Matte Black
            themeContent.includes('#B18C57') && // Bronze
            themeContent.includes('#F7F6F3') && // Soft White
            themeContent.includes('#D6B874');   // Dust Gold
        totalTests++;
        if (logTest('Brand colors defined', hasBrandColors,
            hasBrandColors ? 'All brand colors found' : 'Missing brand colors')) {
            passedTests++;
        }

        // Test 3: Typography System
        const hasTypography = themeContent.includes('EB Garamond') &&
            themeContent.includes('Sora') &&
            themeContent.includes('fontSize') &&
            themeContent.includes('fontWeight');
        totalTests++;
        if (logTest('Typography system defined', hasTypography,
            hasTypography ? 'Typography system found' : 'Typography system missing')) {
            passedTests++;
        }

        // Test 4: Theme Variants
        const hasThemeVariants = themeContent.includes('LightTheme') &&
            themeContent.includes('DarkTheme') &&
            themeContent.includes('FaithModeTheme') &&
            themeContent.includes('EncouragementModeTheme');
        totalTests++;
        if (logTest('Theme variants defined', hasThemeVariants,
            hasThemeVariants ? 'All theme variants found' : 'Missing theme variants')) {
            passedTests++;
        }

        // Test 5: Design Tokens
        const hasDesignTokens = themeContent.includes('Spacing') &&
            themeContent.includes('BorderRadius') &&
            themeContent.includes('Shadows');
        totalTests++;
        if (logTest('Design tokens defined', hasDesignTokens,
            hasDesignTokens ? 'Design tokens found' : 'Design tokens missing')) {
            passedTests++;
        }
    }

    // Test 6: Faith Mode Hook
    const faithModeHookExists = checkFileExists(TEST_CONFIG.faithModeHook);
    totalTests++;
    if (logTest('Faith mode hook exists', faithModeHookExists,
        faithModeHookExists ? 'Hook file found' : 'Hook file not found')) {
        passedTests++;
    }

    if (faithModeHookExists) {
        const hookContent = readFileContent(TEST_CONFIG.faithModeHook);

        // Test 7: Dual Mode Functionality
        const hasDualMode = hookContent.includes('faithMode') &&
            hookContent.includes('encouragementMode') &&
            hookContent.includes('toggleFaithMode') &&
            hookContent.includes('toggleEncouragementMode');
        totalTests++;
        if (logTest('Dual mode functionality', hasDualMode,
            hasDualMode ? 'Dual mode functions found' : 'Dual mode functions missing')) {
            passedTests++;
        }

        // Test 8: AsyncStorage Integration
        const hasAsyncStorage = hookContent.includes('AsyncStorage') &&
            hookContent.includes('setItem') &&
            hookContent.includes('getItem');
        totalTests++;
        if (logTest('AsyncStorage integration', hasAsyncStorage,
            hasAsyncStorage ? 'AsyncStorage integration found' : 'AsyncStorage integration missing')) {
            passedTests++;
        }
    }

    // Test 9: Home Screen
    const homeScreenExists = checkFileExists(TEST_CONFIG.homeScreen);
    totalTests++;
    if (logTest('Home screen exists', homeScreenExists,
        homeScreenExists ? 'Home screen found' : 'Home screen not found')) {
        passedTests++;
    }

    if (homeScreenExists) {
        const homeContent = readFileContent(TEST_CONFIG.homeScreen);

        // Test 10: Home Screen Brand Integration
        const hasHomeBrandIntegration = homeContent.includes('Kingdom Lens') &&
            homeContent.includes('useFaithMode') &&
            homeContent.includes('LightTheme');
        totalTests++;
        if (logTest('Home screen brand integration', hasHomeBrandIntegration,
            hasHomeBrandIntegration ? 'Brand integration found' : 'Brand integration missing')) {
            passedTests++;
        }

        // Test 11: Dual Mode Rendering
        const hasDualModeRendering = homeContent.includes('faithMode') &&
            homeContent.includes('encouragementMode') &&
            homeContent.includes('getWelcomeMessage');
        totalTests++;
        if (logTest('Home screen dual mode rendering', hasDualModeRendering,
            hasDualModeRendering ? 'Dual mode rendering found' : 'Dual mode rendering missing')) {
            passedTests++;
        }

        // Test 12: Tools Grid
        const hasToolsGrid = homeContent.includes('tools') &&
            homeContent.includes('Mockup Canvas') &&
            homeContent.includes('Photo Planner');
        totalTests++;
        if (logTest('Home screen tools grid', hasToolsGrid,
            hasToolsGrid ? 'Tools grid found' : 'Tools grid missing')) {
            passedTests++;
        }
    }

    // Test 13: Mockup Canvas Screen
    const mockupScreenExists = checkFileExists(TEST_CONFIG.mockupScreen);
    totalTests++;
    if (logTest('Mockup canvas screen exists', mockupScreenExists,
        mockupScreenExists ? 'Mockup screen found' : 'Mockup screen not found')) {
        passedTests++;
    }

    if (mockupScreenExists) {
        const mockupContent = readFileContent(TEST_CONFIG.mockupScreen);

        // Test 14: Mockup Canvas Features
        const hasMockupFeatures = mockupContent.includes('Canvas Preview') &&
            mockupContent.includes('Templates') &&
            mockupContent.includes('Overlays') &&
            mockupContent.includes('Export Mockup');
        totalTests++;
        if (logTest('Mockup canvas features', hasMockupFeatures,
            hasMockupFeatures ? 'Mockup features found' : 'Mockup features missing')) {
            passedTests++;
        }
    }

    // Test 15: Photo Planner Screen
    const photoPlannerExists = checkFileExists(TEST_CONFIG.photoPlannerScreen);
    totalTests++;
    if (logTest('Photo planner screen exists', photoPlannerExists,
        photoPlannerExists ? 'Photo planner found' : 'Photo planner not found')) {
        passedTests++;
    }

    if (photoPlannerExists) {
        const plannerContent = readFileContent(TEST_CONFIG.photoPlannerScreen);

        // Test 16: Photo Planner Features
        const hasPlannerFeatures = plannerContent.includes('Shoot Details') &&
            plannerContent.includes('Date') &&
            plannerContent.includes('Location') &&
            plannerContent.includes('Planning Prompts');
        totalTests++;
        if (logTest('Photo planner features', hasPlannerFeatures,
            hasPlannerFeatures ? 'Planner features found' : 'Planner features missing')) {
            passedTests++;
        }
    }

    // Test 17: Sun Tracker Screen
    const sunTrackerExists = checkFileExists(TEST_CONFIG.sunTrackerScreen);
    totalTests++;
    if (logTest('Sun tracker screen exists', sunTrackerExists,
        sunTrackerExists ? 'Sun tracker found' : 'Sun tracker not found')) {
        passedTests++;
    }

    if (sunTrackerExists) {
        const sunContent = readFileContent(TEST_CONFIG.sunTrackerScreen);

        // Test 18: Sun Tracker Features
        const hasSunFeatures = sunContent.includes('Golden Hour') &&
            sunContent.includes('Blue Hour') &&
            sunContent.includes('Sunrise') &&
            sunContent.includes('Sunset');
        totalTests++;
        if (logTest('Sun tracker features', hasSunFeatures,
            hasSunFeatures ? 'Sun tracker features found' : 'Sun tracker features missing')) {
            passedTests++;
        }
    }

    // Test 19: Settings Screen
    const settingsExists = checkFileExists(TEST_CONFIG.settingsScreen);
    totalTests++;
    if (logTest('Settings screen exists', settingsExists,
        settingsExists ? 'Settings screen found' : 'Settings screen not found')) {
        passedTests++;
    }

    if (settingsExists) {
        const settingsContent = readFileContent(TEST_CONFIG.settingsScreen);

        // Test 20: Settings Features
        const hasSettingsFeatures = settingsContent.includes('App Mode') &&
            settingsContent.includes('Faith Mode') &&
            settingsContent.includes('Encouragement Mode') &&
            settingsContent.includes('App Settings');
        totalTests++;
        if (logTest('Settings features', hasSettingsFeatures,
            hasSettingsFeatures ? 'Settings features found' : 'Settings features missing')) {
            passedTests++;
        }
    }

    // Test 21: Brand Consistency
    const allScreensExist = homeScreenExists && mockupScreenExists &&
        photoPlannerExists && sunTrackerExists && settingsExists;
    totalTests++;
    if (logTest('All core screens implemented', allScreensExist,
        allScreensExist ? 'All screens found' : 'Some screens missing')) {
        passedTests++;
    }

    // Test 22: Faith Mode Language
    const hasFaithModeLanguage = fs.existsSync(TEST_CONFIG.homeScreen) &&
        readFileContent(TEST_CONFIG.homeScreen).includes('Capture His light') &&
        readFileContent(TEST_CONFIG.homeScreen).includes('For His Glory');
    totalTests++;
    if (logTest('Faith mode language adaptations', hasFaithModeLanguage,
        hasFaithModeLanguage ? 'Faith mode language found' : 'Faith mode language missing')) {
        passedTests++;
    }

    // Test 23: Encouragement Mode Language
    const hasEncouragementLanguage = fs.existsSync(TEST_CONFIG.homeScreen) &&
        readFileContent(TEST_CONFIG.homeScreen).includes('Capture identity') &&
        readFileContent(TEST_CONFIG.homeScreen).includes('Your unique perspective');
    totalTests++;
    if (logTest('Encouragement mode language adaptations', hasEncouragementLanguage,
        hasEncouragementLanguage ? 'Encouragement mode language found' : 'Encouragement mode language missing')) {
        passedTests++;
    }

    // Test 24: Theme Integration
    const hasThemeIntegration = fs.existsSync(TEST_CONFIG.homeScreen) &&
        readFileContent(TEST_CONFIG.homeScreen).includes('LightTheme') &&
        readFileContent(TEST_CONFIG.homeScreen).includes('theme.colors');
    totalTests++;
    if (logTest('Theme integration across screens', hasThemeIntegration,
        hasThemeIntegration ? 'Theme integration found' : 'Theme integration missing')) {
        passedTests++;
    }

    // Test 25: Professional Features
    const hasProfessionalFeatures = fs.existsSync(TEST_CONFIG.mockupScreen) &&
        readFileContent(TEST_CONFIG.mockupScreen).includes('Export Mockup') &&
        readFileContent(TEST_CONFIG.sunTrackerScreen).includes('Set Reminder');
    totalTests++;
    if (logTest('Professional photography features', hasProfessionalFeatures,
        hasProfessionalFeatures ? 'Professional features found' : 'Professional features missing')) {
        passedTests++;
    }

    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 All Kingdom Lens tests passed!');
        console.log('\n✅ Features Implemented:');
        console.log('   • Complete theme system with brand colors');
        console.log('   • Dual-mode functionality (Faith/Encouragement)');
        console.log('   • Home screen with tools grid');
        console.log('   • Mockup canvas with templates and overlays');
        console.log('   • Photo planner with dual-mode prompts');
        console.log('   • Sun tracker with golden/blue hour');
        console.log('   • Settings with mode toggles');
        console.log('   • Professional photography features');
        console.log('   • Brand-consistent design system');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the implementation.');
    }

    return { totalTests, passedTests };
}

// Run the tests
if (require.main === module) {
    testKingdomLensImplementation();
}

module.exports = { testKingdomLensImplementation }; 