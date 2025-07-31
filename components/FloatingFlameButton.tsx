'use client';

import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import flameAnimation from "../public/flame.json";

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [lottieError, setLottieError] = useState<string | null>(null);

  useEffect(() => {
    console.log('FloatingFlameButton mounted, flameAnimation:', flameAnimation);
  }, []);

  const handleLottieError = (error: any) => {
    console.error('Lottie error:', error);
    setLottieError(error.message);
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-20 h-20 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        {/* Burning Bush Flame */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          {/* Fallback SVG flame - always visible */}
          <svg 
            className="w-full h-full"
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="flameGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="50%" stopColor="#f7931e" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
            <path 
              d="M50 10 C60 20, 70 30, 50 50 C30 30, 40 20, 50 10 Z" 
              fill="url(#flameGradient)"
              className="animate-pulse"
            />
          </svg>
          
          {/* Lottie animation - hidden for now */}
          {false && (
            <Lottie 
              animationData={flameAnimation} 
              loop 
              autoplay 
              onError={handleLottieError}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>

        {/* Status indicator - REMOVED */}
        {/* {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse">
            <div className="w-full h-full bg-green-400 rounded-full"></div>
          </div>
        )} */}
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Kingdom Assistant</span>
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}

      {/* Page context indicator - REMOVED */}
      {/* {!isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75">
          {currentPage === '/' ? 'Home' : currentPage.replace('/', '').replace('-', ' ')}
        </div>
      )} */}
    </div>
  );
} 