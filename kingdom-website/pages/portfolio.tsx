import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';

export default function Portfolio() {
  const kingdomApps = [
    {
      name: 'Kingdom Studios',
      description: 'The ultimate content creation hub for faith-driven visionaries.',
      logo: '/kingdom-studios-logo.png',
      href: '/kingdom-studios',
      tags: ['Content Creation', 'Creator Tools', 'Monetization']
    },
    {
      name: 'Kingdom Clips',
      description: 'Create engaging short-form video content that resonates.',
      logo: '/kingdom-clips-logo.png',
      href: '/kingdom-clips',
      tags: ['Video Creation', 'Social Media', 'AI-Powered']
    },
    {
      name: 'Kingdom Voice',
      description: 'Transform your message into powerful audio content.',
      logo: '/kingdom-voice-logo.png',
      href: '/kingdom-voice',
      tags: ['Podcast', 'Audio', 'Voice Recording']
    },
    {
      name: 'Kingdom Launchpad',
      description: 'Launch your digital products and courses with confidence.',
      logo: '/kingdom-launchpad-logo.png',
      href: '/kingdom-launchpad',
      tags: ['Course Creation', 'Digital Products', 'E-commerce']
    },
    {
      name: 'Kingdom Circle',
      description: 'Build and nurture your community with purpose.',
      logo: '/kingdom-circle-logo.png',
      href: '/kingdom-circle',
      tags: ['Community', 'Events', 'Engagement']
    },
    {
      name: 'Kingdom Lens',
      description: 'Capture life\'s beautiful moments with purpose.',
      logo: '/kingdom-lens-logo.png',
      href: '/kingdom-lens',
      tags: ['Photography', 'Visual Content', 'Portfolio']
    },
    {
      name: 'Kingdom Stand',
      description: 'Navigate legal challenges with confidence and faith.',
      logo: '/kingdom-stand-logo.png',
      href: '/kingdom-stand',
      tags: ['Legal Tools', 'Document Management', 'Resources']
    }
  ];

  const clientProjects = [
    {
      name: 'Tidy Touch',
      description: 'A professional cleaning service website built with elegance, showcasing services and enabling online bookings.',
      services: ['Website Development', 'Responsive Design', 'Booking System'],
      tags: ['Web Design', 'Service Business', 'User Experience'],
      link: '#', // Update with actual link when available
      image: null // Can add a screenshot later
    }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <OptimizedVideoBackground 
          videoSrc="/assets/Heavenly-BG-video.mp4"
          fadeHeight={31}
          fadeColor="#0B0614"
          opacity={1}
          frozen={true}
          frozenFrame={0.3}
        />
      </div>
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-standard text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Our Portfolio
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Built with excellence, led by the Spirit. Every project reflects our commitment to quality, purpose, and divine inspiration.
            </p>
          </div>
        </section>

        {/* Kingdom Apps Suite */}
        <section className="section-padding bg-black/30 backdrop-blur-sm">
          <div className="container-wide">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Kingdom Studios Suite
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-3xl mx-auto">
                Our flagship product — a complete ecosystem of apps designed for faith-driven creators, entrepreneurs, and community builders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {kingdomApps.map((app, index) => (
                <div key={index} className="card-standard hover-elevate flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={app.logo}
                      alt={`${app.name} Logo`}
                      width={60}
                      height={60}
                      className="h-14 w-auto rounded-lg"
                      priority
                    />
                    <h3 className="text-white text-xl sm:text-2xl font-bold">{app.name}</h3>
                  </div>
                  <p className="text-white text-sm sm:text-base font-normal leading-relaxed mb-4 flex-1">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 bg-kingdom-gold/10 border border-kingdom-gold/30 rounded-full text-kingdom-gold text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={app.href} className="text-kingdom-gold font-semibold hover:text-kingdom-gold-soft transition-colors duration-200">
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/apps" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300 inline-block">
                Explore All Kingdom Apps
              </Link>
            </div>
          </div>
        </section>

        {/* Client Work */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Client Work
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-3xl mx-auto">
                We partner with businesses and ministries to create digital solutions that exceed expectations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {clientProjects.map((project, index) => (
                <div key={index} className="card-elevated flex flex-col h-full">
                  <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4">{project.name}</h3>
                  <p className="text-white text-base sm:text-lg font-normal leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-kingdom-gold font-bold mb-3">Services Provided:</h4>
                    <div className="space-y-2">
                      {project.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center">
                          <span className="text-kingdom-gold mr-2">•</span>
                          <span className="text-white text-sm sm:text-base">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 bg-kingdom-gold/10 border border-kingdom-gold/30 rounded-full text-kingdom-gold text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding bg-black/30 backdrop-blur-sm">
          <div className="container-standard">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                What Our Clients Say
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="card-standard text-center p-8 sm:p-12">
                <div className="text-4xl sm:text-5xl mb-6">💬</div>
                <p className="text-white text-base sm:text-lg italic leading-relaxed mb-6">
                  &quot;Everything they build carries peace, clarity, and excellence. You can feel it.&quot;
                </p>
                <div className="text-kingdom-gold font-bold text-sm">
                  — Client Testimonial
                </div>
              </div>
              <div className="text-center mt-8">
                <p className="text-white/60 text-sm">
                  More testimonials coming soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding">
          <div className="container-standard">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-kingdom-gold text-3xl sm:text-4xl md:text-5xl font-black mb-2">7+</div>
                <div className="text-white text-sm sm:text-base font-normal">Kingdom Apps</div>
              </div>
              <div>
                <div className="text-kingdom-gold text-3xl sm:text-4xl md:text-5xl font-black mb-2">14+</div>
                <div className="text-white text-sm sm:text-base font-normal">AI Chatbots</div>
              </div>
              <div>
                <div className="text-kingdom-gold text-3xl sm:text-4xl md:text-5xl font-black mb-2">100%</div>
                <div className="text-white text-sm sm:text-base font-normal">Faith-Driven</div>
              </div>
              <div>
                <div className="text-kingdom-gold text-3xl sm:text-4xl md:text-5xl font-black mb-2">∞</div>
                <div className="text-white text-sm sm:text-base font-normal">Kingdom Impact</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-black/30 backdrop-blur-sm">
          <div className="container-standard text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Let&apos;s Build Your Project
            </h2>
            <p className="text-white text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto mb-8">
              Your project could be featured here next. Let&apos;s create something excellent together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                Start a Project
              </Link>
              <Link href="/services" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                View Our Services
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

