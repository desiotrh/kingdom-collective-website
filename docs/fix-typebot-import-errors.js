const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Typebot.io import errors...\n');

// Function to fix a single JSON file
function fixTypebotFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let json = JSON.parse(content);

        // Fix 1: Add graphCoordinates to start event
        if (json.events && json.events.length > 0) {
            const startEvent = json.events.find(event => event.type === 'start');
            if (startEvent && !startEvent.graphCoordinates) {
                startEvent.graphCoordinates = { "x": 0, "y": 0 };
                console.log(`✅ Added graphCoordinates to start event in ${path.basename(filePath)}`);
            }
        }

        // Fix 2: Change "options" to "choices" in choice input blocks
        let fixedCount = 0;
        if (json.groups) {
            json.groups.forEach(group => {
                if (group.blocks) {
                    group.blocks.forEach(block => {
                        if (block.type === 'choice input' && block.options) {
                            block.choices = block.options;
                            delete block.options;
                            fixedCount++;
                        }
                    });
                }
            });
        }

        if (fixedCount > 0) {
            console.log(`✅ Fixed ${fixedCount} "options" to "choices" in ${path.basename(filePath)}`);
        }

        // Write the fixed file
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`✅ Fixed: ${path.basename(filePath)}`);

    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
}

// Get all Typebot.io files
const botDirs = [
    'booking-bot',
    'lead-gen',
    'sales-assistant',
    'customer-support',
    'onboarding-bot',
    'faith-bot',
    'job-app-bot',
    'course-explainer',
    'testimonial-bot'
];

console.log('Fixing Typebot.io files...\n');

botDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.includes('-typebot.json')) {
                const filePath = path.join(dir, file);
                fixTypebotFile(filePath);
            }
        });
    }
});

console.log('\n🎉 All Typebot.io files fixed!');
console.log('\n📋 Changes made:');
console.log('1. ✅ Added graphCoordinates to start events');
console.log('2. ✅ Changed "options" to "choices" in choice input blocks');
console.log('\n🚀 Files are now ready for Typebot.io import!'); 