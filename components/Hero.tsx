import React from 'react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden ribbon-bg">
            {/* Animated Ribbon Background Elements */}
            <div className="ribbon-element ribbon-wave w-96 h-4 top-20 left-10 opacity-30"></div>
            <div className="ribbon-element ribbon-float w-64 h-3 top-40 right-20 opacity-25" style={{ animationDelay: '2s' }}></div>
            <div className="ribbon-element ribbon-slide w-80 h-5 bottom-40 left-20 opacity-20" style={{ animationDelay: '4s' }}></div>
            <div className="ribbon-element ribbon-wave w-72 h-4 top-1/3 left-1/4 opacity-15" style={{ animationDelay: '6s' }}></div>

            {/* Floating Gold Particles */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-kingdom-gold rounded-full animate-float opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-kingdom-goldLight rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-kingdom-gold rounded-full animate-float opacity-80" style={{ animationDelay: '3s' }}></div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Glowing Ribbon Behind Tagline */}
                <div className="relative mb-8">
                    <div className="ribbon-element ribbon-wave w-full h-8 top-1/2 transform -translate-y-1/2 opacity-40"></div>
                    <h1 className="relative text-5xl sm:text-7xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
                        Kingdom <span className="glow-text">Collective</span>
                    </h1>
                </div>

                <p className="text-xl sm:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                    Create with Purpose. Share with Authority. Build What Matters.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/apps" className="button-primary">
                        Explore Our Apps
                    </Link>
                    <Link href="/pricing" className="button-secondary">
                        View Pricing
                    </Link>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-kingdom-gold/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-kingdom-gold rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-kingdom-gold/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kingdom-navy/5 rounded-full blur-3xl"></div>

            {/* Additional Ribbon Elements */}
            <div className="ribbon-element ribbon-float w-48 h-3 top-1/2 left-10 opacity-20" style={{ animationDelay: '1s' }}></div>
            <div className="ribbon-element ribbon-wave w-56 h-4 bottom-1/3 right-10 opacity-25" style={{ animationDelay: '3s' }}></div>
        </section>
    );
} 