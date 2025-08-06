import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

export default function FAQKnowledgeBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [demoResponse, setDemoResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Knowledge Assistant. I can help you find answers, search through your knowledge base, and provide instant support. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [searchResults, setSearchResults] = useState(0);
  const [knowledgeArticles, setKnowledgeArticles] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

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
          message: "I found 3 relevant articles in your knowledge base. Here's the most helpful answer: [Article Title] provides step-by-step instructions. Would you like me to show you the other articles or help you with something else?",
          results: 3,
          articles: 1,
          time: 0.8
        },
        {
          message: "Based on your question, I can see you're looking for information about [topic]. I've updated our knowledge base with this new information. Here's what I found: [Detailed Answer]. Is this helpful?",
          results: 1,
          articles: 1,
          time: 1.2
        },
        {
          message: "I don't have a specific answer for that in our knowledge base, but I can help you create a new article or connect you with our support team. Would you like me to escalate this to a human agent?",
          results: 0,
          articles: 0,
          time: 0.5
        },
        {
          message: "Great question! I found 5 articles that might help. The most relevant is about [topic]. I can also show you related articles about [related topics]. Which would you like to explore first?",
          results: 5,
          articles: 1,
          time: 1.0
        },
        {
          message: "I've analyzed your question and found the perfect match in our knowledge base. Here's the answer: [Comprehensive Answer]. I've also marked this as helpful for future users. Anything else?",
          results: 1,
          articles: 1,
          time: 0.9
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setSearchResults(prev => prev + selectedResponse.results);
      setKnowledgeArticles(prev => prev + selectedResponse.articles);
      setResponseTime(prev => prev + selectedResponse.time);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    "How to reset password?",
    "Billing questions",
    "Feature requests",
    "Technical support",
    "Account settings"
  ];

  const popularSearches = [
    "password reset",
    "billing",
    "features",
    "support",
    "settings"
  ];

  return (
    <>
      <Head>
        <title>FAQ & Knowledge Base Bot - Kingdom Collective</title>
        <meta name="description" content="Intelligent FAQ handling with context-aware responses and search capabilities. Perfect for SaaS companies, e-commerce, and educational institutions." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">❓</span>
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
                  FAQ & Knowledge Base Bot
                </h1>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto">
                  Transform your support with intelligent FAQ handling, context-aware responses, 
                  and powerful search capabilities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started - $159
                </Link>
                <button
                  onClick={() => setActiveTab('demo')}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
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
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-16">
                  {/* What it does */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">What It Does</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="card-standard">
                        <h3 className="text-white text-2xl font-bold mb-4">🎯 Perfect For</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            SaaS companies and software platforms
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            E-commerce stores and online retailers
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Educational institutions and online courses
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Financial services and banking
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Healthcare and medical practices
                          </li>
                        </ul>
                      </div>
                      
                      <div className="card-standard">
                        <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            24/7 instant support availability
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Reduces support ticket volume by 70%
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Context-aware intelligent responses
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Multi-language support capabilities
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Continuous learning and improvement
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How it works */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">1</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Customer Question</h3>
                        <p className="text-white/80">
                          Customer asks a question through your website, chat widget, or support portal.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">2</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Intelligent Analysis</h3>
                        <p className="text-white/80">
                          Bot analyzes the question, searches knowledge base, and finds the most relevant answer.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">3</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Contextual Response</h3>
                        <p className="text-white/80">
                          Provides personalized, context-aware answer with additional helpful resources.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Seamless Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Website Chat', icon: '💬' },
                        { name: 'Slack', icon: '🔗' },
                        { name: 'Discord', icon: '🎮' },
                        { name: 'WhatsApp', icon: '📱' },
                        { name: 'Email Support', icon: '📧' },
                        { name: 'Help Desk', icon: '🎫' },
                        { name: 'Mobile App', icon: '📱' },
                        { name: 'API Access', icon: '🔌' }
                      ].map((platform) => (
                        <div key={platform.name} className="card-standard text-center">
                          <div className="text-3xl mb-3">{platform.icon}</div>
                          <h3 className="text-white font-bold">{platform.name}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Tab */}
              {activeTab === 'demo' && (
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Demo Chat */}
                    <div className="lg:col-span-2">
                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                            <span className="text-kingdom-dark font-bold">👑</span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold">Kingdom Knowledge Assistant</h3>
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
                            placeholder="Ask a question or search the knowledge base..."
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          />
                          <button
                            type="submit"
                            disabled={isLoading || !demoMessage.trim()}
                            className="w-full bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50"
                          >
                            {isLoading ? 'Searching...' : 'Ask Question'}
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Knowledge Base Analytics */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">📊 Search Analytics</h3>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{searchResults}</div>
                            <div className="text-white/60 text-sm">Search Results</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{knowledgeArticles}</div>
                            <div className="text-white/60 text-sm">Articles Found</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{responseTime.toFixed(1)}s</div>
                            <div className="text-white/60 text-sm">Avg Response Time</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">🔍 Popular Searches</h3>
                        <div className="space-y-2">
                          {popularSearches.map((search, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-white/80 text-sm">{search}</span>
                              <span className="text-kingdom-gold text-xs">{(Math.random() * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">⚡ Real-time Features</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Instant search</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Smart suggestions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Knowledge base</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Auto-categorization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Human escalation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-16">
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        {
                          title: 'Intelligent Search',
                          description: 'Advanced semantic search that understands context and intent',
                          icon: '🔍'
                        },
                        {
                          title: 'Context-Aware Responses',
                          description: 'Provides personalized answers based on user history and preferences',
                          icon: '🧠'
                        },
                        {
                          title: 'Article Suggestions',
                          description: 'Automatically suggests related articles and resources',
                          icon: '📚'
                        },
                        {
                          title: 'Multi-language Support',
                          description: 'Communicates fluently in multiple languages',
                          icon: '🌐'
                        },
                        {
                          title: 'Feedback Collection',
                          description: 'Learns from user feedback to improve responses',
                          icon: '📝'
                        },
                        {
                          title: 'Analytics Tracking',
                          description: 'Detailed insights into question patterns and user behavior',
                          icon: '📊'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="card-standard">
                          <div className="flex items-start space-x-4">
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                              <h3 className="text-white text-xl font-bold mb-2">{feature.title}</h3>
                              <p className="text-white/80">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Advanced Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        {
                          title: 'Knowledge Base Management',
                          description: 'Easy-to-use interface for updating and organizing content',
                          icon: '📖'
                        },
                        {
                          title: 'Escalation to Human',
                          description: 'Seamlessly transfers complex issues to human agents',
                          icon: '👥'
                        },
                        {
                          title: 'Custom Training',
                          description: 'Train the bot on your specific products and services',
                          icon: '🎓'
                        },
                        {
                          title: 'Brand Voice Matching',
                          description: 'Adapts tone and style to match your brand personality',
                          icon: '🎨'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="card-standard">
                          <div className="flex items-start space-x-4">
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                              <h3 className="text-white text-xl font-bold mb-2">{feature.title}</h3>
                              <p className="text-white/80">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Pricing Options</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic */}
                    <div className="card-standard border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Basic</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$159</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic FAQ handling
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Simple search functionality
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Email integration
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic analytics
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-kingdom-gold hover:text-black transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>

                    {/* Professional */}
                    <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30 relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </span>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-4">Professional</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$259</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Basic
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced AI responses
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Multi-language support
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Custom training
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Human escalation
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-xl hover:scale-105 transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>

                    {/* Enterprise */}
                    <div className="card-standard border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Enterprise</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$459</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Professional
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Unlimited knowledge base
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced analytics
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Priority support
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Custom integrations
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-kingdom-gold hover:text-black transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-white text-4xl font-black mb-6">
                Ready to Transform Your Support?
              </h2>
              <p className="text-white/80 text-xl mb-8">
                Join thousands of businesses providing instant, intelligent support 
                with our advanced FAQ and knowledge base bot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </section>

          {/* GitHub Repository Link */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">📦 Source Code</h3>
                <p className="text-gray-300 mb-4">Get the complete source code for this bot</p>
              </div>
              <a 
                href="https://github.com/desiotrh/faq-bot.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
} 