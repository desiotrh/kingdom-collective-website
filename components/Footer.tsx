import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-gray/30 w-full">
              <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
            <p className="text-white text-sm leading-relaxed max-w-md">
              Empowering creators, entrepreneurs, and community builders to create
              with purpose, share with authority, and build what truly matters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/apps"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  Studio Apps
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/vision"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  Vision
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white hover:text-blue transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm">
            © 2024 Kingdom Collective. All rights reserved.
          </p>
          <div className="flex items-center justify-between mt-4 md:mt-0">
            {/* Social Media Icons */}
            <div className="flex space-x-6">
              <a
                href="https://www.tiktok.com/@desi.tritz?_t=ZT-8yG8sblfvAs&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-.9-.40-1.74-.95-2.45-.32-.41-.7-.8-1.07-1.17-.01-.01-.01-.02-.02-.03z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kingdomcollective.pro?igsh=MTkyMnRvZHQ5eTZyMA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue transition-colors duration-200"
              >
                <Image
                  src="/instagram-icon.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://www.facebook.com/kingdomcollective.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/kingdomcollectivepro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            <div className="flex space-x-8 ml-12">
              <Link
                href="/privacy"
                className="text-white hover:text-blue transition-colors duration-200 text-sm"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-white hover:text-blue transition-colors duration-200 text-sm"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-white hover:text-blue transition-colors duration-200 text-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 