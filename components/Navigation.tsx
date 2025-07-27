import React, { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-12 py-6 bg-navy/85 fixed top-0 w-full z-50 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Kingdom Collective
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          href="/apps"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Studio Apps
        </Link>
        <Link
          href="/features"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Features
        </Link>
        <Link
          href="/vision"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Vision
        </Link>
        <Link
          href="/community"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Community
        </Link>
        <Link
          href="/contact"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Contact
        </Link>
      </div>

      {/* Desktop CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <button className="bg-transparent text-white border border-gray-300 px-4 py-2 rounded-md font-semibold hover:bg-white/10 transition-all duration-300">
          Login
        </button>
        <button className="bg-gold text-black px-4 py-2 rounded-md font-semibold shadow-lg shadow-gold/50 hover:shadow-gold/70 transition-all duration-300">
          Dashboard
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-300 transition-colors duration-200"
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy/95 backdrop-blur-md border-t border-gray-800/50">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/apps"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Studio Apps
            </Link>
            <Link
              href="/features"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/vision"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Vision
            </Link>
            <Link
              href="/community"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/contact"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-800/50 space-y-3">
              <button className="block w-full text-left bg-transparent text-white border border-gray-300 px-4 py-2 rounded-md font-semibold hover:bg-white/10 transition-all duration-300">
                Login
              </button>
              <button className="block w-full text-left bg-gold text-black px-4 py-2 rounded-md font-semibold shadow-lg shadow-gold/50 hover:shadow-gold/70 transition-all duration-300">
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 