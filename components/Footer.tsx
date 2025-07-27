import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-navy/50 backdrop-blur-sm border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gold rounded-full"></div>
              </div>
              <span className="text-white font-bold text-xl">Kingdom Collective</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
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
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
                >
                  Studio Apps
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
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
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/vision"
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
                >
                  Vision
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Kingdom Collective. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 