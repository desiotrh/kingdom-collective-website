import React from 'react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden ribbon-bg">
            {/* Main Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-kingdom-gold mb-6 text-glow">
                    Kingdom Collective
                </h1>

                <p className="text-xl sm:text-2xl text-soft-blue mb-8 max-w-4xl mx-auto leading-relaxed">
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
        </section>
    );
} 