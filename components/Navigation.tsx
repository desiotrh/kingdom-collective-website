import React, { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [faithMode, setFaithMode] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-kingdom-dark/80 backdrop-blur-md border-b border-kingdom-violet/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-kingdom-royal to-kingdom-blue rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <span className="text-xl font-playfair font-bold text-white">Kingdom Collective</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#apps" className="text-gray-300 hover:text-kingdom-royal transition-colors duration-200">
                            Apps
                        </a>
                        <a href="#store" className="text-gray-300 hover:text-kingdom-royal transition-colors duration-200">
                            Store
                        </a>
                        <a href="#about" className="text-gray-300 hover:text-kingdom-royal transition-colors duration-200">
                            About
                        </a>

                        {/* Faith Mode Toggle */}
                        <button
                            onClick={() => setFaithMode(!faithMode)}
                            className={`px-4 py-2 rounded-full border transition-all duration-300 ${faithMode
                                ? 'border-kingdom-gold text-kingdom-gold bg-kingdom-gold/10'
                                : 'border-kingdom-violet text-kingdom-violet hover:bg-kingdom-violet/10'
                                }`}
                        >
                            {faithMode ? '🙏 Faith Mode' : '✨ Faith Mode'}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-kingdom-royal/10"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-kingdom-darker/95 backdrop-blur-md rounded-lg mt-2">
                            <a
                                href="#apps"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-royal transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Apps
                            </a>
                            <a
                                href="#store"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-royal transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Store
                            </a>
                            <a
                                href="#about"
                                className="block px-3 py-2 text-gray-300 hover:text-kingdom-royal transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </a>
                            <button
                                onClick={() => {
                                    setFaithMode(!faithMode);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-300 ${faithMode
                                    ? 'border border-kingdom-gold text-kingdom-gold bg-kingdom-gold/10'
                                    : 'border border-kingdom-violet text-kingdom-violet hover:bg-kingdom-violet/10'
                                    }`}
                            >
                                {faithMode ? '🙏 Faith Mode' : '✨ Faith Mode'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 