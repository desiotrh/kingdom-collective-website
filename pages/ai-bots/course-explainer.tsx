import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Message {
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function CourseExplainerBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "📚 Welcome! I'm your Kingdom Course Explainer Assistant. I can help you understand complex topics, create personalized learning paths, and track your educational progress. What subject would you like to explore today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [activeCourses, setActiveCourses] = useState(5);
  const [completedLessons, setCompletedLessons] = useState(23);
  const [learningProgress, setLearningProgress] = useState(78);
  const [studyTime, setStudyTime] = useState(12.5);
  const [knowledgeRetention, setKnowledgeRetention] = useState(4.6);

  const quickActions = [
    "Explain machine learning basics",
    "Help me understand calculus",
    "Create a study plan for history",
    "I'm struggling with chemistry",
    "Quiz me on programming concepts"
  ];

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoMessage.trim()) return;
    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage: Message = {
      type: 'user',
      message: demoMessage,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);

    // Simulate sophisticated AI response with Kingdom branding
    setTimeout(() => {
      const responses = [
        {
          message: "Great question! Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed. Think of it like teaching a computer to recognize patterns. I'll create a personalized learning path for you starting with the fundamentals. Would you like to begin with supervised learning or unsupervised learning?",
          courses: 1,
          lessons: 3,
          progress: 5,
          retention: 0.1
        },
        {
          message: "Calculus can be challenging! Let me break it down into manageable concepts. We'll start with limits and continuity, then move to derivatives and integrals. I'll create interactive examples and practice problems. What's your current math background? This will help me tailor the explanations to your level.",
          courses: 1,
          lessons: 2,
          progress: 3,
          retention: 0.2
        },
        {
          message: "I'll create a comprehensive study plan for history! Let's start with a timeline approach, then dive into key events and their significance. I'll include primary sources, interactive maps, and discussion questions. What time period interests you most? We can focus on specific eras or take a broader approach.",
          courses: 1,
          lessons: 4,
          progress: 4,
          retention: 0.1
        },
        {
          message: "Chemistry can be tricky! Let's start with the fundamentals - atoms, molecules, and chemical bonds. I'll use visual models and real-world examples to make concepts clearer. What specific topic are you struggling with? We can work through problems step-by-step.",
          courses: 0,
          lessons: 2,
          progress: 2,
          retention: 0.3
        },
        {
          message: "Perfect! Let's test your programming knowledge. I'll ask questions about variables, functions, loops, and data structures. For each concept, I'll provide detailed explanations and code examples. Are you ready to start with basic concepts or jump into more advanced topics?",
          courses: 0,
          lessons: 1,
          progress: 1,
          retention: 0.2
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setActiveCourses(prev => prev + selectedResponse.courses);
      setCompletedLessons(prev => prev + selectedResponse.lessons);
      setLearningProgress(prev => Math.min(100, prev + selectedResponse.progress));
      setKnowledgeRetention(prev => Math.min(5.0, prev + selectedResponse.retention));
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
    // Auto-submit the quick action
    setTimeout(() => {
      const event = { preventDefault: () => {} } as React.FormEvent;
      setDemoMessage(action);
      handleDemoSubmit(event);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>Course Explainer Bot - Kingdom Collective</title>
        <meta name="description" content="AI-powered course explanation with personalized learning paths and progress tracking" />
      </Head>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Course Explainer Bot
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              AI-powered course explanation with personalized learning paths, interactive assessments, 
              and progress tracking. Master any subject with adaptive learning technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab('demo')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Try Demo
              </button>
              <Link href="/ai-bots/pricing" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['overview', 'demo', 'features', 'pricing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6">Personalized Learning Excellence</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                <ul className="space-y-3 text-purple-200">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Adaptive Learning Paths
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Interactive Assessments
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Progress Tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Multi-subject Support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Knowledge Retention
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Benefits</h3>
                <ul className="space-y-3 text-purple-200">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Improve learning outcomes by 40%
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Reduce study time by 30%
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Increase retention rates
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Personalized learning experience
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Demo Tab */}
        {activeTab === 'demo' && (
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Kingdom Course Explainer</h3>
                      <p className="text-purple-300 text-sm">Powered by Kingdom AI • Adaptive Learning</p>
                    </div>
                  </div>

                  {/* Conversation History */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {conversationHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                            : 'bg-white/10 backdrop-blur-sm text-white'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-4">
                    <p className="text-sm text-purple-300 mb-2">Quick Actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs hover:bg-white/20 transition-all duration-200"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleDemoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={demoMessage}
                      onChange={(e) => setDemoMessage(e.target.value)}
                      placeholder="Ask about any subject, concept, or learning topic..."
                      className="flex-1 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>

              {/* Live Analytics */}
              <div className="space-y-6">
                {/* Learning Analytics */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Learning Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Active Courses</span>
                      <span className="text-white font-semibold">{activeCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Completed Lessons</span>
                      <span className="text-white font-semibold">{completedLessons}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Learning Progress</span>
                      <span className="text-white font-semibold">{learningProgress}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Study Time (hrs)</span>
                      <span className="text-white font-semibold">{studyTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Knowledge Retention</span>
                      <span className="text-white font-semibold">{knowledgeRetention}/5.0</span>
                    </div>
                  </div>
                </div>

                {/* Subject Breakdown */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Subject Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Mathematics</span>
                      <span className="text-green-400 font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Science</span>
                      <span className="text-blue-400 font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Programming</span>
                      <span className="text-yellow-400 font-semibold">68%</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Features */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Learning Features</h3>
                  <ul className="space-y-2 text-sm text-purple-200">
                    <li>• Adaptive learning paths</li>
                    <li>• Interactive assessments</li>
                    <li>• Progress tracking</li>
                    <li>• Knowledge retention</li>
                    <li>• Multi-subject support</li>
                    <li>• Personalized feedback</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Learning Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Core Capabilities</h3>
                <ul className="space-y-3 text-purple-200">
                  <li>• Adaptive Learning Paths</li>
                  <li>• Interactive Assessments</li>
                  <li>• Progress Tracking</li>
                  <li>• Multi-subject Support</li>
                  <li>• Knowledge Retention</li>
                  <li>• Personalized Feedback</li>
                  <li>• Study Time Analytics</li>
                  <li>• Learning Style Adaptation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                <ul className="space-y-3 text-purple-200">
                  <li>• AI-powered Concept Mapping</li>
                  <li>• Real-time Difficulty Adjustment</li>
                  <li>• Collaborative Learning Groups</li>
                  <li>• Gamified Learning Elements</li>
                  <li>• Voice-based Learning</li>
                  <li>• AR/VR Learning Experiences</li>
                  <li>• Predictive Learning Analytics</li>
                  <li>• Cross-subject Integration</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Student</h3>
                <div className="text-3xl font-bold text-white mb-4">$29<span className="text-lg text-purple-300">/month</span></div>
                <ul className="space-y-2 text-purple-200 mb-6">
                  <li>• Access to 5 subjects</li>
                  <li>• Basic progress tracking</li>
                  <li>• Standard assessments</li>
                  <li>• Study time analytics</li>
                  <li>• Email support</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                  Get Started
                </button>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Professional</h3>
                <div className="text-3xl font-bold text-white mb-4">$79<span className="text-lg text-purple-200">/month</span></div>
                <ul className="space-y-2 text-white mb-6">
                  <li>• Unlimited subjects</li>
                  <li>• Advanced analytics</li>
                  <li>• Interactive assessments</li>
                  <li>• Personalized learning paths</li>
                  <li>• Priority support</li>
                  <li>• Progress certifications</li>
                </ul>
                <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  Get Started
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                <div className="text-3xl font-bold text-white mb-4">Custom</div>
                <ul className="space-y-2 text-purple-200 mb-6">
                  <li>• Custom learning paths</li>
                  <li>• White-label solutions</li>
                  <li>• API integrations</li>
                  <li>• Dedicated support</li>
                  <li>• Custom assessments</li>
                  <li>• Advanced analytics</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 