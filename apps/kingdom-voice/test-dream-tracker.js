const AsyncStorage = require('@react-native-async-storage/async-storage');

// Test dream data
const testDreams = [
    {
        id: 'dream_1',
        title: 'Flying Over Mountains',
        description: 'I was soaring over snow-capped mountains, feeling completely free and peaceful. The air was crisp and clear, and I could see for miles in every direction.',
        mood: 'peaceful',
        symbols: 'Mountains, flying, freedom, clear sky',
        interpretation: 'This dream suggests a desire for freedom and spiritual elevation. The mountains represent challenges overcome.',
        holySpiritInterpretation: 'The Lord is calling you to rise above your circumstances and see things from His perspective.',
        tags: ['Dream', 'Encouragement'],
        date: new Date().toISOString(),
        isInterpreted: true,
        faithMode: true,
    },
    {
        id: 'dream_2',
        title: 'Family Gathering',
        description: 'I was at a large family gathering, everyone was happy and laughing. We were all sitting around a long table sharing stories.',
        mood: 'joyful',
        symbols: 'Family, table, stories, laughter',
        interpretation: 'This represents the importance of community and connection in your life.',
        tags: ['Dream', 'Family'],
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        isInterpreted: false,
        faithMode: false,
    },
    {
        id: 'dream_3',
        title: 'Ocean Waves',
        description: 'I was standing on a beach, watching powerful waves crash against the shore. The sound was both calming and overwhelming.',
        mood: 'confused',
        symbols: 'Ocean, waves, beach, sound',
        interpretation: 'The ocean represents your emotions. The waves suggest you\'re processing deep feelings.',
        tags: ['Dream', 'Warning'],
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        isInterpreted: true,
        faithMode: true,
    },
];

// Test functions
async function testSaveDreams() {
    try {
        await AsyncStorage.setItem('dreams', JSON.stringify(testDreams));
        console.log('✅ Test dreams saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving test dreams:', error);
        return false;
    }
}

async function testLoadDreams() {
    try {
        const dreamsData = await AsyncStorage.getItem('dreams');
        const dreams = dreamsData ? JSON.parse(dreamsData) : [];
        console.log('✅ Dreams loaded successfully:', dreams.length);
        return dreams;
    } catch (error) {
        console.error('❌ Error loading dreams:', error);
        return [];
    }
}

async function testAddNewDream() {
    try {
        const newDream = {
            id: 'test_dream_' + Date.now(),
            title: 'Test Dream Entry',
            description: 'This is a test dream to verify the dream tracking functionality.',
            mood: 'blessed',
            symbols: 'Test symbols, verification, functionality',
            interpretation: 'This dream represents the testing and verification of features.',
            tags: ['Dream', 'Test'],
            date: new Date().toISOString(),
            isInterpreted: false,
            faithMode: true,
        };

        const existingDreams = await AsyncStorage.getItem('dreams');
        const dreams = existingDreams ? JSON.parse(existingDreams) : [];
        dreams.unshift(newDream);
        await AsyncStorage.setItem('dreams', JSON.stringify(dreams));

        console.log('✅ New dream added successfully');
        return true;
    } catch (error) {
        console.error('❌ Error adding new dream:', error);
        return false;
    }
}

async function testToggleInterpretation() {
    try {
        const dreamsData = await AsyncStorage.getItem('dreams');
        const dreams = dreamsData ? JSON.parse(dreamsData) : [];

        if (dreams.length > 0) {
            const updatedDreams = dreams.map((dream, index) =>
                index === 0 ? { ...dream, isInterpreted: !dream.isInterpreted } : dream
            );

            await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
            console.log('✅ Dream interpretation toggled successfully');
            return true;
        } else {
            console.log('⚠️ No dreams to toggle interpretation');
            return false;
        }
    } catch (error) {
        console.error('❌ Error toggling interpretation:', error);
        return false;
    }
}

async function testDreamStats() {
    try {
        const dreamsData = await AsyncStorage.getItem('dreams');
        const dreams = dreamsData ? JSON.parse(dreamsData) : [];

        const stats = {
            total: dreams.length,
            interpreted: dreams.filter(d => d.isInterpreted).length,
            faithDreams: dreams.filter(d => d.faithMode).length,
            byMood: dreams.reduce((acc, dream) => {
                acc[dream.mood] = (acc[dream.mood] || 0) + 1;
                return acc;
            }, {}),
            byTags: dreams.reduce((acc, dream) => {
                dream.tags.forEach(tag => {
                    acc[tag] = (acc[tag] || 0) + 1;
                });
                return acc;
            }, {}),
        };

        console.log('📊 Dream Statistics:');
        console.log('- Total Dreams:', stats.total);
        console.log('- Interpreted:', stats.interpreted);
        console.log('- Faith Dreams:', stats.faithDreams);
        console.log('- Moods:', stats.byMood);
        console.log('- Tags:', stats.byTags);

        return stats;
    } catch (error) {
        console.error('❌ Error calculating dream stats:', error);
        return null;
    }
}

async function testDataStructure() {
    try {
        const dreamsData = await AsyncStorage.getItem('dreams');
        const dreams = dreamsData ? JSON.parse(dreamsData) : [];

        if (dreams.length > 0) {
            const dream = dreams[0];
            const requiredFields = [
                'id', 'title', 'description', 'mood', 'symbols',
                'tags', 'date', 'isInterpreted', 'faithMode'
            ];
            const optionalFields = ['interpretation', 'holySpiritInterpretation'];

            const hasAllRequired = requiredFields.every(field => dream.hasOwnProperty(field));
            const hasOptional = optionalFields.some(field => dream.hasOwnProperty(field));

            console.log('✅ Required fields present:', hasAllRequired);
            console.log('✅ Optional fields present:', hasOptional);

            return hasAllRequired;
        } else {
            console.log('⚠️ No dreams to verify structure');
            return false;
        }
    } catch (error) {
        console.error('❌ Error verifying data structure:', error);
        return false;
    }
}

async function runDreamTests() {
    console.log('🌙 Testing DreamTrackerScreen functionality...\n');

    // Test 1: Save test dreams
    console.log('Test 1: Saving test dreams...');
    await testSaveDreams();

    // Test 2: Load dreams
    console.log('\nTest 2: Loading dreams...');
    const dreams = await testLoadDreams();

    // Test 3: Add new dream
    console.log('\nTest 3: Adding new dream...');
    await testAddNewDream();

    // Test 4: Toggle interpretation
    console.log('\nTest 4: Toggling dream interpretation...');
    await testToggleInterpretation();

    // Test 5: Calculate stats
    console.log('\nTest 5: Calculating dream statistics...');
    await testDreamStats();

    // Test 6: Verify data structure
    console.log('\nTest 6: Verifying data structure...');
    await testDataStructure();

    console.log('\n🎉 All dream tracker tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runDreamTests().catch(console.error);
}

module.exports = {
    testSaveDreams,
    testLoadDreams,
    testAddNewDream,
    testToggleInterpretation,
    testDreamStats,
    testDataStructure,
    runDreamTests,
}; 