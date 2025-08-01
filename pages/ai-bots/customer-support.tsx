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

export default function CustomerSupportBot() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "Hi! I&apos;m your Kingdom Customer Support Assistant. I can help resolve issues, answer questions, and provide 24/7 support. What can I help you with today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [openTickets, setOpenTickets] = useState(12);
  const [resolvedToday, setResolvedToday] = useState(8);
  const [avgResponseTime, setAvgResponseTime] = useState(2.3);
  const [customerSatisfaction, setCustomerSatisfaction] = useState(4.7);
  const [escalatedTickets, setEscalatedTickets] = useState(2);

  const quickActions = [
    "I need help with my order",
    "How do I reset my password?",
    "I want to return an item",
    "What are your business hours?",
    "I have a billing question"
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
          message: "I understand you&apos;re having an issue with your order. Let me check your account details and order history. I can see your recent order #12345. What specific problem are you experiencing? I can help with tracking, returns, or modifications.",
          tickets: -1,
          resolved: 1,
          satisfaction: 0.1
        },
        {
          message: "I can help you reset your password right now. I&apos;ll send a secure reset link to your registered email. For security, the link expires in 15 minutes. You should receive it within 2 minutes. Would you like me to also set up two-factor authentication?",
          tickets: -1,
          resolved: 1,
          satisfaction: 0.2
        },
        {
          message: "I&apos;ll help you with the return process. I can see your purchase qualifies for our 30-day return policy. I&apos;ll generate a return label and update your order status. Would you like a refund to your original payment method or store credit?",
          tickets: -1,
          resolved: 1,
          satisfaction: 0.1
        },
        {
          message: "Our customer support is available 24/7 through this chat, and our phone support is available Monday-Friday 9AM-6PM EST. For urgent technical issues, we have priority support available. What type of assistance do you need?",
          tickets: 0,
          resolved: 0,
          satisfaction: 0.1
        },
        {
          message: "I can help you with your billing question. I can see your current subscription and payment history. Are you looking to update your payment method, change your plan, or dispute a charge? I can assist with any billing-related concerns.",
          tickets: -1,
          resolved: 1,
          satisfaction: 0.1
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setOpenTickets(prev => Math.max(0, prev + selectedResponse.tickets));
      setResolvedToday(prev => prev + selectedResponse.resolved);
      setCustomerSatisfaction(prev => Math.min(5.0, prev + selectedResponse.satisfaction));
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
      id: 'customer-support-bot',
      name: 'Customer Support Bot',
      price: 199,
      type: 'bot',
      description: '24/7 AI-powered customer support with instant issue resolution'
    });
  };

  return (
    <>
      <Head>
        <title>Customer Support Bot - Kingdom Collective</title>
        <meta name="description" content="24/7 AI-powered customer support that resolves issues instantly" />
      </Head>

      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />

          <main className="flex-1">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                  <div className="flex justify-center mb-8">
                    <Image
                      src="/ai-bot-logos/customer-support-bot.png"
                      alt="Customer Support Bot"
                      width={120}
                      height={120}
                      className="rounded-2xl shadow-2xl"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Customer Support Bot
                  </h1>
                  <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
                    24/7 AI-powered customer support that resolves issues instantly, tracks satisfaction, and escalates when needed. 
                    Provide exceptional customer service around the clock.
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
                  <h2 className="text-3xl font-bold text-white mb-6">Customer Support Excellence</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          24/7 Instant Response
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Intelligent Issue Resolution
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Customer Satisfaction Tracking
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Seamless Human Escalation
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Multi-language Support
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
                          Reduce response time by 80%
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Increase customer satisfaction
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Lower support costs by 60%
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Scale support operations
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Improve issue resolution rates
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
                          <div className="text-2xl font-bold text-green-400">{openTickets}</div>
                          <div className="text-sm text-purple-200">Open Tickets</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400">{resolvedToday}</div>
                          <div className="text-sm text-purple-200">Resolved Today</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-yellow-400">{avgResponseTime}s</div>
                          <div className="text-sm text-purple-200">Avg Response Time</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-400">{customerSatisfaction}/5</div>
                          <div className="text-sm text-purple-200">Customer Satisfaction</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-400">{escalatedTickets}</div>
                          <div className="text-sm text-purple-200">Escalated Tickets</div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold text-white mb-6">Kingdom Customer Support Demo</h3>
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
                                  <span className="text-sm">Kingdom Support is typing...</span>
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
                        <li>• 24/7 Instant Response System</li>
                        <li>• Intelligent Issue Classification</li>
                        <li>• Multi-language Support (50+ languages)</li>
                        <li>• Customer Satisfaction Tracking</li>
                        <li>• Seamless Human Escalation</li>
                        <li>• Knowledge Base Integration</li>
                        <li>• Ticket Management System</li>
                        <li>• Automated Follow-up Scheduling</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Sentiment Analysis & Mood Detection</li>
                        <li>• Predictive Issue Resolution</li>
                        <li>• Customer Journey Mapping</li>
                        <li>• Real-time Analytics Dashboard</li>
                        <li>• Custom Workflow Automation</li>
                        <li>• Integration with CRM Systems</li>
                        <li>• Voice & Video Support</li>
                        <li>• Proactive Issue Prevention</li>
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
                        <li>• Up to 1,000 conversations/month</li>
                        <li>• Basic ticket management</li>
                        <li>• Email & chat support</li>
                        <li>• Standard response templates</li>
                        <li>• Basic analytics</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Professional</h3>
                      <div className="text-3xl font-bold text-white mb-4">$299<span className="text-lg text-purple-200">/month</span></div>
                      <ul className="space-y-2 text-white mb-6">
                        <li>• Up to 10,000 conversations/month</li>
                        <li>• Advanced ticket management</li>
                        <li>• Multi-channel support</li>
                        <li>• Custom response templates</li>
                        <li>• Advanced analytics</li>
                        <li>• Human escalation</li>
                      </ul>
                      <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                      <div className="text-3xl font-bold text-white mb-4">Custom</div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Unlimited conversations</li>
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