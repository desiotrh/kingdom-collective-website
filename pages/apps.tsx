import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Apps() {
    const apps = [
        {
            name: 'Kingdom Studios',
            icon: '🎬',
            description: 'Professional video creation and editing suite with AI-powered tools for content creators.',
            features: [
                'Advanced video editing with AI assistance',
                'Professional templates and effects',
                'Multi-track audio editing',
                '4K video support',
                'Cloud collaboration tools',
                'Export to multiple platforms'
            ],
            color: 'kingdom-gold'
        },
        {
            name: 'Kingdom Clips',
            icon: '📱',
            description: 'Short-form video creation and social media content management platform.',
            features: [
                'Quick video editing for social media',
                'Trending template library',
                'Auto-caption generation',
                'Multi-platform publishing',
                'Analytics and performance tracking',
                'Collaborative team features'
            ],
            color: 'kingdom-gold'
        },
        {
            name: 'Kingdom Voice',
            icon: '🎤',
            description: 'Audio recording, podcasting, and voice-over creation with AI enhancement.',
            features: [
                'Professional audio recording',
                'AI-powered noise reduction',
                'Podcast episode management',
                'Voice-over tools and effects',
                'Multi-track audio mixing',
                'Distribution to major platforms'
            ],
            color: 'kingdom-gold'
        },
        {
            name: 'Kingdom Launchpad',
            icon: '🚀',
            description: 'Business launch and growth platform with tools for entrepreneurs and startups.',
            features: [
                'Business plan templates',
                'Financial modeling tools',
                'Market research databases',
                'Investor pitch decks',
                'Legal document templates',
                'Growth tracking analytics'
            ],
            color: 'kingdom-gold'
        },
        {
            name: 'Kingdom Circle',
            icon: '👥',
            description: 'Community building and engagement platform for creators and their audiences.',
            features: [
                'Community forum and discussions',
                'Event planning and management',
                'Member engagement analytics',
                'Content sharing and collaboration',
                'Monetization tools',
                'Mobile app for members'
            ],
            color: 'kingdom-gold'
        },
        {
            name: 'Kingdom Lens',
            icon: '📸',
            description: 'Photography and visual content creation with advanced editing capabilities.',
            features: [
                'Professional photo editing',
                'AI-powered image enhancement',
                'Batch processing tools',
                'Advanced filters and effects',
                'Cloud storage integration',
                'Print-ready export options'
            ],
            color: 'kingdom-gold'
        }
    ];

    return (
        <Layout title="Apps - Kingdom Collective" description="Explore the complete suite of Kingdom Collective apps designed for creators, entrepreneurs, and community builders.">
            <Navigation />

            <div className="pt-16">
                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 navy-gradient">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Our <span className="gold-accent">Apps</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                            A comprehensive ecosystem of tools designed to empower creators, entrepreneurs, and community builders
                            to create with purpose, share with authority, and build what truly matters.
                        </p>
                    </div>
                </section>

                {/* Apps Grid */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {apps.map((app, index) => (
                                <div key={index} className="premium-card p-8">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl">
                                            {app.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                                                {app.name}
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {app.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-lg font-semibold text-kingdom-gold mb-4">
                                            Key Features:
                                        </h4>
                                        <ul className="space-y-2">
                                            {app.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-kingdom-gold rounded-full"></div>
                                                    <span className="text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-kingdom-gold/20">
                                        <Link
                                            href={`/pricing#${app.name.toLowerCase().replace(' ', '-')}`}
                                            className="button-secondary w-full text-center"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-20 text-center">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                                Ready to Get <span className="gold-accent">Started?</span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Choose the perfect plan for your needs and start building with purpose.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/pricing" className="button-primary">
                                    View Pricing
                                </Link>
                                <Link href="/store" className="button-secondary">
                                    Visit Store
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </Layout>
    );
} 