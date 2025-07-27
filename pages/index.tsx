import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AppCard from '../components/AppCard';
import Footer from '../components/Footer';

export default function Home() {
    const apps = [
        {
            title: 'Kingdom Studios',
            description: 'Professional video creation and editing suite with AI-powered tools for content creators.',
            icon: '🎬',
            color: 'kingdom-gold',
            href: '/apps#kingdom-studios'
        },
        {
            title: 'Kingdom Clips',
            description: 'Short-form video creation and social media content management platform.',
            icon: '📱',
            color: 'kingdom-gold',
            href: '/apps#kingdom-clips'
        },
        {
            title: 'Kingdom Voice',
            description: 'Audio recording, podcasting, and voice-over creation with AI enhancement.',
            icon: '🎤',
            color: 'kingdom-gold',
            href: '/apps#kingdom-voice'
        },
        {
            title: 'Kingdom Launchpad',
            description: 'Business launch and growth platform with tools for entrepreneurs and startups.',
            icon: '🚀',
            color: 'kingdom-gold',
            href: '/apps#kingdom-launchpad'
        },
        {
            title: 'Kingdom Circle',
            description: 'Community building and engagement platform for creators and their audiences.',
            icon: '👥',
            color: 'kingdom-gold',
            href: '/apps#kingdom-circle'
        },
        {
            title: 'Kingdom Lens',
            description: 'Photography and visual content creation with advanced editing capabilities.',
            icon: '📸',
            color: 'kingdom-gold',
            href: '/apps#kingdom-lens'
        }
    ];

    return (
        <Layout>
            <Navigation />
            <Hero />

            {/* Apps Section */}
            <section id="apps" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Our <span className="gold-accent">Apps</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Kingdom Collective is more than just a suite of apps—it&apos;s a movement dedicated to empowering
                            creators, entrepreneurs, and community builders to create with purpose, share with authority,
                            and build what truly matters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {apps.map((app, index) => (
                            <AppCard
                                key={index}
                                title={app.title}
                                description={app.description}
                                icon={app.icon}
                                color={app.color}
                                href={app.href}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kingdom-darker to-kingdom-dark">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-playfair font-bold text-white mb-8">
                        About <span className="gold-accent">Kingdom Collective</span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Our mission is to provide the tools, resources, and community support needed to help you
                        make a lasting impact in your sphere of influence. Whether you&apos;re creating content, building
                        a business, or fostering community, we&apos;re here to support your journey every step of the way.
                    </p>
                </div>
            </section>

            {/* Store Section */}
            <section id="store" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-playfair font-bold text-white mb-6">
                            Visit Our <span className="gold-accent">Store</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Discover exclusive products, courses, and resources to enhance your creative journey.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-kingdom-darker/80 to-kingdom-dark/80 backdrop-blur-sm border border-kingdom-gold/20 rounded-2xl p-8">
                        <iframe
                            src="https://desitotrh.com"
                            className="w-full h-96 rounded-lg"
                            title="Kingdom Collective Store"
                            frameBorder="0"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </Layout>
    );
} 