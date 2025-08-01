import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Apps() {
  const apps = [
    {
      name: 'Kingdom Studios',
      description: 'The ultimate content creation hub for faith-driven visionaries. Create, grow, and monetize your digital presence with powerful tools designed for creators who want to make a lasting impact.',
      logo: '/kingdom-studios-logo.png',
      href: '/kingdom-studios',
      features: ['Content Creation Hub', 'Creator Analytics', 'Community Building', 'Monetization Tools', 'AI-Powered Editing', 'Multi-Platform Publishing'],
      color: 'blue'
    },
    {
      name: 'Kingdom Clips',
      description: 'Create engaging short-form video content that resonates with your audience. Perfect for TikTok, Instagram Reels, and YouTube Shorts with faith-based inspiration.',
      logo: '/kingdom-clips-logo.png',
      href: '/kingdom-clips',
      features: ['Video Templates', 'AI Script Generation', 'Trend Analysis', 'Faith-Based Themes', 'Multi-Platform Export', 'Community Collaboration'],
      color: 'purple'
    },
    {
      name: 'Kingdom Voice',
      description: 'Transform your message into powerful audio content. From podcasts to voiceovers, amplify your voice with tools designed for spiritual leaders and content creators.',
      logo: '/kingdom-voice-logo.png',
      href: '/kingdom-voice',
      features: ['Podcast Creation', 'Voice Recording', 'Audio Editing', 'Script Generation', 'Distribution Tools', 'Analytics Dashboard'],
      color: 'green'
    },
    {
      name: 'Kingdom Launchpad',
      description: 'Launch your digital products and courses with confidence. Everything you need to create, sell, and scale your knowledge-based business.',
      logo: '/kingdom-launchpad-logo.png',
      href: '/kingdom-launchpad',
      features: ['Course Creation', 'Digital Products', 'Payment Processing', 'Student Management', 'Marketing Tools', 'Analytics & Insights'],
      color: 'orange'
    },
    {
      name: 'Kingdom Circle',
      description: 'Build and nurture your community with purpose. Create meaningful connections, host events, and foster spiritual growth in a safe, supportive environment.',
      logo: '/kingdom-circle-logo.png',
      href: '/kingdom-circle',
      features: ['Community Building', 'Event Hosting', 'Group Management', 'Prayer Requests', 'Resource Sharing', 'Member Analytics'],
      color: 'pink'
    },
    {
      name: 'Kingdom Lens',
      description: 'Capture life\'s beautiful moments with purpose. Plan, shoot, and share your photography with tools designed for creatives of faith.',
      logo: '/kingdom-lens-logo.png',
      href: '/kingdom-lens',
      features: ['Photo Planning', 'Editing Tools', 'Story Templates', 'Faith-Based Themes', 'Social Sharing', 'Portfolio Building'],
      color: 'teal'
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
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Our <span className="text-blue">Studio Apps</span>
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              A complete suite of tools designed to empower faith-driven creators, entrepreneurs, and community builders. Each app is built with purpose and designed for Kingdom impact.
            </p>
          </div>
        </section>

        {/* Apps Grid */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {apps.map((app, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-6 sm:p-8 hover:bg-black/30 transition-all duration-300 flex flex-col h-full">
                  {/* App Header */}
                  <div className="flex items-start gap-4 sm:gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={app.logo}
                        alt={`${app.name} Logo`}
                        width={80}
                        height={80}
                        className="h-16 sm:h-20 w-auto rounded-xl"
                        priority
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">{app.name}</h3>
                      <p className="text-white text-sm sm:text-base leading-relaxed">{app.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-blue font-bold mb-4">Key Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {app.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <span className="text-blue mr-2">•</span>
                          <span className="text-white text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex gap-4 mt-auto">
                    <Link
                      href={app.href}
                      className="bg-gray text-white px-6 py-3 rounded-full font-bold hover:bg-blue hover:text-white transition-all duration-200"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={() => window.open('https://app.kingdomcollective.pro', '_blank')}
                      className="bg-gray text-white px-6 py-3 rounded-full font-bold hover:bg-blue hover:text-white transition-all duration-200"
                    >
                      Launch App
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Seamless <span className="text-blue">Integration</span>
            </h2>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12">
              All our apps work together as one unified ecosystem. Share content across platforms, manage your community, and grow your impact with tools that actually work together.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">🔄</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3">Cross-Platform Sync</h3>
                <p className="text-white text-sm sm:text-base">Content and data sync seamlessly across all your Kingdom apps.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">👥</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3">Unified Community</h3>
                <p className="text-white text-sm sm:text-base">One community, multiple touchpoints across all your platforms.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">📊</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3">Centralized Analytics</h3>
                <p className="text-white text-sm sm:text-base">Track your impact across all platforms from one dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Ready to <span className="text-blue">Get Started</span>?
            </h2>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Choose the app that fits your current needs, or explore our complete ecosystem to see how they work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/features" className="bg-gray text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-blue hover:text-white transition-all duration-200">
                Learn About Features
              </Link>
              <Link href="/vision" className="bg-gray text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-blue hover:text-white transition-all duration-200">
                Our Vision
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 