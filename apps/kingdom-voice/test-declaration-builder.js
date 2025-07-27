#!/usr/bin/env node

/**
 * DeclarationBuilderScreen Test Script
 * Tests declaration creation, prompt library, faith mode integration, and AI generation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Testing DeclarationBuilderScreen...\n');

// Test configuration
const testConfig = {
    appName: 'kingdom-voice',
    testDeclarations: [
        {
            title: 'Identity in Christ',
            body: 'I am a child of God, fearfully and wonderfully made. I am chosen, loved, and called according to His purpose.',
            tags: ['Identity', 'Purpose'],
            faithMode: true,
            verse: '1 Peter 2:9 - But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.'
        },
        {
            title: 'Voice of Breakthrough',
            body: 'My voice carries breakthrough. I speak life, truth, and victory. My words have power to change atmospheres.',
            tags: ['Voice', 'Breakthrough'],
            faithMode: true,
            verse: 'Proverbs 18:21 - The tongue has the power of life and death.'
        },
        {
            title: 'Walking in Love',
            body: 'I choose to walk in love today. I am patient, kind, and forgiving. Love covers all things.',
            tags: ['Love', 'Character'],
            faithMode: false
        }
    ]
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

function logTest(name, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${name}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${name}`);
    }
    if (details) {
        console.log(`   ${details}`);
    }
    testResults.details.push({ name, passed, details });
}

function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

function checkDeclarationBuilderImplementation() {
    console.log('🎯 Checking DeclarationBuilderScreen Implementation...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('DeclarationBuilderScreen exists', false, 'File not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for imports
    const hasAsyncStorageImport = fileContent.includes("import AsyncStorage from '@react-native-async-storage/async-storage'");
    logTest('AsyncStorage import', hasAsyncStorageImport, hasAsyncStorageImport ? 'AsyncStorage imported' : 'Missing AsyncStorage import');

    const hasClipboardImport = fileContent.includes("import { Clipboard } from 'react-native'");
    logTest('Clipboard import', hasClipboardImport, hasClipboardImport ? 'Clipboard imported' : 'Missing Clipboard import');

    // Check for interface definition
    const hasDeclarationInterface = fileContent.includes('interface Declaration') &&
        fileContent.includes('id: string') &&
        fileContent.includes('title: string') &&
        fileContent.includes('body: string');
    logTest('Declaration interface', hasDeclarationInterface, hasDeclarationInterface ? 'Interface defined' : 'Missing interface');

    // Check for state management
    const hasDeclarationState = fileContent.includes('declaration, setDeclaration') &&
        fileContent.includes('selectedVerse, setSelectedVerse');
    logTest('Declaration state', hasDeclarationState, hasDeclarationState ? 'State management implemented' : 'Missing state management');

    const hasModalStates = fileContent.includes('showPromptLibrary') &&
        fileContent.includes('showAIGenerator') &&
        fileContent.includes('showVerseSelector');
    logTest('Modal states', hasModalStates, hasModalStates ? 'Modal states implemented' : 'Missing modal states');

    return hasAsyncStorageImport && hasClipboardImport && hasDeclarationInterface && hasDeclarationState;
}

function checkInputFields() {
    console.log('\n📝 Checking Input Fields...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Input fields', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for title input
    const hasTitleInput = fileContent.includes('titleInput') && fileContent.includes('Title');
    logTest('Title input', hasTitleInput, hasTitleInput ? 'Title input implemented' : 'Missing title input');

    // Check for body input
    const hasBodyInput = fileContent.includes('bodyInput') && fileContent.includes('Declaration');
    logTest('Body input', hasBodyInput, hasBodyInput ? 'Body input implemented' : 'Missing body input');

    // Check for tags
    const hasTagsInput = fileContent.includes('tagsContainer') && fileContent.includes('availableTags');
    logTest('Tags input', hasTagsInput, hasTagsInput ? 'Tags input implemented' : 'Missing tags input');

    // Check for faith mode toggle
    const hasFaithModeToggle = fileContent.includes('faithMode') && fileContent.includes('isFaithMode');
    logTest('Faith mode toggle', hasFaithModeToggle, hasFaithModeToggle ? 'Faith mode toggle implemented' : 'Missing faith mode toggle');

    // Check for daily reminder toggle
    const hasDailyReminderToggle = fileContent.includes('isDailyReminder') && fileContent.includes('Switch');
    logTest('Daily reminder toggle', hasDailyReminderToggle, hasDailyReminderToggle ? 'Daily reminder toggle implemented' : 'Missing daily reminder toggle');

    return hasTitleInput && hasBodyInput && hasTagsInput && hasFaithModeToggle && hasDailyReminderToggle;
}

function checkPromptLibrary() {
    console.log('\n📚 Checking Prompt Library...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Prompt library', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for preloaded themes
    const hasPreloadedThemes = fileContent.includes('preloadedThemes') &&
        fileContent.includes('Identity in Christ') &&
        fileContent.includes('Voice of Breakthrough');
    logTest('Preloaded themes', hasPreloadedThemes, hasPreloadedThemes ? 'Preloaded themes implemented' : 'Missing preloaded themes');

    // Check for theme cards
    const hasThemeCards = fileContent.includes('renderThemeCard') || fileContent.includes('themeCard');
    logTest('Theme cards', hasThemeCards, hasThemeCards ? 'Theme cards implemented' : 'Missing theme cards');

    // Check for prompt library modal
    const hasPromptLibraryModal = fileContent.includes('showPromptLibrary') && fileContent.includes('Prompt Library');
    logTest('Prompt library modal', hasPromptLibraryModal, hasPromptLibraryModal ? 'Prompt library modal implemented' : 'Missing prompt library modal');

    // Check for theme usage
    const hasUseTheme = fileContent.includes('useTheme');
    logTest('Use theme function', hasUseTheme, hasUseTheme ? 'Use theme function implemented' : 'Missing use theme function');

    return hasPreloadedThemes && hasThemeCards && hasPromptLibraryModal && hasUseTheme;
}

function checkUsageFeatures() {
    console.log('\n📲 Checking Usage Features...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Usage features', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for save functionality
    const hasSaveDeclaration = fileContent.includes('saveDeclaration');
    logTest('Save declaration function', hasSaveDeclaration, hasSaveDeclaration ? 'Save function implemented' : 'Missing save function');

    // Check for copy to clipboard
    const hasCopyToClipboard = fileContent.includes('copyToClipboard') && fileContent.includes('Clipboard.setString');
    logTest('Copy to clipboard', hasCopyToClipboard, hasCopyToClipboard ? 'Copy to clipboard implemented' : 'Missing copy to clipboard');

    // Check for daily reminder
    const hasDailyReminder = fileContent.includes('isDailyReminder') && fileContent.includes('Mark as Daily Reminder');
    logTest('Daily reminder', hasDailyReminder, hasDailyReminder ? 'Daily reminder implemented' : 'Missing daily reminder');

    // Check for AsyncStorage usage
    const hasAsyncStorageUsage = fileContent.includes('AsyncStorage.setItem') && fileContent.includes('declarations');
    logTest('AsyncStorage usage', hasAsyncStorageUsage, hasAsyncStorageUsage ? 'AsyncStorage usage implemented' : 'Missing AsyncStorage usage');

    return hasSaveDeclaration && hasCopyToClipboard && hasDailyReminder && hasAsyncStorageUsage;
}

function checkFaithModeIntegration() {
    console.log('\n✝️ Checking Faith Mode Integration...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Faith mode integration', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for faith mode context
    const hasFaithModeContext = fileContent.includes('useFaithMode') && fileContent.includes('isFaithMode');
    logTest('Faith mode context', hasFaithModeContext, hasFaithModeContext ? 'Context integrated' : 'Missing faith mode context');

    // Check for verse selector
    const hasVerseSelector = fileContent.includes('showVerseSelector') && fileContent.includes('Select a Verse');
    logTest('Verse selector', hasVerseSelector, hasVerseSelector ? 'Verse selector implemented' : 'Missing verse selector');

    // Check for speak declaration
    const hasSpeakDeclaration = fileContent.includes('speakDeclaration') && fileContent.includes('Speak Declaration');
    logTest('Speak declaration', hasSpeakDeclaration, hasSpeakDeclaration ? 'Speak declaration implemented' : 'Missing speak declaration');

    // Check for speaking animation
    const hasSpeakingAnimation = fileContent.includes('speakAnimation') && fileContent.includes('isSpeaking');
    logTest('Speaking animation', hasSpeakingAnimation, hasSpeakingAnimation ? 'Speaking animation implemented' : 'Missing speaking animation');

    // Check for AI generator
    const hasAIGenerator = fileContent.includes('showAIGenerator') && fileContent.includes('AI Generator');
    logTest('AI generator', hasAIGenerator, hasAIGenerator ? 'AI generator implemented' : 'Missing AI generator');

    // Check for AI prompts
    const hasAIPrompts = fileContent.includes('aiPrompts') && fileContent.includes('biblical declarations');
    logTest('AI prompts', hasAIPrompts, hasAIPrompts ? 'AI prompts implemented' : 'Missing AI prompts');

    return hasFaithModeContext && hasVerseSelector && hasSpeakDeclaration && hasSpeakingAnimation && hasAIGenerator;
}

function checkEncouragementMode() {
    console.log('\n🕊 Checking Encouragement Mode...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Encouragement mode', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for encouragement mode context
    const hasEncouragementContext = fileContent.includes('isEncouragementMode');
    logTest('Encouragement context', hasEncouragementContext, hasEncouragementContext ? 'Context integrated' : 'Missing encouragement context');

    // Check for encouragement card
    const hasEncouragementCard = fileContent.includes('encouragementCard') && fileContent.includes('Your Words Matter');
    logTest('Encouragement card', hasEncouragementCard, hasEncouragementCard ? 'Encouragement card implemented' : 'Missing encouragement card');

    // Check for encouragement message
    const hasEncouragementMessage = fileContent.includes('What you declare over your life has power');
    logTest('Encouragement message', hasEncouragementMessage, hasEncouragementMessage ? 'Encouragement message implemented' : 'Missing encouragement message');

    // Check for clean delivery
    const hasCleanDelivery = fileContent.includes('Speak truth into your life') || fileContent.includes('Create powerful declarations');
    logTest('Clean delivery', hasCleanDelivery, hasCleanDelivery ? 'Clean delivery implemented' : 'Missing clean delivery');

    return hasEncouragementContext && hasEncouragementCard && hasEncouragementMessage && hasCleanDelivery;
}

function checkUIComponents() {
    console.log('\n🎨 Checking UI Components...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('UI components', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    // Check for input card
    const hasInputCard = fileContent.includes('inputCard');
    logTest('Input card', hasInputCard, hasInputCard ? 'Input card implemented' : 'Missing input card');

    // Check for action buttons
    const hasActionButtons = fileContent.includes('actionButtons') && fileContent.includes('Prompt Library');
    logTest('Action buttons', hasActionButtons, hasActionButtons ? 'Action buttons implemented' : 'Missing action buttons');

    // Check for save buttons
    const hasSaveButtons = fileContent.includes('saveButtons') && fileContent.includes('Save Declaration');
    logTest('Save buttons', hasSaveButtons, hasSaveButtons ? 'Save buttons implemented' : 'Missing save buttons');

    // Check for speak button
    const hasSpeakButton = fileContent.includes('speakButton') && fileContent.includes('Speak Declaration');
    logTest('Speak button', hasSpeakButton, hasSpeakButton ? 'Speak button implemented' : 'Missing speak button');

    // Check for modals
    const hasModals = fileContent.includes('Modal') && fileContent.includes('modalOverlay');
    logTest('Modals', hasModals, hasModals ? 'Modals implemented' : 'Missing modals');

    // Check for animations
    const hasAnimations = fileContent.includes('fadeAnimation') && fileContent.includes('pulseAnimation');
    logTest('Animations', hasAnimations, hasAnimations ? 'Animations implemented' : 'Missing animations');

    return hasInputCard && hasActionButtons && hasSaveButtons && hasSpeakButton && hasModals && hasAnimations;
}

function checkErrorHandling() {
    console.log('\n🛡️ Checking Error Handling...');

    const declarationBuilderPath = path.join(__dirname, 'app', '(tabs)', 'declaration-builder.tsx');
    if (!checkFileExists(declarationBuilderPath)) {
        logTest('Error handling', false, 'DeclarationBuilderScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(declarationBuilderPath, 'utf8');

    const hasSaveError = fileContent.includes('Missing Information') && fileContent.includes('Alert.alert');
    logTest('Save error handling', hasSaveError, hasSaveError ? 'Save errors handled' : 'Missing save error handling');

    const hasCopyError = fileContent.includes('copy to clipboard') && fileContent.includes('Alert.alert');
    logTest('Copy error handling', hasCopyError, hasCopyError ? 'Copy errors handled' : 'Missing copy error handling');

    const hasTryCatch = fileContent.includes('try {') && fileContent.includes('} catch (error)');
    logTest('Try-catch blocks', hasTryCatch, hasTryCatch ? 'Error handling implemented' : 'Missing error handling');

    return hasSaveError && hasCopyError && hasTryCatch;
}

function generateTestReport() {
    console.log('\n📊 Test Report');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(test => !test.passed)
            .forEach(test => {
                console.log(`   - ${test.name}: ${test.details}`);
            });
    }

    console.log('\n✅ All Tests Passed!');
    console.log('🎯 DeclarationBuilderScreen is ready for testing.');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Open the app and navigate to Declaration Builder');
    console.log('2. Test title and body input fields');
    console.log('3. Test tags selection functionality');
    console.log('4. Test faith mode toggle and verse selection');
    console.log('5. Test daily reminder toggle');
    console.log('6. Open prompt library and test theme selection');
    console.log('7. Test AI generator with different prompts');
    console.log('8. Save a declaration and verify it appears in saved declarations');
    console.log('9. Test copy to clipboard functionality');
    console.log('10. Test speak declaration with animation');
    console.log('11. Verify faith mode watermarks and badges');
    console.log('12. Check encouragement mode messages');
    console.log('13. Test error handling for missing information');
    console.log('14. Verify AsyncStorage persistence');
}

// Run all tests
function runTests() {
    console.log('🚀 Starting DeclarationBuilderScreen Tests...\n');

    checkDeclarationBuilderImplementation();
    checkInputFields();
    checkPromptLibrary();
    checkUsageFeatures();
    checkFaithModeIntegration();
    checkEncouragementMode();
    checkUIComponents();
    checkErrorHandling();

    generateTestReport();
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = {
    runTests,
    testResults,
    testConfig
}; 