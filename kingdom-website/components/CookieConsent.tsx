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
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#2E093F]/30 backdrop-blur-lg border-t border-white/10 shadow-2xl"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container-standard py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p 
            id="cookie-consent-description"
            className="text-white/90 text-xs sm:text-sm flex-1"
            style={{ textShadow: '0 2px 8px rgba(46, 9, 63, 0.9), 0 1px 3px rgba(0, 0, 0, 0.7)' }}
          >
            <span className="font-semibold">Cookie Preferences:</span> We use cookies to enhance your experience.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleAcceptNecessary}
              className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-all font-medium whitespace-nowrap"
              aria-label="Accept necessary cookies only"
            >
              Necessary Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 bg-[#FFB347] text-black text-sm rounded-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(255,179,71,0.5)] transition-all font-semibold whitespace-nowrap"
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

