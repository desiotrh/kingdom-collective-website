import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';

export default function Legal() {
  const legalDocuments = [
    {
      title: 'Terms of Service',
      description: 'The terms and conditions that govern your use of our services, including all Kingdom apps and platforms.',
      href: '/terms',
      lastUpdated: 'July 2025'
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, disclose, and safeguard your personal information when using our services.',
      href: '/privacy',
      lastUpdated: 'July 2025'
    },
    {
      title: 'Cookie Policy',
      description: 'Information about how we use cookies and similar tracking technologies on our website and services.',
      href: '/cookies',
      lastUpdated: 'July 2025'
    },
    {
      title: 'Refund and Billing Policy',
      description: 'Our policies regarding refunds, billing, subscription management, and payment processing.',
      href: '/refund-policy',
      lastUpdated: 'July 2025'
    },
    {
      title: 'User-Generated Content Policy',
      description: 'Guidelines and policies for content created and shared by users on our platforms.',
      href: '/ugc-policy',
      lastUpdated: 'July 2025'
    },
    {
      title: 'Spiritual Disclaimer',
      description: 'Our commitment to biblical principles and how they influence our work and services.',
      href: '/spiritual-disclaimer',
      lastUpdated: 'July 2025'
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
          playbackRate={1.0}
          pauseOnScroll={true}
          scrollThreshold={200}
          frozen={true}
          frozenFrame={0.3}
        />
      </div>
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Legal Documents
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-relaxed px-4">
              All our legal documents, policies, and terms in one place
            </p>
          </div>
        </section>

        {/* Legal Documents List */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {legalDocuments.map((doc, index) => (
                <Link
                  key={index}
                  href={doc.href}
                  className="group bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/30 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#2E093F]/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-bold text-xl group-hover:text-[#FFB347] transition-colors">
                      {doc.title}
                    </h3>
                    <svg 
                      className="w-5 h-5 text-white/60 group-hover:text-[#FFB347] group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    {doc.description}
                  </p>
                  <p className="text-white/60 text-xs">
                    Last Updated: {doc.lastUpdated}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

