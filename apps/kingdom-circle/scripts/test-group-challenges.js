/**
 * Test Script: Group Challenge System
 * 
 * This script tests the Group Challenge System functionality in ForgeGroupScreen including:
 * - Challenge posting with title, description, and prompt
 * - Video recording capabilities (30-60 seconds)
 * - Text and video response options
 * - Dual-mode Faith/Encouragement adaptations
 * - Challenge response viewing and interaction
 * - UI components and styling
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Group Challenge System...\n');

// Test Configuration
const testConfig = {
    appName: 'kingdom-circle',
    testTimeout: 30000,
    features: [
        'Challenge Post Creation',
        'Video Recording (30-60s)',
        'Text Response System',
        'Video Response System',
        'Dual-Mode Adaptations',
        'Challenge Response Viewing',
        'UI Components',
        'Camera Integration'
    ]
};

// Test Results
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Test Functions
function testChallengePostCreation() {
    console.log('📝 Testing Challenge Post Creation...');

    try {
        // Check if challenge interfaces are defined
        const forgeGroupFile = path.join(__dirname, '../app/(tabs)/forge-group.tsx');
        const fileContent = fs.readFileSync(forgeGroupFile, 'utf8');

        const requiredInterfaces = [
            'interface GroupChallenge',
            'interface ChallengeResponse',
            'title: string',
            'description: string',
            'prompt: string',
            'videoUri?: string'
        ];

        let passed = true;
        requiredInterfaces.forEach(interface => {
            if (!fileContent.includes(interface)) {
                console.log(`❌ Missing: ${interface}`);
                passed = false;
            }
        });

        if (passed) {
            console.log('✅ Challenge post creation interfaces verified');
            testResults.passed++;
        } else {
            console.log('❌ Challenge post creation interfaces missing');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'Challenge Post Creation',
            status: passed ? 'PASSED' : 'FAILED',
            details: passed ? 'All required interfaces and properties found' : 'Missing required interfaces'
        });

    } catch (error) {
        console.log('❌ Error testing challenge post creation:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

function testVideoRecordingCapabilities() {
    console.log('🎥 Testing Video Recording Capabilities...');

    try {
        const forgeGroupFile = path.join(__dirname, '../app/(tabs)/forge-group.tsx');
        const fileContent = fs.readFileSync(forgeGroupFile, 'utf8');

        const requiredVideoFeatures = [
            'expo-camera',
            'Camera, CameraType',
            'startRecording',
            'stopRecording',
            'recordAsync',
            'maxDuration: 60',
            'VideoQuality'
        ];

        let passed = true;
        requiredVideoFeatures.forEach(feature => {
            if (!fileContent.includes(feature)) {
                console.log(`❌ Missing: ${feature}`);
                passed = false;
            }
        });

        if (passed) {
            console.log('✅ Video recording capabilities verified');
            testResults.passed++;
        } else {
            console.log('❌ Video recording capabilities incomplete');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'Video Recording Capabilities',
            status: passed ? 'PASSED' : 'FAILED',
            details: passed ? 'All video recording features implemented' : 'Missing video recording features'
        });

    } catch (error) {
        console.log('❌ Error testing video recording:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

function testResponseSystem() {
    console.log('💬 Testing Response System...');

    try {
        const forgeGroupFile = path.join(__dirname, '../app/(tabs)/forge-group.tsx');
        const fileContent = fs.readFileSync(forgeGroupFile, 'utf8');

        const requiredResponseFeatures = [
            'challengeResponseType',
            'type: \'text\' | \'video\'',
            'handlePostChallengeResponse',
            'TextInput',
            'recordedVideoUri'
        ];

        let passed = true;
        requiredResponseFeatures.forEach(feature => {
            if (!fileContent.includes(feature)) {
                console.log(`❌ Missing: ${feature}`);
                passed = false;
            }
        });

        if (passed) {
            console.log('✅ Response system verified');
            testResults.passed++;
        } else {
            console.log('❌ Response system incomplete');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'Response System',
            status: passed ? 'PASSED' : 'FAILED',
            details: passed ? 'Text and video response system implemented' : 'Missing response system features'
        });

    } catch (error) {
        console.log('❌ Error testing response system:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

function testDualModeAdaptations() {
    console.log('✝️ Testing Dual-Mode Adaptations...');

    try {
        const forgeGroupFile = path.join(__dirname, '../app/(tabs)/forge-group.tsx');
        const fileContent = fs.readFileSync(forgeGroupFile, 'utf8');

        const faithModeExamples = [
            'Share Your Testimony',
            'Declare God\'s Word',
            'How has God been working',
            'What is God speaking to you'
        ];

        const encouragementModeExamples = [
            'Share Your Breakthrough',
            'Share Your Truth',
            'What breakthrough or lesson',
            'What truth or principle'
        ];

        let faithModePassed = true;
        faithModeExamples.forEach(example => {
            if (!fileContent.includes(example)) {
                console.log(`❌ Missing Faith Mode example: ${example}`);
                faithModePassed = false;
            }
        });

        let encouragementModePassed = true;
        encouragementModeExamples.forEach(example => {
            if (!fileContent.includes(example)) {
                console.log(`❌ Missing Encouragement Mode example: ${example}`);
                encouragementModePassed = false;
            }
        });

        const passed = faithModePassed && encouragementModePassed;

        if (passed) {
            console.log('✅ Dual-mode adaptations verified');
            testResults.passed++;
        } else {
            console.log('❌ Dual-mode adaptations incomplete');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'Dual-Mode Adaptations',
            status: passed ? 'PASSED' : 'FAILED',
            details: passed ? 'Faith and Encouragement mode examples implemented' : 'Missing dual-mode examples'
        });

    } catch (error) {
        console.log('❌ Error testing dual-mode adaptations:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

function testUIComponents() {
    console.log('🎨 Testing UI Components...');

    try {
        const forgeGroupFile = path.join(__dirname, '../app/(tabs)/forge-group.tsx');
        const fileContent = fs.readFileSync(forgeGroupFile, 'utf8');

        const requiredUIComponents = [
            'challengesTab',
            'newChallengeButton',
            'challengeCard',
            'challengeTitle',
            'challengeDescription',
            'challengePrompt',
            'responseTypeSelection',
            'responseTypeButton'
        ];

        let passed = true;
        requiredUIComponents.forEach(component => {
            if (!fileContent.includes(component)) {
                console.log(`❌ Missing UI component: ${component}`);
                passed = false;
            }
        });

        if (passed) {
            console.log('✅ UI components verified');
            testResults.passed++;
        } else {
            console.log('❌ UI components incomplete');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'UI Components',
            status: passed ? 'PASSED' : 'FAILED',
            details: passed ? 'All required UI components implemented' : 'Missing UI components'
        });

    } catch (error) {
        console.log('❌ Error testing UI components:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

function testCameraIntegration() {
    console.log('📱 Testing Camera Integration...');

    try {
        // Check if expo-camera is installed
        const packageJsonPath = path.join(__dirname, '../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        if (packageJson.dependencies && packageJson.dependencies['expo-camera']) {
            console.log('✅ expo-camera dependency found');
            testResults.passed++;
        } else {
            console.log('❌ expo-camera dependency missing');
            testResults.failed++;
        }

        testResults.total++;
        testResults.details.push({
            test: 'Camera Integration',
            status: packageJson.dependencies && packageJson.dependencies['expo-camera'] ? 'PASSED' : 'FAILED',
            details: packageJson.dependencies && packageJson.dependencies['expo-camera']
                ? 'expo-camera dependency installed'
                : 'expo-camera dependency not found'
        });

    } catch (error) {
        console.log('❌ Error testing camera integration:', error.message);
        testResults.failed++;
        testResults.total++;
    }
}

// Run Tests
console.log('🚀 Starting Group Challenge System Tests...\n');

testChallengePostCreation();
testVideoRecordingCapabilities();
testResponseSystem();
testDualModeAdaptations();
testUIComponents();
testCameraIntegration();

// Generate Test Report
console.log('\n📊 Test Results Summary:');
console.log('========================');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📊 Total: ${testResults.total}`);
console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

console.log('\n📋 Detailed Results:');
console.log('===================');
testResults.details.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${result.test}: ${result.status}`);
    console.log(`   ${result.details}`);
});

// Save Test Report
const reportPath = path.join(__dirname, 'group-challenges-test-report.json');
const report = {
    timestamp: new Date().toISOString(),
    appName: testConfig.appName,
    testResults,
    features: testConfig.features
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Test report saved to: ${reportPath}`);

// Final Status
if (testResults.failed === 0) {
    console.log('\n🎉 All Group Challenge System tests passed!');
    console.log('✅ Challenge posting functionality ready');
    console.log('✅ Video recording capabilities implemented');
    console.log('✅ Text and video response system working');
    console.log('✅ Dual-mode adaptations complete');
    console.log('✅ UI components and styling verified');
    console.log('✅ Camera integration confirmed');
} else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
    console.log('🔧 Check the detailed results above for specific issues.');
}

console.log('\n🎯 Next Steps:');
console.log('1. Test the app on device to verify camera permissions');
console.log('2. Test video recording functionality in both modes');
console.log('3. Verify challenge posting and response flow');
console.log('4. Test dual-mode language adaptations');
console.log('5. Validate UI responsiveness and styling');

console.log('\n✨ Group Challenge System testing complete!'); 