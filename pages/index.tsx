import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AppCard from '../components/AppCard';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Home() {
  const apps = [
    {
      title: 'Kingdom Studios',
      description: 'Content & creator hub for faith-driven visionaries.',
      icon: '🎬',
      color: 'kingdom-gold',
      href: '/apps#kingdom-studios',
    },
    {
      title: 'Kingdom Clips',
      description: 'AI video editing for Reels, Shorts, and TikTok.',
      icon: '📱',
      color: 'kingdom-gold',
      href: '/apps#kingdom-clips',
    },
    {
      title: 'Kingdom Voice',
      description: 'Healing, journaling, and Holy Spirit-led expression.',
      icon: '🎤',
      color: 'kingdom-gold',
      href: '/apps#kingdom-voice',
    },
    {
      title: 'Kingdom Launchpad',
      description: 'Digital product launch tools rooted in wisdom.',
      icon: '🚀',
      color: 'kingdom-gold',
      href: '/apps#kingdom-launchpad',
    },
    {
      title: 'Kingdom Circle',
      description: 'Mentorship and Kingdom community at your fingertips.',
      icon: '👥',
      color: 'kingdom-gold',
      href: '/apps#kingdom-circle',
    },
    {
      title: 'Kingdom Lens',
      description: 'Photography and planning for creatives of faith.',
      icon: '📸',
      color: 'kingdom-gold',
      href: '/apps#kingdom-lens',
    },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        <Hero />
        
        {/* Apps Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Our <span className="text-blue">Studio Apps</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal max-w-3xl mx-auto">
                Kingdom Collective is more than just a suite of apps—it&apos;s a movement
                dedicated to empowering creators, entrepreneurs, and community builders
                to create with purpose, share with authority, and build what truly
                matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apps.map((app, index) => (
                <AppCard
                  key={index}
                  title={app.title}
                  description={app.description}
                  icon={app.icon}
                  color={app.color}
                  href={app.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-8">
              About <span className="text-blue">Kingdom Collective</span>
            </h2>
            <p className="text-white text-base font-normal leading-normal">
              Our mission is to provide the tools, resources, and community support
              needed to help you make a lasting impact in your sphere of influence.
              Whether you&apos;re creating content, building a business, or fostering
              community, we&apos;re here to support your journey every step of the way.
            </p>
          </div>
        </section>

        {/* Store Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Visit Our <span className="text-blue">Store</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal">
                Discover exclusive products, courses, and resources to enhance your
                creative journey.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-gray/30 rounded-xl p-8">
              <iframe
                src="https://desitotrh.com"
                className="w-full h-96 rounded-lg"
                title="Kingdom Collective Store"
                frameBorder="0"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 