/**
 * Test Script: Camera Settings & Invoice Manager Screens
 * 
 * This script tests the CameraSettingsScreen and InvoiceManagerScreen implementations including:
 * 1. Camera settings with shooting scenarios
 * 2. Custom setting creation
 * 3. Faith mode with prophetic sessions and anointing
 * 4. Encouragement mode with intention tags
 * 5. Invoice management with dual-mode support
 * 6. Invoice creation flow
 * 7. Faith mode blessings and encouragement mode prompts
 */

const fs = require('fs');
const path = require('path');

const TEST_CONFIG = {
    cameraSettingsScreen: 'apps/kingdom-lens/app/(tabs)/camera-settings.tsx',
    invoiceManagerScreen: 'apps/kingdom-lens/app/(tabs)/invoice-manager.tsx',
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

function testCameraAndInvoiceScreens() {
    console.log('\n🧪 Testing Camera Settings & Invoice Manager Screens\n');

    let totalTests = 0;
    let passedTests = 0;

    // Test 1: Camera Settings Screen Exists
    const cameraSettingsExists = checkFileExists(TEST_CONFIG.cameraSettingsScreen);
    totalTests++;
    if (logTest('Camera Settings screen exists', cameraSettingsExists,
        cameraSettingsExists ? 'Camera settings screen found' : 'Camera settings screen not found')) {
        passedTests++;
    }

    if (cameraSettingsExists) {
        const cameraContent = readFileContent(TEST_CONFIG.cameraSettingsScreen);

        // Test 2: Camera Settings Interface
        const hasCameraInterface = cameraContent.includes('interface CameraSetting') &&
            cameraContent.includes('iso: string') &&
            cameraContent.includes('shutterSpeed: string') &&
            cameraContent.includes('aperture: string');
        totalTests++;
        if (logTest('Camera settings interface defined', hasCameraInterface,
            hasCameraInterface ? 'Interface found' : 'Interface missing')) {
            passedTests++;
        }

        // Test 3: Shooting Scenarios
        const hasShootingScenarios = cameraContent.includes('Golden Hour') &&
            cameraContent.includes('Indoor Natural') &&
            cameraContent.includes('Backlight Portrait') &&
            cameraContent.includes('Night City') &&
            cameraContent.includes('Studio Portrait');
        totalTests++;
        if (logTest('Shooting scenarios implemented', hasShootingScenarios,
            hasShootingScenarios ? 'Scenarios found' : 'Scenarios missing')) {
            passedTests++;
        }

        // Test 4: Faith Mode Features
        const hasFaithModeFeatures = cameraContent.includes('Prophetic Session') &&
            cameraContent.includes('isAnointed') &&
            cameraContent.includes('handleAnointSetting') &&
            cameraContent.includes('What atmosphere are you capturing spiritually?');
        totalTests++;
        if (logTest('Faith mode features implemented', hasFaithModeFeatures,
            hasFaithModeFeatures ? 'Faith mode features found' : 'Faith mode features missing')) {
            passedTests++;
        }

        // Test 5: Encouragement Mode Features
        const hasEncouragementFeatures = cameraContent.includes('Bold Light') &&
            cameraContent.includes('Soft Beauty') &&
            cameraContent.includes('Legacy Look') &&
            cameraContent.includes('intention');
        totalTests++;
        if (logTest('Encouragement mode features implemented', hasEncouragementFeatures,
            hasEncouragementFeatures ? 'Encouragement features found' : 'Encouragement features missing')) {
            passedTests++;
        }

        // Test 6: Custom Setting Creation
        const hasCustomSettingCreation = cameraContent.includes('Create Custom Setting') &&
            cameraContent.includes('showCreateModal') &&
            cameraContent.includes('handleCreateSetting');
        totalTests++;
        if (logTest('Custom setting creation implemented', hasCustomSettingCreation,
            hasCustomSettingCreation ? 'Custom creation found' : 'Custom creation missing')) {
            passedTests++;
        }

        // Test 7: Anointing Feature
        const hasAnointingFeature = cameraContent.includes('Anoint Setting') &&
            cameraContent.includes('isAnointed: faithMode') &&
            cameraContent.includes('✝️');
        totalTests++;
        if (logTest('Anointing feature implemented', hasAnointingFeature,
            hasAnointingFeature ? 'Anointing feature found' : 'Anointing feature missing')) {
            passedTests++;
        }
    }

    // Test 8: Invoice Manager Screen Exists
    const invoiceManagerExists = checkFileExists(TEST_CONFIG.invoiceManagerScreen);
    totalTests++;
    if (logTest('Invoice Manager screen exists', invoiceManagerExists,
        invoiceManagerExists ? 'Invoice manager screen found' : 'Invoice manager screen not found')) {
        passedTests++;
    }

    if (invoiceManagerExists) {
        const invoiceContent = readFileContent(TEST_CONFIG.invoiceManagerScreen);

        // Test 9: Invoice Interface
        const hasInvoiceInterface = invoiceContent.includes('interface Invoice') &&
            invoiceContent.includes('interface Service') &&
            invoiceContent.includes('clientName: string') &&
            invoiceContent.includes('amount: number');
        totalTests++;
        if (logTest('Invoice interface defined', hasInvoiceInterface,
            hasInvoiceInterface ? 'Interface found' : 'Interface missing')) {
            passedTests++;
        }

        // Test 10: Invoice List Features
        const hasInvoiceListFeatures = invoiceContent.includes('renderInvoiceCard') &&
            invoiceContent.includes('isPaid') &&
            invoiceContent.includes('dateSent') &&
            invoiceContent.includes('Send Invoice');
        totalTests++;
        if (logTest('Invoice list features implemented', hasInvoiceListFeatures,
            hasInvoiceListFeatures ? 'List features found' : 'List features missing')) {
            passedTests++;
        }

        // Test 11: Invoice Creation Flow
        const hasInvoiceCreation = invoiceContent.includes('Create New Invoice') &&
            invoiceContent.includes('handleCreateInvoice') &&
            invoiceContent.includes('services: Service[]') &&
            invoiceContent.includes('tax: number');
        totalTests++;
        if (logTest('Invoice creation flow implemented', hasInvoiceCreation,
            hasInvoiceCreation ? 'Creation flow found' : 'Creation flow missing')) {
            passedTests++;
        }

        // Test 12: Faith Mode Invoice Features
        const hasFaithModeInvoice = invoiceContent.includes('May this work be fruitful and multiply') &&
            invoiceContent.includes('blessing?: string') &&
            invoiceContent.includes('Photographer prays over every client session');
        totalTests++;
        if (logTest('Faith mode invoice features implemented', hasFaithModeInvoice,
            hasFaithModeInvoice ? 'Faith mode invoice features found' : 'Faith mode invoice features missing')) {
            passedTests++;
        }

        // Test 13: Encouragement Mode Invoice Features
        const hasEncouragementInvoice = invoiceContent.includes('Your purpose is valuable') &&
            invoiceContent.includes('This is more than a gig — it\'s legacy') &&
            invoiceContent.includes('Manage your business with purpose');
        totalTests++;
        if (logTest('Encouragement mode invoice features implemented', hasEncouragementInvoice,
            hasEncouragementInvoice ? 'Encouragement invoice features found' : 'Encouragement invoice features missing')) {
            passedTests++;
        }

        // Test 14: Service Management
        const hasServiceManagement = invoiceContent.includes('handleAddService') &&
            invoiceContent.includes('handleUpdateService') &&
            invoiceContent.includes('handleRemoveService') &&
            invoiceContent.includes('Add Service');
        totalTests++;
        if (logTest('Service management implemented', hasServiceManagement,
            hasServiceManagement ? 'Service management found' : 'Service management missing')) {
            passedTests++;
        }

        // Test 15: Mock Invoice Data
        const hasMockInvoiceData = invoiceContent.includes('Sarah Johnson') &&
            invoiceContent.includes('Mike Chen') &&
            invoiceContent.includes('Emily Rodriguez') &&
            invoiceContent.includes('Portrait Session') &&
            invoiceContent.includes('Wedding Photography');
        totalTests++;
        if (logTest('Mock invoice data implemented', hasMockInvoiceData,
            hasMockInvoiceData ? 'Mock data found' : 'Mock data missing')) {
            passedTests++;
        }
    }

    // Test 16: Dual Mode Integration
    const bothScreensExist = cameraSettingsExists && invoiceManagerExists;
    totalTests++;
    if (logTest('Both screens implemented', bothScreensExist,
        bothScreensExist ? 'Both screens found' : 'Some screens missing')) {
        passedTests++;
    }

    // Test 17: Theme Integration
    const hasThemeIntegration = fs.existsSync(TEST_CONFIG.cameraSettingsScreen) &&
        fs.existsSync(TEST_CONFIG.invoiceManagerScreen) &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('LightTheme') &&
        readFileContent(TEST_CONFIG.invoiceManagerScreen).includes('LightTheme');
    totalTests++;
    if (logTest('Theme integration across screens', hasThemeIntegration,
        hasThemeIntegration ? 'Theme integration found' : 'Theme integration missing')) {
        passedTests++;
    }

    // Test 18: Faith Mode Toggle
    const hasFaithModeToggle = fs.existsSync(TEST_CONFIG.cameraSettingsScreen) &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('faithMode') &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('encouragementMode');
    totalTests++;
    if (logTest('Faith mode toggle functionality', hasFaithModeToggle,
        hasFaithModeToggle ? 'Faith mode toggle found' : 'Faith mode toggle missing')) {
        passedTests++;
    }

    // Test 19: Professional Features
    const hasProfessionalFeatures = fs.existsSync(TEST_CONFIG.cameraSettingsScreen) &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('ISO') &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('Shutter') &&
        readFileContent(TEST_CONFIG.cameraSettingsScreen).includes('Aperture');
    totalTests++;
    if (logTest('Professional camera features', hasProfessionalFeatures,
        hasProfessionalFeatures ? 'Professional features found' : 'Professional features missing')) {
        passedTests++;
    }

    // Test 20: Business Features
    const hasBusinessFeatures = fs.existsSync(TEST_CONFIG.invoiceManagerScreen) &&
        readFileContent(TEST_CONFIG.invoiceManagerScreen).includes('amount') &&
        readFileContent(TEST_CONFIG.invoiceManagerScreen).includes('tax') &&
        readFileContent(TEST_CONFIG.invoiceManagerScreen).includes('services');
    totalTests++;
    if (logTest('Business invoice features', hasBusinessFeatures,
        hasBusinessFeatures ? 'Business features found' : 'Business features missing')) {
        passedTests++;
    }

    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 All Camera Settings & Invoice Manager tests passed!');
        console.log('\n✅ Features Implemented:');
        console.log('   • Camera settings with shooting scenarios');
        console.log('   • Custom setting creation with modal');
        console.log('   • Faith mode with prophetic sessions and anointing');
        console.log('   • Encouragement mode with intention tags');
        console.log('   • Invoice management with list and creation');
        console.log('   • Service management with add/remove');
        console.log('   • Faith mode blessings and encouragement prompts');
        console.log('   • Professional camera and business features');
        console.log('   • Dual-mode integration across both screens');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the implementation.');
    }

    return { totalTests, passedTests };
}

// Run the tests
if (require.main === module) {
    testCameraAndInvoiceScreens();
}

module.exports = { testCameraAndInvoiceScreens }; 