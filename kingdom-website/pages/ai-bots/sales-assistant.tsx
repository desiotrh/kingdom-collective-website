import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import OptimizedVideoBackground from '../../components/OptimizedVideoBackground';

const botData = {
  id: 'sales-assistant',
  name: 'Sales Assistant Bot',
  tagline: 'Intelligent Sales Automation with Biblical Integrity',
  description: 'Transform your sales process with AI-powered lead qualification, follow-up automation, and product recommendations while maintaining wholesome communication standards.',
  price: 299,
  category: 'Sales',
  features: [
    'Lead qualification and scoring',
    'Product recommendations',
    'Follow-up automation',
    'Biblical communication standards',
    'CRM integration',
    'Performance analytics',
    'Custom sales scripts',
    'Email and SMS automation',
    'Objection handling',
    'Pipeline management',
    'Revenue forecasting',
    'Sales coaching insights'
  ],
  benefits: [
    'Increase conversion rates by 40%',
    'Reduce follow-up time by 60%',
    'Improve lead quality and scoring',
    'Maintain ethical sales practices',
    'Scale sales operations efficiently',
    'Track performance metrics'
  ],
  useCases: [
    'Real estate agencies',
    'Insurance companies',
    'Financial services',
    'SaaS businesses',
    'Consulting firms',
    'E-commerce stores'
  ],
  demoSteps: [
    {
      title: 'Lead Qualification',
      description: 'Watch how the bot intelligently qualifies leads based on your criteria',
      demo: 'Demo: Lead qualification process with scoring'
    },
    {
      title: 'Product Recommendations',
      description: 'See how the bot suggests relevant products to prospects',
      demo: 'Demo: AI-powered product matching'
    },
    {
      title: 'Follow-up Automation',
      description: 'Observe automated follow-up sequences and scheduling',
      demo: 'Demo: Multi-channel follow-up system'
    },
    {
      title: 'Performance Analytics',
      description: 'Explore the comprehensive analytics dashboard',
      demo: 'Demo: Sales performance insights'
    }
  ],
  biblicalPrinciples: [
    'Proverbs 16:3 - "Commit your work to the Lord, and your plans will be established"',
    'Colossians 3:23 - "Whatever you do, work at it with all your heart, as working for the Lord"',
    'Proverbs 11:3 - "The integrity of the upright guides them"'
  ]
};

export default function SalesAssistantBotPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'features' | 'pricing'>('overview');
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <>
      <Head>
        <title>Sales Assistant Bot - Kingdom Collective</title>
        <meta name="description" content="Intelligent sales automation with lead qualification and follow-up capabilities. Transform your sales process with biblical integrity." />
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
                    {botData.name}
                  </h1>
                  <p className="text-white text-xl font-semibold mb-4">
                    {botData.tagline}
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                    {botData.description}
                  </p>
                  <div className="text-4xl font-bold text-kingdom-gold mb-8">
                    ${botData.price}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact" className="btn-kingdom-primary">
                      Get Started Today
                    </Link>
                    <Link href="#demo" className="btn-kingdom-secondary">
                      Try Demo
                    </Link>
                  </div>
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
                              Real estate agencies
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Insurance companies
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Financial services
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              SaaS businesses
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Consulting firms
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card-standard">
                          <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                          <ul className="space-y-3 text-white/80">
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Increase conversion rates by 40%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Reduce follow-up time by 60%
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Improve lead quality and scoring
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Maintain ethical sales practices
                            </li>
                            <li className="flex items-center">
                              <span className="text-kingdom-gold mr-3">•</span>
                              Scale sales operations efficiently
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
                          <h3 className="text-white text-xl font-bold mb-4">Lead Qualification</h3>
                          <p className="text-white/80">
                            Intelligently qualifies leads based on your criteria and scoring system.
                          </p>
                        </div>
                        
                        <div className="card-standard text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">2</span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-4">Product Recommendations</h3>
                          <p className="text-white/80">
                            Suggests relevant products and services based on customer needs.
                          </p>
                        </div>
                        
                        <div className="card-standard text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">3</span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-4">Follow-up Automation</h3>
                          <p className="text-white/80">
                            Automates follow-up sequences and scheduling for optimal conversion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Demo Tab */}
                {activeTab === 'demo' && (
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-white text-4xl font-black mb-8 text-center">Live Sales Assistant Demo</h2>
                    <p className="text-white/80 text-center mb-12">
                      Experience the Kingdom Sales Assistant Bot in action with real-time lead qualification and follow-up automation.
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Demo Navigation */}
                      <div className="space-y-4">
                        {botData.demoSteps.map((step, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveDemo(index)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                              activeDemo === index
                                ? 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border-kingdom-gold/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            } border backdrop-blur-sm`}
                          >
                            <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                            <p className="text-white/70 text-sm">{step.description}</p>
                          </button>
                        ))}
                      </div>
                      
                      {/* Demo Content */}
                      <div className="lg:col-span-2">
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                          <h3 className="text-white text-xl font-bold mb-4">{botData.demoSteps[activeDemo].title}</h3>
                          <p className="text-white/80 mb-6">{botData.demoSteps[activeDemo].description}</p>
                          <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-kingdom-gold font-semibold">{botData.demoSteps[activeDemo].demo}</p>
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
                      <p className="text-white/80">Comprehensive sales automation tools</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {botData.features.map((feature, index) => (
                        <div key={index} className="card-standard">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                              <span className="text-kingdom-dark font-bold text-sm">{index + 1}</span>
                            </div>
                            <h3 className="text-white font-semibold">{feature}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-white text-4xl font-black mb-8">Pricing</h2>
                    <div className="card-standard p-8">
                      <div className="text-4xl font-bold text-kingdom-gold mb-4">${botData.price}</div>
                      <p className="text-white/80 mb-6">One-time setup fee</p>
                      <Link href="/contact" className="btn-kingdom-primary">
                        Get Started Today
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Powerful Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {botData.features.map((feature, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                          <span className="text-kingdom-dark font-bold text-sm">{index + 1}</span>
                        </div>
                        <h3 className="text-white font-semibold">{feature}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Our Sales Assistant Bot?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {botData.benefits.map((benefit, index) => (
                    <div key={index} className="bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/30">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">✅</span>
                        <h3 className="text-white font-semibold">{benefit}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Interactive Demo</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Demo Navigation */}
                  <div className="space-y-4">
                    {botData.demoSteps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveDemo(index)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                          activeDemo === index
                            ? 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border-kingdom-gold/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } border backdrop-blur-sm`}
                      >
                        <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                        <p className="text-white/70 text-sm">{step.description}</p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Demo Display */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                    <h3 className="text-white font-semibold mb-4">{botData.demoSteps[activeDemo].title}</h3>
                    <div className="bg-black/30 rounded-lg p-6 border border-white/20">
                      <div className="text-center text-white/60 mb-4">
                        <div className="text-4xl mb-2">🤖</div>
                        <p className="text-sm">{botData.demoSteps[activeDemo].demo}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                            <span className="text-white text-sm font-medium">Bot</span>
                          </div>
                          <p className="text-white/80 text-sm">Hello! I&apos;m your Kingdom Sales Assistant. How can I help you today?</p>
                        </div>
                        <div className="bg-kingdom-gold/20 rounded-lg p-3 ml-8">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span className="text-white text-sm font-medium">User</span>
                          </div>
                          <p className="text-white/80 text-sm">I&apos;m interested in your services</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                            <span className="text-white text-sm font-medium">Bot</span>
                          </div>
                          <p className="text-white/80 text-sm">Great! Let me ask you a few questions to better understand your needs...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Perfect For</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {botData.useCases.map((useCase, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200 text-center">
                      <h3 className="text-white font-semibold mb-2">{useCase}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Biblical Principles */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Biblical Foundation</h2>
                
                <div className="space-y-6">
                  {botData.biblicalPrinciples.map((principle, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <p className="text-white/90 text-center italic">&ldquo;{principle}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing & CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-8">Ready to Transform Your Sales?</h2>
                
                <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30 mb-8">
                  <div className="text-4xl font-bold text-kingdom-gold mb-4">${botData.price}</div>
                  <p className="text-white/80 mb-6">Includes setup, training, and 30 days of support</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-white/70 text-sm">
                      <div className="font-semibold text-white mb-1">Setup Included</div>
                      <p>Complete installation and configuration</p>
                    </div>
                    <div className="text-white/70 text-sm">
                      <div className="font-semibold text-white mb-1">Training Provided</div>
                      <p>Comprehensive training for your team</p>
                    </div>
                    <div className="text-white/70 text-sm">
                      <div className="font-semibold text-white mb-1">30-Day Support</div>
                      <p>Ongoing assistance and troubleshooting</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact" className="btn-kingdom-primary">
                      Purchase Now
                    </Link>
                    <Link href="/ai-bots/pricing" className="btn-kingdom-secondary">
                      View All Pricing
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
} 

