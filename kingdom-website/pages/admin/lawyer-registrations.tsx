import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LawyerRegistrationsAdminPage() {
  return (
    <>
      <Head>
        <title>Lawyer Registration Admin | Kingdom Collective</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  Kingdom Collective
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Admin</span>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/stand" className="text-gray-600 hover:text-gray-900">
                  Kingdom Stand
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Lawyer Registration Admin
              </h1>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Registration Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-blue-800">Total Registrations</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-green-800">Verified Lawyers</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-yellow-800">Pending Reviews</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Registrations
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-center">
                    No lawyer registrations yet. Registrations will appear here once lawyers start signing up.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Admin Actions
                </h2>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Export Registrations
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Send Verification Emails
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Review Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Quick Links */}
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Quick Links
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/lawyer-registration"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Registration Page
                </Link>
                <Link
                  href="/stand"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  View Kingdom Stand
                </Link>
                <Link
                  href="/legal-education"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Legal Education Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
