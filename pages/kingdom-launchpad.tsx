import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function KingdomLaunchpad() {
  const features = [
    {
      title: 'Product Launch Tools',
      description: 'Complete suite of tools to launch your digital products with confidence.',
      icon: '🚀'
    },
    {
      title: 'Sales Funnel Builder',
      description: 'Create high-converting sales funnels with our intuitive drag-and-drop builder.',
      icon: '📈'
    },
    {
      title: 'Payment Processing',
      description: 'Secure payment processing with support for all major payment methods.',
      icon: '💳'
    },
    {
      title: 'Email Marketing',
      description: 'Built-in email marketing tools to nurture your audience and drive sales.',
      icon: '📧'
    },
    {
      title: 'Analytics & Tracking',
      description: 'Track conversions, revenue, and customer behavior with detailed analytics.',
      icon: '📊'
    },
    {
      title: 'Wisdom-Based Strategy',
      description: 'Launch strategies rooted in biblical wisdom and proven business principles.',
      icon: '📖'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic business planning tools',
        '1 business plan',
        'Standard business templates',
        'Basic financial calculators',
        'Community support',
        '1GB storage',
        '7-day free trial of Pro features'
      ],
      popular: false,
      trial: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Free',
        'Unlimited business plans',
        'Premium business templates',
        'Advanced financial modeling',
        'Custom branding',
        'Business analytics dashboard',
        'Priority support',
        '100GB storage',
        'Export in multiple formats',
        'Investor pitch tools',
        'Market research tools',
        '14-day free trial'
      ],
      popular: true,
      trial: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 20 members)',
        'White-label business platform',
        'Custom business integrations',
        'Advanced business analytics',
        'Dedicated business consultant',
        '1TB storage',
        'API access for business data',
        'Custom business workflows',
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
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/kingdom-launchpad-logo.png"
                alt="Kingdom Launchpad Logo"
                width={120}
                height={120}
                className="h-24 sm:h-30 w-auto rounded-xl mx-auto mb-6"
                priority
              />
            </div>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Kingdom Launchpad
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Launch your digital products with confidence using tools rooted in wisdom. Build, launch, and scale your online business with proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://launchpad.kingdomcollective.pro', '_blank')}
                className="bg-gray text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-blue hover:text-white transition-all duration-200"
              >
                Launch Kingdom Launchpad
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
                Launch Features
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                Everything you need to successfully launch and scale your digital products.
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
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                Start launching your products today. Scale as your business grows.
              </p>
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
                  <div className="text-center">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-6">
                      <span className="text-white text-3xl sm:text-4xl font-black">{tier.price}</span>
                      <span className="text-white text-base sm:text-lg">{tier.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-white flex items-center">
                          <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => window.open('https://launchpad.kingdomcollective.pro', '_blank')}
                      className="w-full py-3 px-6 rounded-full font-bold bg-gray text-white hover:bg-blue hover:text-white transition-all duration-200"
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