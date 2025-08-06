import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

export default function AppointmentBookingBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [demoResponse, setDemoResponse] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Appointment Assistant. I can help you schedule appointments, manage your calendar, and handle bookings 24/7. What type of appointment would you like to book?",
      timestamp: new Date()
    }
  ]);
  const [bookedAppointments, setBookedAppointments] = useState(0);
  const [availableSlots, setAvailableSlots] = useState(12);
  const [calendarView, setCalendarView] = useState('week');

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoMessage.trim()) return;

    setIsDemoLoading(true);
    
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
          message: "Perfect! I can see you're interested in a consultation. I have availability on Tuesday at 2:00 PM, Wednesday at 10:00 AM, or Friday at 3:30 PM. Which time works best for you? I can also send you a calendar invite with video call details.",
          appointments: 1,
          slots: -1
        },
        {
          message: "Great choice! I'll send you a confirmation email with all the details. I've also added a 15-minute buffer before and after your appointment. Would you like me to send you a reminder 24 hours before?",
          appointments: 1,
          slots: -1
        },
        {
          message: "I can help you reschedule! I see you have an existing appointment. I have slots available tomorrow at 11:00 AM or Thursday at 4:00 PM. Which would you prefer?",
          appointments: 0,
          slots: 0
        },
        {
          message: "I'll set up a recurring appointment for you every Tuesday at 2:00 PM. I can also integrate with your preferred video platform (Zoom, Teams, or Google Meet). What's your preference?",
          appointments: 1,
          slots: -1
        },
        {
          message: "I can handle group bookings too! For your team meeting, I have conference rooms available. I can also set up breakout sessions and send individual calendar invites to all participants.",
          appointments: 1,
          slots: -1
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setBookedAppointments(prev => prev + selectedResponse.appointments);
      setAvailableSlots(prev => prev + selectedResponse.slots);
      setIsDemoLoading(false);
    }, 1500);
  };

  const quickActions = [
    "Book consultation",
    "Reschedule appointment",
    "Group booking",
    "Video call setup",
    "Recurring meetings"
  ];

  const timeSlots = [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 PM", available: true },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true }
  ];

  return (
    <>
      <Head>
        <title>Appointment Booking Bot - Kingdom Collective</title>
        <meta name="description" content="Automated appointment scheduling with calendar integration and payment processing. Perfect for service businesses, healthcare, and consulting." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">📅</span>
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Appointment Booking Bot
                </h1>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto">
                  Automate your scheduling with intelligent calendar integration, time zone handling, 
                  and seamless payment processing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started - $189
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
                      ? 'bg-blue text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'demo' 
                      ? 'bg-blue text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Live Demo
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'features' 
                      ? 'bg-blue text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'pricing' 
                      ? 'bg-blue text-white' 
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
                            Service businesses (consultants, coaches, therapists)
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Healthcare providers and medical practices
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Legal professionals and law firms
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Real estate agents and property managers
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Educational institutions and tutors
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8">
                        <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            24/7 availability for booking
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Automatic time zone handling
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Payment processing integration
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Calendar sync with major platforms
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Reminder notifications
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
                        <h3 className="text-white text-xl font-bold mb-4">Customer Inquiry</h3>
                        <p className="text-white/80">
                          Customer asks to book an appointment through your website, social media, or messaging platform.
                        </p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">2</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Smart Scheduling</h3>
                        <p className="text-white/80">
                          Bot checks your calendar, suggests available times, and handles time zone conversions automatically.
                        </p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">3</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Confirmation & Payment</h3>
                        <p className="text-white/80">
                          Customer confirms time, pays if required, and receives calendar invite with all details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Seamless Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Google Calendar', icon: '📅' },
                        { name: 'Outlook', icon: '📧' },
                        { name: 'Calendly', icon: '🔗' },
                        { name: 'Stripe Payments', icon: '💳' },
                        { name: 'Zoom', icon: '📹' },
                        { name: 'Teams', icon: '💻' },
                        { name: 'WhatsApp', icon: '📱' },
                        { name: 'Slack', icon: '💬' }
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
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Try the Demo</h2>
                  <p className="text-white/80 text-center mb-12">
                    Experience how the Kingdom Appointment Booking Bot handles real scheduling requests.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Demo Chat */}
                    <div className="lg:col-span-2">
                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                            <span className="text-kingdom-dark font-bold">👑</span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold">Kingdom Appointment Assistant</h3>
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
                          
                          {isDemoLoading && (
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
                            placeholder="Type your appointment request here..."
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          />
                          <button
                            type="submit"
                            disabled={isDemoLoading || !demoMessage.trim()}
                            className="w-full bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50"
                          >
                            {isDemoLoading ? 'Processing...' : 'Send Message'}
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Live Calendar & Analytics */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">📅 Live Calendar</h3>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{bookedAppointments}</div>
                            <div className="text-white/60 text-sm">Appointments Booked</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{availableSlots}</div>
                            <div className="text-white/60 text-sm">Available Slots</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">🕐 Today&apos;s Schedule</h3>
                        <div className="space-y-2">
                          {timeSlots.map((slot, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className={`text-sm ${slot.available ? 'text-white/80' : 'text-white/40 line-through'}`}>
                                {slot.time}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                slot.available 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {slot.available ? 'Available' : 'Booked'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-kingdom-dark/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/20">
                        <h3 className="text-white font-bold mb-4">⚡ Real-time Features</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Calendar sync</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Time zone handling</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Video call integration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Payment processing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-white/80">Reminder notifications</span>
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
                          title: 'Calendar Integration',
                          description: 'Syncs with Google Calendar, Outlook, and other major calendar platforms',
                          icon: '📅'
                        },
                        {
                          title: 'Time Zone Handling',
                          description: 'Automatically converts times between different time zones',
                          icon: '🌍'
                        },
                        {
                          title: 'Reminder Notifications',
                          description: 'Sends automated reminders via email, SMS, or push notifications',
                          icon: '🔔'
                        },
                        {
                          title: 'Rescheduling Capabilities',
                          description: 'Allows customers to reschedule appointments easily',
                          icon: '🔄'
                        },
                        {
                          title: 'Payment Processing',
                          description: 'Integrated payment collection for paid consultations',
                          icon: '💳'
                        },
                        {
                          title: 'Video Call Integration',
                          description: 'Automatically generates Zoom, Teams, or Google Meet links',
                          icon: '📹'
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
                          title: 'Intelligent Scheduling',
                          description: 'Learns from your preferences and optimizes scheduling patterns',
                          icon: '🧠'
                        },
                        {
                          title: 'Multi-language Support',
                          description: 'Communicates in multiple languages for global businesses',
                          icon: '🌐'
                        },
                        {
                          title: 'Analytics Dashboard',
                          description: 'Track booking patterns, conversion rates, and customer behavior',
                          icon: '📊'
                        },
                        {
                          title: 'Custom Branding',
                          description: 'Match your brand colors, logo, and messaging style',
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$189</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Calendar integration
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Time zone handling
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic reminders
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Email confirmations
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$289</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Basic
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Payment processing
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Video call integration
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced analytics
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
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$499</div>
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
                          Advanced AI training
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
                Ready to Automate Your Scheduling?
              </h2>
              <p className="text-white/80 text-xl mb-8">
                Join thousands of businesses saving time and improving customer experience 
                with our intelligent appointment booking bot.
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
                href="https://github.com/desiotrh/appointment-booking-bot.git"
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