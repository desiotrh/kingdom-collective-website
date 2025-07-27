import React from 'react';

export default function Hero() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Small headline */}
        <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
          BUILD A NO-CODE AI APP IN MINUTES
        </p>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          A new way to think and create with computers
        </h1>

        {/* Call to action bar */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex items-center justify-between">
            <span className="text-white text-sm">
              You will receive confirmation by email.
            </span>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Video demo link */}
        <div className="mt-12">
          <button className="text-white hover:text-blue-400 transition-colors duration-200 text-sm">
            Play Video Demo
          </button>
        </div>
      </div>
    </section>
  );
} 