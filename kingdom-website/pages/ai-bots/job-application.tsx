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

export default function JobApplicationBot() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "Welcome! I'm your Kingdom Job Application Assistant. I can help parse resumes, screen candidates, schedule interviews, and track applications. How can I help streamline your hiring process today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalApplications, setTotalApplications] = useState(89);
  const [qualifiedCandidates, setQualifiedCandidates] = useState(23);
  const [interviewScheduled, setInterviewScheduled] = useState(12);
  const [avgResponseTime, setAvgResponseTime] = useState(2.1);
  const [hiringSuccess, setHiringSuccess] = useState(78);

  const quickActions = [
    "Help me screen candidates",
    "Schedule an interview",
    "Parse a resume",
    "Track application status",
    "Generate job descriptions"
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
          message: "I'll help you screen candidates efficiently! I can analyze resumes for key skills, experience levels, and cultural fit. I'll create a scoring system based on your job requirements and automatically rank candidates. What specific skills and experience are you looking for in this role?",
          applications: 2,
          qualified: 1,
          interviews: 0,
          success: 2
        },
        {
          message: "I'll schedule interviews automatically! I can check candidate availability, send calendar invites, and provide interview preparation materials. I'll also send reminders and follow-up emails. What type of interview format would you prefer - video call, phone, or in-person?",
          applications: 0,
          qualified: 0,
          interviews: 1,
          success: 1
        },
        {
          message: "I'll parse the resume and extract key information including skills, experience, education, and contact details. I can identify relevant keywords and match them against your job requirements. Would you like me to create a candidate profile or generate interview questions based on their background?",
          applications: 1,
          qualified: 1,
          interviews: 0,
          success: 1
        },
        {
          message: "I'll track the application status in real-time! I can show you where each candidate is in the hiring pipeline - from application received to interview scheduled to offer made. I'll also send automated status updates to candidates. What stage are you most interested in tracking?",
          applications: 0,
          qualified: 0,
          interviews: 0,
          success: 2
        },
        {
          message: "I'll generate compelling job descriptions! I can create detailed job postings based on your requirements, company culture, and industry standards. I'll include key responsibilities, qualifications, and benefits. What position are you hiring for and what are the key requirements?",
          applications: 3,
          qualified: 2,
          interviews: 0,
          success: 1
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalApplications(prev => prev + selectedResponse.applications);
      setQualifiedCandidates(prev => prev + selectedResponse.qualified);
      setInterviewScheduled(prev => prev + selectedResponse.interviews);
      setHiringSuccess(prev => Math.min(100, prev + selectedResponse.success));
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
        <title>Job Application Bot - Kingdom Collective</title>
        <meta name="description" content="Automated job application processing with resume parsing and candidate screening. Streamline your hiring process with intelligent recruitment automation." />
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
                    Job Application Bot
                  </h1>
                  <p className="text-white text-xl font-semibold mb-4">
                    Intelligent Recruitment Automation
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                    Streamline your hiring process with automated resume parsing, candidate screening, and interview scheduling.
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
                              HR departments and recruitment teams
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Staffing agencies and headhunters
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Growing companies with hiring needs
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Remote-first organizations
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card-standard">
                          <h3 className="text-white text-2xl font-bold mb-4">Key Benefits</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Reduce time-to-hire by 60%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Improve candidate quality with AI screening
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Automate repetitive recruitment tasks
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Enhance candidate experience
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
                          <h3 className="text-white text-xl font-bold mb-2">1. Resume Parsing</h3>
                          <p className="text-white/70">Automatically extract key information from resumes and applications</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">2. AI Screening</h3>
                          <p className="text-white/70">Intelligent candidate evaluation based on job requirements</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl"></span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">3. Interview Scheduling</h3>
                          <p className="text-white/70">Automated calendar coordination and interview setup</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30">
                        <h3 className="text-white text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h3>
                        <p className="text-white/80 text-lg mb-6">Join hundreds of companies using our Job Application Bot to streamline their recruitment process.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/ai-bots/pricing"
                            className="btn-kingdom-primary"
                          >
                            Get Started - $229
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
                      <p className="text-white/80">Experience the Job Application Bot in action</p>
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
                            <div className="text-2xl font-bold text-kingdom-gold">{totalApplications}</div>
                            <div className="text-white/70 text-sm">Applications</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{qualifiedCandidates}</div>
                            <div className="text-white/70 text-sm">Qualified</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{interviewScheduled}</div>
                            <div className="text-white/70 text-sm">Interviews</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-kingdom-gold">{hiringSuccess}%</div>
                            <div className="text-white/70 text-sm">Success Rate</div>
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
                      <p className="text-white/80">Comprehensive recruitment automation tools</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Resume Parsing</h3>
                        <p className="text-white/70">Extract key information from resumes including skills, experience, education, and contact details</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">AI Screening</h3>
                        <p className="text-white/70">Intelligent candidate evaluation based on job requirements and company culture</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Interview Scheduling</h3>
                        <p className="text-white/70">Automated calendar coordination and interview setup with reminders</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Analytics Dashboard</h3>
                        <p className="text-white/70">Track hiring metrics, time-to-fill, and recruitment performance</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Automated Communication</h3>
                        <p className="text-white/70">Send personalized emails and status updates to candidates</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-3xl mb-4"></div>
                        <h3 className="text-white text-xl font-bold mb-2">Job Description Generator</h3>
                        <p className="text-white/70">Create compelling job postings based on requirements and company culture</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-white text-3xl font-bold mb-4">Pricing</h2>
                      <p className="text-white/80">Simple, transparent pricing for your recruitment needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <h3 className="text-white text-2xl font-bold mb-2">Starter</h3>
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$229</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Up to 100 applications/month</li>
                          <li>• Basic resume parsing</li>
                          <li>• Email notifications</li>
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
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$399</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Up to 500 applications/month</li>
                          <li>• Advanced AI screening</li>
                          <li>• Interview scheduling</li>
                          <li>• Analytics dashboard</li>
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
                        <div className="text-3xl font-bold text-kingdom-gold mb-4">$799</div>
                        <ul className="space-y-3 text-white/70 mb-8">
                          <li>• Unlimited applications</li>
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