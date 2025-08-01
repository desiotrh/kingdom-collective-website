import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';
import { useCart } from '../../contexts/CartContext';

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
  const { addItem } = useCart();
  const [activeDemo, setActiveDemo] = useState(0);

  const handleAddToCart = () => {
    addItem({
      id: 'sales-assistant-bot',
      name: 'Sales Assistant Bot',
      price: 299,
      type: 'bot',
      description: 'Intelligent sales automation with lead qualification and follow-up capabilities'
    });
  };

  return (
    <>
      <Head>
        <title>Sales Assistant Bot - Kingdom Collective</title>
        <meta name="description" content="Intelligent sales automation with lead qualification and follow-up capabilities. Transform your sales process with biblical integrity." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex justify-center mb-8">
                    <Image
                      src="/ai-bot-logos/generic-bot-logo.png"
                      alt="Sales Assistant Bot"
                      width={120}
                      height={120}
                      className="rounded-2xl shadow-2xl"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    {botData.name}
                  </h1>
                  <p className="text-2xl text-kingdom-gold font-semibold mb-4">
                    {botData.tagline}
                  </p>
                  <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                    {botData.description}
                  </p>
                  <div className="text-4xl font-bold text-kingdom-gold mb-8">
                    ${botData.price}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200"
                    >
                      Add to Cart - $299
                    </button>
                    <Link href="#demo" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                      Try Demo
                    </Link>
                  </div>
                </div>
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
                    <p className="text-white/70 mb-6">{botData.demoSteps[activeDemo].description}</p>
                    <div className="bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10 rounded-lg p-4 border border-kingdom-gold/30">
                      <p className="text-kingdom-gold font-semibold">{botData.demoSteps[activeDemo].demo}</p>
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
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                      <h3 className="text-white font-semibold text-center">{useCase}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Biblical Principles Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Biblical Foundation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {botData.biblicalPrinciples.map((principle, index) => (
                    <div key={index} className="bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/30">
                      <p className="text-white/90 text-center italic">&ldquo;{principle}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
} 