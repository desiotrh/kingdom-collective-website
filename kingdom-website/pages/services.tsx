import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';

export default function Services() {
  const services = [
    {
      title: 'Website Development',
      icon: '🌐',
      description: 'Custom, responsive sites that are visually stunning and spiritually grounded — from faith-based ministries to mainstream brands.',
      features: [
        'Custom Web Design',
        'Responsive & Mobile-First',
        'SEO Optimization',
        'Content Management Systems',
        'E-commerce Solutions',
        'Performance Optimization',
        'Ongoing Maintenance & Support',
        'Analytics & Tracking'
      ],
      details: 'Whether you need a simple landing page, a comprehensive ministry website, or a full-scale e-commerce platform — we build websites that reflect your vision and serve your mission with excellence.'
    },
    {
      title: 'App Design & Development',
      icon: '📱',
      description: 'iOS, Android, and web apps built with excellence, performance, and purpose.',
      features: [
        'Native iOS & Android Apps',
        'Progressive Web Apps (PWA)',
        'Cross-Platform Development',
        'User Experience Design',
        'App Store Optimization',
        'Backend & API Development',
        'Push Notifications',
        'Analytics & User Insights'
      ],
      details: 'From concept to launch, we create mobile and web applications that engage users, solve real problems, and scale with your growth.'
    },
    {
      title: 'AI Chatbots & Automations',
      icon: '🤖',
      description: 'Kingdom-minded and business-ready bots that streamline communication, capture leads, and reflect your voice.',
      features: [
        'Custom AI Chatbots',
        'Lead Generation Automation',
        'Customer Support Bots',
        'Appointment Booking Systems',
        'FAQ & Knowledge Bases',
        'Multi-Channel Integration',
        'CRM Integration',
        'Analytics & Reporting'
      ],
      details: 'Automate your customer interactions without losing the human touch. Our AI chatbots are trained to reflect your brand voice and values, available 24/7.'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery Call',
      description: 'We start with a conversation to understand your vision, goals, and the specific challenges you need to solve.',
      icon: '💬'
    },
    {
      step: '02',
      title: 'Strategy & Planning',
      description: 'We craft a detailed roadmap, outlining the project scope, timeline, and deliverables that align with your mission.',
      icon: '📋'
    },
    {
      step: '03',
      title: 'Design & Development',
      description: 'Our team brings your vision to life with excellence in design, clean code, and attention to every detail.',
      icon: '⚡'
    },
    {
      step: '04',
      title: 'Testing & Launch',
      description: 'We rigorously test everything before launch, ensuring a smooth, professional rollout that exceeds expectations.',
      icon: '🚀'
    },
    {
      step: '05',
      title: 'Support & Growth',
      description: 'After launch, we provide ongoing support, maintenance, and strategic guidance to help you grow.',
      icon: '🌱'
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
              Our Services
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              We build digital systems that glorify God, empower creators, and serve people with excellence. Our standard is not competition — it&apos;s obedience and excellence in the Spirit.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="space-y-12 sm:space-y-16">
              {services.map((service, index) => (
                <div key={index} className={`${index % 2 === 1 ? 'bg-black/30 backdrop-blur-sm' : ''} rounded-2xl p-6 sm:p-8 lg:p-12`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                      <div className="text-5xl sm:text-6xl mb-6">{service.icon}</div>
                      <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-4">
                        {service.title}
                      </h2>
                      <p className="text-white text-base sm:text-lg font-normal leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed">
                        {service.details}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-kingdom-gold text-xl font-bold mb-6">What&apos;s Included:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <span className="text-kingdom-gold mr-2 mt-1">✓</span>
                            <span className="text-white text-sm sm:text-base font-normal leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-black/30 backdrop-blur-sm">
          <div className="container-wide">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Our Process
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-3xl mx-auto">
                From vision to reality, we walk with you every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
                  <div className="text-kingdom-gold text-2xl font-bold mb-2">{item.step}</div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80 text-sm font-normal leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="container-standard">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Faith. Integrity. Excellence.
              </h2>
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

        {/* CTA Section */}
        <section className="section-padding bg-black/30 backdrop-blur-sm">
          <div className="container-standard text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Ready to Build Something Great?
            </h2>
            <p className="text-white text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto mb-8">
              Let&apos;s have a conversation about your vision and how we can bring it to life with excellence and purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                Book a Discovery Call
              </Link>
              <Link href="/portfolio" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                View Our Work
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

