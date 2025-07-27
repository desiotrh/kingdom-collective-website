import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-kingdom-gold to-kingdom-goldDark rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="text-xl font-playfair font-bold text-white">Kingdom Collective</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Create with Purpose. Share with Authority. Build What Matters.
                        </p>
                        <div className="text-sm text-kingdom-gold italic">
                            &ldquo;Unless the Lord builds the house, the builders labor in vain.&rdquo; - Psalm 127:1
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="text-kingdom-gold font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#blog" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#careers" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Apps Links */}
                    <div>
                        <h3 className="text-kingdom-gold font-semibold mb-4">Apps</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#kingdom-studios" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Studios
                                </a>
                            </li>
                            <li>
                                <a href="#kingdom-clips" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Clips
                                </a>
                            </li>
                            <li>
                                <a href="#kingdom-voice" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Voice
                                </a>
                            </li>
                            <li>
                                <a href="#kingdom-launchpad" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Launchpad
                                </a>
                            </li>
                            <li>
                                <a href="#kingdom-circle" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Circle
                                </a>
                            </li>
                            <li>
                                <a href="#kingdom-lens" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200">
                                    Lens
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2024 Kingdom Collective. All rights reserved.
                        </div>

                        <div className="flex space-x-6">
                            <Link href="/privacy" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200 text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200 text-sm">
                                Terms of Service
                            </Link>
                            <a href="#faq" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200 text-sm">
                                FAQ
                            </a>
                            <a href="mailto:support@kingdomcollective.pro" className="text-gray-400 hover:text-kingdom-gold transition-colors duration-200 text-sm">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 