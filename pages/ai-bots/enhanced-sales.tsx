import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
      message: "🚀 Welcome! I'm your Kingdom Enhanced Sales Assistant. I can help qualify leads, manage your sales pipeline, forecast revenue, and track customer relationships. How can I help boost your sales performance today?",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>Enhanced Sales Bot - Kingdom Collective</title>
        <meta name="description" content="AI-powered lead qualification, pipeline management, and revenue forecasting for sales excellence" />
      </Head>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Enhanced Sales Bot
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              AI-powered lead qualification, pipeline management, and revenue forecasting. 
              Boost your sales performance with intelligent automation and predictive insights.
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
            <h2 className="text-3xl font-bold text-white mb-6">Sales Excellence</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                <ul className="space-y-3 text-purple-200">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced Lead Qualification
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Pipeline Management
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Revenue Forecasting
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customer Relationship Tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Predictive Analytics
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
                    Increase conversion rates by 150%
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Reduce sales cycle time by 40%
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Improve forecast accuracy by 85%
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Boost average deal size by 60%
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Kingdom Enhanced Sales Assistant</h3>
                      <p className="text-purple-300 text-sm">Powered by Kingdom AI • Revenue Growth</p>
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
                      placeholder="Ask about lead qualification, pipeline management, or revenue forecasting..."
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
                {/* Sales Analytics */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Sales Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Total Leads</span>
                      <span className="text-white font-semibold">{totalLeads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Qualified Leads</span>
                      <span className="text-white font-semibold">{qualifiedLeads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Conversion Rate</span>
                      <span className="text-white font-semibold">{conversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Avg Deal Size</span>
                      <span className="text-white font-semibold">${avgDealSize.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Pipeline Value</span>
                      <span className="text-white font-semibold">${pipelineValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Stages */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Pipeline Stages</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Prospecting</span>
                      <span className="text-green-400 font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Qualification</span>
                      <span className="text-blue-400 font-semibold">32</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Proposal</span>
                      <span className="text-yellow-400 font-semibold">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Negotiation</span>
                      <span className="text-orange-400 font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Closed Won</span>
                      <span className="text-purple-400 font-semibold">8</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Features */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Sales Features</h3>
                  <ul className="space-y-2 text-sm text-purple-200">
                    <li>• Advanced lead qualification</li>
                    <li>• Pipeline management</li>
                    <li>• Revenue forecasting</li>
                    <li>• Customer relationship tracking</li>
                    <li>• Predictive analytics</li>
                    <li>• Automated follow-ups</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Sales Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Core Capabilities</h3>
                <ul className="space-y-3 text-purple-200">
                  <li>• Advanced Lead Qualification</li>
                  <li>• Pipeline Management</li>
                  <li>• Revenue Forecasting</li>
                  <li>• Customer Relationship Tracking</li>
                  <li>• Predictive Analytics</li>
                  <li>• Automated Follow-ups</li>
                  <li>• Deal Scoring</li>
                  <li>• Sales Activity Tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                <ul className="space-y-3 text-purple-200">
                  <li>• AI-powered Lead Scoring</li>
                  <li>• Churn Prediction</li>
                  <li>• Upsell Opportunity Detection</li>
                  <li>• Sales Performance Analytics</li>
                  <li>• Territory Management</li>
                  <li>• Commission Tracking</li>
                  <li>• Sales Coaching Insights</li>
                  <li>• Market Trend Analysis</li>
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
                  <li>• Up to 500 leads/month</li>
                  <li>• Basic lead qualification</li>
                  <li>• Simple pipeline tracking</li>
                  <li>• Email notifications</li>
                  <li>• Standard reports</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                  Get Started
                </button>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Professional</h3>
                <div className="text-3xl font-bold text-white mb-4">$299<span className="text-lg text-purple-200">/month</span></div>
                <ul className="space-y-2 text-white mb-6">
                  <li>• Up to 2000 leads/month</li>
                  <li>• AI-powered qualification</li>
                  <li>• Advanced pipeline management</li>
                  <li>• Revenue forecasting</li>
                  <li>• Advanced analytics</li>
                  <li>• Multi-user access</li>
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
                  <li>• Custom integrations</li>
                  <li>• White-label solutions</li>
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
    </div>
  );
} 