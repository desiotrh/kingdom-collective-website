import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

interface Message {
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function TestimonialBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "⭐ Welcome! I'm your Kingdom Testimonial Assistant. I can help collect customer feedback, manage reviews, and generate social proof. How can I help you build trust with your customers today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalTestimonials, setTotalTestimonials] = useState(156);
  const [avgRating, setAvgRating] = useState(4.7);
  const [responseRate, setResponseRate] = useState(68);
  const [socialShares, setSocialShares] = useState(89);
  const [trustScore, setTrustScore] = useState(92);

  const quickActions = [
    "Help me collect customer feedback",
    "Generate a testimonial request",
    "Show me my best reviews",
    "I need social proof content",
    "Analyze my customer sentiment"
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
          message: "I'll help you collect customer feedback! I can create personalized feedback requests, send follow-up emails, and track response rates. Let me set up an automated feedback collection system for your recent customers. What type of feedback are you looking for - product reviews, service ratings, or detailed testimonials?",
          testimonials: 3,
          rating: 0.1,
          response: 5,
          trust: 2
        },
        {
          message: "I'll create a compelling testimonial request that encourages customers to share their experience. I'll include specific questions about their journey, results achieved, and recommendations. Would you like me to personalize the request based on customer segments or create a general template?",
          testimonials: 2,
          rating: 0.1,
          response: 3,
          trust: 1
        },
        {
          message: "Here are your top-performing testimonials with the highest engagement and conversion rates. I can help you feature these prominently on your website and social media. Would you like me to create testimonial cards or video testimonials from these reviews?",
          testimonials: 0,
          rating: 0.1,
          response: 0,
          trust: 3
        },
        {
          message: "I'll generate social proof content including customer success stories, case studies, and trust indicators. I can create content for your website, social media, and marketing materials. What platform would you like to focus on first?",
          testimonials: 1,
          rating: 0.1,
          response: 2,
          trust: 2
        },
        {
          message: "I'll analyze your customer sentiment across all touchpoints. I can identify trends, highlight positive feedback, and flag areas for improvement. Would you like a detailed sentiment report or specific insights for different customer segments?",
          testimonials: 0,
          rating: 0.2,
          response: 1,
          trust: 1
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalTestimonials(prev => prev + selectedResponse.testimonials);
      setAvgRating(prev => Math.min(5.0, prev + selectedResponse.rating));
      setResponseRate(prev => Math.min(100, prev + selectedResponse.response));
      setSocialShares(prev => prev + selectedResponse.testimonials);
      setTrustScore(prev => Math.min(100, prev + selectedResponse.trust));
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
  };

  return (
    <>
      <Head>
        <title>Testimonial Bot - Kingdom Collective</title>
        <meta name="description" content="Automated customer feedback collection and testimonial generation. Build trust with social proof and customer success stories." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                <div className="text-6xl mb-6">⭐</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Testimonial Bot
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                  Automated customer feedback collection and testimonial generation. 
                  Build trust with social proof and customer success stories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/ai-bots/pricing" className="btn-kingdom-primary">
                    Get Started - $159
                  </Link>
                  <button 
                    onClick={() => setActiveTab('demo')}
                    className="btn-kingdom-secondary"
                  >
                    Try Demo
                  </button>
                </div>
              </div>
            </section>

            {/* Tab Navigation */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                      activeTab === 'overview' 
                        ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('demo')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                      activeTab === 'demo' 
                        ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Live Demo
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                      activeTab === 'features' 
                        ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                      activeTab === 'pricing' 
                        ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Pricing
                  </button>
                </div>
              </div>
            </section>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-6">Social Proof Excellence</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Automated Feedback Collection
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Review Management System
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Social Proof Generation
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Reputation Monitoring
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Trust Score Analytics
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
                          Increase conversion rates by 60%
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Build customer trust faster
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Generate authentic social proof
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Monitor brand reputation
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">Kingdom Testimonial Assistant</h3>
                            <p className="text-purple-300 text-sm">Powered by Kingdom AI • Social Proof Builder</p>
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
                            placeholder="Ask about testimonial collection, review management, or social proof..."
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
                      {/* Testimonial Analytics */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Testimonial Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Total Testimonials</span>
                            <span className="text-white font-semibold">{totalTestimonials}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Average Rating</span>
                            <span className="text-white font-semibold">{avgRating}/5.0</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Response Rate</span>
                            <span className="text-white font-semibold">{responseRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Social Shares</span>
                            <span className="text-white font-semibold">{socialShares}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Trust Score</span>
                            <span className="text-white font-semibold">{trustScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Review Categories */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Review Categories</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Product Reviews</span>
                            <span className="text-green-400 font-semibold">45%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Service Reviews</span>
                            <span className="text-kingdom-gold font-semibold">32%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Video Testimonials</span>
                            <span className="text-yellow-400 font-semibold">23%</span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Features */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Social Proof Features</h3>
                        <ul className="space-y-2 text-sm text-purple-200">
                          <li>• Automated feedback collection</li>
                          <li>• Review management system</li>
                          <li>• Social proof generation</li>
                          <li>• Reputation monitoring</li>
                          <li>• Trust score analytics</li>
                          <li>• Multi-platform integration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-8">Social Proof Features</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Core Capabilities</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Automated Feedback Collection</li>
                        <li>• Review Management System</li>
                        <li>• Social Proof Generation</li>
                        <li>• Reputation Monitoring</li>
                        <li>• Trust Score Analytics</li>
                        <li>• Multi-platform Integration</li>
                        <li>• Video Testimonial Creation</li>
                        <li>• Customer Success Stories</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• AI-powered Sentiment Analysis</li>
                        <li>• Automated Review Responses</li>
                        <li>• Social Media Integration</li>
                        <li>• Influencer Testimonial Management</li>
                        <li>• Case Study Generation</li>
                        <li>• Trust Badge Creation</li>
                        <li>• Review Aggregation</li>
                        <li>• Competitive Analysis</li>
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
                      <div className="text-3xl font-bold text-white mb-4">$39<span className="text-lg text-purple-300">/month</span></div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Up to 100 testimonials</li>
                        <li>• Basic review management</li>
                        <li>• Email feedback collection</li>
                        <li>• Simple analytics</li>
                        <li>• Standard templates</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Professional</h3>
                      <div className="text-3xl font-bold text-white mb-4">$99<span className="text-lg text-purple-200">/month</span></div>
                      <ul className="space-y-2 text-white mb-6">
                        <li>• Unlimited testimonials</li>
                        <li>• Advanced review management</li>
                        <li>• Multi-platform integration</li>
                        <li>• Video testimonial creation</li>
                        <li>• Advanced analytics</li>
                        <li>• Custom templates</li>
                      </ul>
                      <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                      <div className="text-3xl font-bold text-white mb-4">Custom</div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Full customization</li>
                        <li>• White-label solutions</li>
                        <li>• API integrations</li>
                        <li>• Dedicated support</li>
                        <li>• Advanced analytics</li>
                        <li>• Custom development</li>
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
          <Footer />
        </div>
      </div>
    </>
  );
} 