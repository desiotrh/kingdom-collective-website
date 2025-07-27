import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <Navigation />

      <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Terms of <span className="text-blue-400">Service</span>
            </h1>
            <p className="text-xl text-white">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <p className="text-white mb-6">
              By accessing and using Kingdom Collective&apos;s services, including our mobile applications, website, and related services (collectively, the &ldquo;Services&rdquo;), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">2. Description of Service</h2>
            <p className="text-white mb-6">
              Kingdom Collective provides a comprehensive ecosystem of mobile applications and web services designed to empower creators, entrepreneurs, and community builders. Our services include content creation tools, community building platforms, business development resources, and related features.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">3. User Accounts and Registration</h2>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">3.1 Account Creation</h3>
            <p className="text-white mb-4">
              To access certain features of our Services, you may be required to create an account. You agree to:
            </p>
            <ul className="text-white mb-6 list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">3.2 Account Security</h3>
            <p className="text-white mb-6">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">4. Acceptable Use Policy</h2>
            <p className="text-white mb-4">
              You agree not to use the Services to:
            </p>
            <ul className="text-white mb-6 list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Upload, post, or transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Use the Services for commercial purposes without authorization</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">5. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">5.1 Your Content</h3>
            <p className="text-white mb-4">
              You retain ownership of content you create, upload, or share through our Services. By using our Services, you grant us a limited license to:
            </p>
            <ul className="text-white mb-6 list-disc pl-6 space-y-2">
              <li>Host, store, and display your content</li>
              <li>Provide technical support and maintenance</li>
              <li>Improve our Services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">5.2 Our Intellectual Property</h3>
            <p className="text-white mb-6">
              The Services and their original content, features, and functionality are owned by Kingdom Collective and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">6. Privacy and Data Protection</h2>
            <p className="text-white mb-6">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">7. Payment Terms</h2>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">7.1 Subscription Services</h3>
            <p className="text-white mb-4">
              Some features of our Services may require payment. By subscribing to paid services, you agree to:
            </p>
            <ul className="text-white mb-6 list-disc pl-6 space-y-2">
              <li>Pay all fees in advance</li>
              <li>Provide accurate billing information</li>
              <li>Authorize recurring payments</li>
              <li>Accept responsibility for all charges</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">7.2 Refunds and Cancellations</h3>
            <p className="text-white mb-6">
              Refund policies vary by service and are subject to our discretion. You may cancel your subscription at any time, but no refunds will be provided for partial periods.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">8. Disclaimers and Limitations</h2>
            <p className="text-white mb-6">
              THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">9. Limitation of Liability</h2>
            <p className="text-white mb-6">
              IN NO EVENT SHALL KINGDOM COLLECTIVE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">10. Indemnification</h2>
            <p className="text-white mb-6">
              You agree to defend, indemnify, and hold harmless Kingdom Collective from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Services.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">11. Termination</h2>
            <p className="text-white mb-6">
              We may terminate or suspend your account and access to the Services at any time, with or without cause, with or without notice, effective immediately. Upon termination, your right to use the Services will cease immediately.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">12. Governing Law</h2>
            <p className="text-white mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Kingdom Collective operates, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">13. Changes to Terms</h2>
            <p className="text-white mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">14. Contact Information</h2>
            <p className="text-white mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-white">
                <strong>Email:</strong> legal@kingdomcollective.pro<br />
                <strong>Address:</strong> Kingdom Collective<br />
                <strong>Website:</strong> https://kingdomcollective.pro
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 