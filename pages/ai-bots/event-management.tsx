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

export default function EventManagementBot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'features' | 'pricing'>('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Event Management Assistant. I can help you create, manage, and coordinate events of any size. What type of event are you planning today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalEvents, setTotalEvents] = useState(12);
  const [activeRegistrations, setActiveRegistrations] = useState(47);
  const [revenueGenerated, setRevenueGenerated] = useState(15420);
  const [upcomingEvents, setUpcomingEvents] = useState([
    { name: 'Tech Conference 2024', date: 'Mar 15-17', attendees: 234, revenue: 70200 },
    { name: 'Marketing Summit', date: 'Apr 8', attendees: 89, revenue: 26700 },
    { name: 'Leadership Workshop', date: 'Apr 22', attendees: 45, revenue: 13500 }
  ]);

  const quickActions = [
    "Create a new event",
    "Check registration status",
    "Manage attendee list",
    "Set up payment processing",
    "Schedule networking sessions",
    "Generate event reports"
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
          message: "Perfect! I'll help you create the Tech Conference 2024. Let me set up the event details, registration forms, and payment processing. I can also integrate with your existing calendar and marketing tools. What's your target attendee count?",
          events: 1,
          registrations: 5,
          revenue: 1500
        },
        {
          message: "Excellent! I've created your event and set up the registration system. I can see you have 47 active registrations with $15,420 in revenue. I'll also set up automated email sequences and networking matchmaking. Would you like me to create breakout sessions?",
          events: 0,
          registrations: 3,
          revenue: 900
        },
        {
          message: "I'll integrate with your Stripe account for secure payments and set up the attendee management dashboard. I can also create custom registration forms with your branding and set up automated follow-ups. What's your preferred payment structure?",
          events: 0,
          registrations: 4,
          revenue: 1200
        },
        {
          message: "Great! I'll set up the networking features with AI-powered matchmaking based on attendee profiles. I can also create virtual breakout rooms and schedule one-on-one meetings. How many networking sessions would you like?",
          events: 0,
          registrations: 2,
          revenue: 600
        },
        {
          message: "I'll generate comprehensive reports including registration analytics, revenue tracking, and attendee engagement metrics. I can also set up post-event surveys and feedback collection. What specific metrics are most important to you?",
          events: 0,
          registrations: 3,
          revenue: 900
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalEvents(prev => prev + selectedResponse.events);
      setActiveRegistrations(prev => prev + selectedResponse.registrations);
      setRevenueGenerated(prev => prev + selectedResponse.revenue);
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
        "I'll create a new event for you. Let me set up the event details, registration forms, and payment processing. What type of event are you planning?",
        "I'll check the current registration status for all your events. I can see you have 47 active registrations across 12 events. Would you like detailed analytics?",
        "I'll open the attendee management dashboard. You can view profiles, send communications, and manage check-ins. What specific attendee information do you need?",
        "I'll set up secure payment processing with Stripe integration. I can also configure multiple payment options and automatic invoicing. What payment methods do you prefer?",
        "I'll schedule networking sessions with AI-powered matchmaking. I can create virtual breakout rooms and facilitate one-on-one meetings. How many sessions do you want?",
        "I'll generate comprehensive event reports including registration analytics, revenue tracking, and attendee engagement. What time period would you like to analyze?"
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
        <title>Event Management Bot - Kingdom Collective</title>
        <meta name="description" content="Complete event management with registration, ticketing, and attendee coordination. Perfect for event planners, conference organizers, and churches." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">🎪</span>
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Event Management Bot
                </h1>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto">
                  Streamline your events with complete registration, ticketing, and attendee 
                  coordination powered by AI.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started - $229
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
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8">
                        <h3 className="text-white text-2xl font-bold mb-4">🎯 Perfect For</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Event planners and conference organizers
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Churches and religious organizations
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Networking groups and meetups
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Educational institutions and workshops
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Corporate events and team building
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8">
                        <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Automated registration and ticketing
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Real-time attendee management
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Payment processing integration
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Schedule coordination and updates
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Networking facilitation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How it works */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">1</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Event Discovery</h3>
                        <p className="text-white/80">
                          Attendees discover events through your website, social media, or direct links.
                        </p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">2</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Smart Registration</h3>
                        <p className="text-white/80">
                          Bot guides users through registration, ticket selection, and payment processing.
                        </p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">3</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Event Coordination</h3>
                        <p className="text-white/80">
                          Manages check-ins, schedule updates, networking, and post-event engagement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Seamless Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Eventbrite', icon: '🎫' },
                        { name: 'Stripe Payments', icon: '💳' },
                        { name: 'Mailchimp', icon: '📧' },
                        { name: 'Slack', icon: '💬' },
                        { name: 'Zoom', icon: '📹' },
                        { name: 'Google Calendar', icon: '📅' },
                        { name: 'WhatsApp', icon: '📱' },
                        { name: 'Discord', icon: '🎮' }
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
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Live Event Management Demo</h2>
                  <p className="text-white/80 text-center mb-12">
                    Experience the Kingdom Event Management Bot in action with real-time analytics and event creation workflows.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mr-3">
                          <span className="text-kingdom-dark text-lg">👑</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold">Kingdom Event Assistant</h3>
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
                          placeholder="Ask about event creation, registration, management..."
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
                      {/* Event Analytics */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📊 Live Event Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Events:</span>
                            <span className="text-kingdom-gold font-bold">{totalEvents}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Active Registrations:</span>
                            <span className="text-kingdom-gold font-bold">{activeRegistrations}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Revenue Generated:</span>
                            <span className="text-kingdom-gold font-bold">${revenueGenerated.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Upcoming Events */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📅 Upcoming Events</h3>
                        <div className="space-y-3">
                          {upcomingEvents.map((event, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-white font-semibold text-sm">{event.name}</p>
                                  <p className="text-white/60 text-xs">{event.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-kingdom-gold text-sm font-bold">{event.attendees} attendees</p>
                                  <p className="text-white/60 text-xs">${event.revenue.toLocaleString()}</p>
                                </div>
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
                            Event creation workflows
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Attendee management
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Payment processing
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Networking matchmaking
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Schedule coordination
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
                          title: 'Registration Handling',
                          description: 'Automated registration with customizable forms and validation',
                          icon: '📝'
                        },
                        {
                          title: 'Ticket Sales',
                          description: 'Multiple ticket types, pricing tiers, and payment processing',
                          icon: '🎫'
                        },
                        {
                          title: 'Attendee Management',
                          description: 'Real-time attendee tracking, check-ins, and communication',
                          icon: '👥'
                        },
                        {
                          title: 'Schedule Coordination',
                          description: 'Dynamic schedule updates and session management',
                          icon: '📅'
                        },
                        {
                          title: 'Networking Facilitation',
                          description: 'AI-powered matchmaking and networking opportunities',
                          icon: '🤝'
                        },
                        {
                          title: 'Post-event Surveys',
                          description: 'Automated feedback collection and analytics',
                          icon: '📊'
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
                          title: 'Virtual Event Support',
                          description: 'Seamless integration with Zoom, Teams, and streaming platforms',
                          icon: '📹'
                        },
                        {
                          title: 'Multi-language Support',
                          description: 'Communicate with attendees in their preferred language',
                          icon: '🌐'
                        },
                        {
                          title: 'Analytics Dashboard',
                          description: 'Comprehensive event metrics and attendee insights',
                          icon: '📈'
                        },
                        {
                          title: 'Custom Branding',
                          description: 'Match your event theme and brand identity',
                          icon: '🎨'
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
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Basic</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$229</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic registration forms
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Ticket sales
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Email confirmations
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic analytics
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-blue hover:text-white transition-all duration-200 text-center block"
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$329</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Basic
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced registration
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Networking features
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Virtual event support
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Custom branding
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
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Enterprise</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$529</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Professional
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Multi-language support
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
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-blue hover:text-white transition-all duration-200 text-center block"
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
                Ready to Transform Your Events?
              </h2>
              <p className="text-white/80 text-xl mb-8">
                Join thousands of event organizers creating seamless experiences 
                with our intelligent event management bot.
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
                href="https://github.com/desiotrh/event-bot.git"
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