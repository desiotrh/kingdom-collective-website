import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [studioAppsOpen, setStudioAppsOpen] = useState(false);
  const [chatbotsOpen, setChatbotsOpen] = useState(false);
  const [downloadAppsOpen, setDownloadAppsOpen] = useState(false);

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
          <div className="relative">
            <button 
              className="nav-link flex items-center gap-1"
              onMouseEnter={() => setStudioAppsOpen(true)}
              onMouseLeave={() => setStudioAppsOpen(false)}
            >
              Studio Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {studioAppsOpen && (
              <div 
                className="nav-dropdown"
                onMouseEnter={() => setStudioAppsOpen(true)}
                onMouseLeave={() => setStudioAppsOpen(false)}
              >
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
            )}
          </div>

          {/* Chatbots Dropdown */}
          <div className="relative">
            <button 
              className="nav-link flex items-center gap-1"
              onMouseEnter={() => setChatbotsOpen(true)}
              onMouseLeave={() => setChatbotsOpen(false)}
            >
              Chatbots
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {chatbotsOpen && (
              <div 
                className="nav-dropdown w-72"
                onMouseEnter={() => setChatbotsOpen(true)}
                onMouseLeave={() => setChatbotsOpen(false)}
              >
                <Link href="/ai-bots" className="nav-dropdown-item font-semibold">
                  All Chatbots Overview
                </Link>
                <div className="border-t border-gray/30 my-1"></div>
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
                  FAQ & Knowledge Base Bot
                </Link>
                <Link href="/ai-bots/event-management" className="nav-dropdown-item">
                  Event Management Bot
                </Link>
                <Link href="/ai-bots/inventory-management" className="nav-dropdown-item">
                  Inventory Management Bot
                </Link>
                <Link href="/ai-bots/social-media" className="nav-dropdown-item">
                  Social Media Management Bot
                </Link>
              </div>
            )}
          </div>
          <Link href="/features" className="nav-link">
            Features
          </Link>
          <Link href="/vision" className="nav-link">
            Vision
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
          <div className="relative">
            <button 
              className="nav-link flex items-center gap-1"
              onMouseEnter={() => setDownloadAppsOpen(true)}
              onMouseLeave={() => setDownloadAppsOpen(false)}
            >
              Download Apps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {downloadAppsOpen && (
              <div 
                className="nav-dropdown"
                onMouseEnter={() => setDownloadAppsOpen(true)}
                onMouseLeave={() => setDownloadAppsOpen(false)}
              >
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
            )}
          </div>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex gap-2">
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn-secondary">
              <span className="truncate">Dashboard</span>
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray/30 md:hidden">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-2">Studio Apps</h3>
              <Link href="/apps" className="nav-dropdown-item block">
                All Apps Overview
              </Link>
              <Link href="/kingdom-studios" className="nav-dropdown-item block">
                Kingdom Studios
              </Link>
              <Link href="/kingdom-clips" className="nav-dropdown-item block">
                Kingdom Clips
              </Link>
              <Link href="/kingdom-voice" className="nav-dropdown-item block">
                Kingdom Voice
              </Link>
              <Link href="/kingdom-launchpad" className="nav-dropdown-item block">
                Kingdom Launchpad
              </Link>
              <Link href="/kingdom-circle" className="nav-dropdown-item block">
                Kingdom Circle
              </Link>
              <Link href="/kingdom-lens" className="nav-dropdown-item block">
                Kingdom Lens
              </Link>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-2">AI Bots</h3>
              <Link href="/ai-bots" className="nav-dropdown-item block">
                🤖 All AI Bots Overview
              </Link>
              <Link href="/ai-bots/sales-assistant" className="nav-dropdown-item block">
                💼 Sales Assistant Bot
              </Link>
              <Link href="/ai-bots/lead-generation" className="nav-dropdown-item block">
                🎯 Lead Generation Bot
              </Link>
              <Link href="/ai-bots/onboarding" className="nav-dropdown-item block">
                📚 Onboarding Bot
              </Link>
              <Link href="/ai-bots/customer-support" className="nav-dropdown-item block">
                💬 Customer Support Bot
              </Link>
              <Link href="/ai-bots/faith-bot" className="nav-dropdown-item block">
                🙏 Faith Bot
              </Link>
              <Link href="/ai-bots/course-explainer" className="nav-dropdown-item block">
                🎓 Course Explainer Bot
              </Link>
              <Link href="/ai-bots/testimonial" className="nav-dropdown-item block">
                📝 Testimonial Bot
              </Link>
              <Link href="/ai-bots/job-application" className="nav-dropdown-item block">
                💼 Job Application Bot
              </Link>
              <Link href="/ai-bots/enhanced-sales" className="nav-dropdown-item block">
                🚀 Enhanced Sales Bot
              </Link>
            </div>
            
            <div className="space-y-2">
              <Link href="/features" className="nav-dropdown-item block">
                Features
              </Link>
              <Link href="/vision" className="nav-dropdown-item block">
                Vision
              </Link>
              <Link href="/contact" className="nav-dropdown-item block">
                Contact
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray/30">
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-secondary w-full text-center">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn-secondary w-full text-center">
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