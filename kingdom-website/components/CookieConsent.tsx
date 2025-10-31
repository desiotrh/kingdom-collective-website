import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      initializeTracking(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(necessaryOnly);
  };

  const saveConsent = (consent: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    initializeTracking(consent);
  };

  const initializeTracking = (consent: typeof preferences) => {
    // Initialize analytics only if consented
    if (consent.analytics && typeof window !== 'undefined') {
      // Initialize PostHog, Google Analytics, or Vercel Analytics here
      console.log('Analytics tracking enabled');
      
      // Example: Initialize PostHog
      // if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      //   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      //     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
      //   });
      // }
    }
    
    if (consent.marketing && typeof window !== 'undefined') {
      // Initialize marketing pixels here
      console.log('Marketing tracking enabled');
    }
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] bg-[#2E093F]/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <h3 
            id="cookie-consent-title"
            className="text-white font-semibold text-base"
            style={{ textShadow: '0 2px 8px rgba(46, 9, 63, 0.9), 0 1px 3px rgba(0, 0, 0, 0.7)' }}
          >
            Cookie Preferences
          </h3>
          <p 
            id="cookie-consent-description"
            className="text-white/90 text-sm leading-relaxed"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)' }}
          >
            We use cookies to enhance your experience and analyze site traffic.{' '}
            <Link href="/privacy" className="text-[#FFB347] hover:text-[#FFD700] underline transition-colors">
              Learn more
            </Link>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              onClick={handleAcceptNecessary}
              className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-all font-medium"
              aria-label="Accept necessary cookies only"
            >
              Necessary Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 bg-[#FFB347] text-black text-sm rounded-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(255,179,71,0.5)] transition-all font-semibold"
              aria-label="Accept all cookies"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

