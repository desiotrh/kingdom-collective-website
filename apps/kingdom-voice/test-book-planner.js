const AsyncStorage = require('@react-native-async-storage/async-storage');

// Test book plan data
const testBookPlans = [
    {
        id: 'book_1',
        title: 'My Journey of Faith',
        description: 'A personal memoir about my spiritual journey and the lessons I\'ve learned along the way.',
        chapters: [
            {
                id: 'chapter_1',
                title: 'The Beginning',
                notes: 'How my faith journey started and what led me to this path.',
                linkedEntry: 'journal_entry_1',
                linkedDream: '',
                order: 0,
            },
            {
                id: 'chapter_2',
                title: 'First Steps',
                notes: 'The early challenges and victories in my walk with God.',
                linkedEntry: '',
                linkedDream: 'dream_1',
                order: 1,
            },
            {
                id: 'chapter_3',
                title: 'Breaking Through',
                notes: 'A major breakthrough moment that changed everything.',
                linkedEntry: 'journal_entry_2',
                linkedDream: '',
                order: 2,
            },
        ],
        faithMode: true,
        date: new Date().toISOString(),
    },
    {
        id: 'book_2',
        title: 'Lessons from the Valley',
        description: 'A collection of insights gained during difficult seasons of life.',
        chapters: [
            {
                id: 'chapter_4',
                title: 'The Valley Experience',
                notes: 'Understanding why we go through difficult times.',
                linkedEntry: 'journal_entry_3',
                linkedDream: '',
                order: 0,
            },
            {
                id: 'chapter_5',
                title: 'Finding Light',
                notes: 'How to see God\'s hand even in the darkest moments.',
                linkedEntry: '',
                linkedDream: 'dream_2',
                order: 1,
            },
        ],
        faithMode: true,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
];

// Test functions
async function testSaveBookPlans() {
    try {
        await AsyncStorage.setItem('book_plans', JSON.stringify(testBookPlans));
        console.log('✅ Test book plans saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving test book plans:', error);
        return false;
    }
}

async function testLoadBookPlans() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];
        console.log('✅ Book plans loaded successfully:', plans.length);
        return plans;
    } catch (error) {
        console.error('❌ Error loading book plans:', error);
        return [];
    }
}

async function testAddNewBookPlan() {
    try {
        const newBookPlan = {
            id: 'test_book_' + Date.now(),
            title: 'Test Book Plan',
            description: 'This is a test book plan to verify the book planner functionality.',
            chapters: [],
            faithMode: true,
            date: new Date().toISOString(),
        };

        const existingPlans = await AsyncStorage.getItem('book_plans');
        const plans = existingPlans ? JSON.parse(existingPlans) : [];
        plans.unshift(newBookPlan);
        await AsyncStorage.setItem('book_plans', JSON.stringify(plans));

        console.log('✅ New book plan added successfully');
        return true;
    } catch (error) {
        console.error('❌ Error adding new book plan:', error);
        return false;
    }
}

async function testAddChapter() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];

        if (plans.length > 0) {
            const bookPlan = plans[0];
            const newChapter = {
                id: 'test_chapter_' + Date.now(),
                title: 'Test Chapter',
                notes: 'This is a test chapter to verify chapter management.',
                linkedEntry: 'test_journal_entry',
                linkedDream: '',
                order: bookPlan.chapters.length,
            };

            const updatedBookPlan = {
                ...bookPlan,
                chapters: [...bookPlan.chapters, newChapter],
            };

            const updatedPlans = plans.map(plan =>
                plan.id === bookPlan.id ? updatedBookPlan : plan
            );

            await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
            console.log('✅ Chapter added successfully');
            return true;
        } else {
            console.log('⚠️ No book plans to add chapter to');
            return false;
        }
    } catch (error) {
        console.error('❌ Error adding chapter:', error);
        return false;
    }
}

async function testReorderChapters() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];

        if (plans.length > 0 && plans[0].chapters.length > 1) {
            const bookPlan = plans[0];
            const chapters = [...bookPlan.chapters];

            // Swap first and second chapters
            const temp = chapters[0];
            chapters[0] = chapters[1];
            chapters[1] = temp;

            // Update order numbers
            const reorderedChapters = chapters.map((chapter, index) => ({
                ...chapter,
                order: index,
            }));

            const updatedBookPlan = {
                ...bookPlan,
                chapters: reorderedChapters,
            };

            const updatedPlans = plans.map(plan =>
                plan.id === bookPlan.id ? updatedBookPlan : plan
            );

            await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
            console.log('✅ Chapters reordered successfully');
            return true;
        } else {
            console.log('⚠️ Not enough chapters to reorder');
            return false;
        }
    } catch (error) {
        console.error('❌ Error reordering chapters:', error);
        return false;
    }
}

async function testDeleteChapter() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];

        if (plans.length > 0 && plans[0].chapters.length > 0) {
            const bookPlan = plans[0];
            const updatedChapters = bookPlan.chapters
                .slice(1) // Remove first chapter
                .map((chapter, index) => ({
                    ...chapter,
                    order: index,
                }));

            const updatedBookPlan = {
                ...bookPlan,
                chapters: updatedChapters,
            };

            const updatedPlans = plans.map(plan =>
                plan.id === bookPlan.id ? updatedBookPlan : plan
            );

            await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
            console.log('✅ Chapter deleted successfully');
            return true;
        } else {
            console.log('⚠️ No chapters to delete');
            return false;
        }
    } catch (error) {
        console.error('❌ Error deleting chapter:', error);
        return false;
    }
}

async function testBookPlanStats() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];

        const stats = {
            totalBooks: plans.length,
            totalChapters: plans.reduce((sum, book) => sum + book.chapters.length, 0),
            faithBooks: plans.filter(book => book.faithMode).length,
            averageChapters: plans.length > 0 ?
                plans.reduce((sum, book) => sum + book.chapters.length, 0) / plans.length : 0,
            booksWithLinks: plans.filter(book =>
                book.chapters.some(chapter => chapter.linkedEntry || chapter.linkedDream)
            ).length,
        };

        console.log('📊 Book Plan Statistics:');
        console.log('- Total Books:', stats.totalBooks);
        console.log('- Total Chapters:', stats.totalChapters);
        console.log('- Faith Books:', stats.faithBooks);
        console.log('- Average Chapters per Book:', stats.averageChapters.toFixed(1));
        console.log('- Books with Linked Content:', stats.booksWithLinks);

        return stats;
    } catch (error) {
        console.error('❌ Error calculating book plan stats:', error);
        return null;
    }
}

async function testDataStructure() {
    try {
        const plansData = await AsyncStorage.getItem('book_plans');
        const plans = plansData ? JSON.parse(plansData) : [];

        if (plans.length > 0) {
            const bookPlan = plans[0];
            const requiredFields = [
                'id', 'title', 'description', 'chapters', 'faithMode', 'date'
            ];
            const chapterRequiredFields = [
                'id', 'title', 'notes', 'order'
            ];

            const hasAllRequired = requiredFields.every(field => bookPlan.hasOwnProperty(field));
            const hasValidChapters = bookPlan.chapters.length === 0 ||
                bookPlan.chapters.every(chapter =>
                    chapterRequiredFields.every(field => chapter.hasOwnProperty(field))
                );

            console.log('✅ Required fields present:', hasAllRequired);
            console.log('✅ Valid chapter structure:', hasValidChapters);

            return hasAllRequired && hasValidChapters;
        } else {
            console.log('⚠️ No book plans to verify structure');
            return false;
        }
    } catch (error) {
        console.error('❌ Error verifying data structure:', error);
        return false;
    }
}

async function runBookPlannerTests() {
    console.log('📚 Testing BookPlannerScreen functionality...\n');

    // Test 1: Save test book plans
    console.log('Test 1: Saving test book plans...');
    await testSaveBookPlans();

    // Test 2: Load book plans
    console.log('\nTest 2: Loading book plans...');
    const plans = await testLoadBookPlans();

    // Test 3: Add new book plan
    console.log('\nTest 3: Adding new book plan...');
    await testAddNewBookPlan();

    // Test 4: Add chapter
    console.log('\nTest 4: Adding chapter...');
    await testAddChapter();

    // Test 5: Reorder chapters
    console.log('\nTest 5: Reordering chapters...');
    await testReorderChapters();

    // Test 6: Delete chapter
    console.log('\nTest 6: Deleting chapter...');
    await testDeleteChapter();

    // Test 7: Calculate stats
    console.log('\nTest 7: Calculating book plan statistics...');
    await testBookPlanStats();

    // Test 8: Verify data structure
    console.log('\nTest 8: Verifying data structure...');
    await testDataStructure();

    console.log('\n🎉 All book planner tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runBookPlannerTests().catch(console.error);
}

module.exports = {
    testSaveBookPlans,
    testLoadBookPlans,
    testAddNewBookPlan,
    testAddChapter,
    testReorderChapters,
    testDeleteChapter,
    testBookPlanStats,
    testDataStructure,
    runBookPlannerTests,
}; 