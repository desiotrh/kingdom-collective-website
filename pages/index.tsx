import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AppCard from '../components/AppCard';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Home() {
  const apps = [
    {
      title: 'Kingdom Studios',
      description: 'The ultimate content creation hub for faith-driven visionaries. Create, grow, and monetize your digital presence with powerful tools designed for creators who want to make a lasting impact.',
      icon: '🎬',
      logo: '/kingdom-studios-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-studios',
    },
    {
      title: 'Kingdom Clips',
      description: 'Create engaging short-form video content that resonates with your audience. Perfect for TikTok, Instagram Reels, and YouTube Shorts with faith-based inspiration.',
      icon: '📱',
      logo: '/kingdom-clips-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-clips',
    },
    {
      title: 'Kingdom Voice',
      description: 'Transform your message into powerful audio content. From podcasts to voiceovers, amplify your voice with tools designed for spiritual leaders and content creators.',
      icon: '🎤',
      logo: '/kingdom-voice-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-voice',
    },
    {
      title: 'Kingdom Launchpad',
      description: 'Launch your digital products and courses with confidence. Everything you need to create, sell, and scale your knowledge-based business.',
      icon: '🚀',
      logo: '/kingdom-launchpad-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-launchpad',
    },
    {
      title: 'Kingdom Circle',
      description: 'Build and nurture your community with purpose. Create meaningful connections, host events, and foster spiritual growth in a safe, supportive environment.',
      icon: '👥',
      logo: '/kingdom-circle-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-circle',
    },
    {
      title: 'Kingdom Lens',
      description: 'Capture life\'s beautiful moments with purpose. Plan, shoot, and share your photography with tools designed for creatives of faith.',
      icon: '📸',
      logo: '/kingdom-lens-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-lens',
    },
  ];

  return (
    <Layout>
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          <Hero />
          
          {/* Apps Section */}
          <section className="section-padding">
            <div className="container-standard">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-heading-primary mb-4 sm:mb-6">
                  Our <span className="text-blue">Studio Apps</span>
                </h2>
                <p className="text-body-primary max-w-3xl mx-auto px-4">
                  Kingdom Collective is more than just a suite of apps—it&apos;s a movement
                  dedicated to empowering creators, entrepreneurs, and community builders
                  to create with purpose, share with authority, and build what truly
                  matters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {apps.map((app, index) => (
                  <AppCard
                    key={index}
                    title={app.title}
                    description={app.description}
                    icon={app.icon}
                    logo={app.logo}
                    color={app.color}
                    href={app.href}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="section-padding bg-black/30 backdrop-blur-sm">
            <div className="container-standard text-center">
              <h2 className="text-heading-primary mb-6 sm:mb-8">
                About <span className="text-blue">Kingdom Collective</span>
              </h2>
              <p className="text-body-primary px-4">
                Our mission is to provide the tools, resources, and community support
                needed to help you make a lasting impact in your sphere of influence.
                Whether you&apos;re creating content, building a business, or fostering
                community, we&apos;re here to support your journey every step of the way.
              </p>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </Layout>
  );
} 