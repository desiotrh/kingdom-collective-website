import React, { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-white font-bold text-xl">Kingdom</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/apps"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              Apps
            </Link>
            <Link
              href="/features"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="/mission"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              Mission
            </Link>
            <Link
              href="/company"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              Company
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-blue-400 transition-colors duration-200">
              Enterprise
            </button>
            <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-gray-800/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/apps"
                className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Apps
              </Link>
              <Link
                href="/features"
                className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/mission"
                className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Mission
              </Link>
              <Link
                href="/company"
                className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Company
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-800/50">
                <button className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors duration-200">
                  Enterprise
                </button>
                <button className="block w-full text-left px-3 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 mt-2">
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 