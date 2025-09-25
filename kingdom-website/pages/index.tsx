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
      icon: '🎙️',
      logo: '/kingdom-voice-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-voice',
    },
    {
      title: 'Kingdom Launchpad',
      description: 'Launch your digital ministry with confidence. Complete business tools, marketing automation, and growth strategies for faith-based entrepreneurs.',
      icon: '🚀',
      logo: '/kingdom-launchpad-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-launchpad',
    },
    {
      title: 'Kingdom Circle',
      description: 'Build and nurture your community with powerful engagement tools. From events to messaging, create meaningful connections that last.',
      icon: '👥',
      logo: '/kingdom-circle-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-circle',
    },
    {
      title: 'Kingdom Lens',
      description: 'Professional photography tools with AI-powered composition guides and business management features for faith-based photographers.',
      icon: '📸',
      logo: '/kingdom-lens-logo.png',
      color: 'kingdom-gold',
      href: '/kingdom-lens',
    },
    {
      title: 'Kingdom Stand',
      description: 'Navigate legal challenges with confidence and faith. Comprehensive legal support tools, education hub, and community resources for self-represented litigants.',
      icon: '⚖️',
      logo: '/kingdom-stand-logo.png',
      color: 'kingdom-gold',
      href: '/stand',
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen overflow-x-hidden">
        <BackgroundVideo />
        <div className="relative z-30">
          <Navigation />
          
          <main role="main">
            <section aria-labelledby="hero-heading">
              <h1 id="hero-heading" className="sr-only">Kingdom Collective - Create with Purpose. Share with Authority. Build What Matters.</h1>
              <Hero />
            </section>
            
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20" aria-labelledby="apps-heading">
              <div className="max-w-[960px] mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 id="apps-heading" className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                    🚀 OUR STUDIO APPS - TESTING DEPLOYMENT 🚀
                  </h2>
                  <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
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

            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm" aria-labelledby="about-heading">
              <div className="max-w-[960px] mx-auto text-center">
                <h2 id="about-heading" className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                  About Kingdom Collective
                </h2>
                <p className="text-white text-sm sm:text-base font-normal leading-normal">
                  Our mission is to provide the tools, resources, and community support
                  needed to help you make a lasting impact in your sphere of influence.
                  Whether you&apos;re creating content, building a business, or fostering
                  community, we&apos;re here to support your journey every step of the way.
                </p>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </Layout>
  );
}