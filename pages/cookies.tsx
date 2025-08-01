import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Cookies() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Cookie Policy
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-relaxed px-4">
              Last Updated: July 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <div className="text-white space-y-8">
                
                <div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    This Cookie Policy explains how Kingdom Collective (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar tracking technologies on our websites, web apps, and mobile platforms.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit a website or app. They help us remember your preferences, analyze site usage, personalize content, and deliver a better user experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray/30">
                      <thead>
                        <tr className="bg-black/20">
                          <th className="border border-gray/30 px-4 py-3 text-left text-white font-semibold">Type</th>
                          <th className="border border-gray/30 px-4 py-3 text-left text-white font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Essential Cookies</td>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Enable core functionality like login, account management, and security.</td>
                        </tr>
                        <tr>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Analytics Cookies</td>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Help us understand how users interact with our services (e.g., Google Analytics, Mixpanel).</td>
                        </tr>
                        <tr>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Functional Cookies</td>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Remember your settings, preferences, and previous interactions.</td>
                        </tr>
                        <tr>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Marketing Cookies</td>
                          <td className="border border-gray/30 px-4 py-3 text-gray-300">Used by third-party tools to deliver relevant ads or track conversions.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">3. Third-Party Services</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We may allow third-party services like Google, Facebook, or TikTok to place cookies on your device to track engagement or enable integrations.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    These services have their own privacy and cookie policies. We encourage you to review them individually.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">4. Your Choices</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You can manage cookie preferences through:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>The cookie banner shown on your first visit</li>
                    <li>Your browser settings (to block or delete cookies)</li>
                    <li>Opt-out tools provided by analytics providers (e.g., Google Analytics Opt-Out)</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Disabling some cookies may affect your ability to use certain features of our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">5. Updates to This Policy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We may update this Cookie Policy from time to time. Changes will be posted on this page with the updated date.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    For more information, contact us at <a href="mailto:privacy@kingdomcollective.pro" className="text-blue hover:text-blue-300 transition-colors duration-200">privacy@kingdomcollective.pro</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 