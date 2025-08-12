import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function RefundPolicy() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Refund and Billing Policy
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
                    This policy outlines the billing, subscription, and refund procedures for all products and services offered through Kingdom Collective and its apps, including AI bots and related services.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">1. Payment & Subscription Terms</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    By subscribing to a paid plan (Seed, Growth, Pro, Mantled Pro, Kingdom Enterprise, or AI bot services), you agree to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Pay the full amount listed at the time of purchase</li>
                    <li>Maintain a valid payment method (processed via Stripe or designated providers)</li>
                    <li>Allow automatic recurring charges unless cancelled</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    All pricing is displayed in USD unless otherwise noted. Taxes may apply based on your location.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">2. Free Trials</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Some plans may offer a free trial. If not cancelled before the trial ends, your card will be automatically charged at the regular rate.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You are responsible for cancelling before the trial period ends if you do not wish to continue.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">3. Refund Policy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We do not issue refunds for:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Partial billing cycles (monthly or yearly)</li>
                    <li>Unused credits (e.g., AI generations, storage)</li>
                    <li>User error or forgotten cancellations</li>
                    <li>Downgrades after renewal</li>
                    <li>AI bot services after 30 days of purchase (one-time purchases)</li>
                    <li>Custom AI bot development work once development has begun</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Refunds may be granted in rare cases involving:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Duplicate charges</li>
                    <li>Accidental multi-plan purchases</li>
                    <li>Confirmed technical errors that prevent platform access</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    All refund requests must be made within 7 days of charge for subscription services, or within 30 days for one-time AI bot purchases, by contacting <a href="mailto:billing@kingdomcollective.pro" className="text-kingdom-gold hover:text-kingdom-gold-soft transition-colors duration-200">billing@kingdomcollective.pro</a>. We reserve the right to deny refunds at our sole discretion.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">4. Cancellations</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You may cancel your subscription anytime through your account dashboard. Your plan will remain active until the end of the billing period.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Cancellation does not remove your data unless requested (see Privacy Policy).
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">5. Failed Payments</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    If your payment fails:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4">
                    <li>Your account will be downgraded to the Seed (Free) plan</li>
                    <li>Access to premium features, credits, and team seats will be suspended</li>
                    <li>We may retry your payment method or contact you for resolution</li>
                  </ul>
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