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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-kingdom-dark/95 backdrop-blur-lg border-t border-kingdom-gold/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-2">
              Cookie Preferences
            </h3>
            <p className="text-white/80 text-sm">
              We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
              Your privacy matters to us. You can customize your preferences or accept all cookies.
              {' '}
              <Link href="/privacy" className="text-kingdom-gold hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAcceptNecessary}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Accept necessary cookies only"
            >
              Necessary Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-kingdom-gold text-kingdom-dark rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
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

