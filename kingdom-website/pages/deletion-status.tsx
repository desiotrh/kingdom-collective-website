import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';

interface DeletionStatus {
  success: boolean;
  status: string;
  message: string;
  confirmation_code: string;
  deleted_at: string;
}

export default function DeletionStatus() {
  const router = useRouter();
  const { code } = router.query;
  const [status, setStatus] = useState<DeletionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDeletionStatus = useCallback(async () => {
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/facebook/deletion-status?code=${code}`);
      const data = await response.json();

      if (data.success) {
        setStatus(data);
      } else {
        setError(data.error || 'Failed to check deletion status');
      }
    } catch (err) {
      setError('Failed to check deletion status. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      checkDeletionStatus();
    }
  }, [code, checkDeletionStatus]);

  return (
    <>
      <div className="fixed inset-0 z-0">
        <OptimizedVideoBackground
          videoSrc="/assets/Heavenly-BG-video.mp4"
          fadeHeight={31}
          fadeColor="#0B0614"
          opacity={1}
          playbackRate={1.0}
          pauseOnScroll={true}
          scrollThreshold={200}
          frozen={true}
          frozenFrame={0.3}
        />
      </div>
      <Navigation />
      
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-8 border border-kingdom-gold/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Data Deletion Status
              </h1>
              <p className="text-gray-300">
                Check the status of your data deletion request
              </p>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kingdom-gold mx-auto mb-4"></div>
                <p className="text-gray-300">Checking deletion status...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                <p className="text-red-300">{error}</p>
                <button
                  onClick={checkDeletionStatus}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {status && (
              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-green-400 font-semibold text-lg">
                      Deletion Completed
                    </h3>
                  </div>
                  <p className="text-green-300 mb-4">{status.message}</p>
                  
                  <div className="bg-black/40 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confirmation Code:</span>
                      <span className="text-white font-mono">{status.confirmation_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 capitalize">{status.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-white">
                        {new Date(status.deleted_at).toLocaleDateString()} at{' '}
                        {new Date(status.deleted_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-blue-400 font-semibold mb-3">What was deleted?</h3>
                  <ul className="text-blue-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Your account information and profile data
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      All generated content and saved projects
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Social media connections and integration data
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Analytics and usage data
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Any other personal information stored in our systems
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <h3 className="text-yellow-400 font-semibold mb-3">Important Information</h3>
                  <ul className="text-yellow-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      This action is permanent and cannot be undone
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      If you want to use our services again, you&apos;ll need to create a new account
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      Keep this confirmation code for your records
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black font-bold rounded-xl hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}








