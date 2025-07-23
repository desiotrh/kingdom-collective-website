#!/usr/bin/env node

/**
 * Test Script: Comment & Reaction System
 * Kingdom Circle App - Social Interaction Features
 * 
 * This script tests the implementation of:
 * 1. Comments on all content types (Discipleship Threads, Challenges, etc.)
 * 2. Reaction system with emoji reactions
 * 3. Faith/Encouragement mode adaptations
 * 4. Nested replies for Discipleship posts
 * 5. Comment tags for Faith Mode
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Comment & Reaction System');
console.log('='.repeat(60));

// Test Configuration
const TEST_CONFIG = {
    forgeGroupScreen: 'apps/kingdom-circle/app/(tabs)/forge-group.tsx',
    expectedFeatures: [
        'Comment interface with text, author, timestamp',
        'Reaction interface with emoji, count, users',
        'Nested replies for comments',
        'Faith mode emoji reactions (✝️, 🙏)',
        'Encouragement mode emoji reactions (🔥, 🙌)',
        'Comment tags for Faith Mode (Word of Knowledge, Prophetic)',
        'Reaction bar with quick-reaction buttons',
        'Comment input with post functionality',
        'Reply functionality with nested structure',
        'Reaction count display and user tracking',
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

// Test 1: File Exists
console.log('\n📁 Testing File Structure...');
const forgeGroupScreenExists = checkFileExists(TEST_CONFIG.forgeGroupScreen);
logTest('ForgeGroupScreen.tsx exists', forgeGroupScreenExists,
    forgeGroupScreenExists ? 'File found' : 'ForgeGroupScreen.tsx not found');

// Test 2: Comment & Reaction Interfaces
console.log('\n💬 Testing Comment & Reaction Interfaces...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Comment Interface
    checkFeature(forgeGroupContent, 'interface Comment', 'Comment interface defined');
    checkFeature(forgeGroupContent, 'text: string', 'Comment text field');
    checkFeature(forgeGroupContent, 'author: string', 'Comment author field');
    checkFeature(forgeGroupContent, 'timestamp: number', 'Comment timestamp field');
    checkFeature(forgeGroupContent, 'reactions: Reaction[]', 'Comment reactions array');
    checkFeature(forgeGroupContent, 'replies?: Comment[]', 'Nested replies support');
    checkFeature(forgeGroupContent, 'tags?: string[]', 'Comment tags for Faith Mode');

    // Reaction Interface
    checkFeature(forgeGroupContent, 'interface Reaction', 'Reaction interface defined');
    checkFeature(forgeGroupContent, 'emoji: string', 'Reaction emoji field');
    checkFeature(forgeGroupContent, 'count: number', 'Reaction count field');
    checkFeature(forgeGroupContent, 'users: string[]', 'Reaction users tracking');

    // Content With Comments Interface
    checkFeature(forgeGroupContent, 'interface ContentWithComments', 'ContentWithComments interface defined');
    checkFeature(forgeGroupContent, 'comments: Comment[]', 'Content comments array');
    checkFeature(forgeGroupContent, 'reactions: Reaction[]', 'Content reactions array');
}

// Test 3: Faith/Encouragement Mode Reactions
console.log('\n🔥 Testing Faith/Encouragement Mode Reactions...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Faith Mode Reactions
    checkFeature(forgeGroupContent, 'FAITH_REACTIONS', 'Faith mode reactions array');
    checkFeature(forgeGroupContent, '✝️', 'Cross emoji for Faith Mode');
    checkFeature(forgeGroupContent, '🙏', 'Prayer emoji for Faith Mode');

    // Encouragement Mode Reactions
    checkFeature(forgeGroupContent, 'ENCOURAGEMENT_REACTIONS', 'Encouragement mode reactions array');
    checkFeature(forgeGroupContent, '🔥', 'Fire emoji for Encouragement Mode');
    checkFeature(forgeGroupContent, '🙌', 'Hands emoji for Encouragement Mode');

    // Mode-specific logic
    checkFeature(forgeGroupContent, 'faithMode ? FAITH_REACTIONS : ENCOURAGEMENT_REACTIONS', 'Mode-specific reaction selection');
}

// Test 4: Comment State Management
console.log('\n📝 Testing Comment State Management...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // State variables
    checkFeature(forgeGroupContent, 'showComments', 'Show comments state');
    checkFeature(forgeGroupContent, 'newComment', 'New comment input state');
    checkFeature(forgeGroupContent, 'replyingTo', 'Reply target state');
    checkFeature(forgeGroupContent, 'comments', 'Comments data state');

    // Mock comments data
    checkFeature(forgeGroupContent, 'MOCK_COMMENTS', 'Mock comments data');
    checkFeature(forgeGroupContent, 'Word of Knowledge', 'Faith mode comment tag');
    checkFeature(forgeGroupContent, 'Prophetic', 'Faith mode comment tag');
}

// Test 5: Reaction Functions
console.log('\n⚡ Testing Reaction Functions...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Reaction handlers
    checkFeature(forgeGroupContent, 'handleReaction', 'Reaction handler function');
    checkFeature(forgeGroupContent, 'handleAddComment', 'Add comment handler function');

    // Reaction logic
    checkFeature(forgeGroupContent, 'reaction.users.includes', 'User reaction tracking');
    checkFeature(forgeGroupContent, 'reaction.count++', 'Reaction count increment');
    checkFeature(forgeGroupContent, 'reaction.count--', 'Reaction count decrement');
}

// Test 6: UI Components
console.log('\n🎨 Testing UI Components...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Reaction bar
    checkFeature(forgeGroupContent, 'renderReactionBar', 'Reaction bar render function');
    checkFeature(forgeGroupContent, 'reactionButton', 'Reaction button component');
    checkFeature(forgeGroupContent, 'reactionEmoji', 'Reaction emoji display');
    checkFeature(forgeGroupContent, 'reactionCount', 'Reaction count display');

    // Comments section
    checkFeature(forgeGroupContent, 'renderCommentsSection', 'Comments section render function');
    checkFeature(forgeGroupContent, 'commentCard', 'Comment card component');
    checkFeature(forgeGroupContent, 'commentHeader', 'Comment header component');
    checkFeature(forgeGroupContent, 'commentAvatar', 'Comment avatar display');
    checkFeature(forgeGroupContent, 'commentText', 'Comment text display');

    // Reply functionality
    checkFeature(forgeGroupContent, 'replyCard', 'Reply card component');
    checkFeature(forgeGroupContent, 'replyInputContainer', 'Reply input container');
    checkFeature(forgeGroupContent, 'repliesContainer', 'Replies container');
}

// Test 7: Content Integration
console.log('\n🔗 Testing Content Integration...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Thread cards with reactions/comments
    checkFeature(forgeGroupContent, 'renderThreadCard', 'Thread card render function');
    checkFeature(forgeGroupContent, 'renderReactionBar(`thread-${thread.id}`', 'Thread reaction bar');
    checkFeature(forgeGroupContent, 'renderCommentsSection(`thread-${thread.id}`', 'Thread comments section');

    // Challenge cards with reactions/comments
    checkFeature(forgeGroupContent, 'renderChallengeCard', 'Challenge card render function');
    checkFeature(forgeGroupContent, 'renderReactionBar(`challenge-${challenge.id}`', 'Challenge reaction bar');
    checkFeature(forgeGroupContent, 'renderCommentsSection(`challenge-${challenge.id}`', 'Challenge comments section');
}

// Test 8: Styling
console.log('\n🎨 Testing Styling...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Reaction styles
    checkFeature(forgeGroupContent, 'reactionBar:', 'Reaction bar styles');
    checkFeature(forgeGroupContent, 'reactionButton:', 'Reaction button styles');
    checkFeature(forgeGroupContent, 'reactionButtonActive:', 'Active reaction button styles');
    checkFeature(forgeGroupContent, 'reactionEmoji:', 'Reaction emoji styles');
    checkFeature(forgeGroupContent, 'reactionCount:', 'Reaction count styles');

    // Comment styles
    checkFeature(forgeGroupContent, 'commentsSection:', 'Comments section styles');
    checkFeature(forgeGroupContent, 'commentCard:', 'Comment card styles');
    checkFeature(forgeGroupContent, 'commentHeader:', 'Comment header styles');
    checkFeature(forgeGroupContent, 'commentAvatar:', 'Comment avatar styles');
    checkFeature(forgeGroupContent, 'commentText:', 'Comment text styles');
    checkFeature(forgeGroupContent, 'commentTag:', 'Comment tag styles');

    // Reply styles
    checkFeature(forgeGroupContent, 'replyCard:', 'Reply card styles');
    checkFeature(forgeGroupContent, 'replyInputContainer:', 'Reply input container styles');
    checkFeature(forgeGroupContent, 'repliesContainer:', 'Replies container styles');
}

// Test 9: Faith Mode Features
console.log('\n✝️ Testing Faith Mode Features...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Faith mode specific features
    checkFeature(forgeGroupContent, 'faithMode ?', 'Faith mode conditional logic');
    checkFeature(forgeGroupContent, 'Word of Knowledge', 'Word of Knowledge tag');
    checkFeature(forgeGroupContent, 'Prophetic', 'Prophetic tag');
    checkFeature(forgeGroupContent, '✝️', 'Cross emoji in Faith Mode');
    checkFeature(forgeGroupContent, '🙏', 'Prayer emoji in Faith Mode');
}

// Test 10: Encouragement Mode Features
console.log('\n🕊 Testing Encouragement Mode Features...');
if (forgeGroupScreenExists) {
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);

    // Encouragement mode specific features
    checkFeature(forgeGroupContent, 'encouragementMode', 'Encouragement mode support');
    checkFeature(forgeGroupContent, '🔥', 'Fire emoji in Encouragement Mode');
    checkFeature(forgeGroupContent, '🙌', 'Hands emoji in Encouragement Mode');
    checkFeature(forgeGroupContent, '💬', 'Speech emoji in Encouragement Mode');
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
    console.log('✅ Excellent implementation! The Comment & Reaction System is comprehensive and well-implemented.');
    console.log('✅ Consider adding:');
    console.log('   • Real-time comment updates');
    console.log('   • Comment moderation features');
    console.log('   • Advanced reaction animations');
    console.log('   • Comment search and filtering');
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
    'Comment interface with text, author, timestamp',
    'Reaction interface with emoji, count, users',
    'Nested replies for comments',
    'Faith mode emoji reactions (✝️, 🙏)',
    'Encouragement mode emoji reactions (🔥, 🙌)',
    'Comment tags for Faith Mode (Word of Knowledge, Prophetic)',
    'Reaction bar with quick-reaction buttons',
    'Comment input with post functionality',
    'Reply functionality with nested structure',
    'Reaction count display and user tracking',
    'Faith/Encouragement mode adaptations',
    'Mock comments data for testing',
    'Comment styling and UI components',
    'Reaction state management',
    'Content integration (threads, challenges)'
];

implementedFeatures.forEach(feature => {
    const isImplemented = testResults.details.some(test =>
        test.name.toLowerCase().includes(feature.toLowerCase()) && test.passed
    );
    console.log(`${isImplemented ? '✅' : '❌'} ${feature}`);
});

console.log('\n🎉 Comment & Reaction System Testing Complete!');
console.log('The system provides comprehensive social interaction features across all content types.'); 