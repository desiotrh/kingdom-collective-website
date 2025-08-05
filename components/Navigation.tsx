import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray/30 px-4 sm:px-6 md:px-8 lg:px-10 py-3 bg-black/20 backdrop-blur-sm relative z-[9999999]">
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
          <div className="relative group">
            <button
              className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200 flex items-center gap-1"
            >
              Studio Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="nav-dropdown">
              <Link href="/apps" className="nav-dropdown-item">
                All Apps Overview
              </Link>
              <Link href="/kingdom-studios" className="nav-dropdown-item">
                Kingdom Studios
              </Link>
              <Link href="/kingdom-clips" className="nav-dropdown-item">
                Kingdom Clips
              </Link>
              <Link href="/kingdom-voice" className="nav-dropdown-item">
                Kingdom Voice
              </Link>
              <Link href="/kingdom-launchpad" className="nav-dropdown-item">
                Kingdom Launchpad
              </Link>
              <Link href="/kingdom-circle" className="nav-dropdown-item">
                Kingdom Circle
              </Link>
              <Link href="/kingdom-lens" className="nav-dropdown-item">
                Kingdom Lens
              </Link>
            </div>
          </div>

          {/* AI Bots Dropdown */}
          <div className="relative group">
            <button
              className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200 flex items-center gap-1"
            >
              AI Bots
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="nav-dropdown w-72">
              <Link href="/ai-bots" className="nav-dropdown-item font-semibold">
                All AI Bots Overview
              </Link>
              <div className="border-t border-white/30 my-1"></div>
              <Link href="/ai-bots/sales-assistant" className="nav-dropdown-item">
                Sales Assistant Bot
              </Link>
              <Link href="/ai-bots/lead-generation" className="nav-dropdown-item">
                Lead Generation Bot
              </Link>
              <Link href="/ai-bots/onboarding" className="nav-dropdown-item">
                Onboarding Bot
              </Link>
              <Link href="/ai-bots/customer-support" className="nav-dropdown-item">
                Customer Support Bot
              </Link>
              <Link href="/ai-bots/faith-bot" className="nav-dropdown-item">
                Faith Bot
              </Link>
              <Link href="/ai-bots/course-explainer" className="nav-dropdown-item">
                Course Explainer Bot
              </Link>
              <Link href="/ai-bots/testimonial" className="nav-dropdown-item">
                Testimonial Bot
              </Link>
              <Link href="/ai-bots/job-application" className="nav-dropdown-item">
                Job Application Bot
              </Link>
              <Link href="/ai-bots/enhanced-sales" className="nav-dropdown-item">
                Enhanced Sales Bot
              </Link>
              <Link href="/ai-bots/appointment-booking" className="nav-dropdown-item">
                Appointment Booking Bot
              </Link>
              <Link href="/ai-bots/faq-knowledge" className="nav-dropdown-item">
                FAQ & Knowledge Bot
              </Link>
              <Link href="/ai-bots/event-management" className="nav-dropdown-item">
                Event Management Bot
              </Link>
              <Link href="/ai-bots/inventory-management" className="nav-dropdown-item">
                Inventory Management Bot
              </Link>
              <Link href="/ai-bots/social-media" className="nav-dropdown-item">
                Social Media Bot
              </Link>
              <div className="border-t border-white/30 my-1"></div>
              <Link href="/ai-bots/pricing" className="nav-dropdown-item font-semibold">
                Pricing & Add-ons
              </Link>
            </div>
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
          <div className="relative group">
            <button className="text-white text-sm font-medium leading-normal hover:text-blue transition-colors duration-200 flex items-center gap-1">
              Download Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="nav-dropdown">
              <a href="#" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍎</span>
                  <span>App Store</span>
                </div>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="nav-dropdown-item">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <span>Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex gap-2 items-center">
          <CartIcon />
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
            <div className="space-y-2">
              <div className="text-white text-sm font-medium mb-2">AI Bots</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/ai-bots"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🤖 All AI Bots Overview
                </Link>
                <Link
                  href="/ai-bots/sales-assistant"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💼 Sales Assistant Bot
                </Link>
                <Link
                  href="/ai-bots/lead-generation"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🎯 Lead Generation Bot
                </Link>
                <Link
                  href="/ai-bots/onboarding"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 Onboarding Bot
                </Link>
                <Link
                  href="/ai-bots/customer-support"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💬 Customer Support Bot
                </Link>
                <Link
                  href="/ai-bots/faith-bot"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🙏 Faith Bot
                </Link>
                <Link
                  href="/ai-bots/course-explainer"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🎓 Course Explainer Bot
                </Link>
                <Link
                  href="/ai-bots/testimonial"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📝 Testimonial Bot
                </Link>
                <Link
                  href="/ai-bots/job-application"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💼 Job Application Bot
                </Link>
                <Link
                  href="/ai-bots/enhanced-sales"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🚀 Enhanced Sales Bot
                </Link>
                <Link
                  href="/ai-bots/pricing"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💰 Pricing & Add-ons
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
            <div className="space-y-2">
              <div className="text-white text-sm font-medium mb-2">Download Apps</div>
              <div className="pl-4 space-y-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🍎 App Store
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-blue transition-colors duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🤖 Google Play
                </a>
              </div>
            </div>
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