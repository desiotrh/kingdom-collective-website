const AsyncStorage = require('@react-native-async-storage/async-storage');

// Test devotional data
const testDevotionals = [
    {
        id: 'devotional_1',
        title: 'Finding Peace in the Storm',
        scripture: 'Psalm 46:10 - "Be still and know that I am God."',
        body: 'In the midst of life\'s challenges, remember that God is always with you. His love is constant, His grace is sufficient, and His peace is available to all who seek Him.',
        prayer: 'Lord, help me to trust in Your plan and find peace in Your presence. Amen.',
        prompt: 'I was feeling overwhelmed with work and life responsibilities',
        faithMode: true,
        date: new Date().toISOString(),
    },
    {
        id: 'devotional_2',
        title: 'The Power of Gratitude',
        scripture: 'Philippians 4:6-7 - "Do not be anxious about anything, but present your requests to God with thanksgiving."',
        body: 'When we practice gratitude, we open our hearts to God\'s blessings. Every moment is an opportunity to see His hand at work in our lives.',
        prayer: 'Thank You, Lord, for Your unfailing love and the peace that comes from knowing You. Amen.',
        prompt: 'I want to focus on being more grateful in my daily life',
        faithMode: true,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
];

// Test functions
async function testSaveDevotional() {
    try {
        await AsyncStorage.setItem('saved_devotionals', JSON.stringify(testDevotionals));
        console.log('✅ Test devotionals saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving test devotionals:', error);
        return false;
    }
}

async function testLoadDevotionals() {
    try {
        const devotionalsData = await AsyncStorage.getItem('saved_devotionals');
        const devotionals = devotionalsData ? JSON.parse(devotionalsData) : [];
        console.log('✅ Devotionals loaded successfully:', devotionals.length);
        return devotionals;
    } catch (error) {
        console.error('❌ Error loading devotionals:', error);
        return [];
    }
}

async function testAddNewDevotional() {
    try {
        const newDevotional = {
            id: 'test_devotional_' + Date.now(),
            title: 'Test Devotional',
            scripture: 'John 3:16 - "For God so loved the world that he gave his one and only Son."',
            body: 'This is a test devotional to verify the devotional generator functionality.',
            prayer: 'Lord, thank You for this test devotional and the opportunity to grow in faith. Amen.',
            prompt: 'Testing the devotional generator features',
            faithMode: true,
            date: new Date().toISOString(),
        };

        const existingDevotionals = await AsyncStorage.getItem('saved_devotionals');
        const devotionals = existingDevotionals ? JSON.parse(existingDevotionals) : [];
        devotionals.unshift(newDevotional);
        await AsyncStorage.setItem('saved_devotionals', JSON.stringify(devotionals));

        console.log('✅ New devotional added successfully');
        return true;
    } catch (error) {
        console.error('❌ Error adding new devotional:', error);
        return false;
    }
}

async function testGenerateDevotional() {
    try {
        // Mock generation function
        const mockGenerate = async (prompt, scripture) => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

            return {
                id: Date.now().toString(),
                title: 'Generated Devotional',
                scripture: scripture || 'Psalm 23:1 - "The Lord is my shepherd, I shall not want."',
                body: `Based on your prompt: "${prompt}", here is a devotional about finding peace and strength in God.`,
                prayer: 'Lord, help me to find peace in Your presence and strength in Your word. Amen.',
                prompt: prompt,
                faithMode: true,
                date: new Date().toISOString(),
            };
        };

        const testPrompt = 'I was feeling anxious about my future';
        const testScripture = 'Jeremiah 29:11 - "For I know the plans I have for you, declares the Lord."';

        const generatedDevotional = await mockGenerate(testPrompt, testScripture);
        console.log('✅ Devotional generated successfully:', generatedDevotional.title);
        return generatedDevotional;
    } catch (error) {
        console.error('❌ Error generating devotional:', error);
        return null;
    }
}

async function testDevotionalStats() {
    try {
        const devotionalsData = await AsyncStorage.getItem('saved_devotionals');
        const devotionals = devotionalsData ? JSON.parse(devotionalsData) : [];

        const stats = {
            total: devotionals.length,
            faithMode: devotionals.filter(d => d.faithMode).length,
            withScripture: devotionals.filter(d => d.scripture).length,
            byPromptType: devotionals.reduce((acc, devotional) => {
                const type = devotional.prompt.includes('journal') ? 'journal' : 'theme';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {}),
        };

        console.log('📊 Devotional Statistics:');
        console.log('- Total Devotionals:', stats.total);
        console.log('- Faith Mode:', stats.faithMode);
        console.log('- With Scripture:', stats.withScripture);
        console.log('- By Prompt Type:', stats.byPromptType);

        return stats;
    } catch (error) {
        console.error('❌ Error calculating devotional stats:', error);
        return null;
    }
}

async function testDataStructure() {
    try {
        const devotionalsData = await AsyncStorage.getItem('saved_devotionals');
        const devotionals = devotionalsData ? JSON.parse(devotionalsData) : [];

        if (devotionals.length > 0) {
            const devotional = devotionals[0];
            const requiredFields = [
                'id', 'title', 'body', 'prayer', 'prompt', 'faithMode', 'date'
            ];
            const optionalFields = ['scripture'];

            const hasAllRequired = requiredFields.every(field => devotional.hasOwnProperty(field));
            const hasOptional = optionalFields.some(field => devotional.hasOwnProperty(field));

            console.log('✅ Required fields present:', hasAllRequired);
            console.log('✅ Optional fields present:', hasOptional);

            return hasAllRequired;
        } else {
            console.log('⚠️ No devotionals to verify structure');
            return false;
        }
    } catch (error) {
        console.error('❌ Error verifying data structure:', error);
        return false;
    }
}

async function runDevotionalTests() {
    console.log('✨ Testing DevotionalGeneratorScreen functionality...\n');

    // Test 1: Save test devotionals
    console.log('Test 1: Saving test devotionals...');
    await testSaveDevotional();

    // Test 2: Load devotionals
    console.log('\nTest 2: Loading devotionals...');
    const devotionals = await testLoadDevotionals();

    // Test 3: Generate new devotional
    console.log('\nTest 3: Generating new devotional...');
    const generatedDevotional = await testGenerateDevotional();

    // Test 4: Add new devotional
    console.log('\nTest 4: Adding new devotional...');
    await testAddNewDevotional();

    // Test 5: Calculate stats
    console.log('\nTest 5: Calculating devotional statistics...');
    await testDevotionalStats();

    // Test 6: Verify data structure
    console.log('\nTest 6: Verifying data structure...');
    await testDataStructure();

    console.log('\n🎉 All devotional generator tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runDevotionalTests().catch(console.error);
}

module.exports = {
    testSaveDevotional,
    testLoadDevotionals,
    testAddNewDevotional,
    testGenerateDevotional,
    testDevotionalStats,
    testDataStructure,
    runDevotionalTests,
}; 