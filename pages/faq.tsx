import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function FAQ() {
    const faqs = [
        {
            question: "What is Kingdom Collective?",
            answer: "Kingdom Collective is a comprehensive ecosystem of apps designed to empower creators, entrepreneurs, and community builders. Our suite includes tools for video creation, audio recording, business launch, community building, photography, and more."
        },
        {
            question: "How do I get started with Kingdom Collective apps?",
            answer: "You can start by exploring our individual apps or purchasing one of our bundles. Each app is designed to work independently or as part of the larger ecosystem. Visit our pricing page to see available options."
        },
        {
            question: "Do you offer support for your apps?",
            answer: "Yes! We offer comprehensive support including documentation, video tutorials, community forums, and direct support channels. Premium users get priority support and dedicated assistance."
        },
        {
            question: "Can I use Kingdom Collective apps on multiple devices?",
            answer: "Yes, most of our apps support cross-platform usage. Your account and data sync across devices, allowing you to work seamlessly from anywhere."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and Apple Pay. We also offer flexible payment plans for larger purchases and enterprise solutions."
        },
        {
            question: "Is my data secure with Kingdom Collective?",
            answer: "Absolutely. We prioritize data security and privacy. All data is encrypted, and we follow industry best practices for data protection. You can read our Privacy Policy for detailed information."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee for most purchases. If you're not satisfied with your purchase, contact our support team within 30 days for a full refund."
        },
        {
            question: "How often do you update your apps?",
            answer: "We regularly update our apps with new features, improvements, and bug fixes. Updates are typically released monthly, with major feature releases quarterly."
        }
    ];

    return (
        <Layout title="FAQ - Kingdom Collective" description="Frequently asked questions about Kingdom Collective apps and services.">
            <Navigation />

            <div className="pt-16">
                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 navy-gradient">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Frequently Asked <span className="gold-accent">Questions</span>
                        </h1>
                        <p className="text-xl text-gray-300">
                            Find answers to common questions about Kingdom Collective apps and services.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-8">
                            {faqs.map((faq, index) => (
                                <div key={index} className="premium-card p-8">
                                    <h3 className="text-xl font-playfair font-semibold text-white mb-4">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <div className="mt-16 text-center">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                                Still Have <span className="gold-accent">Questions?</span>
                            </h2>
                            <p className="text-gray-300 mb-8">
                                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:support@kingdomcollective.pro"
                                    className="button-primary"
                                >
                                    Contact Support
                                </a>
                                <Link
                                    href="/pricing"
                                    className="button-secondary"
                                >
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