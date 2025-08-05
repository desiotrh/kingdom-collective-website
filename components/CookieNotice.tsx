import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-gray/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and assist with our marketing efforts. 
              By continuing to use our site, you consent to our use of cookies. 
              <Link href="/cookies" className="text-kingdom-gold hover:text-kingdom-gold/80 transition-colors duration-200 ml-1">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 border border-gray/30 rounded-lg hover:border-gray/50"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-gray text-white rounded-lg hover:bg-blue hover:text-white transition-colors duration-200"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 