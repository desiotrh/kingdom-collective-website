import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Store() {
    return (
        <Layout title="Store - Kingdom Collective" description="Discover exclusive products, courses, and resources to enhance your creative journey with Kingdom Collective.">
            <Navigation />

            <div className="pt-16">
                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 ribbon-bg">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
                            Kingdom <span className="gold-accent">Store</span>
                        </h1>
                        <p className="text-xl text-blue-200 max-w-4xl mx-auto drop-shadow-md">
                            Discover exclusive products, courses, and resources designed to accelerate your creative journey
                            and help you build what truly matters.
                        </p>
                    </div>
                </section>

                {/* Store Categories */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    📚
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Courses & Training
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Master your craft with our comprehensive video courses and training programs.
                                </p>
                            </div>

                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    🎨
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Templates & Assets
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Professional templates, graphics, and assets to speed up your workflow.
                                </p>
                            </div>

                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    🛠️
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Tools & Resources
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Essential tools and resources to enhance your creative and business processes.
                                </p>
                            </div>

                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    👕
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Merchandise
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    High-quality apparel and accessories featuring Kingdom Collective branding.
                                </p>
                            </div>

                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    📖
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Books & Guides
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    In-depth guides and books on creativity, business, and community building.
                                </p>
                            </div>

                            <div className="premium-card p-6 text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-goldDark flex items-center justify-center text-2xl mx-auto mb-4">
                                    🎯
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-3">
                                    Coaching & Consulting
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    One-on-one coaching sessions and consulting services for your specific needs.
                                </p>
                            </div>
                        </div>

                        {/* Featured Products */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                                Featured <span className="gold-accent">Products</span>
                            </h2>
                            <p className="text-xl text-gray-300">
                                Our most popular and highly-rated products
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            <div className="premium-card p-6">
                                <div className="w-full h-48 bg-gradient-to-br from-kingdom-gold/20 to-kingdom-goldDark/20 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-4xl">📚</span>
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-2">
                                    Content Creator Masterclass
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Complete course on building your personal brand and growing your audience.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-kingdom-gold font-bold">$197</span>
                                    <button className="button-secondary text-sm px-4 py-2">
                                        Learn More
                                    </button>
                                </div>
                            </div>

                            <div className="premium-card p-6">
                                <div className="w-full h-48 bg-gradient-to-br from-kingdom-gold/20 to-kingdom-goldDark/20 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-4xl">🎨</span>
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-2">
                                    Professional Template Pack
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    500+ professional templates for videos, graphics, and social media.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-kingdom-gold font-bold">$97</span>
                                    <button className="button-secondary text-sm px-4 py-2">
                                        Learn More
                                    </button>
                                </div>
                            </div>

                            <div className="premium-card p-6">
                                <div className="w-full h-48 bg-gradient-to-br from-kingdom-gold/20 to-kingdom-goldDark/20 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-4xl">🚀</span>
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-white mb-2">
                                    Business Launch Blueprint
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Step-by-step guide to launching and scaling your business successfully.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-kingdom-gold font-bold">$297</span>
                                    <button className="button-secondary text-sm px-4 py-2">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Store Embed */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                                Browse Our <span className="gold-accent">Full Store</span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Explore our complete collection of products and resources
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

                        {/* CTA Section */}
                        <div className="mt-20 text-center">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                                Ready to <span className="gold-accent">Invest</span> in Your Success?
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Join thousands of creators who have transformed their work with our products.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="https://desitotrh.com" className="button-primary">
                                    Visit Store
                                </a>
                                <Link href="/pricing" className="button-secondary">
                                    View Pricing
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