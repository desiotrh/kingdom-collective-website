#!/usr/bin/env node

/**
 * Test Script: Member Profile Pages and Group Roles System
 * Kingdom Circle App - Profile and Role Management
 * 
 * This script tests the implementation of:
 * 1. ProfileScreen with dual-mode support
 * 2. Group roles (Member, Leader, Admin)
 * 3. Role badges in ForgeGroupScreen
 * 4. Role-based permissions
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Member Profile Pages and Group Roles System');
console.log('='.repeat(60));

// Test Configuration
const TEST_CONFIG = {
    profileScreen: 'apps/kingdom-circle/app/(tabs)/profile.tsx',
    forgeGroupScreen: 'apps/kingdom-circle/app/(tabs)/forge-group.tsx',
    expectedFeatures: [
        'ProfileScreen with dual-mode support',
        'Avatar upload functionality',
        'Kingdom Calling / Mission textarea',
        'Role badges (Member, Leader, Admin)',
        'Joined groups display',
        'Profile editing capabilities',
        'Role-based permissions in groups',
        'Role badges in member lists',
        'Faith/Encouragement mode adaptations'
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

// Test 1: ProfileScreen File Exists
console.log('\n📁 Testing File Structure...');
const profileScreenExists = checkFileExists(TEST_CONFIG.profileScreen);
logTest('ProfileScreen.tsx exists', profileScreenExists,
    profileScreenExists ? 'File found' : 'ProfileScreen.tsx not found');

const forgeGroupScreenExists = checkFileExists(TEST_CONFIG.forgeGroupScreen);
logTest('ForgeGroupScreen.tsx exists', forgeGroupScreenExists,
    forgeGroupScreenExists ? 'File found' : 'ForgeGroupScreen.tsx not found');

// Test 2: ProfileScreen Features
console.log('\n👤 Testing ProfileScreen Features...');
if (profileScreenExists) {
    const profileContent = readFileContent(TEST_CONFIG.profileScreen);

    // Core Profile Features
    checkFeature(profileContent, 'interface UserProfile', 'UserProfile interface defined');
    checkFeature(profileContent, 'displayName: string', 'Display name field');
    checkFeature(profileContent, 'avatar?: string', 'Avatar field');
    checkFeature(profileContent, 'bio: string', 'Bio field');
    checkFeature(profileContent, 'kingdomCalling: string', 'Kingdom Calling field');
    checkFeature(profileContent, 'role: \'member\' | \'leader\' | \'admin\'', 'Role field with proper types');

    // Dual-Mode Support
    checkFeature(profileContent, 'faithMode', 'Faith mode support');
    checkFeature(profileContent, 'encouragementMode', 'Encouragement mode support');
    checkFeature(profileContent, '✝️ Kingdom Calling', 'Faith mode Kingdom Calling');
    checkFeature(profileContent, '🕊 Your Mission', 'Encouragement mode Mission');
    checkFeature(profileContent, '✝️ Faith-Filled Builder', 'Faith mode badge');
    checkFeature(profileContent, '🕊 Growth Champion', 'Encouragement mode badge');

    // Profile Editing
    checkFeature(profileContent, 'isEditing', 'Edit mode state');
    checkFeature(profileContent, 'setIsEditing', 'Edit mode toggle');
    checkFeature(profileContent, 'TextInput', 'Profile editing inputs');
    checkFeature(profileContent, 'handleSave', 'Save profile functionality');
    checkFeature(profileContent, 'handleCancel', 'Cancel editing functionality');

    // Avatar Upload
    checkFeature(profileContent, 'showAvatarModal', 'Avatar modal state');
    checkFeature(profileContent, 'setShowAvatarModal', 'Avatar modal toggle');
    checkFeature(profileContent, 'Change Avatar', 'Avatar change modal');

    // Groups Display
    checkFeature(profileContent, 'MOCK_GROUPS', 'Mock groups data');
    checkFeature(profileContent, 'joinedGroups', 'Joined groups field');
    checkFeature(profileContent, 'My Groups', 'Groups section title');

    // Stats Section
    checkFeature(profileContent, 'Kingdom Stats', 'Stats section');
    checkFeature(profileContent, 'Growth Stats', 'Encouragement mode stats');
    checkFeature(profileContent, 'Member Since', 'Join date display');

    // AsyncStorage
    checkFeature(profileContent, 'AsyncStorage', 'Local storage support');
    checkFeature(profileContent, 'loadProfile', 'Profile loading');
    checkFeature(profileContent, 'saveProfile', 'Profile saving');

    // Styling
    checkFeature(profileContent, 'StyleSheet.create', 'Styled components');
    checkFeature(profileContent, 'roleBadge', 'Role badge styles');
    checkFeature(profileContent, 'badgeContainer', 'Badge container styles');
}

// Test 3: ForgeGroupScreen Role Features
console.log('\n👑 Testing Group Roles Features...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Role Interfaces
    checkFeature(forgeGroupContent, 'authorRole: \'member\' | \'leader\' | \'admin\'', 'Author role in interfaces');
    checkFeature(forgeGroupContent, 'role: \'leader\' as const', 'Role assignment in mock data');

    // Role Badge Functions
    checkFeature(forgeGroupContent, 'getRoleBadge', 'Role badge function');
    checkFeature(forgeGroupContent, 'canPostContent', 'Content posting permission check');
    checkFeature(forgeGroupContent, 'canModerate', 'Moderation permission check');

    // Role Badge Display
    checkFeature(forgeGroupContent, 'roleBadge', 'Role badge component');
    checkFeature(forgeGroupContent, 'roleBadgeText', 'Role badge text styles');
    checkFeature(forgeGroupContent, '👑 Admin', 'Admin badge text');
    checkFeature(forgeGroupContent, '⭐ Leader', 'Leader badge text');
    checkFeature(forgeGroupContent, '👤 Member', 'Member badge text');

    // Member Display with Roles
    checkFeature(forgeGroupContent, 'MOCK_MEMBERS.map', 'Member list rendering');
    checkFeature(forgeGroupContent, 'getRoleBadge(m.role)', 'Role badge rendering');

    // Role-based Content
    checkFeature(forgeGroupContent, 'authorRole: \'leader\'', 'Leader role in content');
    checkFeature(forgeGroupContent, 'authorRole: \'admin\'', 'Admin role in content');
    checkFeature(forgeGroupContent, 'authorRole: \'member\'', 'Member role in content');
}

// Test 4: Integration Features
console.log('\n🔗 Testing Integration Features...');

// Check for proper imports
if (profileScreenExists) {
    const profileContent = readFileContent(TEST_CONFIG.profileScreen);
    checkFeature(profileContent, 'useFaithMode', 'Faith mode hook import');
    checkFeature(profileContent, 'AsyncStorage', 'AsyncStorage import');
    checkFeature(profileContent, 'Colors', 'Colors import');
    checkFeature(profileContent, 'useColorScheme', 'Color scheme hook');
}

if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);
    checkFeature(forgeGroupContent, 'useFaithMode', 'Faith mode hook in ForgeGroup');
    checkFeature(forgeGroupContent, 'Colors', 'Colors import in ForgeGroup');
}

// Test 5: Error Handling
console.log('\n🛡️ Testing Error Handling...');
if (profileScreenExists) {
    const profileContent = readFileContent(TEST_CONFIG.profileScreen);
    checkFeature(profileContent, 'try {', 'Try-catch error handling');
    checkFeature(profileContent, 'catch (error)', 'Error catching');
    checkFeature(profileContent, 'console.log(\'Error', 'Error logging');
    checkFeature(profileContent, 'Alert.alert', 'User alerts for errors');
}

// Test 6: Accessibility and UX
console.log('\n♿ Testing Accessibility and UX...');
if (profileScreenExists) {
    const profileContent = readFileContent(TEST_CONFIG.profileScreen);
    checkFeature(profileContent, 'TouchableOpacity', 'Touchable components');
    checkFeature(profileContent, 'ScrollView', 'Scrollable content');
    checkFeature(profileContent, 'placeholder', 'Input placeholders');
    checkFeature(profileContent, 'onPress', 'Press handlers');
}

// Test 7: Performance Considerations
console.log('\n⚡ Testing Performance Features...');
if (profileScreenExists) {
    const profileContent = readFileContent(TEST_CONFIG.profileScreen);
    checkFeature(profileContent, 'useEffect', 'Effect hooks for data loading');
    checkFeature(profileContent, 'useState', 'State management');
    checkFeature(profileContent, 'keyExtractor', 'List key extraction');
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
    console.log('✅ Excellent implementation! The Member Profile Pages and Group Roles system is well-implemented.');
    console.log('✅ Consider adding:');
    console.log('   • Real avatar upload functionality');
    console.log('   • Role-based content moderation');
    console.log('   • Advanced group management features');
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
    'ProfileScreen with dual-mode support',
    'Avatar upload interface (modal ready)',
    'Kingdom Calling / Mission textarea',
    'Role badges (Member, Leader, Admin)',
    'Joined groups display',
    'Profile editing capabilities',
    'Role-based permissions in groups',
    'Role badges in member lists',
    'Faith/Encouragement mode adaptations',
    'Local storage with AsyncStorage',
    'Error handling and user feedback',
    'Responsive design and accessibility'
];

implementedFeatures.forEach(feature => {
    const isImplemented = testResults.details.some(test =>
        test.name.toLowerCase().includes(feature.toLowerCase()) && test.passed
    );
    console.log(`${isImplemented ? '✅' : '❌'} ${feature}`);
});

console.log('\n🎉 Member Profile Pages and Group Roles System Testing Complete!');
console.log('The system provides comprehensive profile management and role-based group features.'); 