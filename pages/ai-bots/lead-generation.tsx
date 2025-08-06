import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

export default function LeadGenerationBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [demoResponse, setDemoResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Lead Generation Assistant. I can help you capture, qualify, and nurture leads across multiple channels. What type of business are you looking to generate leads for?",
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
          message: "Excellent! I can see you're in the [business type] space. Let me set up a multi-channel lead capture system for you. I'll integrate with your website, social media, and email campaigns. What's your current lead generation strategy?",
          score: 25,
          leads: 3
        },
        {
          message: "Perfect! I'll create a lead scoring system based on engagement, demographics, and behavior patterns. I can also set up automated follow-up sequences. How do you currently qualify your leads?",
          score: 30,
          leads: 2
        },
        {
          message: "I'll integrate with your CRM and set up real-time lead notifications. I can also create custom landing pages and A/B test different lead magnets. What's your target conversion rate?",
          score: 35,
          leads: 4
        },
        {
          message: "Great! I'll implement lead nurturing workflows with personalized content. I can also set up retargeting campaigns and social proof elements. How often do you follow up with leads?",
          score: 40,
          leads: 5
        },
        {
          message: "I'll optimize your lead capture forms and implement progressive profiling. I can also set up lead scoring based on your specific criteria. What's your ideal customer profile?",
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
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Lead Generation Bot
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                  Automate your lead capture and qualification process with intelligent CRM integration. 
                  Never miss a potential customer again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/ai-bots/pricing" className="btn-kingdom-primary">
                    Get Started - $249
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

            {/* Tab Content */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">
                        Transform Your Lead Generation
                      </h2>
                      <p className="text-lg text-white/80 mb-6">
                        Our Lead Generation Bot automates the entire process from initial contact to qualified lead. 
                        It captures leads through multiple channels, qualifies them based on your criteria, and 
                        seamlessly integrates with your CRM system.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="text-kingdom-gold text-xl">✓</div>
                          <div>
                            <h3 className="font-semibold text-white">Multi-Channel Capture</h3>
                            <p className="text-white/70">Capture leads from website forms, social media, email campaigns, and more</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-kingdom-gold text-xl">✓</div>
                          <div>
                            <h3 className="font-semibold text-white">Intelligent Qualification</h3>
                            <p className="text-white/70">Automatically score and qualify leads based on your business criteria</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-kingdom-gold text-xl">✓</div>
                          <div>
                            <h3 className="font-semibold text-white">CRM Integration</h3>
                            <p className="text-white/70">Seamlessly sync with popular CRM platforms like Salesforce, HubSpot, and Pipedrive</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-4">Key Benefits</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                          <span className="text-white/80">Increase lead capture by 300%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                          <span className="text-white/80">Reduce qualification time by 80%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                          <span className="text-white/80">Improve lead quality by 150%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                          <span className="text-white/80">24/7 lead capture and response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'demo' && (
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Demo Chat */}
                      <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                              <span className="text-kingdom-dark font-bold">👑</span>
                            </div>
                            <div>
                              <h3 className="text-white font-bold">Kingdom Lead Gen Assistant</h3>
                              <p className="text-white/60 text-sm">Powered by Kingdom AI</p>
                            </div>
                          </div>
                          
                          {/* Conversation History */}
                          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {conversationHistory.map((msg, index) => (
                              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                                  msg.type === 'user' 
                                    ? 'bg-kingdom-gold text-kingdom-dark' 
                                    : 'bg-white/10 text-white'
                                }`}>
                                  <p className="text-sm">{msg.message}</p>
                                  <p className="text-xs opacity-60 mt-1">
                                    {msg.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="bg-white/10 text-white p-3 rounded-lg">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="mb-4">
                            <p className="text-white/60 text-sm mb-2">Quick Actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {quickActions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => setDemoMessage(action)}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-full hover:bg-kingdom-gold hover:text-kingdom-dark transition-colors"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Input Form */}
                          <form onSubmit={handleDemoSubmit} className="space-y-3">
                            <input
                              type="text"
                              value={demoMessage}
                              onChange={(e) => setDemoMessage(e.target.value)}
                              placeholder="Ask about lead generation, qualification, or CRM integration..."
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            />
                            <button
                              type="submit"
                              disabled={isLoading || !demoMessage.trim()}
                              className="w-full bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50"
                            >
                              {isLoading ? 'Processing...' : 'Send Message'}
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* Live Analytics Dashboard */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                          <h3 className="text-white font-bold mb-4">📊 Live Analytics</h3>
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-kingdom-gold">{capturedLeads}</div>
                              <div className="text-white/60 text-sm">Leads Captured</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-kingdom-gold">{leadScore}</div>
                              <div className="text-white/60 text-sm">Lead Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-kingdom-gold">{conversionRate.toFixed(1)}%</div>
                              <div className="text-white/60 text-sm">Conversion Rate</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                          <h3 className="text-white font-bold mb-4">🎯 Lead Sources</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm">Website Forms</span>
                              <span className="text-kingdom-gold font-bold">45%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm">Social Media</span>
                              <span className="text-kingdom-gold font-bold">30%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm">Email Campaigns</span>
                              <span className="text-kingdom-gold font-bold">15%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm">Referrals</span>
                              <span className="text-kingdom-gold font-bold">10%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                          <h3 className="text-white font-bold mb-4">⚡ Real-time Features</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-white/80">Multi-channel capture</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-white/80">Lead scoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-white/80">CRM integration</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-white/80">Automated nurturing</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">📝</div>
                      <h3 className="text-xl font-bold text-white mb-3">Automated Lead Capture</h3>
                      <p className="text-white/70">
                        Capture leads from website forms, social media, email campaigns, and phone calls with 
                        intelligent data extraction and validation.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">🎯</div>
                      <h3 className="text-xl font-bold text-white mb-3">Smart Qualification</h3>
                      <p className="text-white/70">
                        Automatically score and qualify leads based on your business criteria, budget, timeline, 
                        and decision-making authority.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">🔗</div>
                      <h3 className="text-xl font-bold text-white mb-3">CRM Integration</h3>
                      <p className="text-white/70">
                        Seamlessly integrate with popular CRM platforms including Salesforce, HubSpot, Pipedrive, 
                        and custom solutions.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">📊</div>
                      <h3 className="text-xl font-bold text-white mb-3">Lead Scoring</h3>
                      <p className="text-white/70">
                        Advanced lead scoring algorithms that analyze behavior, engagement, and demographic data 
                        to prioritize high-value prospects.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">🤖</div>
                      <h3 className="text-xl font-bold text-white mb-3">Follow-up Automation</h3>
                      <p className="text-white/70">
                        Automated follow-up sequences with personalized messaging based on lead behavior and 
                        qualification status.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-3xl mb-4">📈</div>
                      <h3 className="text-xl font-bold text-white mb-3">Analytics & Reporting</h3>
                      <p className="text-white/70">
                        Comprehensive analytics dashboard showing lead sources, conversion rates, qualification 
                        metrics, and ROI tracking.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                      <p className="text-white/80">Choose the plan that fits your lead generation needs</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
                        <div className="text-4xl font-bold text-kingdom-gold mb-6">$249</div>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Up to 500 leads/month</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Basic qualification</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Email integration</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Basic analytics</span>
                          </li>
                        </ul>
                        <Link href="/ai-bots/pricing" className="block w-full bg-kingdom-gold text-kingdom-dark text-center py-3 rounded-lg font-semibold hover:bg-kingdom-orange transition-colors">
                          Get Started
                        </Link>
                      </div>
                      
                      <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/50 relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-kingdom-gold text-kingdom-dark px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
                        <div className="text-4xl font-bold text-kingdom-gold mb-6">$499</div>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Up to 2,000 leads/month</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Advanced qualification</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">CRM integration</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Lead scoring</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Follow-up automation</span>
                          </li>
                        </ul>
                        <Link href="/ai-bots/pricing" className="block w-full bg-kingdom-gold text-kingdom-dark text-center py-3 rounded-lg font-semibold hover:bg-kingdom-orange transition-colors">
                          Get Started
                        </Link>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                        <div className="text-4xl font-bold text-kingdom-gold mb-6">$999</div>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Unlimited leads</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Custom qualification</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Multi-CRM support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Advanced analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-kingdom-gold">✓</span>
                            <span className="text-white/80">Priority support</span>
                          </li>
                        </ul>
                        <Link href="/ai-bots/pricing" className="block w-full bg-kingdom-gold text-kingdom-dark text-center py-3 rounded-lg font-semibold hover:bg-kingdom-orange transition-colors">
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
} 