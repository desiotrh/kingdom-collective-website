import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function KingdomClips() {
  const features = [
    {
      title: 'AI Video Editing',
      description: 'Automatically edit and enhance your videos with advanced AI technology.',
      icon: '🤖'
    },
    {
      title: 'Multi-Platform Optimization',
      description: 'Optimize videos for Reels, Shorts, TikTok, and YouTube automatically.',
      icon: '📱'
    },
    {
      title: 'Smart Captions',
      description: 'Generate engaging captions and subtitles with AI-powered transcription.',
      icon: '💬'
    },
    {
      title: 'Trending Effects',
      description: 'Access the latest trending effects and transitions for viral content.',
      icon: '✨'
    },
    {
      title: 'Batch Processing',
      description: 'Edit multiple videos simultaneously to save time and increase output.',
      icon: '⚡'
    },
    {
      title: 'Analytics & Insights',
      description: 'Track performance and optimize your content strategy with detailed analytics.',
      icon: '📊'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic video editing tools',
        '3 video exports per month',
        'Standard video templates',
        'Basic AI video enhancement',
        'Community support',
        '2GB storage',
        '7-day free trial of Pro features'
      ],
      popular: false,
      trial: false
    },
    {
      name: 'Pro',
      price: '$39',
      period: '/month',
      features: [
        'Everything in Free',
        'Unlimited video exports',
        'Premium video templates',
        'Advanced AI video enhancement',
        '4K export quality',
        'Custom branding',
        'Advanced video effects',
        'Priority support',
        '100GB storage',
        'Multiple export formats',
        'Social media optimization',
        '14-day free trial'
      ],
      popular: true,
      trial: true
    },
    {
      name: 'Enterprise',
      price: '$129',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 15 members)',
        'White-label video platform',
        'Custom video integrations',
        'Advanced video analytics',
        'Dedicated video specialist',
        '1TB storage',
        'API access for video processing',
        'Custom video workflows',
        'Advanced security and compliance',
        '14-day free trial'
      ],
      popular: false,
      trial: true
    }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/kingdom-clips-logo.png"
                alt="Kingdom Clips Logo"
                width={120}
                height={120}
                className="h-30 w-auto rounded-xl mx-auto mb-6"
                priority
              />
            </div>
            <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Kingdom <span className="text-blue">Clips</span>
            </h1>
            <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Transform your raw footage into viral content with AI-powered video editing. Create engaging Reels, Shorts, and TikTok videos in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://clips.kingdomcollective.pro', '_blank')}
                className="bg-blue text-navy px-8 py-4 rounded-full text-lg font-bold hover:bg-blue/90 transition-all duration-200"
              >
                Launch Kingdom Clips
              </button>
              <Link href="#features" className="bg-gray text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray/90 transition-all duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                AI-Powered <span className="text-blue">Features</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal max-w-3xl mx-auto">
                Everything you need to create viral video content with the power of artificial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-6 hover:bg-black/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Choose Your <span className="text-blue">Plan</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal max-w-3xl mx-auto mb-4">
                Start creating viral content today. Scale as you grow.
              </p>
              <div className="bg-blue/20 border border-blue/30 rounded-xl p-4 max-w-2xl mx-auto">
                <p className="text-blue font-bold text-lg">🎉 Start Free Today!</p>
                <p className="text-white text-sm">All paid plans include a 14-day free trial. No credit card required to start.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <div key={index} className={`relative bg-black/20 backdrop-blur-sm border rounded-xl p-8 ${
                  tier.popular ? 'border-blue/50 bg-black/30' : 'border-gray/30'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue text-navy px-4 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {tier.trial && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                     <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                 14-Day Free Trial
               </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-white text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-6">
                      <span className="text-white text-4xl font-black">{tier.price}</span>
                      <span className="text-white text-lg">{tier.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-white flex items-center">
                          <svg className="w-5 h-5 text-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => window.open('https://clips.kingdomcollective.pro', '_blank')}
                      className={`w-full py-3 px-6 rounded-full font-bold transition-all duration-200 ${
                        tier.popular 
                          ? 'bg-blue text-navy hover:bg-blue/90' 
                          : 'bg-gray text-white hover:bg-gray/90'
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 