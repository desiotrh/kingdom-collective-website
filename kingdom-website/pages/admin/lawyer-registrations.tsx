import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LawyerRegistrationAdmin } from '@kingdom-studios/ui';

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
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="py-8">
          <LawyerRegistrationAdmin />
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
                  href="/admin"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Admin Dashboard
                </Link>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
