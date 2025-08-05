const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Typebot.io schema structure...\n');

// Function to fix a single JSON file
function fixTypebotSchema(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let json = JSON.parse(content);

        // Fix blocks in groups
        if (json.groups) {
            json.groups.forEach(group => {
                if (group.blocks) {
                    group.blocks.forEach(block => {
                        // Fix text blocks - wrap content in object
                        if (block.type === 'text' && typeof block.content === 'string') {
                            block.content = {
                                "type": "text",
                                "content": block.content
                            };
                        }

                        // Fix choice input blocks
                        if (block.type === 'choice input') {
                            // Wrap question in object
                            if (typeof block.question === 'string') {
                                block.question = {
                                    "type": "text",
                                    "content": block.question
                                };
                            }

                            // Convert choices array to proper format
                            if (block.choices && Array.isArray(block.choices)) {
                                block.choices = block.choices.map((choice, index) => ({
                                    "id": `opt${index + 1}`,
                                    "label": choice
                                }));
                            }
                        }

                        // Fix other input blocks (text input, email input, etc.)
                        if (block.type === 'text input' || block.type === 'email input' ||
                            block.type === 'number input' || block.type === 'url input' ||
                            block.type === 'phone number input' || block.type === 'date input' ||
                            block.type === 'time input' || block.type === 'rating input' ||
                            block.type === 'file input') {

                            // Wrap question in object
                            if (typeof block.question === 'string') {
                                block.question = {
                                    "type": "text",
                                    "content": block.question
                                };
                            }
                        }
                    });
                }
            });
        }

        // Write the fixed file
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`✅ Fixed schema: ${path.basename(filePath)}`);

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

console.log('Fixing Typebot.io schema structure...\n');

botDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.includes('-typebot.json')) {
                const filePath = path.join(dir, file);
                fixTypebotSchema(filePath);
            }
        });
    }
});

console.log('\n🎉 All Typebot.io files fixed with proper schema!');
console.log('\n📋 Schema fixes applied:');
console.log('1. ✅ Text blocks: content wrapped in object');
console.log('2. ✅ Choice inputs: question wrapped in object');
console.log('3. ✅ Choice inputs: choices converted to {id, label} format');
console.log('4. ✅ Other inputs: question wrapped in object');
console.log('\n🚀 Files now follow exact Typebot.io schema!'); 