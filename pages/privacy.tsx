import React from 'react';
import Layout from '../components/Layout';

export default function PrivacyPolicy() {
    return (
        <Layout
            title="Privacy Policy - Kingdom Collective"
            description="Privacy Policy for Kingdom Collective - Learn how we protect your data and privacy."
        >
            <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Privacy <span className="glow-text">Policy</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Last updated: December 2024
                        </p>
                    </div>

                    <div className="prose prose-lg prose-invert max-w-none">
                        <div className="bg-kingdom-darker/50 rounded-2xl p-8 border border-kingdom-violet/20">
                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">1. Introduction</h2>
                            <p className="text-gray-300 mb-6">
                                Kingdom Collective ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our mobile applications and website.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">2. Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-kingdom-violet mb-4">2.1 Personal Information</h3>
                            <p className="text-gray-300 mb-4">
                                We may collect personal information that you provide directly to us, including:
                            </p>
                            <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
                                <li>Name and contact information (email address, phone number)</li>
                                <li>Account credentials and profile information</li>
                                <li>Payment and billing information</li>
                                <li>Content you create, upload, or share through our services</li>
                                <li>Communications with us</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-kingdom-violet mb-4">2.2 Automatically Collected Information</h3>
                            <p className="text-gray-300 mb-4">
                                We automatically collect certain information when you use our services:
                            </p>
                            <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
                                <li>Device information (device type, operating system, unique device identifiers)</li>
                                <li>Usage data (features used, time spent, interactions)</li>
                                <li>Log data (IP address, browser type, access times)</li>
                                <li>Location information (with your consent)</li>
                            </ul>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">3. How We Use Your Information</h2>
                            <p className="text-gray-300 mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send technical notices, updates, and support messages</li>
                                <li>Respond to your comments, questions, and requests</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                                <li>Detect, investigate, and prevent fraudulent transactions</li>
                                <li>Personalize your experience and deliver relevant content</li>
                            </ul>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">4. Information Sharing and Disclosure</h2>
                            <p className="text-gray-300 mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                            </p>
                            <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights, property, or safety</li>
                                <li>In connection with a business transfer or merger</li>
                                <li>With service providers who assist in our operations</li>
                            </ul>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">5. Data Security</h2>
                            <p className="text-gray-300 mb-6">
                                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">6. Data Retention</h2>
                            <p className="text-gray-300 mb-6">
                                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">7. Your Rights and Choices</h2>
                            <p className="text-gray-300 mb-4">
                                You have certain rights regarding your personal information:
                            </p>
                            <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your personal information</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Control cookie preferences</li>
                                <li>Request data portability</li>
                            </ul>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">8. Third-Party Services</h2>
                            <p className="text-gray-300 mb-6">
                                Our services may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">9. Children's Privacy</h2>
                            <p className="text-gray-300 mb-6">
                                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">10. International Data Transfers</h2>
                            <p className="text-gray-300 mb-6">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">11. Changes to This Privacy Policy</h2>
                            <p className="text-gray-300 mb-6">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>

                            <h2 className="text-2xl font-playfair font-semibold text-white mb-6">12. Contact Us</h2>
                            <p className="text-gray-300 mb-6">
                                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                            </p>
                            <div className="bg-kingdom-dark/50 rounded-lg p-4 border border-kingdom-violet/20">
                                <p className="text-gray-300">
                                    <strong>Email:</strong> privacy@kingdomcollective.pro<br />
                                    <strong>Address:</strong> Kingdom Collective<br />
                                    [Your Business Address]
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 