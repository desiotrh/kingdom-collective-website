import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-gray/30 w-full" role="contentinfo" aria-label="Site footer">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Image
                  src="/kingdom-collective-logo.png"
                  alt="Kingdom Collective Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Kingdom Collective
              </h2>
            </div>
            <p className="text-white/70 text-sm max-w-md mb-4">
              Empowering creators, entrepreneurs, and community builders to create
              with purpose, share with authority, and build what truly matters.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 mt-4">
              <a 
                href="https://tiktok.com/@kingdomcollectivepro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FFB347] transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/kingdomcollectivepro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FFB347] transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/kingdomcollective.pro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FFB347] transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <h3 id="footer-quick-links" className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="nav-link text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apps" className="nav-link text-sm">
                  Kingdom Apps
                </Link>
              </li>
              <li>
                <Link href="/services" className="nav-link text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="nav-link text-sm">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="nav-link text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company">
            <h3 id="footer-company" className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vision" className="nav-link text-sm">
                  Vision
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal" className="nav-link text-sm">
                  Legal
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@kingdomcollective.pro" 
                  className="nav-link text-sm"
                >
                  contact@kingdomcollective.pro
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray/20 flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Kingdom Collective. All rights reserved.
          </p>
          <nav aria-label="Legal and social links">
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm items-center">
              <Link href="/legal" className="text-white/70 hover:text-[#FFB347] transition-colors">
                Legal
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/privacy" className="text-white/70 hover:text-[#FFB347] transition-colors">
                Privacy
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/terms" className="text-white/70 hover:text-[#FFB347] transition-colors">
                Terms
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
} 