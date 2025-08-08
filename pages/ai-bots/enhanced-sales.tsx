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

export default function EnhancedSalesBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "Welcome! I'm your Kingdom Enhanced Sales Assistant. I can help qualify leads, manage your sales pipeline, forecast revenue, and track customer relationships. How can I help boost your sales performance today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalLeads, setTotalLeads] = useState(234);
  const [qualifiedLeads, setQualifiedLeads] = useState(89);
  const [conversionRate, setConversionRate] = useState(38);
  const [avgDealSize, setAvgDealSize] = useState(12500);
  const [pipelineValue, setPipelineValue] = useState(890000);

  const quickActions = [
    "Help me qualify leads",
    "Analyze my sales pipeline",
    "Generate sales forecasts",
    "Track customer relationships",
    "Create follow-up sequences"
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
          message: "I'll help you qualify leads efficiently! I can analyze lead behavior, engagement patterns, and buying signals to identify high-value prospects. I'll create a scoring system based on your ideal customer profile and automatically prioritize leads. What criteria do you use to qualify prospects?",
          leads: 3,
          qualified: 2,
          conversion: 2,
          dealSize: 1000,
          pipeline: 25000
        },
        {
          message: "I'll analyze your sales pipeline and identify bottlenecks, opportunities, and trends. I can show you conversion rates at each stage, average time in pipeline, and revenue projections. I'll also suggest strategies to accelerate deals and improve win rates. Which stage of your pipeline needs the most attention?",
          leads: 0,
          qualified: 1,
          conversion: 1,
          dealSize: 500,
          pipeline: 15000
        },
        {
          message: "I'll generate accurate sales forecasts based on historical data, current pipeline, and market trends. I can provide weekly, monthly, and quarterly projections with confidence intervals. I'll also identify factors that could impact your revenue and suggest mitigation strategies. What time period would you like to forecast?",
          leads: 1,
          qualified: 0,
          conversion: 2,
          dealSize: 2000,
          pipeline: 30000
        },
        {
          message: "I'll track customer relationships and engagement across all touchpoints. I can monitor communication history, purchase patterns, and satisfaction scores. I'll also identify upsell opportunities and churn risks. Would you like me to create personalized engagement strategies for your top customers?",
          leads: 0,
          qualified: 0,
          conversion: 1,
          dealSize: 1500,
          pipeline: 20000
        },
        {
          message: "I'll create automated follow-up sequences that nurture leads through your sales funnel. I can personalize messages based on lead behavior, segment prospects, and optimize timing for maximum engagement. I'll also track open rates, click-through rates, and conversion metrics. What type of follow-up sequence do you need?",
          leads: 2,
          qualified: 1,
          conversion: 1,
          dealSize: 800,
          pipeline: 18000
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalLeads(prev => prev + selectedResponse.leads);
      setQualifiedLeads(prev => prev + selectedResponse.qualified);
      setConversionRate(prev => Math.min(100, prev + selectedResponse.conversion));
      setAvgDealSize(prev => prev + selectedResponse.dealSize);
      setPipelineValue(prev => prev + selectedResponse.pipeline);
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
    <>
      <Head>
        <title>Enhanced Sales Bot - Kingdom Collective</title>
        <meta name="description" content="Advanced sales automation with lead qualification, pipeline management, and revenue forecasting. Boost your sales performance with intelligent AI assistance." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
              <div className="max-w-[960px] mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Enhanced Sales Bot
                  </h1>
                  <p className="text-white text-xl font-semibold mb-4">
                    Advanced Sales Automation & Intelligence
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                    Boost your sales performance with intelligent lead qualification, pipeline management, and revenue forecasting.
                  </p>
                </div>
              </div>
            </section>

            {/* Tab Navigation */}
            <section className="px-4 sm:px-6 lg:px-8 py-8">
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
            <section className="px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-6xl mx-auto">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-16">
                    {/* What it does */}
                    <div>
                      <h2 className="text-white text-4xl font-black mb-8">What It Does</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-standard">
                          <h3 className="text-white text-2xl font-bold mb-4">Perfect For</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Sales teams and B2B companies
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              High-value product sales
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Complex sales cycles
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Revenue-focused organizations
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card-standard">
                          <h3 className="text-white text-2xl font-bold mb-4">Key Benefits</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Increase conversion rates by 40%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Reduce sales cycle time by 30%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Improve lead qualification accuracy
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Boost revenue forecasting precision
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* How it works */}
                    <div>
                      <h2 className="text-white text-4xl font-black mb-8">How It Works</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">1. Lead Qualification</h3>
                          <p className="text-white/70">Intelligent scoring and prioritization of prospects</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">2. Pipeline Management</h3>
                          <p className="text-white/70">Track and optimize your sales funnel</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">3. Revenue Forecasting</h3>
                          <p className="text-white/70">Accurate predictions and trend analysis</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30">
                        <h3 className="text-white text-3xl font-bold mb-4">Ready to Transform Your Sales?</h3>
                        <p className="text-white/80 text-lg mb-6">Join successful sales teams using our Enhanced Sales Bot to boost performance and revenue.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/ai-bots/pricing"
                            className="btn-kingdom-primary"
                          >
                            Get Started - $399
                          </Link>
                          <button
                            onClick={() => setActiveTab('demo')}
                            className="btn-kingdom-secondary"
                          >
                            Try Demo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Demo Tab */}
                {activeTab === 'demo' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-white text-3xl font-bold mb-4">Live Demo</h2>
                      <p className="text-white/80">Experience the Enhanced Sales Bot in action</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Chat Interface */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white text-xl font-bold mb-4">Chat with the Bot</h3>
                        
                        <div className="space-y-4 mb-4 h-96 overflow-y-auto">
                          {conversationHistory.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.type === 'user'
                                    ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black'
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                {message.message}
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <form onSubmit={handleDemoSubmit} className="flex gap-2">
                          <input
                            type="text"
                            value={demoMessage}
                            onChange={(e) => setDemoMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          />
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black rounded-lg font-bold hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all disabled:opacity-50"
                          >
                            Send
                          </button>
                        </form>
                      </div>

                      {/* Analytics Dashboard */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white text-xl font-bold mb-4">Live Analytics</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{totalLeads}</div>
                            <div className="text-white/70 text-sm">Total Leads</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{qualifiedLeads}</div>
                            <div className="text-white/70 text-sm">Qualified</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{conversionRate}%</div>
                            <div className="text-white/70 text-sm">Conversion</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">${avgDealSize.toLocaleString()}</div>
                            <div className="text-white/70 text-sm">Avg Deal</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-white font-semibold">Quick Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                className="px-3 py-1 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-all"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div className="space-y-12">
                    <div className="text-center mb-8">
                      <h2 className="text-white text-3xl font-bold mb-4">Features</h2>
                      <p className="text-white/80">Advanced sales automation and intelligence tools</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Lead Qualification</h3>
                        <p className="text-white/70">Intelligent scoring and prioritization of prospects based on behavior and engagement</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Pipeline Management</h3>
                        <p className="text-white/70">Track deals through your sales funnel with automated stage progression</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Revenue Forecasting</h3>
                        <p className="text-white/70">Accurate revenue predictions based on historical data and current pipeline</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Sales Analytics</h3>
                        <p className="text-white/70">Comprehensive reporting on conversion rates, deal velocity, and performance metrics</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">AI Insights</h3>
                        <p className="text-white/70">Predictive analytics and recommendations to optimize your sales strategy</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Automated Follow-ups</h3>
                        <p className="text-white/70">Personalized email sequences and communication tracking</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-white text-3xl font-bold mb-4">Pricing</h2>
                      <p className="text-white/80">Advanced sales automation for serious revenue growth</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-white text-2xl font-bold mb-2">Starter</h3>
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$399</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Up to 500 leads/month</li>
                          <li>• Basic lead qualification</li>
                          <li>• Pipeline tracking</li>
                          <li>• Standard support</li>
                        </ul>
                        <Link
                          href="/ai-bots/pricing"
                          className="w-full btn-kingdom-primary text-center"
                        >
                          Get Started
                        </Link>
                      </div>
                      
                      <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30">
                        <div className="bg-kingdom-gold text-navy px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">Most Popular</div>
                        <h3 className="text-white text-2xl font-bold mb-2">Professional</h3>
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$699</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Up to 2000 leads/month</li>
                          <li>• Advanced AI qualification</li>
                          <li>• Revenue forecasting</li>
                          <li>• Sales analytics</li>
                          <li>• Priority support</li>
                        </ul>
                        <Link
                          href="/ai-bots/pricing"
                          className="w-full btn-kingdom-primary text-center"
                        >
                          Get Started
                        </Link>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-white text-2xl font-bold mb-2">Enterprise</h3>
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$1299</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Unlimited leads</li>
                          <li>• Custom integrations</li>
                          <li>• White-label options</li>
                          <li>• Dedicated support</li>
                          <li>• Custom training</li>
                        </ul>
                        <Link
                          href="/ai-bots/pricing"
                          className="w-full btn-kingdom-primary text-center"
                        >
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