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

export default function FaithBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "🙏 Welcome! I'm your Kingdom Faith Assistant. I'm here to provide spiritual guidance, biblical wisdom, and prayer support. How can I help you grow in your faith journey today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [prayerRequests, setPrayerRequests] = useState(15);
  const [bibleReferences, setBibleReferences] = useState(8);
  const [communityMembers, setCommunityMembers] = useState(42);
  const [dailyDevotionals, setDailyDevotionals] = useState(3);
  const [spiritualGrowth, setSpiritualGrowth] = useState(4.8);

  const quickActions = [
    "I need prayer for strength",
    "What does the Bible say about hope?",
    "Help me with daily devotion",
    "I'm struggling with doubt",
    "Share a verse of encouragement"
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
          message: "I understand you need strength right now. Let me share Isaiah 41:10 with you: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.' I'll add your prayer request to our community prayer list. Would you like me to suggest some daily practices to build your spiritual strength?",
          prayers: 1,
          references: 1,
          growth: 0.1
        },
        {
          message: "The Bible speaks beautifully about hope! Romans 15:13 says, 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.' And Jeremiah 29:11 reminds us, 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.' These verses remind us that our hope is anchored in God's promises.",
          prayers: 0,
          references: 2,
          growth: 0.2
        },
        {
          message: "I'd love to help you with daily devotion! Let's start with Psalm 119:105: 'Your word is a lamp to my feet and a light to my path.' I can suggest a daily reading plan, send you morning devotionals, or help you develop a prayer routine. What area of your spiritual life would you like to focus on first?",
          prayers: 0,
          references: 1,
          growth: 0.3
        },
        {
          message: "It's completely normal to experience doubt in our faith journey. Even the disciples had moments of doubt! John 20:27-29 shows Jesus meeting Thomas in his doubt with compassion. Remember, doubt can lead to deeper faith when we bring it to God. Would you like to explore some biblical figures who also struggled with doubt?",
          prayers: 0,
          references: 1,
          growth: 0.2
        },
        {
          message: "Here's a verse to encourage you: Philippians 4:13 - 'I can do all things through Christ who strengthens me.' And 2 Corinthians 12:9 reminds us, 'My grace is sufficient for you, for my power is made perfect in weakness.' These verses remind us that God's strength is available to us in every situation.",
          prayers: 0,
          references: 2,
          growth: 0.1
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setPrayerRequests(prev => prev + selectedResponse.prayers);
      setBibleReferences(prev => prev + selectedResponse.references);
      setSpiritualGrowth(prev => Math.min(5.0, prev + selectedResponse.growth));
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
  };

  return (
    <>
      <Head>
        <title>Faith Bot - Kingdom Collective</title>
        <meta name="description" content="Biblical guidance and spiritual encouragement with prayer support. Grow in your faith with AI-powered spiritual assistance." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                {/* Emoji removed for consistency */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Faith Bot
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                  Biblical guidance and spiritual encouragement with prayer support. 
                  Grow in your faith with AI-powered spiritual assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/ai-bots/pricing" className="btn-kingdom-primary">
                    Get Started - $179
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
                  <h2 className="text-3xl font-bold text-white mb-6">Spiritual Growth & Guidance</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Biblical Reference System
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Prayer Request Management
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Daily Devotional Guidance
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Faith Community Support
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Spiritual Growth Tracking
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
                          Deepen biblical understanding
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Build consistent prayer habits
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Connect with faith community
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Navigate spiritual challenges
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">Kingdom Faith Assistant</h3>
                            <p className="text-purple-300 text-sm">Powered by Kingdom AI • Spiritual Guidance</p>
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
                            placeholder="Ask for prayer, biblical wisdom, or spiritual guidance..."
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
                      {/* Faith Analytics */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Faith Community Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Prayer Requests</span>
                            <span className="text-white font-semibold">{prayerRequests}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Bible References</span>
                            <span className="text-white font-semibold">{bibleReferences}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Community Members</span>
                            <span className="text-white font-semibold">{communityMembers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Daily Devotionals</span>
                            <span className="text-white font-semibold">{dailyDevotionals}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Spiritual Growth</span>
                            <span className="text-white font-semibold">{spiritualGrowth}/5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Prayer Requests */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Prayer Requests</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Health & Healing</span>
                            <span className="text-green-400 font-semibold">8</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Family & Relationships</span>
                            <span className="text-kingdom-gold font-semibold">5</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Work & Career</span>
                            <span className="text-yellow-400 font-semibold">2</span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Features */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Spiritual Features</h3>
                        <ul className="space-y-2 text-sm text-purple-200">
                          <li>• Biblical verse recommendations</li>
                          <li>• Prayer request tracking</li>
                          <li>• Daily devotional guidance</li>
                          <li>• Faith community connection</li>
                          <li>• Spiritual growth monitoring</li>
                          <li>• Biblical study resources</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-8">Spiritual Features</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Core Capabilities</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Biblical Reference System (KJV, NIV, ESV)</li>
                        <li>• Prayer Request Management</li>
                        <li>• Daily Devotional Guidance</li>
                        <li>• Faith Community Support</li>
                        <li>• Spiritual Growth Tracking</li>
                        <li>• Biblical Study Resources</li>
                        <li>• Prayer Reminder System</li>
                        <li>• Faith-based Counseling</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Advanced Features</h3>
                      <ul className="space-y-3 text-purple-200">
                        <li>• Personalized Bible Reading Plans</li>
                        <li>• Scripture Memorization Tools</li>
                        <li>• Faith-based Goal Setting</li>
                        <li>• Spiritual Accountability Partners</li>
                        <li>• Biblical Character Studies</li>
                        <li>• Worship Music Recommendations</li>
                        <li>• Faith-based Meditation Guides</li>
                        <li>• Spiritual Gift Assessment</li>
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
                      <h3 className="text-xl font-semibold text-white mb-4">Individual</h3>
                      <div className="text-3xl font-bold text-white mb-4">$49<span className="text-lg text-purple-300">/month</span></div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Personal prayer journal</li>
                        <li>• Daily devotional access</li>
                        <li>• Bible study resources</li>
                        <li>• Basic spiritual guidance</li>
                        <li>• Community prayer support</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Family</h3>
                      <div className="text-3xl font-bold text-white mb-4">$99<span className="text-lg text-purple-200">/month</span></div>
                      <ul className="space-y-2 text-white mb-6">
                        <li>• Up to 5 family members</li>
                        <li>• Family prayer tracking</li>
                        <li>• Age-appropriate devotionals</li>
                        <li>• Family Bible study plans</li>
                        <li>• Spiritual growth monitoring</li>
                        <li>• Faith community access</li>
                      </ul>
                      <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Get Started
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Church</h3>
                      <div className="text-3xl font-bold text-white mb-4">Custom</div>
                      <ul className="space-y-2 text-purple-200 mb-6">
                        <li>• Unlimited members</li>
                        <li>• Church-wide prayer lists</li>
                        <li>• Sermon study guides</li>
                        <li>• Ministry coordination</li>
                        <li>• Leadership resources</li>
                        <li>• Custom integrations</li>
                      </ul>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
} 