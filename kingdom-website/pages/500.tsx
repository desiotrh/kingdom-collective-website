import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Custom500() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark">
      <BackgroundVideo />
      
      <Navigation />
      
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">500</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-kingdom-gold mb-6">
            Server Error
          </h2>
          <p className="text-xl text-white/80 mb-8">
            We&apos;re experiencing technical difficulties. Our team has been notified and is working to resolve the issue.
          </p>
          <p className="text-lg text-white/60 mb-8 italic">
            &ldquo;The Lord is my strength and my shield; my heart trusts in him, and he helps me.&rdquo; - Psalm 28:7
          </p>
          <Link
            href="/"
            className="inline-block bg-kingdom-gold text-kingdom-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors focus-kingdom"
            aria-label="Return to homepage"
          >
            Return Home
          </Link>
          
          <div className="mt-12 text-white/60 text-sm">
            <p>Error Reference: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p className="mt-2">Timestamp: {new Date().toISOString()}</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

