import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LawyerRegistrationForm } from '@kingdom-studios/ui';

export default function LawyerRegistrationPage() {
  return (
    <>
      <Head>
        <title>Join Kingdom Stand as a Lawyer | Kingdom Collective</title>
        <meta 
          name="description" 
          content="Join our legal directory and help families find quality legal assistance. Register your practice with Kingdom Stand today." 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Kingdom Collective
              </Link>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/stand" className="text-gray-600 hover:text-gray-900">
                  Kingdom Stand
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="text-6xl mb-6">⚖️</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Kingdom Stand as a Legal Professional
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Help families navigate complex legal challenges by joining our trusted directory. 
                Connect with clients who need your expertise in family law, mediation, and legal guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#registration-form" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg"
                >
                  Register Your Practice
                </a>
                <a 
                  href="#benefits" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-lg"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Join Kingdom Stand?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Be part of a platform that prioritizes family well-being and connects 
                people with qualified legal professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Targeted Client Base
                </h3>
                <p className="text-gray-600">
                  Connect with families specifically seeking legal assistance in your practice areas.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trusted Platform
                </h3>
                <p className="text-gray-600">
                  Families trust Kingdom Stand to find qualified, verified legal professionals.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mobile-First Access
                </h3>
                <p className="text-gray-600">
                  Clients can find you on-the-go through our mobile app and website.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to join our legal directory
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
                <p className="text-gray-600">
                  Complete the registration form with your practice details
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-gray-600">
                  Our team reviews and verifies your information
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval</h3>
                <p className="text-gray-600">
                  Get approved and added to our directory within 24-48 hours
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600">
                  Start receiving inquiries from families in need
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div id="registration-form" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Join?
              </h2>
              <p className="text-xl text-gray-600">
                Complete the form below to register your practice
              </p>
            </div>

            <LawyerRegistrationForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a fee to join?
                </h3>
                <p className="text-gray-600">
                  No, joining our directory is completely free. We believe in making legal 
                  assistance accessible to families.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does approval take?
                </h3>
                <p className="text-gray-600">
                  We typically review and approve registrations within 24-48 hours during 
                  business days.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What information is required?
                </h3>
                <p className="text-gray-600">
                  We require basic contact information, practice areas, location, and 
                  verification of your legal credentials.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I update my information later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can update your practice information at any time through 
                  our admin portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Kingdom Collective</h3>
                <p className="text-gray-400">
                  Empowering families with faith-based solutions and legal guidance.
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li><Link href="/stand" className="hover:text-white">Kingdom Stand</Link></li>
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">
                  Questions about joining?<br />
                  <a href="mailto:legal@kingdomcollective.com" className="hover:text-white">
                    legal@kingdomcollective.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Kingdom Collective. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
