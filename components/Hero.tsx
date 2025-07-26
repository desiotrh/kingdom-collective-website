import React from 'react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-kingdom-blue via-kingdom-darker to-kingdom-dark"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-kingdom-royal/20 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-kingdom-gold/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-kingdom-sky/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-playfair font-bold mb-6">
                    <span className="block text-white">Kingdom</span>
                    <span className="block glow-text animate-glow">Collective</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-8 font-inter font-light">
                    Create with Purpose. Share with Authority. Build What Matters.
                </p>

                {/* Description */}
                <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                    A comprehensive ecosystem of apps designed to empower creators, entrepreneurs, and community builders
                    to create meaningful content, build authentic connections, and make a lasting impact.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="#apps"
                        className="button-primary text-lg px-10 py-4"
                    >
                        Explore Apps
                    </a>
                    <a
                        href="#store"
                        className="button-secondary text-lg px-10 py-4"
                    >
                        Visit Store
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-kingdom-royal/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-kingdom-royal rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-kingdom-royal/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kingdom-blue/5 rounded-full blur-3xl"></div>
        </section>
    );
} 