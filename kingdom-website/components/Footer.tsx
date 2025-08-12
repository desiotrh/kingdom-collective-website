import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-gray/30 w-full" role="contentinfo" aria-label="Site footer">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4">
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
            <p className="text-body-primary max-w-md">
              Empowering creators, entrepreneurs, and community builders to create
              with purpose, share with authority, and build what truly matters.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-products">
            <h3 id="footer-products" className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/apps" className="nav-link text-sm">
                  Studio Apps
                </Link>
              </li>
              <li>
                <Link href="/features" className="nav-link text-sm">
                  Features
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
                <Link href="/about" className="nav-link text-sm">
                  About
                </Link>
              </li>
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
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <p className="text-body-secondary text-center md:text-left">
            © 2025 Kingdom Collective. All rights reserved.
          </p>
          <nav aria-label="Legal links">
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link href="/privacy" className="nav-link">
                Privacy Policy
              </Link>
              <Link href="/terms" className="nav-link">
                Terms of Service
              </Link>
              <Link href="/cookies" className="nav-link">
                Cookie Policy
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
} 