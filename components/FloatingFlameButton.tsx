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
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-24 h-24 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        {/* Burning Bush Flame */}
        <div className="relative z-10 w-20 h-20 flex items-center justify-center">
          {/* Better SVG flame - always visible */}
          <svg 
            className="w-full h-full"
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="flameGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="30%" stopColor="#f7931e" />
                <stop offset="60%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Main flame */}
            <path 
              d="M50 5 C60 15, 70 25, 65 45 C70 35, 75 25, 50 5 Z M50 5 C40 15, 30 25, 35 45 C30 35, 25 25, 50 5 Z" 
              fill="url(#flameGradient)"
              filter="url(#glow)"
              className="animate-pulse"
            />
            {/* Inner flame */}
            <path 
              d="M50 10 C55 20, 60 30, 58 40 C60 35, 62 25, 50 10 Z M50 10 C45 20, 40 30, 42 40 C40 35, 38 25, 50 10 Z" 
              fill="#ff8c42"
              opacity="0.8"
            />
            {/* Flame tip */}
            <path 
              d="M50 0 C52 5, 54 10, 50 15 C46 10, 48 5, 50 0 Z" 
              fill="#ff6b35"
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