'use client';

import React, { useState, useEffect } from 'react';

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glow, setGlow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-24 h-24 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        {/* Burning Bush Flame */}
        <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-black rounded-full shadow-inner">
          <svg
            viewBox="0 0 100 100"
            width="60"
            height="60"
            className="transition-all duration-700 ease-in-out"
            style={{
              filter: glow
                ? "drop-shadow(0 0 12px #facc15) drop-shadow(0 0 24px #3b82f6)"
                : "drop-shadow(0 0 6px #dc2626)",
            }}
          >
            <path
              d="M50,10 C65,35 60,75 50,90 C40,75 35,35 50,10 Z"
              fill="url(#flameGradient)"
            />
            <defs>
              <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />     {/* Blue */}
                <stop offset="50%" stopColor="#facc15" />    {/* Gold */}
                <stop offset="100%" stopColor="#dc2626" />   {/* Red */}
              </linearGradient>
            </defs>
          </svg>
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