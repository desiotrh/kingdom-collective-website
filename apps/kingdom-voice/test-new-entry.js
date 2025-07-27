const AsyncStorage = require('@react-native-async-storage/async-storage');

// Test data structure
const testEntry = {
    id: 'test_123',
    title: 'Test Journal Entry',
    content: 'This is a test entry to verify the journal functionality.',
    mood: 'happy',
    tags: ['Identity', 'Growth'],
    date: new Date().toISOString(),
    faithMode: true,
    verse: 'Psalm 46:10 - Be still and know that I am God.',
    isDraft: false,
};

// Test functions
async function testSaveEntry() {
    try {
        const entriesKey = 'journal_entries';
        const existingEntries = await AsyncStorage.getItem(entriesKey);
        const entries = existingEntries ? JSON.parse(existingEntries) : [];
        entries.unshift(testEntry);
        await AsyncStorage.setItem(entriesKey, JSON.stringify(entries));
        console.log('✅ Entry saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving entry:', error);
        return false;
    }
}

async function testLoadEntries() {
    try {
        const entriesKey = 'journal_entries';
        const entries = await AsyncStorage.getItem(entriesKey);
        const parsedEntries = entries ? JSON.parse(entries) : [];
        console.log('✅ Entries loaded successfully:', parsedEntries.length);
        return parsedEntries;
    } catch (error) {
        console.error('❌ Error loading entries:', error);
        return [];
    }
}

async function testSaveDraft() {
    try {
        const draftKey = 'journal_draft';
        const draftData = {
            ...testEntry,
            isDraft: true,
        };
        await AsyncStorage.setItem(draftKey, JSON.stringify(draftData));
        console.log('✅ Draft saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving draft:', error);
        return false;
    }
}

async function testLoadDraft() {
    try {
        const draftKey = 'journal_draft';
        const draft = await AsyncStorage.getItem(draftKey);
        const parsedDraft = draft ? JSON.parse(draft) : null;
        console.log('✅ Draft loaded successfully:', parsedDraft ? 'Yes' : 'No');
        return parsedDraft;
    } catch (error) {
        console.error('❌ Error loading draft:', error);
        return null;
    }
}

async function runTests() {
    console.log('🧪 Testing NewEntryScreen functionality...\n');

    // Test 1: Save entry
    console.log('Test 1: Saving entry...');
    await testSaveEntry();

    // Test 2: Load entries
    console.log('\nTest 2: Loading entries...');
    const entries = await testLoadEntries();

    // Test 3: Save draft
    console.log('\nTest 3: Saving draft...');
    await testSaveDraft();

    // Test 4: Load draft
    console.log('\nTest 4: Loading draft...');
    const draft = await testLoadDraft();

    // Test 5: Verify data structure
    console.log('\nTest 5: Verifying data structure...');
    if (entries.length > 0) {
        const entry = entries[0];
        const requiredFields = ['id', 'title', 'content', 'mood', 'tags', 'date', 'faithMode', 'isDraft'];
        const hasAllFields = requiredFields.every(field => entry.hasOwnProperty(field));
        console.log(hasAllFields ? '✅ All required fields present' : '❌ Missing required fields');
    }

    console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testSaveEntry,
    testLoadEntries,
    testSaveDraft,
    testLoadDraft,
    runTests,
}; 