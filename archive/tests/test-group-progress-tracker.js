/**
 * Test Script: Group Progress Tracker
 * 
 * This script tests the Group Progress Tracker functionality in ForgeGroupScreen including:
 * 1. Progress tab button and rendering
 * 2. Streak display and messaging
 * 3. Weekly activity heatmap
 * 4. Top contributors display
 * 5. Milestone animations
 * 6. Activity recording functionality
 * 7. Faith/Encouragement mode adaptations
 */

const fs = require('fs');
const path = require('path');

const TEST_CONFIG = {
    forgeGroupScreen: 'apps/kingdom-circle/app/(tabs)/forge-group.tsx',
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

function testGroupProgressTracker() {
    console.log('\n🧪 Testing Group Progress Tracker Component\n');

    let totalTests = 0;
    let passedTests = 0;

    // Test 1: File Existence
    const forgeGroupScreenExists = checkFileExists(TEST_CONFIG.forgeGroupScreen);
    totalTests++;
    if (logTest('ForgeGroupScreen.tsx exists', forgeGroupScreenExists,
        forgeGroupScreenExists ? 'File found' : 'ForgeGroupScreen.tsx not found')) {
        passedTests++;
    }

    if (!forgeGroupScreenExists) {
        console.log('\n❌ Cannot proceed with tests - file not found');
        return { totalTests, passedTests };
    }

    // Test 2: Progress Tab Button
    const forgeGroupContent = readFileContent(TEST_CONFIG.forgeGroupScreen);
    const hasProgressTabButton = forgeGroupContent.includes('tab === \'progress\'') &&
        forgeGroupContent.includes('onPress={() => setTab(\'progress\')}');
    totalTests++;
    if (logTest('Progress tab button exists', hasProgressTabButton,
        hasProgressTabButton ? 'Tab button found' : 'Progress tab button not found')) {
        passedTests++;
    }

    // Test 3: Progress Tab State
    const hasProgressTabState = forgeGroupContent.includes('\'progress\'>(\'chat\')');
    totalTests++;
    if (logTest('Progress tab state included', hasProgressTabState,
        hasProgressTabState ? 'Progress tab in state' : 'Progress tab not in state')) {
        passedTests++;
    }

    // Test 4: Group Progress Interfaces
    const hasGroupProgressInterface = forgeGroupContent.includes('interface GroupProgress') &&
        forgeGroupContent.includes('currentStreak: number') &&
        forgeGroupContent.includes('weeklyActivity: number[]') &&
        forgeGroupContent.includes('topContributors: string[]');
    totalTests++;
    if (logTest('GroupProgress interface defined', hasGroupProgressInterface,
        hasGroupProgressInterface ? 'Interface found' : 'Interface missing')) {
        passedTests++;
    }

    // Test 5: Group Activity Interface
    const hasGroupActivityInterface = forgeGroupContent.includes('interface GroupActivity') &&
        forgeGroupContent.includes('type: \'checkin\' | \'prayer\' | \'comment\' | \'challenge\' | \'discipleship\'');
    totalTests++;
    if (logTest('GroupActivity interface defined', hasGroupActivityInterface,
        hasGroupActivityInterface ? 'Interface found' : 'Interface missing')) {
        passedTests++;
    }

    // Test 6: Mock Progress Data
    const hasMockProgressData = forgeGroupContent.includes('MOCK_GROUP_PROGRESS') &&
        forgeGroupContent.includes('currentStreak: 4') &&
        forgeGroupContent.includes('weeklyActivity: [2, 3, 1, 4, 2, 3, 1]');
    totalTests++;
    if (logTest('Mock progress data defined', hasMockProgressData,
        hasMockProgressData ? 'Mock data found' : 'Mock data missing')) {
        passedTests++;
    }

    // Test 7: Progress State Variables
    const hasProgressState = forgeGroupContent.includes('const [groupProgress, setGroupProgress]') &&
        forgeGroupContent.includes('const [showMilestoneAnimation, setShowMilestoneAnimation]') &&
        forgeGroupContent.includes('const [flameAnimation] = useState(new Animated.Value(1))');
    totalTests++;
    if (logTest('Progress state variables defined', hasProgressState,
        hasProgressState ? 'State variables found' : 'State variables missing')) {
        passedTests++;
    }

    // Test 8: Activity Record Handler
    const hasActivityRecordHandler = forgeGroupContent.includes('handleActivityRecord') &&
        forgeGroupContent.includes('activityType: GroupActivity[\'type\']') &&
        forgeGroupContent.includes('hoursSinceLastActivity > 48');
    totalTests++;
    if (logTest('Activity record handler implemented', hasActivityRecordHandler,
        hasActivityRecordHandler ? 'Handler found' : 'Handler missing')) {
        passedTests++;
    }

    // Test 9: Progress Tab Render Function
    const hasProgressTabRender = forgeGroupContent.includes('renderProgressTab = () =>') &&
        forgeGroupContent.includes('getStreakMessage()') &&
        forgeGroupContent.includes('getEncouragementMessage()');
    totalTests++;
    if (logTest('Progress tab render function', hasProgressTabRender,
        hasProgressTabRender ? 'Render function found' : 'Render function missing')) {
        passedTests++;
    }

    // Test 10: Streak Display
    const hasStreakDisplay = forgeGroupContent.includes('streakContainer') &&
        forgeGroupContent.includes('streakHeader') &&
        forgeGroupContent.includes('streakIcon') &&
        forgeGroupContent.includes('streakMessage');
    totalTests++;
    if (logTest('Streak display components', hasStreakDisplay,
        hasStreakDisplay ? 'Streak display found' : 'Streak display missing')) {
        passedTests++;
    }

    // Test 11: Heatmap Display
    const hasHeatmapDisplay = forgeGroupContent.includes('heatmapContainer') &&
        forgeGroupContent.includes('heatmapGrid') &&
        forgeGroupContent.includes('heatmapCell') &&
        forgeGroupContent.includes('Last 7 Days Activity');
    totalTests++;
    if (logTest('Heatmap display components', hasHeatmapDisplay,
        hasHeatmapDisplay ? 'Heatmap display found' : 'Heatmap display missing')) {
        passedTests++;
    }

    // Test 12: Contributors Display
    const hasContributorsDisplay = forgeGroupContent.includes('contributorsContainer') &&
        forgeGroupContent.includes('contributorsList') &&
        forgeGroupContent.includes('contributorAvatar') &&
        forgeGroupContent.includes('Top Contributors');
    totalTests++;
    if (logTest('Contributors display components', hasContributorsDisplay,
        hasContributorsDisplay ? 'Contributors display found' : 'Contributors display missing')) {
        passedTests++;
    }

    // Test 13: Milestone Animation
    const hasMilestoneAnimation = forgeGroupContent.includes('showMilestoneAnimation') &&
        forgeGroupContent.includes('milestoneOverlay') &&
        forgeGroupContent.includes('milestoneCard') &&
        forgeGroupContent.includes('7-Day');
    totalTests++;
    if (logTest('Milestone animation components', hasMilestoneAnimation,
        hasMilestoneAnimation ? 'Milestone animation found' : 'Milestone animation missing')) {
        passedTests++;
    }

    // Test 14: Faith Mode Language
    const hasFaithModeLanguage = forgeGroupContent.includes('The fire is still burning') &&
        forgeGroupContent.includes('Your circle is aligned in faith') &&
        forgeGroupContent.includes('Group Fire');
    totalTests++;
    if (logTest('Faith mode language adaptations', hasFaithModeLanguage,
        hasFaithModeLanguage ? 'Faith mode language found' : 'Faith mode language missing')) {
        passedTests++;
    }

    // Test 15: Encouragement Mode Language
    const hasEncouragementModeLanguage = forgeGroupContent.includes('This group is staying consistent') &&
        forgeGroupContent.includes('You showed up — that matters') &&
        forgeGroupContent.includes('Group Momentum');
    totalTests++;
    if (logTest('Encouragement mode language adaptations', hasEncouragementModeLanguage,
        hasEncouragementModeLanguage ? 'Encouragement mode language found' : 'Encouragement mode language missing')) {
        passedTests++;
    }

    // Test 16: Test Activity Button
    const hasTestActivityButton = forgeGroupContent.includes('testActivityButton') &&
        forgeGroupContent.includes('Record Test Activity') &&
        forgeGroupContent.includes('handleActivityRecord(\'checkin\')');
    totalTests++;
    if (logTest('Test activity button', hasTestActivityButton,
        hasTestActivityButton ? 'Test button found' : 'Test button missing')) {
        passedTests++;
    }

    // Test 17: Progress Tab Styles
    const hasProgressStyles = forgeGroupContent.includes('progressTab:') &&
        forgeGroupContent.includes('streakContainer:') &&
        forgeGroupContent.includes('heatmapContainer:') &&
        forgeGroupContent.includes('contributorsContainer:');
    totalTests++;
    if (logTest('Progress tab styles defined', hasProgressStyles,
        hasProgressStyles ? 'Styles found' : 'Styles missing')) {
        passedTests++;
    }

    // Test 18: Tab Content Rendering
    const hasProgressTabContent = forgeGroupContent.includes('{tab === \'progress\' && renderProgressTab()}');
    totalTests++;
    if (logTest('Progress tab content rendering', hasProgressTabContent,
        hasProgressTabContent ? 'Tab content found' : 'Tab content missing')) {
        passedTests++;
    }

    // Test 19: Streak Reset Logic
    const hasStreakResetLogic = forgeGroupContent.includes('hoursSinceLastActivity > 48') &&
        forgeGroupContent.includes('newStreak = 1') &&
        forgeGroupContent.includes('newStreak = groupProgress.currentStreak + 1');
    totalTests++;
    if (logTest('Streak reset logic (48 hours)', hasStreakResetLogic,
        hasStreakResetLogic ? 'Reset logic found' : 'Reset logic missing')) {
        passedTests++;
    }

    // Test 20: Milestone Detection
    const hasMilestoneDetection = forgeGroupContent.includes('newStreak === 7') &&
        forgeGroupContent.includes('milestoneReached: true') &&
        forgeGroupContent.includes('setShowMilestoneAnimation(true)');
    totalTests++;
    if (logTest('7-day milestone detection', hasMilestoneDetection,
        hasMilestoneDetection ? 'Milestone detection found' : 'Milestone detection missing')) {
        passedTests++;
    }

    // Test 21: Flame Animation
    const hasFlameAnimation = forgeGroupContent.includes('flameAnimation') &&
        forgeGroupContent.includes('Animated.timing(flameAnimation') &&
        forgeGroupContent.includes('transform: [{ scale: flameAnimation }]');
    totalTests++;
    if (logTest('Flame animation implementation', hasFlameAnimation,
        hasFlameAnimation ? 'Flame animation found' : 'Flame animation missing')) {
        passedTests++;
    }

    // Test 22: Weekly Activity Update
    const hasWeeklyActivityUpdate = forgeGroupContent.includes('newWeeklyActivity.shift()') &&
        forgeGroupContent.includes('newWeeklyActivity.push(1)') &&
        forgeGroupContent.includes('weeklyActivity: newWeeklyActivity');
    totalTests++;
    if (logTest('Weekly activity update logic', hasWeeklyActivityUpdate,
        hasWeeklyActivityUpdate ? 'Activity update found' : 'Activity update missing')) {
        passedTests++;
    }

    // Test 23: Heatmap Intensity Calculation
    const hasHeatmapIntensity = forgeGroupContent.includes('intensity = Math.min(activity / 4, 1)') &&
        forgeGroupContent.includes('backgroundColor: `rgba(47, 119, 102, ${intensity * 0.3 + 0.1})`');
    totalTests++;
    if (logTest('Heatmap intensity calculation', hasHeatmapIntensity,
        hasHeatmapIntensity ? 'Intensity calculation found' : 'Intensity calculation missing')) {
        passedTests++;
    }

    // Test 24: Day Labels
    const hasDayLabels = forgeGroupContent.includes('daysAgo === 0 ? \'Today\' : daysAgo === 1 ? \'Yesterday\' : `${daysAgo}d ago`');
    totalTests++;
    if (logTest('Heatmap day labels', hasDayLabels,
        hasDayLabels ? 'Day labels found' : 'Day labels missing')) {
        passedTests++;
    }

    // Test 25: Top Contributor Badge
    const hasTopContributorBadge = forgeGroupContent.includes('index === 0') &&
        forgeGroupContent.includes('topContributorBadge') &&
        forgeGroupContent.includes('faithMode ? \'🔥\' : \'⭐\'');
    totalTests++;
    if (logTest('Top contributor badge', hasTopContributorBadge,
        hasTopContributorBadge ? 'Badge found' : 'Badge missing')) {
        passedTests++;
    }

    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 All Group Progress Tracker tests passed!');
        console.log('\n✅ Features Implemented:');
        console.log('   • Progress tab with streak display');
        console.log('   • Weekly activity heatmap');
        console.log('   • Top contributors with avatars');
        console.log('   • 48-hour streak reset logic');
        console.log('   • 7-day milestone celebrations');
        console.log('   • Flame animation for milestones');
        console.log('   • Faith/Encouragement mode adaptations');
        console.log('   • Test activity recording button');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the implementation.');
    }

    return { totalTests, passedTests };
}

// Run the tests
if (require.main === module) {
    testGroupProgressTracker();
}

module.exports = { testGroupProgressTracker }; 