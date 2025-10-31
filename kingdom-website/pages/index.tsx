import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';
import WarriorWithFlame from '../components/WarriorWithFlame';

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [crownPos, setCrownPos] = useState<{ left: number; bottom: number; width: number }>({
    left: 0,
    bottom: 0,
    width: 600
  });

  useLayoutEffect(() => {
    function measureCrownPosition() {
      const el = titleRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Crown floats right above "KINGDOM" text
      // Fine-tuned position: up 3%, left 35%
      const bottom = window.innerHeight - r.top - 110 + (window.innerHeight * 0.03); // Up 3% of viewport (down 2% from previous)
      setCrownPos({ 
        left: r.left + r.width / 2 - (r.width * 0.35), // Left 35% (left 5% more from 30%)
        bottom, 
        width: r.width 
      });
    }
    measureCrownPosition();
    window.addEventListener("resize", measureCrownPosition);
    return () => window.removeEventListener("resize", measureCrownPosition);
  }, []);

  const services = [
    {
      title: 'Website Development',
      icon: '🌐',
      description: 'Custom, responsive sites that are visually stunning and spiritually grounded — from faith-based ministries to mainstream brands.',
      link: '/services#website-development'
    },
    {
      title: 'App Design & Development',
      icon: '📱',
      description: 'iOS, Android, and web apps built with excellence, performance, and purpose.',
      link: '/services#app-development'
    },
    {
      title: 'AI Chatbots & Automations',
      icon: '🤖',
      description: 'Kingdom-minded and business-ready bots that streamline communication, capture leads, and reflect your voice.',
      link: '/services#ai-chatbots'
    }
  ];

  const portfolioHighlights = [
    {
      name: 'Kingdom Studios Suite',
      description: '7 integrated apps for faith-driven creators and entrepreneurs',
      count: '7 Apps',
      link: '/portfolio#kingdom-apps',
      tag: 'Our Flagship Product'
    },
    {
      name: 'Tidy Touch',
      description: 'Professional cleaning service website with elegance and booking system',
      count: 'Client Work',
      link: '/portfolio#client-work',
      tag: 'Web Design'
    },
    {
      name: 'AI Chatbot Collection',
      description: '14+ specialized bots for every business need',
      count: '14+ Bots',
      link: '/ai-bots',
      tag: 'AI Solutions'
    }
  ];

  return (
    <Layout
      title="Kingdom Collective - Create with Purpose. Share with Authority. Build What Matters."
      description="Kingdom Collective is a Jesus-founded digital company creating world-class websites, apps, and AI systems. Every design, line of code, and creative decision begins with prayer, excellence, and purpose."
    >
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Video Background - Full page coverage, behind everything */}
        <div className="fixed inset-0 z-0">
          <OptimizedVideoBackground 
            videoSrc="/assets/Heavenly-BG-video.mp4"
            fadeHeight={31}
            fadeColor="#0B0614"
            opacity={1}
            playbackRate={1.0}
            pauseOnScroll={true}
            scrollThreshold={200}
          />
        </div>
        
        <div className="relative z-30">
          <Navigation />
          
          <main role="main">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] overflow-hidden" aria-labelledby="hero-heading">
              
              {/* Headline - z-[50] (below header z-[70]) */}
              <div className="relative z-[50] flex h-[90vh] w-full items-center justify-center pt-[35vh]">
                <div className="container-standard text-center">
                  {/* Kingdom Collective Text - HUGE with clean font */}
                  <div className="mb-8">
                    <h2 
                      className="text-white/95 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-[0.2em] uppercase leading-[0.95]" 
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
                    >
                      <span ref={titleRef}>KINGDOM</span><br/>COLLECTIVE
                    </h2>
                  </div>
                  
                  {/* Tagline - Directly underneath with good spacing */}
                  <div className="mt-6 sm:mt-8 md:mt-10">
                    <h1 id="hero-heading" className="font-condensed text-xs sm:text-sm md:text-base font-normal leading-relaxed tracking-[0.2em] uppercase opacity-80" style={{ fontFamily: 'Roboto Condensed, Montserrat, sans-serif', fontWeight: 300, textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}>
                      Create with Purpose. Share with Authority. Build What Matters.
                    </h1>
                  </div>
                </div>
              </div>

              {/* Woman with Sword with Rising Embers - z-[40-42] (sits with falling particles, below header z-[70]) */}
              <WarriorWithFlame crownPos={crownPos} />
            </section>

            {/* CTA Buttons */}
            <section className="section-padding">
              <div className="container-standard text-center">
                <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                  Kingdom Collective is a Jesus-founded digital company creating world-class websites, apps, and AI systems. Every design, line of code, and creative decision begins with prayer, excellence, and purpose.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                    Start a Project
                  </Link>
                  <Link href="/portfolio" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                    See Our Work
                  </Link>
                </div>
              </div>
            </section>

            {/* The Origin - About Section */}
            <section className="section-padding" aria-labelledby="origin-heading">
              <div className="container-standard">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 id="origin-heading" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Born from a Blueprint of Heaven
                  </h2>
                </div>

                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 text-white leading-relaxed text-base sm:text-lg">
                  <p>
                    Kingdom Collective was founded by Desirea Tritz, after being given a divine blueprint by the Holy Spirit — a call to build technology that reflects God&apos;s excellence and truth.
                  </p>
                  
                  <p>
                    We create with conviction, steward innovation with integrity, and deliver professional solutions that bring Kingdom values into the digital world.
                  </p>
                  
                  <p className="text-xl sm:text-2xl font-bold text-kingdom-gold text-center">
                    We believe creativity is worship, and excellence is ministry. Every project is a collaboration between vision, technology, and faith.
                  </p>
                </div>

                <div className="text-center mt-12">
                  <Link href="/vision" className="text-kingdom-gold font-semibold text-lg hover:text-kingdom-gold-soft transition-colors duration-200">
                    Read Our Full Mission →
                  </Link>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="section-padding" aria-labelledby="services-heading">
              <div className="container-wide">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 id="services-heading" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    What We Do
                  </h2>
                  <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-3xl mx-auto">
                    From websites to apps to AI — we build digital systems that serve people with excellence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {services.map((service, index) => (
                    <div key={index} className="card-standard hover-elevate text-center h-full flex flex-col">
                      <div className="text-5xl sm:text-6xl mb-6">{service.icon}</div>
                      <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">{service.title}</h3>
                      <p className="text-white text-sm sm:text-base font-normal leading-relaxed mb-6 flex-1">
                        {service.description}
                      </p>
                      <Link href={service.link} className="text-kingdom-gold font-semibold hover:text-kingdom-gold-soft transition-colors duration-200">
                        Learn More →
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link href="/services" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300 inline-block">
                    View All Services
                  </Link>
                </div>
              </div>
            </section>

            {/* Mission Statement */}
            <section className="section-padding">
              <div className="container-standard text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Our Mission
                  </h2>
                  <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed mb-8">
                    We build digital systems that glorify God, empower creators, and serve people with excellence.
                  </p>
                  <p className="text-kingdom-gold text-base sm:text-lg font-semibold">
                    Our standard is not competition — it&apos;s obedience and excellence in the Spirit.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Portfolio Preview */}
            <section className="section-padding" aria-labelledby="portfolio-heading">
              <div className="container-wide">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 id="portfolio-heading" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Our Work
                  </h2>
                  <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-3xl mx-auto">
                    Built with excellence, led by the Spirit.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {portfolioHighlights.map((item, index) => (
                    <div key={index} className="card-elevated h-full flex flex-col">
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-kingdom-gold/20 border border-kingdom-gold/40 rounded-full text-kingdom-gold text-xs font-bold">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="text-white text-xl sm:text-2xl font-bold mb-3">{item.name}</h3>
                      <p className="text-white text-sm sm:text-base font-normal leading-relaxed mb-4 flex-1">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-kingdom-gold font-bold text-sm">{item.count}</span>
                        <Link href={item.link} className="text-kingdom-gold font-semibold hover:text-kingdom-gold-soft transition-colors duration-200">
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link href="/portfolio" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300 inline-block">
                    View Full Portfolio
                  </Link>
                </div>
              </div>
            </section>

            {/* Testimonial Section - Faith. Integrity. Excellence. */}
            <section className="section-padding">
              <div className="container-standard">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                    Faith. Integrity. Excellence.
                  </h2>
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                  <div className="card-standard text-center p-8 sm:p-12">
                    <div className="text-4xl sm:text-5xl mb-6">💬</div>
                    <p className="text-white text-base sm:text-lg md:text-xl italic leading-relaxed mb-6">
                      &quot;Everything they build carries peace, clarity, and excellence. You can feel it.&quot;
                    </p>
                    <div className="text-kingdom-gold font-bold text-sm">
                      — Client Testimonial
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-4">🙏</div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Faith-Driven</h3>
                    <p className="text-white text-sm sm:text-base font-normal leading-relaxed">
                      Every project begins with prayer. We seek divine guidance in strategy, design, and execution.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-4">💎</div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Built with Integrity</h3>
                    <p className="text-white text-sm sm:text-base font-normal leading-relaxed">
                      Honest communication, transparent pricing, and ethical practices in every interaction.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-4">⭐</div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Excellence Always</h3>
                    <p className="text-white text-sm sm:text-base font-normal leading-relaxed">
                      We don&apos;t compete with the market — we set the standard through Spirit-led excellence.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Section - Your Vision. His Blueprint. */}
            <section className="section-padding" aria-labelledby="cta-heading">
              <div className="container-standard text-center">
                <h2 id="cta-heading" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Your Vision. His Blueprint.
                </h2>
                <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                  Whether you&apos;re launching a ministry, a brand, or a business — we&apos;ll help you build it with excellence and purpose.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                    Book a Discovery Call
                  </Link>
                  <Link href="/apps" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                    Explore Kingdom Apps
                  </Link>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </Layout>
  );
}
