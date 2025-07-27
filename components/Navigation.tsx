import React, { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-kingdom-dark/95 to-kingdom-darker/95 backdrop-blur-md border-b border-kingdom-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-kingdom-gold to-kingdom-goldDark rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <span className="text-xl font-playfair font-bold text-white">Kingdom Collective</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/apps" className="text-gray-300 hover:text-kingdom-gold transition-colors duration-200">
                            Apps
                        </Link>
                        <Link href="/store" className="text-gray-300 hover:text-kingdom-gold transition-colors duration-200">
                            Store
                        </Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-kingdom-gold transition-colors duration-200">
                            Pricing
                        </Link>
                        <Link href="/faq" className="text-gray-300 hover:text-kingdom-gold transition-colors duration-200">
                            FAQ
                        </Link>
                        <button className="button-secondary text-sm px-6 py-2">
                            Faith Mode
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-kingdom-gold/10"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-kingdom-darker/95 rounded-lg mt-2">
                            <Link
                                href="/apps"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-gold transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Apps
                            </Link>
                            <Link
                                href="/store"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-gold transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Store
                            </Link>
                            <Link
                                href="/pricing"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-gold transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/faq"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-gold transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                FAQ
                            </Link>
                            <button className="button-secondary text-sm px-6 py-2 w-full mt-2">
                                Faith Mode
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 