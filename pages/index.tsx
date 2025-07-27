import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AppCard from '../components/AppCard';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Apps Section */}
      <section id="apps" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Our <span className="text-blue-400">Apps</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Kingdom Collective is more than just a suite of apps—it's a movement
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
      <section
        id="about"
        className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            About <span className="text-blue-400">Kingdom Collective</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our mission is to provide the tools, resources, and community support
            needed to help you make a lasting impact in your sphere of influence.
            Whether you're creating content, building a business, or fostering
            community, we're here to support your journey every step of the way.
          </p>
        </div>
      </section>

      {/* Store Section */}
      <section id="store" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Visit Our <span className="text-blue-400">Store</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Discover exclusive products, courses, and resources to enhance your
              creative journey.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
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
  );
} 