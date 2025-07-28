import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudioAppsOpen, setIsStudioAppsOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMouseInDropdown, setIsMouseInDropdown] = useState(false);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray/30 px-10 py-3 bg-black/20 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-4 text-white hover:text-blue transition-colors duration-200">
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
      </Link>

      {/* Desktop Navigation */}
      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          {/* Studio Apps Dropdown */}
                   <div className="relative">
                     <button
            onMouseEnter={() => {
              if (dropdownTimeout) clearTimeout(dropdownTimeout);
              setIsStudioAppsOpen(true);
            }}
            onMouseLeave={() => {
              if (!isMouseInDropdown) {
                const timeout = setTimeout(() => setIsStudioAppsOpen(false), 300);
                setDropdownTimeout(timeout);
              }
            }}
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200 flex items-center gap-1"
          >
             Studio Apps
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           </button>
                         {isStudioAppsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-sm border border-gray/30 rounded-xl py-2 z-[999999]"
                  onMouseEnter={() => {
                    if (dropdownTimeout) clearTimeout(dropdownTimeout);
                    setIsStudioAppsOpen(true);
                    setIsMouseInDropdown(true);
                  }}
                  onMouseLeave={() => {
                    setIsMouseInDropdown(false);
                    const timeout = setTimeout(() => setIsStudioAppsOpen(false), 300);
                    setDropdownTimeout(timeout);
                  }}
                >
                <Link href="/apps" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  All Apps Overview
                </Link>
                <Link href="/kingdom-studios" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Studios
                </Link>
                <Link href="/kingdom-clips" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Clips
                </Link>
                <Link href="/kingdom-voice" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Voice
                </Link>
                <Link href="/kingdom-launchpad" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Launchpad
                </Link>
                <Link href="/kingdom-circle" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Circle
                </Link>
                <Link href="/kingdom-lens" className="block px-4 py-2 text-white hover:bg-blue/20 transition-colors duration-200">
                  Kingdom Lens
                </Link>
              </div>
            )}
          </div>
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
            href="/contact"
            className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex gap-2">
          {isAuthenticated ? (
            <Link href="/dashboard" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue hover:text-white transition-all duration-200">
              <span className="truncate">Dashboard</span>
            </Link>
          ) : (
            <Link href="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray/90 transition-all duration-200">
              <span className="truncate">Login</span>
            </Link>
          )}
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
            <div className="space-y-2">
              <div className="text-white text-sm font-medium mb-2">Studio Apps</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/apps"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Apps Overview
                </Link>
                <Link
                  href="/kingdom-studios"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Studios
                </Link>
                <Link
                  href="/kingdom-clips"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Clips
                </Link>
                <Link
                  href="/kingdom-voice"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Voice
                </Link>
                <Link
                  href="/kingdom-launchpad"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Launchpad
                </Link>
                <Link
                  href="/kingdom-circle"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Circle
                </Link>
                <Link
                  href="/kingdom-lens"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Lens
                </Link>
              </div>
            </div>
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
              href="/contact"
              className="block text-white hover:text-blue transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray space-y-3">
              {isAuthenticated ? (
                <Link href="/dashboard" className="block w-full text-left bg-gray text-white px-4 py-2 rounded-full font-bold text-sm tracking-[0.015em] hover:bg-blue hover:text-white transition-all duration-200">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="block w-full text-left bg-gray text-white px-4 py-2 rounded-full font-bold text-sm tracking-[0.015em] hover:bg-gray/90 transition-all duration-200">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 