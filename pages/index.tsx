import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AppCard from '../components/AppCard';

export default function HomePage() {
    const apps = [
        {
            title: 'Kingdom Studios',
            description: 'The comprehensive content creation platform for creators, entrepreneurs, and community builders.',
            icon: '🎬',
            color: 'kingdom-royal',
            href: 'https://app.kingdomcollective.pro'
        },
        {
            title: 'Kingdom Clips',
            description: 'Create, edit, and share compelling video content with powerful AI-driven tools.',
            icon: '🎥',
            color: 'kingdom-sky',
            href: 'https://clips.kingdomcollective.pro'
        },
        {
            title: 'Kingdom Voice',
            description: 'Record, edit, and publish professional audio content and podcasts.',
            icon: '🎙️',
            color: 'kingdom-gold',
            href: 'https://voice.kingdomcollective.pro'
        },
        {
            title: 'Kingdom Launchpad',
            description: 'Launch and scale your business with comprehensive entrepreneurship tools.',
            icon: '🚀',
            color: 'kingdom-blue',
            href: 'https://launchpad.kingdomcollective.pro'
        },
        {
            title: 'Kingdom Circle',
            description: 'Build authentic community connections and foster meaningful discipleship.',
            icon: '🔥',
            color: 'kingdom-amber',
            href: 'https://circle.kingdomcollective.pro'
        },
        {
            title: 'Kingdom Lens',
            description: 'Capture and share stunning visual content with professional photography tools.',
            icon: '📸',
            color: 'kingdom-royal',
            href: 'https://lens.kingdomcollective.pro'
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <Hero />

            {/* Apps Section */}
            <section id="apps" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Our <span className="glow-text">Ecosystem</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            A comprehensive suite of apps designed to empower creators, entrepreneurs, and community builders
                            to create meaningful content and build authentic connections.
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

            {/* Store Section */}
            <section id="store" className="py-20 px-4 sm:px-6 lg:px-8 bg-kingdom-darker/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Kingdom <span className="glow-text">Store</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Discover premium resources, courses, and tools to accelerate your creative journey and business growth.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden border border-kingdom-violet/20 bg-kingdom-dark/50">
                            <iframe
                                src="https://desitotrh.com"
                                className="w-full h-[800px] border-none"
                                title="Kingdom Collective Store"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-8">
                        About <span className="glow-text">Kingdom Collective</span>
                    </h2>
                    <div className="prose prose-lg prose-invert max-w-none">
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Kingdom Collective is more than just a suite of apps—it&apos;s a movement dedicated to empowering
                            creators, entrepreneurs, and community builders to create with purpose, share with authority,
                            and build what truly matters.
                        </p>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Our mission is to provide the tools, resources, and community support needed to help you
                            make a lasting impact in your sphere of influence. Whether you&apos;re creating content, building
                            a business, or fostering community, we&apos;re here to support your journey every step of the way.
                        </p>
                    </div>
                </div>
            </section>
        </Layout>
    );
} 