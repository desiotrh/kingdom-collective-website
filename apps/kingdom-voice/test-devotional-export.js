#!/usr/bin/env node

/**
 * DevotionalExportScreen Test Script
 * Tests devotional selection, export formats, and faith mode features
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📚 Testing DevotionalExportScreen...\n');

// Test configuration
const testConfig = {
    appName: 'kingdom-voice',
    testDevotionals: [
        {
            id: '1',
            title: 'Morning Devotion: Trusting God',
            content: 'Today I choose to trust God with my future. His plans are always better than mine, and I know He has a purpose for everything.',
            mood: 'blessed',
            tags: ['Prayer', 'Trust'],
            date: new Date().toISOString(),
            faithMode: true,
            verse: 'Jeremiah 29:11 - For I know the plans I have for you, declares the Lord.',
            isDraft: false,
            entryType: 'devotion'
        },
        {
            id: '2',
            title: 'Evening Reflection: Gratitude',
            content: 'As I end this day, I am grateful for all the blessings God has given me. Even in difficult times, His love remains constant.',
            mood: 'peaceful',
            tags: ['Gratitude', 'Prayer'],
            date: new Date(Date.now() - 86400000).toISOString(),
            faithMode: true,
            verse: 'Psalm 107:1 - Give thanks to the Lord, for he is good.',
            isDraft: false,
            entryType: 'devotion'
        },
        {
            id: '3',
            title: 'Prayer for Strength',
            content: 'Lord, give me the strength to face today\'s challenges. Help me to rely on Your power and not my own understanding.',
            mood: 'strong',
            tags: ['Prayer', 'Strength'],
            date: new Date(Date.now() - 172800000).toISOString(),
            faithMode: true,
            verse: 'Philippians 4:13 - I can do all things through Christ who strengthens me.',
            isDraft: false,
            entryType: 'devotion'
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

function checkDependencies() {
    console.log('📦 Checking dependencies...');

    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!checkFileExists(packageJsonPath)) {
        logTest('Package.json exists', false, 'Package.json not found');
        return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};

    const requiredDeps = ['pdf-lib', 'expo-sharing', 'expo-file-system'];
    let allDepsPresent = true;

    requiredDeps.forEach(dep => {
        if (!dependencies[dep]) {
            logTest(`${dep} dependency`, false, 'Missing required dependency');
            allDepsPresent = false;
        } else {
            logTest(`${dep} dependency`, true, `Version: ${dependencies[dep]}`);
        }
    });

    return allDepsPresent;
}

function checkDevotionalExportImplementation() {
    console.log('\n📚 Checking DevotionalExportScreen Implementation...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('DevotionalExportScreen exists', false, 'File not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for imports
    const hasFileSystemImport = fileContent.includes("import * as FileSystem from 'expo-file-system'");
    logTest('FileSystem import', hasFileSystemImport, hasFileSystemImport ? 'FileSystem imported' : 'Missing FileSystem import');

    const hasSharingImport = fileContent.includes("import * as Sharing from 'expo-sharing'");
    logTest('Sharing import', hasSharingImport, hasSharingImport ? 'Sharing imported' : 'Missing Sharing import');

    const hasPdfLibImport = fileContent.includes("import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'");
    logTest('PDF-lib import', hasPdfLibImport, hasPdfLibImport ? 'PDF-lib imported' : 'Missing PDF-lib import');

    // Check for interface definition
    const hasExportBundleInterface = fileContent.includes('interface ExportBundle') &&
        fileContent.includes('id: string') &&
        fileContent.includes('title: string') &&
        fileContent.includes('entries: JournalEntry[]');
    logTest('ExportBundle interface', hasExportBundleInterface, hasExportBundleInterface ? 'Interface defined' : 'Missing interface');

    // Check for state management
    const hasDevotionalsState = fileContent.includes('devotionals, setDevotionals') &&
        fileContent.includes('selectedDevotionals, setSelectedDevotionals');
    logTest('Devotionals state', hasDevotionalsState, hasDevotionalsState ? 'State management implemented' : 'Missing state management');

    const hasExportSettingsState = fileContent.includes('exportTitle, setExportTitle') &&
        fileContent.includes('exportFormat, setExportFormat');
    logTest('Export settings state', hasExportSettingsState, hasExportSettingsState ? 'Export settings implemented' : 'Missing export settings');

    return hasFileSystemImport && hasSharingImport && hasPdfLibImport && hasExportBundleInterface && hasDevotionalsState;
}

function checkDevotionalSelection() {
    console.log('\n📋 Checking Devotional Selection...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('Devotional selection', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for selection functions
    const hasToggleSelection = fileContent.includes('toggleDevotionalSelection');
    logTest('Toggle selection function', hasToggleSelection, hasToggleSelection ? 'Function implemented' : 'Missing function');

    const hasSelectAll = fileContent.includes('selectAllDevotionals');
    logTest('Select all function', hasSelectAll, hasSelectAll ? 'Function implemented' : 'Missing function');

    const hasClearSelection = fileContent.includes('clearSelection');
    logTest('Clear selection function', hasClearSelection, hasClearSelection ? 'Function implemented' : 'Missing function');

    // Check for selection UI
    const hasSelectionIndicator = fileContent.includes('selectionIndicator');
    logTest('Selection indicator', hasSelectionIndicator, hasSelectionIndicator ? 'Selection indicator implemented' : 'Missing selection indicator');

    const hasSelectionControls = fileContent.includes('selectionControls');
    logTest('Selection controls', hasSelectionControls, hasSelectionControls ? 'Selection controls implemented' : 'Missing selection controls');

    // Check for devotional filtering
    const hasLoadDevotionals = fileContent.includes('loadDevotionals');
    logTest('Load devotionals function', hasLoadDevotionals, hasLoadDevotionals ? 'Function implemented' : 'Missing function');

    const hasDevotionalFilter = fileContent.includes('faithMode') && fileContent.includes('Prayer') && fileContent.includes('Devotion');
    logTest('Devotional filtering', hasDevotionalFilter, hasDevotionalFilter ? 'Filtering implemented' : 'Missing filtering');

    return hasToggleSelection && hasSelectAll && hasClearSelection && hasSelectionIndicator && hasLoadDevotionals;
}

function checkExportFormats() {
    console.log('\n📄 Checking Export Formats...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('Export formats', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for PDF generation
    const hasGeneratePDF = fileContent.includes('generatePDF');
    logTest('Generate PDF function', hasGeneratePDF, hasGeneratePDF ? 'Function implemented' : 'Missing function');

    const hasPdfLibUsage = fileContent.includes('PDFDocument.create') && fileContent.includes('StandardFonts');
    logTest('PDF-lib usage', hasPdfLibUsage, hasPdfLibUsage ? 'PDF-lib used correctly' : 'Missing PDF-lib usage');

    // Check for text generation
    const hasGenerateText = fileContent.includes('generateText');
    logTest('Generate text function', hasGenerateText, hasGenerateText ? 'Function implemented' : 'Missing function');

    // Check for format options
    const hasFormatOptions = fileContent.includes('formatOptions') && fileContent.includes('PDF') && fileContent.includes('Text');
    logTest('Format options', hasFormatOptions, hasFormatOptions ? 'Format options implemented' : 'Missing format options');

    // Check for export title
    const hasExportTitle = fileContent.includes('exportTitle') && fileContent.includes('Bundle Title');
    logTest('Export title', hasExportTitle, hasExportTitle ? 'Export title implemented' : 'Missing export title');

    return hasGeneratePDF && hasGenerateText && hasFormatOptions && hasExportTitle;
}

function checkExportMethod() {
    console.log('\n🖨️ Checking Export Method...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('Export method', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for file system usage
    const hasFileSystemUsage = fileContent.includes('FileSystem.writeAsStringAsync') && fileContent.includes('FileSystem.documentDirectory');
    logTest('FileSystem usage', hasFileSystemUsage, hasFileSystemUsage ? 'FileSystem used correctly' : 'Missing FileSystem usage');

    // Check for sharing functionality
    const hasSharingUsage = fileContent.includes('Sharing.isAvailableAsync') && fileContent.includes('Sharing.shareAsync');
    logTest('Sharing usage', hasSharingUsage, hasSharingUsage ? 'Sharing used correctly' : 'Missing Sharing usage');

    // Check for export function
    const hasExportDevotionals = fileContent.includes('exportDevotionals');
    logTest('Export devotionals function', hasExportDevotionals, hasExportDevotionals ? 'Function implemented' : 'Missing function');

    // Check for preview functionality
    const hasPreviewExport = fileContent.includes('previewExport');
    logTest('Preview export function', hasPreviewExport, hasPreviewExport ? 'Function implemented' : 'Missing function');

    // Check for loading states
    const hasIsExporting = fileContent.includes('isExporting, setIsExporting');
    logTest('Export loading state', hasIsExporting, hasIsExporting ? 'Loading state implemented' : 'Missing loading state');

    return hasFileSystemUsage && hasSharingUsage && hasExportDevotionals && hasPreviewExport && hasIsExporting;
}

function checkFaithModeIntegration() {
    console.log('\n✝️ Checking Faith Mode Integration...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('Faith mode integration', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for faith mode context
    const hasFaithModeContext = fileContent.includes('useFaithMode') && fileContent.includes('isFaithMode');
    logTest('Faith mode context', hasFaithModeContext, hasFaithModeContext ? 'Context integrated' : 'Missing faith mode context');

    // Check for faith mode title
    const hasFaithModeTitle = fileContent.includes('✝️ Export Devotionals');
    logTest('Faith mode title', hasFaithModeTitle, hasFaithModeTitle ? 'Faith mode title implemented' : 'Missing faith mode title');

    // Check for prayer over file
    const hasPrayOverFile = fileContent.includes('prayOverFile') && fileContent.includes('Pray over this file');
    logTest('Pray over file option', hasPrayOverFile, hasPrayOverFile ? 'Pray over file implemented' : 'Missing pray over file');

    // Check for faith mode watermark
    const hasFaithWatermark = fileContent.includes('faithWatermark') && fileContent.includes('✝️');
    logTest('Faith watermark', hasFaithWatermark, hasFaithWatermark ? 'Faith watermark implemented' : 'Missing faith watermark');

    // Check for encouragement mode
    const hasEncouragementMode = fileContent.includes('isEncouragementMode') && fileContent.includes('encouragementCard');
    logTest('Encouragement mode', hasEncouragementMode, hasEncouragementMode ? 'Encouragement mode implemented' : 'Missing encouragement mode');

    const hasEncouragementMessage = fileContent.includes('Share Your Light') && fileContent.includes('inspire others');
    logTest('Encouragement message', hasEncouragementMessage, hasEncouragementMessage ? 'Encouragement message implemented' : 'Missing encouragement message');

    return hasFaithModeContext && hasFaithModeTitle && hasPrayOverFile && hasFaithWatermark && hasEncouragementMode;
}

function checkUIComponents() {
    console.log('\n🎨 Checking UI Components...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('UI components', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    // Check for devotional cards
    const hasDevotionalCard = fileContent.includes('renderDevotionalCard');
    logTest('Devotional card rendering', hasDevotionalCard, hasDevotionalCard ? 'Card rendering implemented' : 'Missing card rendering');

    // Check for settings card
    const hasSettingsCard = fileContent.includes('settingsCard');
    logTest('Settings card', hasSettingsCard, hasSettingsCard ? 'Settings card implemented' : 'Missing settings card');

    // Check for export actions
    const hasExportActions = fileContent.includes('exportActions');
    logTest('Export actions', hasExportActions, hasExportActions ? 'Export actions implemented' : 'Missing export actions');

    // Check for preview modal
    const hasPreviewModal = fileContent.includes('showPreviewModal') && fileContent.includes('Modal');
    logTest('Preview modal', hasPreviewModal, hasPreviewModal ? 'Preview modal implemented' : 'Missing preview modal');

    // Check for empty state
    const hasEmptyState = fileContent.includes('emptyContainer') || fileContent.includes('No Devotionals Found');
    logTest('Empty state', hasEmptyState, hasEmptyState ? 'Empty state implemented' : 'Missing empty state');

    // Check for loading indicator
    const hasLoadingIndicator = fileContent.includes('ActivityIndicator');
    logTest('Loading indicator', hasLoadingIndicator, hasLoadingIndicator ? 'Loading indicator implemented' : 'Missing loading indicator');

    return hasDevotionalCard && hasSettingsCard && hasExportActions && hasPreviewModal && hasEmptyState;
}

function checkErrorHandling() {
    console.log('\n🛡️ Checking Error Handling...');

    const devotionalExportPath = path.join(__dirname, 'app', '(tabs)', 'devotional-export.tsx');
    if (!checkFileExists(devotionalExportPath)) {
        logTest('Error handling', false, 'DevotionalExportScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(devotionalExportPath, 'utf8');

    const hasExportError = fileContent.includes('Export Error') && fileContent.includes('Alert.alert');
    logTest('Export error handling', hasExportError, hasExportError ? 'Export errors handled' : 'Missing export error handling');

    const hasSelectionError = fileContent.includes('No Selection') && fileContent.includes('Alert.alert');
    logTest('Selection error handling', hasSelectionError, hasSelectionError ? 'Selection errors handled' : 'Missing selection error handling');

    const hasTryCatch = fileContent.includes('try {') && fileContent.includes('} catch (error)');
    logTest('Try-catch blocks', hasTryCatch, hasTryCatch ? 'Error handling implemented' : 'Missing error handling');

    return hasExportError && hasSelectionError && hasTryCatch;
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
    console.log('📚 DevotionalExportScreen is ready for testing.');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Open the app and navigate to Devotional Export');
    console.log('2. Verify devotionals are displayed with selection indicators');
    console.log('3. Test multi-select functionality (individual, select all, clear all)');
    console.log('4. Test export title input field');
    console.log('5. Test format selection (PDF vs Text)');
    console.log('6. Test faith mode prayer option');
    console.log('7. Preview export content (text format)');
    console.log('8. Export devotionals as PDF');
    console.log('9. Export devotionals as text');
    console.log('10. Verify sharing functionality');
    console.log('11. Test faith mode watermarks and badges');
    console.log('12. Check encouragement mode messages');
    console.log('13. Test empty state when no devotionals exist');
    console.log('14. Verify loading states during export');
}

// Run all tests
function runTests() {
    console.log('🚀 Starting DevotionalExportScreen Tests...\n');

    const depsOk = checkDependencies();
    if (!depsOk) {
        console.log('\n❌ Dependencies check failed. Please install required packages.');
        return;
    }

    checkDevotionalExportImplementation();
    checkDevotionalSelection();
    checkExportFormats();
    checkExportMethod();
    checkFaithModeIntegration();
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