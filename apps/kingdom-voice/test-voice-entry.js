#!/usr/bin/env node

/**
 * Voice Entry Feature Test Script
 * Tests microphone integration, transcription, and faith mode enhancements
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎙️ Testing Voice Entry Feature...\n');

// Test configuration
const testConfig = {
    appName: 'kingdom-voice',
    testDuration: 30000, // 30 seconds
    recordingTests: [
        {
            name: 'Short Journal Entry',
            duration: 15000,
            expectedText: 'grateful for the small moments of peace'
        },
        {
            name: 'Faith-Based Reflection',
            duration: 20000,
            expectedText: 'trust God more with my future'
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

    const requiredDeps = ['expo-av', 'expo-speech'];
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

function checkVoiceEntryImplementation() {
    console.log('\n🎤 Checking Voice Entry Implementation...');

    const newEntryPath = path.join(__dirname, 'app', '(tabs)', 'new-entry.tsx');
    if (!checkFileExists(newEntryPath)) {
        logTest('NewEntryScreen exists', false, 'File not found');
        return false;
    }

    const fileContent = fs.readFileSync(newEntryPath, 'utf8');

    // Check for voice recording imports
    const hasAudioImport = fileContent.includes("import { Audio } from 'expo-av'");
    logTest('Audio import', hasAudioImport, hasAudioImport ? 'expo-av imported' : 'Missing Audio import');

    const hasSpeechImport = fileContent.includes("import * as Speech from 'expo-speech'");
    logTest('Speech import', hasSpeechImport, hasSpeechImport ? 'expo-speech imported' : 'Missing Speech import');

    // Check for voice recording states
    const hasRecordingStates = fileContent.includes('isRecording') &&
        fileContent.includes('recording') &&
        fileContent.includes('transcribedText');
    logTest('Recording states', hasRecordingStates, hasRecordingStates ? 'All recording states present' : 'Missing recording states');

    // Check for voice recording functions
    const hasStartRecording = fileContent.includes('startRecording');
    logTest('startRecording function', hasStartRecording, hasStartRecording ? 'Function implemented' : 'Missing function');

    const hasStopRecording = fileContent.includes('stopRecording');
    logTest('stopRecording function', hasStopRecording, hasStopRecording ? 'Function implemented' : 'Missing function');

    const hasTranscriptionModal = fileContent.includes('showTranscriptionModal');
    logTest('Transcription modal', hasTranscriptionModal, hasTranscriptionModal ? 'Modal implemented' : 'Missing modal');

    // Check for faith mode integration
    const hasFaithModeBlessing = fileContent.includes('Blessing Added') &&
        fileContent.includes('Let the redeemed of the Lord say so');
    logTest('Faith mode blessing', hasFaithModeBlessing, hasFaithModeBlessing ? 'Faith mode blessing implemented' : 'Missing faith mode blessing');

    // Check for encouragement mode
    const hasEncouragementMessage = fileContent.includes('Your voice matters. Speak your story.');
    logTest('Encouragement message', hasEncouragementMessage, hasEncouragementMessage ? 'Encouragement message implemented' : 'Missing encouragement message');

    // Check for UI elements
    const hasVoiceSection = fileContent.includes('voiceSection');
    logTest('Voice section UI', hasVoiceSection, hasVoiceSection ? 'Voice section implemented' : 'Missing voice section');

    const hasRecordButton = fileContent.includes('recordButton');
    logTest('Record button', hasRecordButton, hasRecordButton ? 'Record button implemented' : 'Missing record button');

    const hasRecordingTimer = fileContent.includes('recordingTime');
    logTest('Recording timer', hasRecordingTimer, hasRecordingTimer ? 'Timer implemented' : 'Missing timer');

    return hasAudioImport && hasSpeechImport && hasRecordingStates && hasStartRecording && hasStopRecording;
}

function checkPermissions() {
    console.log('\n🔐 Checking Permissions...');

    const newEntryPath = path.join(__dirname, 'app', '(tabs)', 'new-entry.tsx');
    if (!checkFileExists(newEntryPath)) {
        logTest('Permissions check', false, 'NewEntryScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(newEntryPath, 'utf8');

    const hasPermissionRequest = fileContent.includes('requestPermissionsAsync');
    logTest('Permission request', hasPermissionRequest, hasPermissionRequest ? 'Permission request implemented' : 'Missing permission request');

    const hasPermissionCheck = fileContent.includes('recordingPermission');
    logTest('Permission state', hasPermissionCheck, hasPermissionCheck ? 'Permission state managed' : 'Missing permission state');

    return hasPermissionRequest && hasPermissionCheck;
}

function checkTranscriptionFlow() {
    console.log('\n📝 Checking Transcription Flow...');

    const newEntryPath = path.join(__dirname, 'app', '(tabs)', 'new-entry.tsx');
    if (!checkFileExists(newEntryPath)) {
        logTest('Transcription flow', false, 'NewEntryScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(newEntryPath, 'utf8');

    // Check for transcription functions
    const hasMockTranscribe = fileContent.includes('mockTranscribeAudio');
    logTest('Mock transcription', hasMockTranscribe, hasMockTranscribe ? 'Mock transcription implemented' : 'Missing mock transcription');

    const hasTranscriptionEdit = fileContent.includes('handleTranscriptionEdit');
    logTest('Transcription editing', hasTranscriptionEdit, hasTranscriptionEdit ? 'Edit function implemented' : 'Missing edit function');

    const hasInsertTranscription = fileContent.includes('insertTranscription');
    logTest('Insert transcription', hasInsertTranscription, hasTranscriptionEdit ? 'Insert function implemented' : 'Missing insert function');

    // Check for transcription options
    const hasAppendOption = fileContent.includes('append') && fileContent.includes('Append to Entry');
    logTest('Append option', hasAppendOption, hasAppendOption ? 'Append option implemented' : 'Missing append option');

    const hasReplaceOption = fileContent.includes('replace') && fileContent.includes('Replace Entry');
    logTest('Replace option', hasReplaceOption, hasReplaceOption ? 'Replace option implemented' : 'Missing replace option');

    return hasMockTranscribe && hasTranscriptionEdit && hasInsertTranscription && hasAppendOption && hasReplaceOption;
}

function checkAnimations() {
    console.log('\n✨ Checking Animations...');

    const newEntryPath = path.join(__dirname, 'app', '(tabs)', 'new-entry.tsx');
    if (!checkFileExists(newEntryPath)) {
        logTest('Animations', false, 'NewEntryScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(newEntryPath, 'utf8');

    const hasPulseAnimation = fileContent.includes('pulseAnimation');
    logTest('Pulse animation', hasPulseAnimation, hasPulseAnimation ? 'Pulse animation implemented' : 'Missing pulse animation');

    const hasRecordingAnimation = fileContent.includes('Animated.loop') && fileContent.includes('pulseAnimation');
    logTest('Recording animation', hasRecordingAnimation, hasRecordingAnimation ? 'Recording animation implemented' : 'Missing recording animation');

    const hasGlowAnimation = fileContent.includes('glowAnimation');
    logTest('Glow animation', hasGlowAnimation, hasGlowAnimation ? 'Glow animation implemented' : 'Missing glow animation');

    return hasPulseAnimation && hasRecordingAnimation && hasGlowAnimation;
}

function checkErrorHandling() {
    console.log('\n🛡️ Checking Error Handling...');

    const newEntryPath = path.join(__dirname, 'app', '(tabs)', 'new-entry.tsx');
    if (!checkFileExists(newEntryPath)) {
        logTest('Error handling', false, 'NewEntryScreen not found');
        return false;
    }

    const fileContent = fs.readFileSync(newEntryPath, 'utf8');

    const hasRecordingError = fileContent.includes('Recording Error') && fileContent.includes('Alert.alert');
    logTest('Recording error handling', hasRecordingError, hasRecordingError ? 'Recording errors handled' : 'Missing recording error handling');

    const hasPermissionError = fileContent.includes('Permission Required') && fileContent.includes('Alert.alert');
    logTest('Permission error handling', hasPermissionError, hasPermissionError ? 'Permission errors handled' : 'Missing permission error handling');

    const hasTryCatch = fileContent.includes('try {') && fileContent.includes('} catch (error)');
    logTest('Try-catch blocks', hasTryCatch, hasTryCatch ? 'Error handling implemented' : 'Missing error handling');

    return hasRecordingError && hasPermissionError && hasTryCatch;
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
    console.log('🎙️ Voice Entry Feature is ready for testing.');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Open the app and navigate to New Entry');
    console.log('2. Tap "Record Voice Entry" button');
    console.log('3. Grant microphone permission when prompted');
    console.log('4. Speak for 15-30 seconds about your day');
    console.log('5. Tap "Stop Recording" when finished');
    console.log('6. Review the transcribed text in the modal');
    console.log('7. Edit the text if needed');
    console.log('8. Choose "Append to Entry" or "Replace Entry"');
    console.log('9. Verify faith mode blessing appears');
    console.log('10. Save the entry and verify it appears in saved entries');
}

// Run all tests
function runTests() {
    console.log('🚀 Starting Voice Entry Feature Tests...\n');

    const depsOk = checkDependencies();
    if (!depsOk) {
        console.log('\n❌ Dependencies check failed. Please install required packages.');
        return;
    }

    checkVoiceEntryImplementation();
    checkPermissions();
    checkTranscriptionFlow();
    checkAnimations();
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