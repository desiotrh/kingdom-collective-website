import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Features() {
  const differentiators = [
    {
      title: 'Faith-Driven Design',
      description: 'Every feature is built with spiritual purpose, not just profit. Our tools are designed to amplify your God-given message.',
      icon: '🙏'
    },
    {
      title: 'Dual-Mode Experience',
      description: 'Faith Mode for Spirit-led creators, Encouragement Mode for those exploring faith. We meet you where you are.',
      icon: '⚖️'
    },
    {
      title: 'Community Over Competition',
      description: 'Unlike other platforms that pit creators against each other, we foster genuine collaboration and Kingdom unity.',
      icon: '🤝'
    },
    {
      title: 'Prophetic Creativity',
      description: 'AI tools that don&apos;t just optimize for algorithms, but for Kingdom impact and spiritual growth.',
      icon: '✨'
    },
    {
      title: 'Holistic Growth',
      description: 'We don&apos;t just help you create content—we help you grow as a person, leader, and Kingdom representative.',
      icon: '🌱'
    },
    {
      title: 'Kingdom Economics',
      description: 'Revenue sharing, fair pricing, and business models that honor both creator and community.',
      icon: '💰'
    }
  ];

  const uniqueFeatures = [
    {
      title: 'Spiritual Growth Checkpoints',
      description: 'Built-in reminders and tools to help you stay connected to your spiritual foundation while creating.',
      category: 'Faith Integration'
    },
    {
      title: 'Prophetic Content Suggestions',
      description: 'AI that suggests content themes based on biblical wisdom and current spiritual movements.',
      category: 'AI Innovation'
    },
    {
      title: 'Kingdom Collaboration Tools',
      description: 'Features designed to help creators work together, not compete against each other.',
      category: 'Community'
    },
    {
      title: 'Dual-Mode Interface',
      description: 'Switch between Faith Mode and Encouragement Mode based on your spiritual journey.',
      category: 'Accessibility'
    },
    {
      title: 'Spirit-Led Analytics',
      description: 'Track not just engagement, but Kingdom impact and spiritual growth metrics.',
      category: 'Analytics'
    },
    {
      title: 'Kingdom Business Tools',
      description: 'Business features that honor biblical principles of stewardship and generosity.',
      category: 'Business'
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
              What Makes Us Different
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              We&apos;re not just another content creation platform. We&apos;re a movement designed to empower faith-driven creators to make a lasting impact in the digital space.
            </p>
          </div>
        </section>

        {/* Differentiators Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Why We&apos;re Unique
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                In a world of copycat platforms, we&apos;ve built something truly different—a suite of tools designed for Kingdom impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {differentiators.map((item, index) => (
                <div key={index} className="card-standard hover-elevate">
                  <div className="icon-standard">{item.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Unique Features Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Features You Won&apos;t Find Elsewhere
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                These aren&apos;t just features—they&apos;re tools for Kingdom advancement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {uniqueFeatures.map((feature, index) => (
                                <div key={index} className="card-standard hover-elevate">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-kingdom-gold/20 text-kingdom-gold px-3 py-1 rounded-full text-xs font-bold">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Join thousands of faith-driven creators who are already building with purpose and making an impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apps" className="bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte hover-scale animate-standard">
                Explore Our Apps
              </Link>
              <Link href="/vision" className="bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte hover-scale animate-standard">
                Learn Our Vision
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 