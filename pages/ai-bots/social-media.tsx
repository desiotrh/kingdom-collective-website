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

export default function SocialMediaBot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'features' | 'pricing'>('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Social Media Assistant. I can help you create content, schedule posts, and track engagement across all your platforms. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalPosts, setTotalPosts] = useState(47);
  const [totalEngagement, setTotalEngagement] = useState(2847);
  const [followerGrowth, setFollowerGrowth] = useState(234);
  const [scheduledPosts, setScheduledPosts] = useState(12);
  const [platformStats, setPlatformStats] = useState([
    { name: 'Instagram', followers: 15420, engagement: 4.2, posts: 23 },
    { name: 'LinkedIn', followers: 8920, engagement: 2.8, posts: 15 },
    { name: 'Twitter', followers: 12340, engagement: 3.1, posts: 9 }
  ]);

  const quickActions = [
    "Create content calendar",
    "Schedule posts",
    "Analyze performance",
    "Generate hashtags",
    "Monitor engagement",
    "Track competitors"
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
          message: "I'll help you create a comprehensive content calendar! Based on your audience analysis, I recommend posting 3-4 times per week on Instagram and LinkedIn. Your best performing content type is educational posts about AI and business. Would you like me to generate next week's content plan?",
          posts: 4,
          engagement: 150,
          followers: 25,
          scheduled: 4
        },
        {
          message: "I've analyzed your social media performance and found that posts about 'AI in Business' get 40% more engagement. I suggest creating more content around this topic and scheduling posts for your peak times: Tuesday 9 AM, Thursday 2 PM, and Friday 10 AM. Should I set up automated posting?",
          posts: 0,
          engagement: 200,
          followers: 15,
          scheduled: 3
        },
        {
          message: "I'll generate optimized hashtags for your next post and schedule it for optimal engagement times. I can also create variations for different platforms and set up cross-posting. What's the main topic of your content?",
          posts: 1,
          engagement: 100,
          followers: 10,
          scheduled: 2
        },
        {
          message: "I'll monitor your engagement metrics in real-time and provide insights on what's working best. I can also track your competitors and identify trending topics in your niche. What specific metrics are most important to you?",
          posts: 0,
          engagement: 75,
          followers: 8,
          scheduled: 0
        },
        {
          message: "I'll create a content strategy based on your brand voice and audience preferences. I can also generate captions, suggest images, and optimize your posting schedule. What's your primary goal for social media?",
          posts: 2,
          engagement: 120,
          followers: 18,
          scheduled: 3
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalPosts(prev => prev + selectedResponse.posts);
      setTotalEngagement(prev => prev + selectedResponse.engagement);
      setFollowerGrowth(prev => prev + selectedResponse.followers);
      setScheduledPosts(prev => prev + selectedResponse.scheduled);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
    // Auto-submit the quick action
    const userMessage: Message = {
      type: 'user',
      message: action,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "I'll create a comprehensive content calendar for the next month. I'll analyze your best-performing content types and schedule posts for optimal engagement times. What themes or topics should I focus on?",
        "I'll schedule your posts across all platforms at the best times for engagement. I can also create platform-specific variations and set up automated posting. How many posts do you want to schedule?",
        "I'll analyze your social media performance across all platforms and provide detailed insights on engagement rates, follower growth, and content effectiveness. What time period should I analyze?",
        "I'll generate trending hashtags for your industry and create optimized hashtag combinations for maximum reach. I can also suggest hashtags based on your specific content topics. What's your main content theme?",
        "I'll monitor your engagement metrics in real-time and provide alerts for unusual activity. I can also track mentions, comments, and shares across all platforms. What engagement metrics are most important?",
        "I'll track your competitors' social media activity and identify opportunities for your brand. I can also analyze their content strategies and engagement patterns. Which competitors should I monitor?"
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Social Media Management Bot - Kingdom Collective</title>
        <meta name="description" content="Automated social media management with content scheduling and engagement tracking. Perfect for marketing agencies, influencers, and businesses." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">📱</span>
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Social Media Management Bot
                </h1>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto">
                  Automate your social media presence with intelligent content scheduling, 
                  hashtag optimization, and engagement tracking.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started - $199
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
                            Marketing agencies and consultants
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Small businesses and startups
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Influencers and content creators
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            E-commerce and retail brands
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Professional services
                          </li>
                        </ul>
                      </div>
                      
                      <div className="card-standard">
                        <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Automated content scheduling
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Hashtag optimization
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Engagement monitoring
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Cross-platform posting
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Performance analytics
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
                        <h3 className="text-white text-xl font-bold mb-4">Content Analysis</h3>
                        <p className="text-white/80">
                          Analyzes your brand, audience, and best-performing content types.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">2</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Smart Scheduling</h3>
                        <p className="text-white/80">
                          Creates content calendars and schedules posts for optimal engagement times.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">3</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Performance Tracking</h3>
                        <p className="text-white/80">
                          Monitors engagement, provides insights, and optimizes future content.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Seamless Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Instagram', icon: '📸' },
                        { name: 'Facebook', icon: '📘' },
                        { name: 'Twitter', icon: '🐦' },
                        { name: 'LinkedIn', icon: '💼' },
                        { name: 'TikTok', icon: '🎵' },
                        { name: 'YouTube', icon: '📺' },
                        { name: 'Pinterest', icon: '📌' },
                        { name: 'Snapchat', icon: '👻' }
                      ].map((platform) => (
                        <div key={platform.name} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
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
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Live Social Media Management Demo</h2>
                  <p className="text-white/80 text-center mb-12">
                    Experience the Kingdom Social Media Management Bot in action with real-time content scheduling and engagement tracking.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mr-3">
                          <span className="text-kingdom-dark text-lg">👑</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold">Kingdom Social Media Assistant</h3>
                          <p className="text-white/60 text-sm">Powered by Kingdom AI</p>
                        </div>
                      </div>
                      
                      {/* Conversation History */}
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {conversationHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'bg-blue text-white' : 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 text-white border border-kingdom-gold/30'}`}>
                              <div className="p-3 rounded-lg">
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-60 mt-1">
                                  {msg.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border border-kingdom-gold/30 rounded-lg p-3">
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
                        <p className="text-white/80 text-sm mb-2">Quick Actions:</p>
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(action)}
                              className="px-3 py-1 bg-white/10 text-white text-xs rounded-full hover:bg-white/20 transition-all duration-200"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Message Input */}
                      <form onSubmit={handleDemoSubmit} className="space-y-4">
                        <textarea
                          value={demoMessage}
                          onChange={(e) => setDemoMessage(e.target.value)}
                          placeholder="Ask about content strategy, scheduling, hashtags, analytics..."
                          className="textarea-standard w-full"
                          rows={3}
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !demoMessage.trim()}
                          className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Processing...' : 'Send Message'}
                        </button>
                      </form>
                    </div>
                    
                    {/* Live Analytics Dashboard */}
                    <div className="space-y-6">
                      {/* Social Media Analytics */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📊 Live Social Media Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Posts:</span>
                            <span className="text-kingdom-gold font-bold">{totalPosts}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Engagement:</span>
                            <span className="text-kingdom-gold font-bold">{totalEngagement.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Follower Growth:</span>
                            <span className="text-kingdom-gold font-bold">+{followerGrowth}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Scheduled Posts:</span>
                            <span className="text-kingdom-gold font-bold">{scheduledPosts}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Platform Performance */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📱 Platform Performance</h3>
                        <div className="space-y-3">
                          {platformStats.map((platform, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-white font-semibold text-sm">{platform.name}</p>
                                <span className="text-kingdom-gold text-sm font-bold">{platform.engagement}%</span>
                              </div>
                              <div className="flex justify-between text-xs text-white/60">
                                <span>{platform.followers.toLocaleString()} followers</span>
                                <span>{platform.posts} posts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Real-time Features */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">⚡ Real-time Features</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Content scheduling
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Engagement tracking
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Hashtag optimization
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Cross-platform posting
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Performance analytics
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
                          title: 'Content Scheduling',
                          description: 'Automated posting across multiple platforms at optimal times',
                          icon: '📅'
                        },
                        {
                          title: 'Hashtag Optimization',
                          description: 'AI-powered hashtag suggestions for maximum reach',
                          icon: '🏷️'
                        },
                        {
                          title: 'Engagement Monitoring',
                          description: 'Real-time tracking of likes, comments, and shares',
                          icon: '📊'
                        },
                        {
                          title: 'Trend Analysis',
                          description: 'Identify trending topics and hashtags in your niche',
                          icon: '📈'
                        },
                        {
                          title: 'Cross-platform Posting',
                          description: 'Post to multiple social networks simultaneously',
                          icon: '🔄'
                        },
                        {
                          title: 'Performance Metrics',
                          description: 'Comprehensive analytics and reporting',
                          icon: '📋'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
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
                          title: 'Content Generation',
                          description: 'AI-powered content creation based on your brand voice',
                          icon: '✍️'
                        },
                        {
                          title: 'Audience Insights',
                          description: 'Deep analysis of your audience demographics and behavior',
                          icon: '👥'
                        },
                        {
                          title: 'Competitor Analysis',
                          description: 'Monitor competitors and identify opportunities',
                          icon: '🔍'
                        },
                        {
                          title: 'Automated Responses',
                          description: 'Intelligent replies to common comments and messages',
                          icon: '💬'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$199</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic scheduling
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Hashtag suggestions
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Engagement tracking
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic analytics
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black font-bold rounded-xl hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200 text-center block"
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$299</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Basic
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Content generation
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced analytics
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Competitor analysis
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Automated responses
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$499</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Professional
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Multi-account management
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Priority support
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Custom integrations
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          White-label options
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black font-bold rounded-xl hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200 text-center block"
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
          <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-white text-4xl font-black mb-6">
                Ready to Transform Your Social Media?
              </h2>
              <p className="text-white/80 text-xl mb-8">
                Join thousands of businesses growing their online presence 
                with our intelligent social media management bot.
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
                href="https://github.com/desiotrh/social-media-bot.git"
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