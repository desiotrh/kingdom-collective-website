const fs = require('fs');
const path = require('path');

// Load the template
const template = JSON.parse(fs.readFileSync('template.json', 'utf8'));

// All bot configurations with proper Typebot.io block structure
const allBots = [
    {
        name: "Lead Generation Bot",
        id: "lead-gen-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "👋 Hi there! Ready to level up your business or life?"
            },
            {
                "id": "tone-selector",
                "type": "choice input",
                "label": "Tone Selection",
                "question": "Choose your preferred tone:",
                "options": ["😎 Casual", "💼 Professional", "🎉 Fun"]
            },
            {
                "id": "faith-toggle",
                "type": "text",
                "label": "Faith Mode Question",
                "content": "Would you like Faith Mode? (Encouragement + Scripture)"
            },
            {
                "id": "faith-choice",
                "type": "choice input",
                "label": "Faith Mode Choice",
                "question": "Faith Mode:",
                "options": ["🙏 Yes", "No"]
            },
            {
                "id": "faith-message",
                "type": "text",
                "label": "Faith Encouragement",
                "content": "✨ Here's a word for you: 'For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.' (Jeremiah 29:11)"
            },
            {
                "id": "challenge-question",
                "type": "text",
                "label": "Challenge Question",
                "content": "🎯 What's your biggest challenge right now?"
            },
            {
                "id": "challenge-input",
                "type": "text input",
                "label": "Challenge Input",
                "question": "Tell me about your challenge...",
                "variable": "challenge"
            },
            {
                "id": "goal-question",
                "type": "text",
                "label": "Goal Question",
                "content": "🚀 What's your #1 goal for the next 90 days?"
            },
            {
                "id": "goal-input",
                "type": "text input",
                "label": "Goal Input",
                "question": "What do you want to achieve?",
                "variable": "goal"
            },
            {
                "id": "name-question",
                "type": "text",
                "label": "Name Question",
                "content": "What's your full name?"
            },
            {
                "id": "name-input",
                "type": "text input",
                "label": "Name Input",
                "question": "Enter your full name",
                "variable": "full_name"
            },
            {
                "id": "email-question",
                "type": "text",
                "label": "Email Question",
                "content": "What's your email address?"
            },
            {
                "id": "email-input",
                "type": "email input",
                "label": "Email Input",
                "question": "Enter your email",
                "variable": "email"
            },
            {
                "id": "thank-you",
                "type": "text",
                "label": "Thank You",
                "content": "Thank you, {{full_name}}! 🎉 Check your email for next steps.\n\nCoded in wisdom by Kingdom Collective"
            }
        ]
    },
    {
        name: "Booking Bot",
        id: "booking-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Hi there! Need to book a service or want to ask a quick question? 📅"
            },
            {
                "id": "initial-intent",
                "type": "choice input",
                "label": "Initial Intent",
                "question": "How can I help you?",
                "options": ["📅 Book Now", "❓ Ask a Question"]
            },
            {
                "id": "service-question",
                "type": "text",
                "label": "Service Question",
                "content": "Which service are you interested in?"
            },
            {
                "id": "service-choice",
                "type": "choice input",
                "label": "Service Choice",
                "question": "Select a service",
                "options": ["✂️ Haircut & Styling", "🐾 Pet Checkup", "🌟 Life Coaching Session", "📸 Photography Consultation"]
            },
            {
                "id": "day-question",
                "type": "text",
                "label": "Day Question",
                "content": "What day works best for you?"
            },
            {
                "id": "day-choice",
                "type": "choice input",
                "label": "Day Choice",
                "question": "Select preferred day",
                "options": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            {
                "id": "time-choice",
                "type": "choice input",
                "label": "Time Choice",
                "question": "Select preferred time",
                "options": ["🌅 Morning (9AM-12PM)", "☀️ Afternoon (12PM-5PM)", "🌆 Evening (5PM-8PM)"]
            },
            {
                "id": "calendar-link",
                "type": "text",
                "label": "Calendar Link",
                "content": "Perfect! Here's your booking link:\n[📅 Book Your Session](https://calendly.com/your-link)"
            }
        ]
    },
    {
        name: "Sales Assistant Bot",
        id: "sales-assistant-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Hey! Looking for something specific or want a recommendation? 🛍️"
            },
            {
                "id": "initial-choices",
                "type": "choice input",
                "label": "Initial Choices",
                "question": "Choose an option",
                "options": ["Browse Products", "Tell Me What I Need", "Show Me Your Top Pick"]
            },
            {
                "id": "category-choice",
                "type": "choice input",
                "label": "Category Choice",
                "question": "Select category",
                "options": ["Skincare", "Apparel", "Digital Templates", "Gifts"]
            },
            {
                "id": "goal-question",
                "type": "text",
                "label": "Goal Question",
                "content": "What's your goal with this product?"
            },
            {
                "id": "goal-input",
                "type": "text input",
                "label": "Goal Input",
                "question": "Tell me about your goal...",
                "variable": "goal"
            },
            {
                "id": "product-results",
                "type": "text",
                "label": "Product Results",
                "content": "Perfect! Here are my top recommendations for you:\n\n🌟 Premium Glow Serum\nTransform your skin in 7 days with our bestselling anti-aging formula."
            },
            {
                "id": "product-cta",
                "type": "choice input",
                "label": "Product CTA",
                "question": "Product Actions",
                "options": ["🛒 View Now", "Show More Options"]
            }
        ]
    },
    {
        name: "Customer Support Bot",
        id: "customer-support-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Hi! I'm here to help. What can I assist you with today? 🆘"
            },
            {
                "id": "issue-category",
                "type": "choice input",
                "label": "Issue Category",
                "question": "What type of issue are you experiencing?",
                "options": ["Technical Problem", "Billing Question", "Feature Request", "General Inquiry"]
            },
            {
                "id": "technical-help",
                "type": "text",
                "label": "Technical Help",
                "content": "I'll help you troubleshoot this technical issue. Can you describe what's happening?"
            },
            {
                "id": "issue-description",
                "type": "text input",
                "label": "Issue Description",
                "question": "Please describe your issue in detail...",
                "variable": "issue_description"
            },
            {
                "id": "contact-info",
                "type": "text",
                "label": "Contact Info",
                "content": "Thanks for the details. I'll need your contact information to follow up."
            },
            {
                "id": "name-input",
                "type": "text input",
                "label": "Name Input",
                "question": "What's your name?",
                "variable": "support_name"
            },
            {
                "id": "email-input",
                "type": "email input",
                "label": "Email Input",
                "question": "What's your email?",
                "variable": "support_email"
            },
            {
                "id": "support-confirmation",
                "type": "text",
                "label": "Support Confirmation",
                "content": "Thank you, {{support_name}}! I've created a support ticket for you. You'll receive an email confirmation shortly."
            }
        ]
    },
    {
        name: "Onboarding Bot",
        id: "onboarding-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Welcome! Let's get you set up and ready to go. 🚀"
            },
            {
                "id": "account-type",
                "type": "choice input",
                "label": "Account Type",
                "question": "What type of account are you setting up?",
                "options": ["Personal", "Business", "Team"]
            },
            {
                "id": "name-question",
                "type": "text",
                "label": "Name Question",
                "content": "Great! Let's start with your name."
            },
            {
                "id": "name-input",
                "type": "text input",
                "label": "Name Input",
                "question": "What's your full name?",
                "variable": "onboarding_name"
            },
            {
                "id": "email-question",
                "type": "text",
                "label": "Email Question",
                "content": "Perfect! Now I need your email address."
            },
            {
                "id": "email-input",
                "type": "email input",
                "label": "Email Input",
                "question": "What's your email?",
                "variable": "onboarding_email"
            },
            {
                "id": "goals-question",
                "type": "text",
                "label": "Goals Question",
                "content": "What are your main goals with this platform?"
            },
            {
                "id": "goals-input",
                "type": "text input",
                "label": "Goals Input",
                "question": "Tell me about your goals...",
                "variable": "onboarding_goals"
            },
            {
                "id": "onboarding-complete",
                "type": "text",
                "label": "Onboarding Complete",
                "content": "Excellent, {{onboarding_name}}! Your account is all set up. Check your email for next steps and welcome materials."
            }
        ]
    },
    {
        name: "Faith Bot",
        id: "faith-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Welcome! I'm here to provide faith-based encouragement and guidance. 🙏"
            },
            {
                "id": "daily-verse",
                "type": "text",
                "label": "Daily Verse",
                "content": "Here's today's verse for you:\n\n'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' - Joshua 1:9"
            },
            {
                "id": "prayer-request",
                "type": "choice input",
                "label": "Prayer Request",
                "question": "Would you like to share a prayer request?",
                "options": ["Yes, I have a prayer request", "No, just encouragement today"]
            },
            {
                "id": "prayer-input",
                "type": "text input",
                "label": "Prayer Input",
                "question": "What would you like me to pray for?",
                "variable": "prayer_request"
            },
            {
                "id": "encouragement",
                "type": "text",
                "label": "Encouragement",
                "content": "I'm praying for you and your situation. Remember, God hears every prayer and is working in your life. Keep trusting in Him!"
            }
        ]
    },
    {
        name: "Job Application Bot",
        id: "job-app-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Welcome to our job application process! Let's get started. 💼"
            },
            {
                "id": "position-interest",
                "type": "choice input",
                "label": "Position Interest",
                "question": "What type of position are you interested in?",
                "options": ["Full-time", "Part-time", "Contract", "Internship"]
            },
            {
                "id": "name-question",
                "type": "text",
                "label": "Name Question",
                "content": "Let's start with your basic information."
            },
            {
                "id": "name-input",
                "type": "text input",
                "label": "Name Input",
                "question": "What's your full name?",
                "variable": "applicant_name"
            },
            {
                "id": "email-question",
                "type": "text",
                "label": "Email Question",
                "content": "Great! Now I need your contact information."
            },
            {
                "id": "email-input",
                "type": "email input",
                "label": "Email Input",
                "question": "What's your email address?",
                "variable": "applicant_email"
            },
            {
                "id": "experience-question",
                "type": "text",
                "label": "Experience Question",
                "content": "Tell me about your relevant experience."
            },
            {
                "id": "experience-input",
                "type": "text input",
                "label": "Experience Input",
                "question": "Describe your relevant experience...",
                "variable": "applicant_experience"
            },
            {
                "id": "application-confirmation",
                "type": "text",
                "label": "Application Confirmation",
                "content": "Thank you, {{applicant_name}}! Your application has been submitted. We'll review it and contact you within 5-7 business days."
            }
        ]
    },
    {
        name: "Course Explainer Bot",
        id: "course-explainer-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Welcome! I'm here to help you understand our courses and find the perfect fit. 📚"
            },
            {
                "id": "course-interest",
                "type": "choice input",
                "label": "Course Interest",
                "question": "What type of course are you interested in?",
                "options": ["Business", "Technology", "Creative", "Personal Development"]
            },
            {
                "id": "skill-level",
                "type": "choice input",
                "label": "Skill Level",
                "question": "What's your current skill level?",
                "options": ["Beginner", "Intermediate", "Advanced"]
            },
            {
                "id": "course-overview",
                "type": "text",
                "label": "Course Overview",
                "content": "Perfect! Based on your interests, here's what I recommend:\n\n🎯 Course: [Course Name]\n⏱️ Duration: 8 weeks\n💡 Level: Perfect for your skill level\n💰 Investment: $299"
            },
            {
                "id": "enrollment-question",
                "type": "choice input",
                "label": "Enrollment Question",
                "question": "Would you like to learn more or enroll?",
                "options": ["Tell me more", "I'm ready to enroll", "Show me other options"]
            },
            {
                "id": "enrollment-link",
                "type": "text",
                "label": "Enrollment Link",
                "content": "Excellent choice! Here's your enrollment link:\n[📚 Enroll Now](https://yourcourse.com/enroll)"
            }
        ]
    },
    {
        name: "Testimonial Bot",
        id: "testimonial-bot",
        blocks: [
            {
                "id": "welcome",
                "type": "text",
                "label": "Welcome",
                "content": "Thank you for choosing to share your experience! Your feedback helps others. ⭐"
            },
            {
                "id": "experience-rating",
                "type": "choice input",
                "label": "Experience Rating",
                "question": "How would you rate your overall experience?",
                "options": ["⭐⭐⭐⭐⭐ Excellent", "⭐⭐⭐⭐ Very Good", "⭐⭐⭐ Good", "⭐⭐ Fair", "⭐ Poor"]
            },
            {
                "id": "favorite-aspect",
                "type": "text",
                "label": "Favorite Aspect",
                "content": "What was your favorite aspect of your experience?"
            },
            {
                "id": "favorite-input",
                "type": "text input",
                "label": "Favorite Input",
                "question": "Tell us what you loved most...",
                "variable": "favorite_aspect"
            },
            {
                "id": "improvement-suggestion",
                "type": "text",
                "label": "Improvement Suggestion",
                "content": "Is there anything we could improve?"
            },
            {
                "id": "improvement-input",
                "type": "text input",
                "label": "Improvement Input",
                "question": "Your suggestions help us get better...",
                "variable": "improvement_suggestion"
            },
            {
                "id": "recommend-question",
                "type": "choice input",
                "label": "Recommend Question",
                "question": "Would you recommend us to others?",
                "options": ["Absolutely!", "Probably", "Maybe", "Probably not", "No"]
            },
            {
                "id": "testimonial-thanks",
                "type": "text",
                "label": "Testimonial Thanks",
                "content": "Thank you so much for your feedback! Your testimonial helps others make informed decisions. We appreciate you taking the time to share your experience."
            }
        ]
    }
];

function generateTypebotFile(botConfig) {
    // Create a copy of the template
    const botFile = JSON.parse(JSON.stringify(template));

    // Update the bot-specific information
    botFile.id = botConfig.id;
    botFile.name = botConfig.name;

    // Update the blocks
    botFile.groups[0].blocks = botConfig.blocks;

    // Update the edge to point to the first block
    if (botConfig.blocks.length > 0) {
        botFile.edges[0].to.blockId = botConfig.blocks[0].id;
    }

    return botFile;
}

// Generate files for all bots
console.log('🚀 Generating all Typebot.io files...\n');

allBots.forEach(config => {
    const botFile = generateTypebotFile(config);
    const fileName = `${config.id}-typebot.json`;

    fs.writeFileSync(fileName, JSON.stringify(botFile, null, 2));
    console.log(`✅ Created: ${fileName} (${config.name})`);
});

console.log('\n🎉 All 9 Typebot.io files generated with proper structure!');
console.log('These files should import into Typebot.io without any validation errors.');
console.log('\n📁 Generated files:');
allBots.forEach(config => {
    console.log(`- ${config.id}-typebot.json`);
}); 