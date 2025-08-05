'use client';

import { useState } from 'react';
import FloatingFlameButton from '../components/FloatingFlameButton';
import EnhancedChatWindow from '../components/EnhancedChatWindow';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Kingdom Collective
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover our innovative ecosystem of apps that combine cutting-edge technology with timeless wisdom
          </p>
          
          {/* Demo navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { name: 'Home', path: '/' },
              { name: 'Kingdom Voice', path: '/kingdom-voice' },
              { name: 'Kingdom Circle', path: '/kingdom-circle' },
              { name: 'Kingdom Lens', path: '/kingdom-lens' },
              { name: 'Kingdom Clips', path: '/kingdom-clips' },
              { name: 'Kingdom Launchpad', path: '/kingdom-launchpad' },
              { name: 'Kingdom Studios', path: '/kingdom-studios' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'Contact', path: '/contact' }
            ].map((page) => (
              <button
                key={page.path}
                onClick={() => setCurrentPage(page.path)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  currentPage === page.path
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/5'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>

          {/* Current page info */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Page: {currentPage === '/' ? 'Home' : currentPage.replace('/', '').replace('-', ' ')}</h2>
            <p className="text-gray-300">
              The Kingdom Assistant will provide contextual responses based on this page. 
              Try clicking different pages above and then interacting with the floating flame button!
            </p>
          </div>

          {/* Features showcase */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Page-Aware Intelligence</h3>
              <p className="text-gray-400 text-sm">
                The assistant knows which page you're on and provides contextual responses
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17V7L12 12L2 7V17Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Conversation Memory</h3>
              <p className="text-gray-400 text-sm">
                Remembers your interests, preferences, and conversation history
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-gray-400 text-sm">
                Suggests the perfect Kingdom apps based on your needs and interests
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Try the Enhanced Sales Bot!</h3>
            <p className="text-gray-300 mb-4">
              Look for the animated flame button on the right side of the screen. Click it to start a conversation with the Kingdom Assistant.
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>• The bot remembers your conversations</p>
              <p>• It adapts responses based on which page you're on</p>
              <p>• Ask about pricing, features, demos, or app comparisons</p>
              <p>• Try switching pages and see how the responses change!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Flame Button */}
      <FloatingFlameButton
        onToggle={handleToggleChat}
        isOpen={isChatOpen}
        currentPage={currentPage}
      />

      {/* Enhanced Chat Window */}
      <EnhancedChatWindow
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        currentPage={currentPage}
      />
    </div>
  );
} 