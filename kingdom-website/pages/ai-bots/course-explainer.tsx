import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import OptimizedVideoBackground from '../../components/OptimizedVideoBackground';

interface Message {
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function CourseExplainerBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "Welcome! I'm your Kingdom Course Explainer Assistant. I can help you understand complex topics, create study guides, and provide personalized learning experiences. What subject would you like to explore today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalTopics, setTotalTopics] = useState(24);
  const [completedLessons, setCompletedLessons] = useState(8);
  const [studyTime, setStudyTime] = useState(3.5);
  const [retentionRate, setRetentionRate] = useState(87);

  const quickActions = [
    "Explain a concept",
    "Create study guide",
    "Practice questions",
    "Review progress",
    "Set learning goals"
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
          message: "I'll help you understand this concept step by step! Let me break it down into digestible parts and create a visual explanation. I can also provide practice questions to reinforce your understanding. What specific aspect would you like me to focus on?",
          topics: 1,
          lessons: 1,
          time: 0.5,
          retention: 2
        },
        {
          message: "Perfect! I'll create a comprehensive study guide for this topic. I'll include key concepts, examples, practice problems, and a summary. I can also adapt the difficulty based on your current understanding. How much detail would you like?",
          topics: 0,
          lessons: 2,
          time: 1.0,
          retention: 3
        },
        {
          message: "I'll generate practice questions tailored to your learning level. I can create multiple-choice, short answer, and essay questions. I'll also provide detailed explanations for each answer to help you learn from mistakes. What type of questions do you prefer?",
          topics: 0,
          lessons: 1,
          time: 0.8,
          retention: 2
        },
        {
          message: "Let me analyze your learning progress and identify areas for improvement. I can see you're doing well in some topics but struggling with others. I'll create a personalized study plan to help you improve. What's your target score?",
          topics: 0,
          lessons: 0,
          time: 0.3,
          retention: 1
        },
        {
          message: "I'll help you set realistic learning goals and create a study schedule. I can break down complex topics into manageable chunks and track your progress over time. What's your timeline for mastering this subject?",
          topics: 1,
          lessons: 1,
          time: 0.7,
          retention: 2
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalTopics(prev => prev + selectedResponse.topics);
      setCompletedLessons(prev => prev + selectedResponse.lessons);
      setStudyTime(prev => prev + selectedResponse.time);
      setRetentionRate(prev => Math.min(100, prev + selectedResponse.retention));
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
  };

  return (
    <>
      <Head>
        <title>Course Explainer Bot - Kingdom Collective</title>
        <meta name="description" content="AI-powered course explanation and personalized learning assistance. Transform complex topics into understandable concepts with interactive learning experiences." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <div className="fixed inset-0 z-0"><OptimizedVideoBackground videoSrc="/assets/Heavenly-BG-video.mp4" fadeHeight={31} fadeColor="#0B0614" opacity={1} playbackRate={1.0} pauseOnScroll={true} scrollThreshold={200} frozen={true} frozenFrame={0.3} /></div>
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
              <div className="max-w-[960px] mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Course Explainer Bot
                  </h1>
                  <p className="text-white text-xl font-semibold mb-4">
                    Personalized Learning & Concept Mastery
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                    Transform complex topics into understandable concepts with AI-powered explanations and personalized learning experiences.
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
                          <h3 className="text-white text-2xl font-bold mb-4">🎯 Perfect For</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Students and learners of all ages
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Educational institutions and teachers
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Corporate training programs
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Self-directed learners
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card-standard">
                          <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Improve learning outcomes by 40%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Reduce study time by 30%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Increase retention rates
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Personalized learning experience
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
                          <h3 className="text-white text-xl font-bold mb-2">1. Concept Analysis</h3>
                          <p className="text-white/70">Break down complex topics into understandable components</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">2. Personalized Learning</h3>
                          <p className="text-white/70">Adapt explanations to your learning style and pace</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">3. Progress Tracking</h3>
                          <p className="text-white/70">Monitor your understanding and retention over time</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30">
                        <h3 className="text-white text-3xl font-bold mb-4">Ready to Master Any Subject?</h3>
                        <p className="text-white/80 text-lg mb-6">Join thousands of learners using our Course Explainer Bot to understand complex topics.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/ai-bots/pricing"
                            className="btn-kingdom-primary"
                          >
                            Get Started - $279
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
                      <p className="text-white/80">Experience the Course Explainer Bot in action</p>
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
                        <h3 className="text-white text-xl font-bold mb-4">Learning Analytics</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{totalTopics}</div>
                            <div className="text-white/70 text-sm">Topics</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{completedLessons}</div>
                            <div className="text-white/70 text-sm">Lessons</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{studyTime}h</div>
                            <div className="text-white/70 text-sm">Study Time</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{retentionRate}%</div>
                            <div className="text-white/70 text-sm">Retention</div>
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
                      <p className="text-white/80">Comprehensive learning and explanation tools</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Concept Analysis</h3>
                        <p className="text-white/70">Break down complex topics into understandable components</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Personalized Learning</h3>
                        <p className="text-white/70">Adapt explanations to your learning style and pace</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Progress Tracking</h3>
                        <p className="text-white/70">Monitor your understanding and retention over time</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Practice Questions</h3>
                        <p className="text-white/70">Generate tailored practice problems and assessments</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Study Guides</h3>
                        <p className="text-white/70">Create comprehensive study materials and summaries</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Interactive Learning</h3>
                        <p className="text-white/70">Engage with gamified learning experiences</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-white text-3xl font-bold mb-4">Pricing</h2>
                      <p className="text-white/80">Affordable learning solutions for everyone</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-white text-2xl font-bold mb-2">Student</h3>
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$279</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Access to 5 subjects</li>
                          <li>• Basic progress tracking</li>
                          <li>• Standard assessments</li>
                          <li>• Study time analytics</li>
                          <li>• Email support</li>
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
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$479</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Unlimited subjects</li>
                          <li>• Advanced analytics</li>
                          <li>• Interactive assessments</li>
                          <li>• Personalized learning paths</li>
                          <li>• Priority support</li>
                          <li>• Progress certifications</li>
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
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$879</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Custom learning paths</li>
                          <li>• White-label solutions</li>
                          <li>• API integrations</li>
                          <li>• Dedicated support</li>
                          <li>• Custom assessments</li>
                          <li>• Advanced analytics</li>
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

