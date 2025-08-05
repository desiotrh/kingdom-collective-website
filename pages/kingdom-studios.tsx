import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function KingdomStudios() {
  const features = [
    {
      title: 'Content Creation Hub',
      description: 'Create, edit, and manage all your content in one powerful platform.',
      icon: '🎬'
    },
    {
      title: 'Creator Analytics',
      description: 'Track your growth, engagement, and audience insights with detailed analytics.',
      icon: '📊'
    },
    {
      title: 'Community Building',
      description: 'Build and nurture your community with integrated tools and features.',
      icon: '👥'
    },
    {
      title: 'Monetization Tools',
      description: 'Multiple revenue streams including courses, memberships, and digital products.',
      icon: '💰'
    },
    {
      title: 'AI-Powered Editing',
      description: 'Advanced AI tools to enhance your content creation workflow.',
      icon: '🤖'
    },
    {
      title: 'Multi-Platform Publishing',
      description: 'Publish to all major platforms from one centralized dashboard.',
      icon: '🚀'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic content creation tools',
        '5 projects per month',
        'Standard templates (10 templates)',
        'Basic AI assistance',
        'Community support',
        '1GB storage',
        '7-day free trial of Pro features'
      ],
      popular: false,
      trial: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        'Everything in Free',
        'Unlimited projects',
        'Premium templates (50+ templates)',
        'Advanced AI features',
        'Custom branding',
        'Advanced analytics dashboard',
        'Priority support',
        '50GB storage',
        'Export in multiple formats',
        'Social media scheduling',
        '14-day free trial'
      ],
      popular: true,
      trial: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 10 members)',
        'White-label options',
        'Custom integrations',
        'Advanced workflow automation',
        'Dedicated account manager',
        '500GB storage',
        'API access',
        'Custom training sessions',
        'Advanced security features',
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
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/kingdom-studios-logo.png"
                alt="Kingdom Studios Logo"
                width={120}
                height={120}
                className="h-24 sm:h-30 w-auto rounded-xl mx-auto mb-6"
                priority
              />
            </div>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Kingdom Studios
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              The ultimate content creation hub for faith-driven visionaries. Create, grow, and monetize your digital presence with powerful tools designed for creators who want to make a lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://app.kingdomcollective.pro', '_blank')}
                className="bg-gray text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-blue hover:text-white transition-all duration-200"
              >
                Launch Kingdom Studios
              </button>
              <Link href="#features" className="bg-gray text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-blue hover:text-white transition-all duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Powerful Features
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                Everything you need to create, grow, and monetize your digital presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-6 hover:bg-black/30 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Choose Your Plan
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto mb-4">
                Start free and scale as you grow. No hidden fees, cancel anytime.
              </p>
              <div className="bg-blue/20 border border-blue/30 rounded-xl p-4 max-w-2xl mx-auto">
                <p className="text-blue font-bold text-base sm:text-lg">🎉 Start Free Today!</p>
                <p className="text-white text-xs sm:text-sm">All paid plans include a 14-day free trial. No credit card required to start.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <div key={index} className={`relative bg-black/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 ${
                  tier.popular ? 'bg-black/30' : ''
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue text-navy px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {tier.trial && !tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue text-navy px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                        14-Day Free Trial
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-2">{tier.name}</h3>
                      <div className="mb-6">
                        <span className="text-white text-4xl font-black">{tier.price}</span>
                        <span className="text-white text-lg">{tier.period}</span>
                      </div>
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
                    <div className="text-center">
                      <button 
                        onClick={() => window.open('https://app.kingdomcollective.pro', '_blank')}
                        className="w-full py-3 px-6 rounded-full font-bold bg-gray text-white hover:bg-blue hover:text-white transition-all duration-200"
                      >
                        Get Started
                      </button>
                    </div>
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