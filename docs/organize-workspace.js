const fs = require('fs');
const path = require('path');

console.log('🧹 Organizing workspace...\n');

// Move Typebot.io files to their respective directories
const fileMoves = [
    { from: 'lead-gen-bot-typebot.json', to: 'lead-gen/lead-gen-typebot.json' },
    { from: 'booking-bot-typebot.json', to: 'booking-bot/booking-bot-typebot.json' },
    { from: 'sales-assistant-bot-typebot.json', to: 'sales-assistant/sales-assistant-typebot.json' },
    { from: 'customer-support-bot-typebot.json', to: 'customer-support/support-bot-typebot.json' },
    { from: 'onboarding-bot-typebot.json', to: 'onboarding-bot/onboarding-bot-typebot.json' },
    { from: 'faith-bot-typebot.json', to: 'faith-bot/faith-bot-typebot.json' },
    { from: 'job-app-bot-typebot.json', to: 'job-app-bot/job-app-bot-typebot.json' },
    { from: 'course-explainer-bot-typebot.json', to: 'course-explainer/course-explainer-typebot.json' },
    { from: 'testimonial-bot-typebot.json', to: 'testimonial-bot/testimonial-bot-typebot.json' }
];

// Move files to their directories
fileMoves.forEach(move => {
    if (fs.existsSync(move.from)) {
        // Ensure directory exists
        const dir = path.dirname(move.to);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.renameSync(move.from, move.to);
        console.log(`✅ Moved: ${move.from} → ${move.to}`);
    }
});

// Files to keep in root (essential only)
const filesToKeep = [
    'template.json',
    'generate-all-bots.js',
    'organize-workspace.js',
    'TYPEBOT_READY_FILES.md'
];

// Clean up root directory
console.log('\nCleaning root directory...');
const rootFiles = fs.readdirSync('.');
rootFiles.forEach(file => {
    if (file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.md')) {
        if (filesToKeep.includes(file)) {
            console.log(`✅ Keeping: ${file}`);
        } else {
            // Delete unnecessary files
            fs.unlinkSync(file);
            console.log(`🗑️  Deleted: ${file}`);
        }
    }
});

// Clean up old files in bot directories
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

console.log('\nCleaning bot directories...');
botDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);

            // Keep only the new Typebot.io files and any .md files
            if (file.includes('-typebot.json')) {
                console.log(`✅ Keeping: ${dir}/${file}`);
            } else if (file.endsWith('.md')) {
                console.log(`✅ Keeping: ${dir}/${file}`);
            } else {
                // Delete old files
                fs.unlinkSync(filePath);
                console.log(`🗑️  Deleted: ${dir}/${file}`);
            }
        });
    }
});

console.log('\n🎉 Workspace organized!');
console.log('\n📁 Final structure:');
console.log('- Each bot directory has only the *-typebot.json file');
console.log('- Root directory has only essential files');
console.log('- All ready for Typebot.io upload!'); 