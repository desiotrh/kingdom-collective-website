import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-gray/30 w-full">
      <div className="max-w-[960px] mx-auto px-40 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
        <div className="mt-12 pt-8 border-t border-gray flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm">
            © 2024 Kingdom Collective. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
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
    </footer>
  );
} 