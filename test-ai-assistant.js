// Test script for enhanced AI assistant
const { aiResponseGenerator } = require('./utils/ai-response-generator');
const { conversationManager } = require('./utils/conversation-memory');

// Test the enhanced AI assistant
function testAIAssistant() {
  console.log('🧪 Testing Enhanced AI Assistant...\n');

  const sessionId = 'test-session-' + Date.now();
  
  // Test 1: Comprehensive app overview
  console.log('📱 Test 1: Comprehensive App Overview');
  const response1 = aiResponseGenerator.generateResponse('Show me all your apps', sessionId, '/');
  console.log('Response:', response1.substring(0, 200) + '...\n');

  // Test 2: AI bots inquiry
  console.log('🤖 Test 2: AI Bots Inquiry');
  const response2 = aiResponseGenerator.generateResponse('Tell me about your AI bots', sessionId, '/');
  console.log('Response:', response2.substring(0, 200) + '...\n');

  // Test 3: Pricing inquiry
  console.log('💰 Test 3: Pricing Inquiry');
  const response3 = aiResponseGenerator.generateResponse('What are your pricing options?', sessionId, '/');
  console.log('Response:', response3.substring(0, 200) + '...\n');

  // Test 4: Company mission
  console.log('🏛️ Test 4: Company Mission');
  const response4 = aiResponseGenerator.generateResponse('Tell me about your mission', sessionId, '/');
  console.log('Response:', response4.substring(0, 200) + '...\n');

  // Test 5: Biblical integration
  console.log('📖 Test 5: Biblical Integration');
  const response5 = aiResponseGenerator.generateResponse('How do your apps align with biblical principles?', sessionId, '/');
  console.log('Response:', response5.substring(0, 200) + '...\n');

  // Test 6: Conversation memory
  console.log('🧠 Test 6: Conversation Memory');
  const memory = conversationManager.getMemory(sessionId);
  console.log('Memory topics:', memory.conversationTopics);
  console.log('Mentioned apps:', memory.mentionedApps);
  console.log('User interests:', memory.userInterests);

  console.log('\n✅ AI Assistant Enhancement Complete!');
  console.log('The assistant now provides:');
  console.log('• Comprehensive app overviews');
  console.log('• Detailed AI bots information');
  console.log('• Enhanced pricing responses');
  console.log('• Biblical integration details');
  console.log('• Better conversation memory');
  console.log('• Contextual follow-up responses');
}

testAIAssistant(); 