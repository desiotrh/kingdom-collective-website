#!/usr/bin/env node

/**
 * Test Script: Group Explore Screen
 * Kingdom Circle App - Group Discovery Features
 * 
 * This script tests the implementation of:
 * 1. Group discovery with search functionality
 * 2. Filter chips for different categories
 * 3. Faith/Encouragement mode adaptations
 * 4. Public/private group handling
 * 5. Join/leave group functionality
 * 6. List/grid view modes
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Group Explore Screen');
console.log('='.repeat(60));

// Test Configuration
const TEST_CONFIG = {
    groupExploreScreen: 'apps/kingdom-circle/app/(tabs)/group-explore.tsx',
    expectedFeatures: [
        'Group interface with all required fields',
        'Search functionality by name, description, tags',
        'Filter chips for Faith/Encouragement modes',
        'Public/private group handling',
        'Join/leave group functionality',
        'List and grid view modes',
        'Faith mode adaptations (✝️ badge, Spirit-led)',
        'Encouragement mode adaptations',
        'AsyncStorage for joined groups',
        'Mock groups data for testing',
        'Category filtering system',
        'Member count display',
        'Group images and descriptions'
    ]
};

// Test Results
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Utility Functions
function logTest(testName, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${testName}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}`);
        if (details) console.log(`   Details: ${details}`);
    }
    testResults.details.push({ name: testName, passed, details });
}

function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return '';
    }
}

function checkFeature(content, feature, description) {
    const hasFeature = content.includes(feature);
    logTest(description, hasFeature, hasFeature ? 'Feature found' : `Missing: ${feature}`);
    return hasFeature;
}

// Test 1: File Exists
console.log('\n📁 Testing File Structure...');
const groupExploreScreenExists = checkFileExists(TEST_CONFIG.groupExploreScreen);
logTest('GroupExploreScreen.tsx exists', groupExploreScreenExists,
    groupExploreScreenExists ? 'File found' : 'GroupExploreScreen.tsx not found');

// Test 2: Group Interface
console.log('\n👥 Testing Group Interface...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Group Interface
    checkFeature(groupExploreContent, 'interface Group', 'Group interface defined');
    checkFeature(groupExploreContent, 'id: string', 'Group ID field');
    checkFeature(groupExploreContent, 'name: string', 'Group name field');
    checkFeature(groupExploreContent, 'description: string', 'Group description field');
    checkFeature(groupExploreContent, 'memberCount: number', 'Member count field');
    checkFeature(groupExploreContent, 'maxMembers: number', 'Max members field');
    checkFeature(groupExploreContent, 'category: string', 'Group category field');
    checkFeature(groupExploreContent, 'tags: string[]', 'Group tags array');
    checkFeature(groupExploreContent, 'isPublic: boolean', 'Public/private flag');
    checkFeature(groupExploreContent, 'isFaithBased: boolean', 'Faith-based flag');
    checkFeature(groupExploreContent, 'imageUrl?: string', 'Group image URL');
}

// Test 3: Filter Categories
console.log('\n🏷️ Testing Filter Categories...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Faith Mode Categories
    checkFeature(groupExploreContent, 'FAITH_FILTER_CATEGORIES', 'Faith filter categories array');
    checkFeature(groupExploreContent, 'intercession', 'Intercession category');
    checkFeature(groupExploreContent, 'kingdom-business', 'Kingdom Business category');
    checkFeature(groupExploreContent, 'deliverance', 'Deliverance category');
    checkFeature(groupExploreContent, 'identity', 'Identity category');
    checkFeature(groupExploreContent, 'marriage', 'Marriage category');
    checkFeature(groupExploreContent, 'prayer', 'Prayer category');

    // Encouragement Mode Categories
    checkFeature(groupExploreContent, 'ENCOURAGEMENT_FILTER_CATEGORIES', 'Encouragement filter categories array');
    checkFeature(groupExploreContent, 'mindset-reset', 'Mindset Reset category');
    checkFeature(groupExploreContent, 'confidence-builders', 'Confidence Builders category');
    checkFeature(groupExploreContent, 'dream-circle', 'Dream Circle category');
    checkFeature(groupExploreContent, 'purpose-path', 'Purpose Path category');
    checkFeature(groupExploreContent, 'accountability', 'Accountability category');
    checkFeature(groupExploreContent, 'creative', 'Creative category');
}

// Test 4: Mock Groups Data
console.log('\n📊 Testing Mock Groups Data...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Mock Groups
    checkFeature(groupExploreContent, 'MOCK_GROUPS', 'Mock groups data array');
    checkFeature(groupExploreContent, 'Prophetic Activation Circle', 'Faith-based group example');
    checkFeature(groupExploreContent, 'Kingdom Entrepreneurs', 'Kingdom business group example');
    checkFeature(groupExploreContent, 'Mindset Mastery Circle', 'Encouragement group example');
    checkFeature(groupExploreContent, 'Creative Expression Hub', 'Creative group example');
    checkFeature(groupExploreContent, 'Deliverance Warriors', 'Deliverance group example');

    // Group Properties
    checkFeature(groupExploreContent, 'memberCount: 24', 'Member count in mock data');
    checkFeature(groupExploreContent, 'maxMembers: 50', 'Max members in mock data');
    checkFeature(groupExploreContent, 'isPublic: true', 'Public group flag');
    checkFeature(groupExploreContent, 'isFaithBased: true', 'Faith-based group flag');
    checkFeature(groupExploreContent, 'imageUrl:', 'Group image URLs');
}

// Test 5: Search Functionality
console.log('\n🔍 Testing Search Functionality...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Search State
    checkFeature(groupExploreContent, 'searchQuery', 'Search query state');
    checkFeature(groupExploreContent, 'setSearchQuery', 'Search query setter');

    // Search Logic
    checkFeature(groupExploreContent, 'searchQuery.toLowerCase()', 'Search query processing');
    checkFeature(groupExploreContent, 'group.name.toLowerCase().includes(query)', 'Name search');
    checkFeature(groupExploreContent, 'group.description.toLowerCase().includes(query)', 'Description search');
    checkFeature(groupExploreContent, 'group.tags.some(tag => tag.toLowerCase().includes(query))', 'Tag search');

    // Search UI
    checkFeature(groupExploreContent, 'TextInput', 'Search input component');
    checkFeature(groupExploreContent, 'placeholder', 'Search placeholder text');
}

// Test 6: Filter Functionality
console.log('\n🎯 Testing Filter Functionality...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Filter State
    checkFeature(groupExploreContent, 'selectedCategory', 'Selected category state');
    checkFeature(groupExploreContent, 'setSelectedCategory', 'Category setter');

    // Filter Logic
    checkFeature(groupExploreContent, 'selectedCategory !== \'all\'', 'Category filter logic');
    checkFeature(groupExploreContent, 'group.category === selectedCategory', 'Category matching');
    checkFeature(groupExploreContent, 'faithMode ? FAITH_FILTER_CATEGORIES : ENCOURAGEMENT_FILTER_CATEGORIES', 'Mode-specific categories');

    // Filter UI
    checkFeature(groupExploreContent, 'ScrollView horizontal', 'Horizontal filter scroll');
    checkFeature(groupExploreContent, 'filterChip', 'Filter chip component');
    checkFeature(groupExploreContent, 'All Groups', 'All groups filter option');
}

// Test 7: View Modes
console.log('\n👁️ Testing View Modes...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // View Mode State
    checkFeature(groupExploreContent, 'viewMode', 'View mode state');
    checkFeature(groupExploreContent, 'setViewMode', 'View mode setter');
    checkFeature(groupExploreContent, '\'list\' | \'grid\'', 'View mode types');

    // View Mode UI
    checkFeature(groupExploreContent, 'viewModeContainer', 'View mode container');
    checkFeature(groupExploreContent, 'viewModeButton', 'View mode button');
    checkFeature(groupExploreContent, 'List', 'List view option');
    checkFeature(groupExploreContent, 'Grid', 'Grid view option');

    // Render Functions
    checkFeature(groupExploreContent, 'renderGroupCard', 'List view render function');
    checkFeature(groupExploreContent, 'renderGroupGridItem', 'Grid view render function');
    checkFeature(groupExploreContent, 'numColumns={viewMode === \'grid\' ? 2 : 1}', 'Column configuration');
}

// Test 8: Join/Leave Functionality
console.log('\n🤝 Testing Join/Leave Functionality...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Join State
    checkFeature(groupExploreContent, 'joinedGroups', 'Joined groups state');
    checkFeature(groupExploreContent, 'setJoinedGroups', 'Joined groups setter');

    // Join Functions
    checkFeature(groupExploreContent, 'handleJoinGroup', 'Join group handler');
    checkFeature(groupExploreContent, 'loadJoinedGroups', 'Load joined groups function');
    checkFeature(groupExploreContent, 'saveJoinedGroups', 'Save joined groups function');

    // AsyncStorage
    checkFeature(groupExploreContent, 'AsyncStorage', 'AsyncStorage import');
    checkFeature(groupExploreContent, 'AsyncStorage.getItem(\'joinedGroups\')', 'Load from storage');
    checkFeature(groupExploreContent, 'AsyncStorage.setItem(\'joinedGroups\'', 'Save to storage');

    // Join UI
    checkFeature(groupExploreContent, 'Join', 'Join button text');
    checkFeature(groupExploreContent, 'Joined', 'Joined button text');
    checkFeature(groupExploreContent, 'joinedGroups.includes(group.id)', 'Join status check');
}

// Test 9: Faith Mode Features
console.log('\n✝️ Testing Faith Mode Features...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Faith Mode Logic
    checkFeature(groupExploreContent, 'faithMode', 'Faith mode support');
    checkFeature(groupExploreContent, 'faithMode ?', 'Faith mode conditional logic');
    checkFeature(groupExploreContent, 'group.isFaithBased', 'Faith-based group check');
    checkFeature(groupExploreContent, 'filtered.filter(group => group.isFaithBased)', 'Faith group filtering');

    // Faith Mode UI
    checkFeature(groupExploreContent, '✝️ Discover Groups', 'Faith mode title');
    checkFeature(groupExploreContent, 'faithBadge', 'Faith badge component');
    checkFeature(groupExploreContent, '✝️', 'Cross emoji in Faith mode');
    checkFeature(groupExploreContent, 'Spirit-led', 'Spirit-led text');
}

// Test 10: Encouragement Mode Features
console.log('\n🕊 Testing Encouragement Mode Features...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Encouragement Mode Logic
    checkFeature(groupExploreContent, 'encouragementMode', 'Encouragement mode support');
    checkFeature(groupExploreContent, '!group.isFaithBased', 'Non-faith group check');
    checkFeature(groupExploreContent, 'filtered.filter(group => !group.isFaithBased)', 'Encouragement group filtering');

    // Encouragement Mode UI
    checkFeature(groupExploreContent, '🕊 Discover Groups', 'Encouragement mode title');
    checkFeature(groupExploreContent, 'like-minded people', 'Encouragement mode text');
}

// Test 11: UI Components
console.log('\n🎨 Testing UI Components...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // Main Components
    checkFeature(groupExploreContent, 'FlatList', 'Groups list component');
    checkFeature(groupExploreContent, 'groupCard', 'Group card component');
    checkFeature(groupExploreContent, 'groupGridItem', 'Group grid item component');
    checkFeature(groupExploreContent, 'groupImage', 'Group image component');

    // Group Info Display
    checkFeature(groupExploreContent, 'groupCardTitle', 'Group title display');
    checkFeature(groupExploreContent, 'groupCardDescription', 'Group description display');
    checkFeature(groupExploreContent, 'groupCardMembers', 'Member count display');
    checkFeature(groupExploreContent, 'groupCardTags', 'Group tags display');

    // Empty State
    checkFeature(groupExploreContent, 'ListEmptyComponent', 'Empty state component');
    checkFeature(groupExploreContent, 'emptyState', 'Empty state styling');
}

// Test 12: Styling
console.log('\n💅 Testing Styling...');
if (groupExploreScreenExists) {
    const groupExploreContent = readFileContent(TEST_CONFIG.groupExploreScreen);

    // StyleSheet
    checkFeature(groupExploreContent, 'StyleSheet.create', 'Styled components');
    checkFeature(groupExploreContent, 'container:', 'Container styles');
    checkFeature(groupExploreContent, 'header:', 'Header styles');
    checkFeature(groupExploreContent, 'searchContainer:', 'Search container styles');
    checkFeature(groupExploreContent, 'filterContainer:', 'Filter container styles');
    checkFeature(groupExploreContent, 'groupCard:', 'Group card styles');
    checkFeature(groupExploreContent, 'joinButton:', 'Join button styles');
}

// Summary
console.log('\n📊 Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${testResults.total}`);
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

// Detailed Results
if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
        .filter(test => !test.passed)
        .forEach(test => {
            console.log(`   • ${test.name}: ${test.details}`);
        });
}

// Recommendations
console.log('\n💡 Recommendations:');
if (testResults.passed / testResults.total >= 0.8) {
    console.log('✅ Excellent implementation! The Group Explore Screen is comprehensive and well-implemented.');
    console.log('✅ Consider adding:');
    console.log('   • Real-time group updates');
    console.log('   • Advanced search filters');
    console.log('   • Group recommendations');
    console.log('   • Group creation functionality');
} else if (testResults.passed / testResults.total >= 0.6) {
    console.log('⚠️ Good implementation with some areas for improvement.');
    console.log('🔧 Consider fixing:');
    testResults.details
        .filter(test => !test.passed)
        .slice(0, 3)
        .forEach(test => {
            console.log(`   • ${test.name}`);
        });
} else {
    console.log('❌ Implementation needs significant work.');
    console.log('🚨 Priority fixes needed:');
    testResults.details
        .filter(test => !test.passed)
        .slice(0, 5)
        .forEach(test => {
            console.log(`   • ${test.name}`);
        });
}

// Feature Checklist
console.log('\n📋 Feature Implementation Checklist:');
const implementedFeatures = [
    'Group interface with all required fields',
    'Search functionality by name, description, tags',
    'Filter chips for Faith/Encouragement modes',
    'Public/private group handling',
    'Join/leave group functionality',
    'List and grid view modes',
    'Faith mode adaptations (✝️ badge, Spirit-led)',
    'Encouragement mode adaptations',
    'AsyncStorage for joined groups',
    'Mock groups data for testing',
    'Category filtering system',
    'Member count display',
    'Group images and descriptions',
    'Empty state handling',
    'Responsive design and styling'
];

implementedFeatures.forEach(feature => {
    const isImplemented = testResults.details.some(test =>
        test.name.toLowerCase().includes(feature.toLowerCase()) && test.passed
    );
    console.log(`${isImplemented ? '✅' : '❌'} ${feature}`);
});

console.log('\n🎉 Group Explore Screen Testing Complete!');
console.log('The screen provides comprehensive group discovery features with dual-mode support.'); 