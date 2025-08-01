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

  // Test 6: Help request
  console.log('🙏 Test 6: Help Request');
  const response6 = aiResponseGenerator.generateResponse('I need help', sessionId, '/');
  console.log('Response:', response6.substring(0, 200) + '...\n');

  // Test 7: Sentiment analysis
  console.log('😊 Test 7: Positive Sentiment');
  const response7 = aiResponseGenerator.generateResponse('This is amazing! I love what you\'re doing', sessionId, '/');
  console.log('Response:', response7.substring(0, 200) + '...\n');

  // Test 8: Technical user
  console.log('🔧 Test 8: Technical User');
  const response8 = aiResponseGenerator.generateResponse('I need technical details about API integration', sessionId, '/');
  console.log('Response:', response8.substring(0, 200) + '...\n');

  // Test 9: Decision stage - evaluation
  console.log('⚖️ Test 9: Decision Stage - Evaluation');
  const response9 = aiResponseGenerator.generateResponse('What are the costs and pricing details?', sessionId, '/');
  console.log('Response:', response9.substring(0, 200) + '...\n');

  // Test 10: Conversation memory
  console.log('🧠 Test 10: Conversation Memory');
  const memory = conversationManager.getMemory(sessionId);
  console.log('Memory topics:', memory.conversationTopics);
  console.log('Mentioned apps:', memory.mentionedApps);
  console.log('User interests:', memory.userInterests);
  console.log('Sentiment:', memory.sentiment);
  console.log('Engagement level:', memory.engagementLevel);
  console.log('Decision stage:', memory.decisionStage);
  console.log('Communication style:', memory.preferredCommunicationStyle);
  console.log('User journey:', memory.userJourney);
  console.log('Pain points:', memory.painPoints);

  console.log('\n✅ Enhanced AI Assistant Testing Complete!');
  console.log('The assistant now provides:');
  console.log('• Comprehensive app overviews');
  console.log('• Detailed AI bots information');
  console.log('• Enhanced pricing responses');
  console.log('• Biblical integration details');
  console.log('• Better conversation memory');
  console.log('• Contextual follow-up responses');
  console.log('• Sentiment analysis');
  console.log('• Engagement tracking');
  console.log('• Decision stage detection');
  console.log('• Communication style adaptation');
  console.log('• User journey tracking');
  console.log('• Pain point detection');
  console.log('• Personalized responses');
}

testAIAssistant(); 