import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray/30 px-10 py-3 bg-black/20 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-4 text-white">
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

      {/* Desktop Navigation */}
      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          <Link
            href="/apps"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Studio Apps
          </Link>
          <Link
            href="/features"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/vision"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Vision
          </Link>
          <Link
            href="/community"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Community
          </Link>
          <Link
            href="/contact"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex gap-2">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue text-navy text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue/90 transition-all duration-200">
            <span className="truncate">Dashboard</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray/90 transition-all duration-200">
            <span className="truncate">Login</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-blue transition-colors duration-200"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-navy/95 backdrop-blur-md border-t border-gray">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/apps"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Studio Apps
            </Link>
            <Link
              href="/features"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/vision"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Vision
            </Link>
            <Link
              href="/community"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray space-y-3">
              <button className="block w-full text-left bg-blue text-navy px-4 py-2 rounded-full font-bold text-sm tracking-[0.015em] hover:bg-blue/90 transition-all duration-200">
                Dashboard
              </button>
              <button className="block w-full text-left bg-gray text-white px-4 py-2 rounded-full font-bold text-sm tracking-[0.015em] hover:bg-gray/90 transition-all duration-200">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 