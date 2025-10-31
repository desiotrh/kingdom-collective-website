import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[70] bg-white/5 backdrop-blur-lg supports-[backdrop-filter]:backdrop-saturate-150 border-b border-white/10 shadow-[0_2px_24px_rgba(0,0,0,0.15)] no-blur-fallback"
      style={{
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        backdropFilter: "blur(20px) saturate(1.5)"
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 h-[58px] flex items-center justify-between">
        {/* Logo - Enlarged */}
        <Link href="/" className="flex items-center text-white hover:opacity-90 transition-opacity duration-200" aria-label="Go to Kingdom Collective homepage">
          <Image
            src="/kingdom-collective-logo.png"
            alt="Kingdom Collective Logo"
            width={56}
            height={56}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-end gap-8 items-center" role="navigation" aria-label="Main navigation">
          <Link
            href="/services"
            className="text-white/80 text-sm font-medium leading-normal hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,179,71,0.6)]"
            style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Services
          </Link>
          <Link
            href="/portfolio"
            className="text-white/80 text-sm font-medium leading-normal hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,179,71,0.6)]"
            style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Portfolio
          </Link>
          
          {/* Kingdom Apps Dropdown */}
          <div className="relative group">
            <button
              className="text-white/80 text-sm font-medium leading-normal hover:text-white transition-all duration-200 flex items-center gap-1 hover:drop-shadow-[0_0_8px_rgba(255,179,71,0.6)]"
              aria-expanded="false"
              aria-haspopup="true"
              aria-label="Kingdom Apps menu"
              style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
            >
              Kingdom Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full mt-2 w-56 bg-gradient-to-b from-[#FFB347] to-[#B8742D] backdrop-blur-md rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden border border-[#FFB347]/30" role="menu">
              <Link href="/apps" className="block px-5 py-3 text-black font-semibold hover:bg-black/20 transition-colors duration-200" role="menuitem">
                All Apps Overview
              </Link>
              <div className="border-t border-black/20 mx-2"></div>
              <Link href="/kingdom-studios" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Studios
              </Link>
              <Link href="/kingdom-clips" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Clips
              </Link>
              <Link href="/kingdom-voice" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Voice
              </Link>
              <Link href="/kingdom-launchpad" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Launchpad
              </Link>
              <Link href="/kingdom-circle" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Circle
              </Link>
              <Link href="/kingdom-lens" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Lens
              </Link>
              <Link href="/stand" className="block px-5 py-3 text-black hover:bg-black/20 transition-colors duration-200" role="menuitem">
                Kingdom Stand
              </Link>
            </div>
          </div>

          <Link
            href="/vision"
            className="text-white/80 text-sm font-medium leading-normal hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,179,71,0.6)]"
            style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Vision
          </Link>
          <Link
            href="/contact"
            className="text-white/80 text-sm font-medium leading-normal hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,179,71,0.6)]"
            style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Contact
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <CartIcon />
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
                  aria-label="Go to your account"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <CartIcon />
                <Link
                  href="/login"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm hover:shadow-[0_0_16px_rgba(255,179,71,0.5)]"
                  aria-label="Log in to your account"
                  style={{ textShadow: '0 3px 12px rgba(46, 9, 63, 1), 0 1px 4px rgba(0, 0, 0, 0.8)' }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-kingdom-gold transition-colors duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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

      {/* Optional gradient fade for readability */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0614]/20 via-transparent to-transparent" />
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-navy/95 backdrop-blur-md border-t border-gray" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/services"
              className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <div className="space-y-2">
              <div className="text-white text-sm font-medium mb-2">Kingdom Apps</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/apps"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Apps Overview
                </Link>
                <Link
                  href="/kingdom-studios"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Studios
                </Link>
                <Link
                  href="/kingdom-clips"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Clips
                </Link>
                <Link
                  href="/kingdom-voice"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Voice
                </Link>
                <Link
                  href="/kingdom-launchpad"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Launchpad
                </Link>
                <Link
                  href="/kingdom-circle"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Circle
                </Link>
                <Link
                  href="/kingdom-lens"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Lens
                </Link>
                <Link
                  href="/stand"
                  className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kingdom Stand
                </Link>
              </div>
            </div>
            <Link
              href="/vision"
              className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Vision
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-kingdom-gold transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray space-y-3">
              {isAuthenticated ? (
                <Link href="/dashboard" className="block w-full text-left bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="block w-full text-left bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200">
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
