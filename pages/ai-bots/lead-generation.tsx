import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';
import { useCart } from '../../contexts/CartContext';

export default function LeadGenerationBot() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [demoResponse, setDemoResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      type: 'bot',
      message: "Hi! I&apos;m your Kingdom Lead Generation Assistant. I can help you capture, qualify, and nurture leads across multiple channels. What type of business are you looking to generate leads for?",
      timestamp: new Date()
    }
  ]);
  const [leadScore, setLeadScore] = useState(0);
  const [capturedLeads, setCapturedLeads] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoMessage.trim()) return;

    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage = {
      type: 'user',
      message: demoMessage,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);

    // Simulate sophisticated AI response with Kingdom branding
    setTimeout(() => {
      const responses = [
        {
          message: "Excellent! I can see you&apos;re in the [business type] space. Let me set up a multi-channel lead capture system for you. I&apos;ll integrate with your website, social media, and email campaigns. What&apos;s your current lead generation strategy?",
          score: 25,
          leads: 3
        },
        {
          message: "Perfect! I&apos;ll create a lead scoring system based on engagement, demographics, and behavior patterns. I can also set up automated follow-up sequences. How do you currently qualify your leads?",
          score: 30,
          leads: 2
        },
        {
          message: "I&apos;ll integrate with your CRM and set up real-time lead notifications. I can also create custom landing pages and A/B test different lead magnets. What&apos;s your target conversion rate?",
          score: 35,
          leads: 4
        },
        {
          message: "Great! I&apos;ll implement lead nurturing workflows with personalized content. I can also set up retargeting campaigns and social proof elements. How often do you follow up with leads?",
          score: 40,
          leads: 5
        },
        {
          message: "I&apos;ll optimize your lead capture forms and implement progressive profiling. I can also set up lead scoring based on your specific criteria. What&apos;s your ideal customer profile?",
          score: 45,
          leads: 3
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setLeadScore(prev => prev + selectedResponse.score);
      setCapturedLeads(prev => prev + selectedResponse.leads);
      setConversionRate(prev => prev + (Math.random() * 2));
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    "How do you capture leads?",
    "What's lead scoring?",
    "CRM integration options",
    "Lead nurturing strategies",
    "Multi-channel setup"
  ];

  const handleAddToCart = () => {
    addItem({
      id: 'lead-generation-bot',
      name: 'Lead Generation Bot',
      price: 199,
      type: 'bot',
      description: 'Automated lead capture and qualification with CRM integration'
    });
  };

  return (
    <>
      <Head>
        <title>Lead Generation Bot - Kingdom Collective</title>
        <meta name="description" content="Automated lead capture and qualification with CRM integration. Boost your sales pipeline with intelligent lead generation." />
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
                      src="/ai-bot-logos/generic-bot-logo.png"
                      alt="Lead Generation Bot"
                      width={120}
                      height={120}
                      className="rounded-2xl shadow-2xl"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Lead Generation Bot
                  </h1>
                  <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
                    Automated lead capture and qualification with CRM integration. Boost your sales pipeline with intelligent lead generation across multiple channels.
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
                  <h2 className="text-3xl font-bold text-white mb-6">Lead Generation Excellence</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Multi-Channel Lead Capture
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Intelligent Lead Scoring
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          CRM Integration
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Automated Nurturing
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Real-time Analytics
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
                          Increase lead quality by 60%
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Reduce acquisition costs
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Scale lead generation
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Improve conversion rates
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Track ROI effectively
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
                          <div className="text-2xl font-bold text-green-400">{leadScore}</div>
                          <div className="text-sm text-purple-200">Lead Score</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400">{capturedLeads}</div>
                          <div className="text-sm text-purple-200">Captured Leads</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-yellow-400">{conversionRate.toFixed(1)}%</div>
                          <div className="text-sm text-purple-200">Conversion Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold text-white mb-6">Kingdom Lead Generation Demo</h3>
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
                                  <span className="text-sm">Kingdom Lead Gen is typing...</span>
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
                                onClick={() => {
                                  setDemoMessage(action);
                                  setTimeout(() => {
                                    const event = { preventDefault: () => {} } as React.FormEvent;
                                    handleDemoSubmit(event);
                                  }, 100);
                                }}
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
                        <li>• Multi-Channel Lead Capture</li>
                        <li>• Intelligent Lead Scoring</li>
                        <li>• CRM Integration</li>
                        <li>• Automated Nurturing</li>
                        <li>• Real-time Analytics</li>
                        <li>• Custom Landing Pages</li>
                        <li>• A/B Testing</li>
                        <li>• Progressive Profiling</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Behavioral Tracking</li>
                        <li>• Predictive Analytics</li>
                        <li>• Social Proof Integration</li>
                        <li>• Retargeting Campaigns</li>
                        <li>• Lead Segmentation</li>
                        <li>• Automated Follow-ups</li>
                        <li>• ROI Tracking</li>
                        <li>• Custom Workflows</li>
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
                        <li>• Up to 1,000 leads/month</li>
                        <li>• Basic lead scoring</li>
                        <li>• Email integration</li>
                        <li>• Standard templates</li>
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
                        <li>• Up to 10,000 leads/month</li>
                        <li>• Advanced lead scoring</li>
                        <li>• CRM integration</li>
                        <li>• Custom templates</li>
                        <li>• Advanced analytics</li>
                        <li>• Multi-channel capture</li>
                      </ul>
                      <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                      <div className="text-3xl font-bold text-white mb-4">Custom</div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Unlimited leads</li>
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