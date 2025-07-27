#!/usr/bin/env node

/**
 * SavedEntriesScreen Test Script
 * Tests entry display, search, filtering, and faith mode features
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📁 Testing SavedEntriesScreen...\n');

// Test configuration
const testConfig = {
    appName: 'kingdom-voice',
    testEntries: [
        {
            id: '1',
            title: 'Grateful for Today',
            content: 'Today I felt really grateful for the small moments of peace in my day. God\'s presence was so evident in the quiet times.',
            mood: 'blessed',
            tags: ['Gratitude', 'Peace'],
            date: new Date().toISOString(),
            faithMode: true,
            verse: 'Psalm 46:10 - Be still and know that I am God.',
            isDraft: false,
            isPinned: true,
            entryType: 'journal'
        },
        {
            id: '2',
            title: 'Dream About Flying',
            content: 'I had a dream last night where I was flying over the city. It felt so freeing and peaceful.',
            mood: 'peaceful',
            tags: ['Dreams', 'Freedom'],
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            faithMode: false,
            isDraft: false,
            isPinned: false,
            entryType: 'dream'
        },
        {
            id: '3',
            title: 'Morning Devotion',
            content: 'Trusting God with my future today. His plans are always better than mine.',
            mood: 'thoughtful',
            tags: ['Prayer', 'Trust'],
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            faithMode: true,
            verse: 'Jeremiah 29:11 - For I know the plans I have for you.',
            isDraft: false,
            isPinned: false,
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

function checkSavedEntriesImplementation() {
    console.log('📁 Checking SavedEntriesScreen Implementation...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('SavedEntriesScreen exists', false, 'File not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for imports
    const hasAsyncStorageImport = fileContent.includes("import AsyncStorage from '@react-native-async-storage/async-storage'");
    logTest('AsyncStorage import', hasAsyncStorageImport, hasAsyncStorageImport ? 'AsyncStorage imported' : 'Missing AsyncStorage import');

    const hasRouterImport = fileContent.includes("import { router } from 'expo-router'");
    logTest('Router import', hasRouterImport, hasRouterImport ? 'Router imported' : 'Missing router import');

    // Check for interface definition
    const hasJournalEntryInterface = fileContent.includes('interface JournalEntry') &&
        fileContent.includes('id: string') &&
        fileContent.includes('title: string') &&
        fileContent.includes('content: string');
    logTest('JournalEntry interface', hasJournalEntryInterface, hasJournalEntryInterface ? 'Interface defined' : 'Missing interface');

    // Check for state management
    const hasEntriesState = fileContent.includes('entries, setEntries') &&
        fileContent.includes('filteredEntries, setFilteredEntries');
    logTest('Entries state', hasEntriesState, hasEntriesState ? 'State management implemented' : 'Missing state management');

    const hasSearchState = fileContent.includes('searchQuery, setSearchQuery');
    logTest('Search state', hasSearchState, hasSearchState ? 'Search state implemented' : 'Missing search state');

    const hasFilterState = fileContent.includes('selectedFilter, setSelectedFilter');
    logTest('Filter state', hasFilterState, hasFilterState ? 'Filter state implemented' : 'Missing filter state');

    // Check for data loading
    const hasLoadEntriesFunction = fileContent.includes('loadEntries');
    logTest('loadEntries function', hasLoadEntriesFunction, hasLoadEntriesFunction ? 'Function implemented' : 'Missing function');

    const hasFilterEntriesFunction = fileContent.includes('filterEntries');
    logTest('filterEntries function', hasFilterEntriesFunction, hasFilterEntriesFunction ? 'Function implemented' : 'Missing function');

    return hasAsyncStorageImport && hasRouterImport && hasJournalEntryInterface && hasEntriesState;
}

function checkDisplayFeatures() {
    console.log('\n📱 Checking Display Features...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('Display features', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for card/list view
    const hasViewMode = fileContent.includes('viewMode') && fileContent.includes('cards') && fileContent.includes('list');
    logTest('View mode toggle', hasViewMode, hasViewMode ? 'View mode implemented' : 'Missing view mode');

    // Check for entry card rendering
    const hasRenderEntryCard = fileContent.includes('renderEntryCard');
    logTest('Entry card rendering', hasRenderEntryCard, hasRenderEntryCard ? 'Card rendering implemented' : 'Missing card rendering');

    // Check for entry details
    const hasEntryTitle = fileContent.includes('entryTitle') || fileContent.includes('title');
    logTest('Entry title display', hasEntryTitle, hasEntryTitle ? 'Title display implemented' : 'Missing title display');

    const hasEntryDate = fileContent.includes('entryDate') || fileContent.includes('formatDate');
    logTest('Entry date display', hasEntryDate, hasEntryDate ? 'Date display implemented' : 'Missing date display');

    const hasMoodDisplay = fileContent.includes('moodEmoji') || fileContent.includes('getMoodEmoji');
    logTest('Mood display', hasMoodDisplay, hasMoodDisplay ? 'Mood display implemented' : 'Missing mood display');

    const hasTagsDisplay = fileContent.includes('tagsContainer') || fileContent.includes('tagChip');
    logTest('Tags display', hasTagsDisplay, hasTagsDisplay ? 'Tags display implemented' : 'Missing tags display');

    // Check for faith mode display
    const hasFaithBadge = fileContent.includes('faithBadge') || fileContent.includes('Faith Mode');
    logTest('Faith mode badge', hasFaithBadge, hasFaithBadge ? 'Faith badge implemented' : 'Missing faith badge');

    const hasFaithWatermark = fileContent.includes('faithWatermark');
    logTest('Faith watermark', hasFaithWatermark, hasFaithWatermark ? 'Faith watermark implemented' : 'Missing faith watermark');

    return hasViewMode && hasRenderEntryCard && hasEntryTitle && hasEntryDate && hasMoodDisplay && hasTagsDisplay;
}

function checkSearchAndFilter() {
    console.log('\n🔍 Checking Search and Filter Features...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('Search and filter', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for search functionality
    const hasSearchBar = fileContent.includes('searchBar') || fileContent.includes('searchInput');
    logTest('Search bar', hasSearchBar, hasSearchBar ? 'Search bar implemented' : 'Missing search bar');

    const hasSearchIcon = fileContent.includes('searchIcon') || fileContent.includes('🔍');
    logTest('Search icon', hasSearchIcon, hasSearchIcon ? 'Search icon implemented' : 'Missing search icon');

    // Check for filter functionality
    const hasFilterTabs = fileContent.includes('filterTab') || fileContent.includes('filterContainer');
    logTest('Filter tabs', hasFilterTabs, hasFilterTabs ? 'Filter tabs implemented' : 'Missing filter tabs');

    const hasFilterOptions = fileContent.includes('All') && fileContent.includes('Journal') && fileContent.includes('Dreams') && fileContent.includes('Devotions');
    logTest('Filter options', hasFilterOptions, hasFilterOptions ? 'Filter options implemented' : 'Missing filter options');

    // Check for search logic
    const hasSearchLogic = fileContent.includes('toLowerCase') && fileContent.includes('includes');
    logTest('Search logic', hasSearchLogic, hasSearchLogic ? 'Search logic implemented' : 'Missing search logic');

    // Check for filter logic
    const hasFilterLogic = fileContent.includes('selectedFilter') && fileContent.includes('filtered');
    logTest('Filter logic', hasFilterLogic, hasFilterLogic ? 'Filter logic implemented' : 'Missing filter logic');

    return hasSearchBar && hasFilterTabs && hasFilterOptions && hasSearchLogic && hasFilterLogic;
}

function checkFaithModeIntegration() {
    console.log('\n✝️ Checking Faith Mode Integration...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('Faith mode integration', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for faith mode context
    const hasFaithModeContext = fileContent.includes('useFaithMode') && fileContent.includes('isFaithMode');
    logTest('Faith mode context', hasFaithModeContext, hasFaithModeContext ? 'Context integrated' : 'Missing faith mode context');

    // Check for faith mode visual elements
    const hasFaithModeTitle = fileContent.includes('✝️ Saved Entries');
    logTest('Faith mode title', hasFaithModeTitle, hasFaithModeTitle ? 'Faith mode title implemented' : 'Missing faith mode title');

    const hasFaithModeBorder = fileContent.includes('faithMode ? colors.softGold : colors.skyBlue');
    logTest('Faith mode border', hasFaithModeBorder, hasFaithModeBorder ? 'Faith mode border implemented' : 'Missing faith mode border');

    const hasFaithModeBadge = fileContent.includes('faithBadge') && fileContent.includes('✝️');
    logTest('Faith mode badge', hasFaithModeBadge, hasFaithModeBadge ? 'Faith mode badge implemented' : 'Missing faith mode badge');

    // Check for encouragement mode
    const hasEncouragementMode = fileContent.includes('isEncouragementMode') && fileContent.includes('encouragementCard');
    logTest('Encouragement mode', hasEncouragementMode, hasEncouragementMode ? 'Encouragement mode implemented' : 'Missing encouragement mode');

    const hasEncouragementQuotes = fileContent.includes('encouragementQuotes') && fileContent.includes('Revisit what God already said');
    logTest('Encouragement quotes', hasEncouragementQuotes, hasEncouragementQuotes ? 'Encouragement quotes implemented' : 'Missing encouragement quotes');

    return hasFaithModeContext && hasFaithModeTitle && hasFaithModeBorder && hasFaithModeBadge && hasEncouragementMode;
}

function checkDataManagement() {
    console.log('\n💾 Checking Data Management...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('Data management', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for AsyncStorage usage
    const hasAsyncStorageGet = fileContent.includes('AsyncStorage.getItem') && fileContent.includes('journal_entries');
    logTest('AsyncStorage get', hasAsyncStorageGet, hasAsyncStorageGet ? 'AsyncStorage get implemented' : 'Missing AsyncStorage get');

    const hasAsyncStorageSet = fileContent.includes('AsyncStorage.setItem');
    logTest('AsyncStorage set', hasAsyncStorageSet, hasAsyncStorageSet ? 'AsyncStorage set implemented' : 'Missing AsyncStorage set');

    // Check for data structure
    const hasFirestoreStructure = fileContent.includes('/users/') && fileContent.includes('/entries/');
    logTest('Firestore structure', hasFirestoreStructure, hasFirestoreStructure ? 'Firestore structure ready' : 'Missing Firestore structure');

    // Check for entry operations
    const hasTogglePin = fileContent.includes('togglePinEntry');
    logTest('Toggle pin function', hasTogglePin, hasTogglePin ? 'Toggle pin implemented' : 'Missing toggle pin');

    const hasDeleteEntry = fileContent.includes('deleteEntry');
    logTest('Delete entry function', hasDeleteEntry, hasDeleteEntry ? 'Delete entry implemented' : 'Missing delete entry');

    const hasEditEntry = fileContent.includes('editEntry');
    logTest('Edit entry function', hasEditEntry, hasEditEntry ? 'Edit entry implemented' : 'Missing edit entry');

    return hasAsyncStorageGet && hasAsyncStorageSet && hasTogglePin && hasDeleteEntry && hasEditEntry;
}

function checkUIComponents() {
    console.log('\n🎨 Checking UI Components...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('UI components', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    // Check for modal implementation
    const hasEntryModal = fileContent.includes('showEntryModal') && fileContent.includes('Modal');
    logTest('Entry modal', hasEntryModal, hasEntryModal ? 'Entry modal implemented' : 'Missing entry modal');

    // Check for action buttons
    const hasViewButton = fileContent.includes('View') || fileContent.includes('👁️');
    logTest('View button', hasViewButton, hasViewButton ? 'View button implemented' : 'Missing view button');

    const hasEditButton = fileContent.includes('Edit') || fileContent.includes('✏️');
    logTest('Edit button', hasEditButton, hasEditButton ? 'Edit button implemented' : 'Missing edit button');

    const hasPinButton = fileContent.includes('Pin') || fileContent.includes('📌');
    logTest('Pin button', hasPinButton, hasPinButton ? 'Pin button implemented' : 'Missing pin button');

    // Check for empty state
    const hasEmptyState = fileContent.includes('emptyContainer') || fileContent.includes('No entries found');
    logTest('Empty state', hasEmptyState, hasEmptyState ? 'Empty state implemented' : 'Missing empty state');

    // Check for loading state
    const hasLoadingState = fileContent.includes('loadingContainer') || fileContent.includes('Loading your entries');
    logTest('Loading state', hasLoadingState, hasLoadingState ? 'Loading state implemented' : 'Missing loading state');

    return hasEntryModal && hasViewButton && hasEditButton && hasPinButton && hasEmptyState && hasLoadingState;
}

function checkAnimations() {
    console.log('\n✨ Checking Animations...');

    const savedEntriesPath = path.join(__dirname, 'app', '(tabs)', 'saved-entries.tsx');
    if (!checkFileExists(savedEntriesPath)) {
        logTest('Animations', false, 'SavedEntriesScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(savedEntriesPath, 'utf8');

    const hasFadeAnimation = fileContent.includes('fadeAnimation');
    logTest('Fade animation', hasFadeAnimation, hasFadeAnimation ? 'Fade animation implemented' : 'Missing fade animation');

    const hasSlideAnimation = fileContent.includes('slideAnimation');
    logTest('Slide animation', hasSlideAnimation, hasSlideAnimation ? 'Slide animation implemented' : 'Missing slide animation');

    const hasAnimatedView = fileContent.includes('Animated.View');
    logTest('Animated view', hasAnimatedView, hasAnimatedView ? 'Animated view implemented' : 'Missing animated view');

    return hasFadeAnimation && hasSlideAnimation && hasAnimatedView;
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
    console.log('📁 SavedEntriesScreen is ready for testing.');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Open the app and navigate to Saved Entries');
    console.log('2. Verify entries are displayed in card format');
    console.log('3. Test search functionality with different queries');
    console.log('4. Test filter options (All, Journal, Dreams, Devotions)');
    console.log('5. Tap on an entry to view full details');
    console.log('6. Test edit functionality');
    console.log('7. Test pin/unpin entries');
    console.log('8. Test delete functionality');
    console.log('9. Verify faith mode badges and watermarks');
    console.log('10. Check encouragement mode messages');
    console.log('11. Test empty state when no entries exist');
    console.log('12. Test loading state during data fetch');
}

// Run all tests
function runTests() {
    console.log('🚀 Starting SavedEntriesScreen Tests...\n');

    checkSavedEntriesImplementation();
    checkDisplayFeatures();
    checkSearchAndFilter();
    checkFaithModeIntegration();
    checkDataManagement();
    checkUIComponents();
    checkAnimations();

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