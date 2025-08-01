import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';
import { useCart } from '../../contexts/CartContext';

interface Message {
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function OnboardingBot() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "Welcome! I&apos;m your Kingdom Onboarding Assistant. I can help map user journeys, track progress, recommend resources, and measure success metrics. How can I help create an exceptional onboarding experience today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalUsers, setTotalUsers] = useState(156);
  const [completionRate, setCompletionRate] = useState(78);
  const [avgTimeToComplete, setAvgTimeToComplete] = useState(4.2);
  const [userSatisfaction, setUserSatisfaction] = useState(92);
  const [retentionRate, setRetentionRate] = useState(85);

  const quickActions = [
    "Help me map user journeys",
    "Track onboarding progress",
    "Recommend resources",
    "Measure success metrics",
    "Create personalized paths"
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
          message: "I&apos;ll help you map user journeys effectively! I can analyze user behavior patterns, identify friction points, and create personalized onboarding paths. I&apos;ll track user progress through each stage and optimize the experience based on data. What type of users are you onboarding and what are their main goals?",
          users: 3,
          completion: 2,
          time: -0.1,
          satisfaction: 1,
          retention: 2
        },
        {
          message: "I&apos;ll track onboarding progress in real-time! I can monitor completion rates, time spent at each stage, and identify where users get stuck. I&apos;ll provide insights on which steps need improvement and suggest optimizations. Would you like me to create a dashboard showing progress metrics for different user segments?",
          users: 0,
          completion: 1,
          time: -0.2,
          satisfaction: 2,
          retention: 1
        },
        {
          message: "I&apos;ll recommend personalized resources based on user behavior and preferences! I can suggest relevant tutorials, documentation, and best practices. I&apos;ll also identify knowledge gaps and create targeted learning paths. What types of resources do you have available for your users?",
          users: 1,
          completion: 2,
          time: -0.1,
          satisfaction: 1,
          retention: 1
        },
        {
          message: "I&apos;ll measure success metrics comprehensively! I can track completion rates, time to value, user satisfaction scores, and retention rates. I&apos;ll also identify leading indicators of successful onboarding and create predictive models. Which metrics are most important for your business goals?",
          users: 0,
          completion: 1,
          time: -0.1,
          satisfaction: 2,
          retention: 1
        },
        {
          message: "I&apos;ll create personalized onboarding paths! I can segment users based on their role, experience level, and goals. I&apos;ll design custom journeys that adapt to user progress and provide relevant guidance at each step. What user segments do you want to create personalized paths for?",
          users: 2,
          completion: 3,
          time: -0.3,
          satisfaction: 2,
          retention: 2
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalUsers(prev => prev + selectedResponse.users);
      setCompletionRate(prev => Math.min(100, prev + selectedResponse.completion));
      setAvgTimeToComplete(prev => Math.max(1.0, prev + selectedResponse.time));
      setUserSatisfaction(prev => Math.min(100, prev + selectedResponse.satisfaction));
      setRetentionRate(prev => Math.min(100, prev + selectedResponse.retention));
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

  const handleAddToCart = () => {
    addItem({
      id: 'onboarding-bot',
      name: 'Onboarding Bot',
      price: 199,
      type: 'bot',
      description: 'AI-powered user journey mapping and progress tracking'
    });
  };

  return (
    <>
      <Head>
        <title>Onboarding Bot - Kingdom Collective</title>
        <meta name="description" content="AI-powered user journey mapping, progress tracking, and success metrics for exceptional onboarding experiences" />
      </Head>

      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />

          <main className="flex-1">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                  <div className="flex justify-center mb-8">
                    <Image
                      src="/ai-bot-logos/generic-bot-logo.png"
                      alt="Onboarding Bot"
                      width={120}
                      height={120}
                      className="rounded-2xl shadow-2xl"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Onboarding Bot
                  </h1>
                  <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
                    AI-powered user journey mapping, progress tracking, and success metrics. 
                    Create exceptional onboarding experiences that drive user success and retention.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('demo')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                    >
                      Try Demo
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-200"
                    >
                      Add to Cart - $199
                    </button>
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
                  <h2 className="text-3xl font-bold text-white mb-6">User Success Excellence</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          User Journey Mapping
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
                          Resource Recommendations
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Success Metrics
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Personalized Paths
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
                          Increase completion rates by 40%
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Reduce time to value
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Improve user satisfaction
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Boost retention rates
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Scale onboarding efficiently
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Tab */}
              {activeTab === 'demo' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Live Analytics */}
                    <div className="lg:col-span-1">
                      <h3 className="text-xl font-semibold text-white mb-6">Live Analytics</h3>
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-400">{totalUsers}</div>
                          <div className="text-sm text-purple-200">Total Users</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400">{completionRate}%</div>
                          <div className="text-sm text-purple-200">Completion Rate</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-yellow-400">{avgTimeToComplete}h</div>
                          <div className="text-sm text-purple-200">Avg Time to Complete</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-400">{userSatisfaction}%</div>
                          <div className="text-sm text-purple-200">User Satisfaction</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-400">{retentionRate}%</div>
                          <div className="text-sm text-purple-200">Retention Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold text-white mb-6">Kingdom Onboarding Demo</h3>
                      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
                        <div className="h-96 overflow-y-auto mb-4 space-y-4">
                          {conversationHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                msg.type === 'user' 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                                  : 'bg-white/10 text-white'
                              }`}>
                                <div className="flex items-center mb-1">
                                  {msg.type === 'bot' && (
                                    <svg className="w-4 h-4 mr-2 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                  <span className="text-xs opacity-70">
                                    {msg.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm">{msg.message}</p>
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white/10 text-white max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                                  <span className="text-sm">Kingdom Onboarding is typing...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-4">
                          <p className="text-sm text-purple-200 mb-2">Quick Actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors duration-200"
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
                            placeholder="Type your message..."
                            className="flex-1 bg-white/10 text-white placeholder-purple-300 px-4 py-2 rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400"
                          />
                          <button
                            type="submit"
                            disabled={isLoading || !demoMessage.trim()}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-8">Advanced Features</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Core Capabilities</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• User Journey Mapping</li>
                        <li>• Progress Tracking</li>
                        <li>• Resource Recommendations</li>
                        <li>• Success Metrics</li>
                        <li>• Personalized Paths</li>
                        <li>• A/B Testing</li>
                        <li>• Analytics Dashboard</li>
                        <li>• Integration APIs</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Behavioral Analysis</li>
                        <li>• Predictive Modeling</li>
                        <li>• Custom Workflows</li>
                        <li>• Multi-language Support</li>
                        <li>• Mobile Optimization</li>
                        <li>• Real-time Notifications</li>
                        <li>• Advanced Reporting</li>
                        <li>• White-label Options</li>
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
                      <h3 className="text-xl font-semibold text-white mb-4">Starter</h3>
                      <div className="text-3xl font-bold text-white mb-4">$99<span className="text-lg text-purple-300">/month</span></div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Up to 1,000 users/month</li>
                        <li>• Basic journey mapping</li>
                        <li>• Standard templates</li>
                        <li>• Basic analytics</li>
                        <li>• Email support</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Professional</h3>
                      <div className="text-3xl font-bold text-white mb-4">$299<span className="text-lg text-purple-200">/month</span></div>
                      <ul className="space-y-2 text-white mb-6">
                        <li>• Up to 10,000 users/month</li>
                        <li>• Advanced journey mapping</li>
                        <li>• Custom templates</li>
                        <li>• Advanced analytics</li>
                        <li>• Priority support</li>
                        <li>• API access</li>
                      </ul>
                      <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                      <div className="text-3xl font-bold text-white mb-4">Custom</div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Unlimited users</li>
                        <li>• Full customization</li>
                        <li>• Priority support</li>
                        <li>• Advanced integrations</li>
                        <li>• Dedicated account manager</li>
                        <li>• Custom training</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
} 