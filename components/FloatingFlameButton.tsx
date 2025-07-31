'use client';

import React, { useState, useEffect } from 'react';

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300 hover:scale-110 transition-all duration-300 animate-pulse animate-flame-glow"
      >
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping"></div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-pulse"></div>
        
        {/* Animated SVG Flame */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          <svg 
            className="w-12 h-12 animate-flame-flicker" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            {/* Main flame body */}
            <path 
              d="M12 2C14 2 15 3 15 5C15 7 14 8 12 8C10 8 9 7 9 5C9 3 10 2 12 2ZM12 9C14 9 15 10 15 12C15 14 14 15 12 15C10 15 9 14 9 12C9 10 10 9 12 9ZM12 16C14 16 15 17 15 19C15 21 14 22 12 22C10 22 9 21 9 19C9 17 10 16 12 16Z"
              fill="url(#flameGradient)"
              className="animate-flame-flicker"
            />
            
            {/* Inner flame glow */}
            <path 
              d="M12 3C13 3 13.5 3.5 13.5 4.5C13.5 5.5 13 6 12 6C11 6 10.5 5.5 10.5 4.5C10.5 3.5 11 3 12 3ZM12 10C13 10 13.5 10.5 13.5 11.5C13.5 12.5 13 13 12 13C11 13 10.5 12.5 10.5 11.5C10.5 10.5 11 10 12 10ZM12 17C13 17 13.5 17.5 13.5 18.5C13.5 19.5 13 20 12 20C11 20 10.5 19.5 10.5 18.5C10.5 17.5 11 17 12 17Z"
              fill="url(#innerFlameGradient)"
              className="animate-flame-flicker"
              style={{ animationDelay: '0.1s' }}
            />
            
            {/* Flame tip */}
            <path 
              d="M12 1C12.5 1 13 1.5 13 2C13 2.5 12.5 3 12 3C11.5 3 11 2.5 11 2C11 1.5 11.5 1 12 1Z"
              fill="url(#flameTipGradient)"
              className="animate-flame-flicker"
              style={{ animationDelay: '0.2s' }}
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="30%" stopColor="#FFA500" />
                <stop offset="70%" stopColor="#FF4500" />
                <stop offset="100%" stopColor="#DC143C" />
              </linearGradient>
              <linearGradient id="innerFlameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFF00" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
              <linearGradient id="flameTipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FFFF00" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Status indicator */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse">
            <div className="w-full h-full bg-green-400 rounded-full"></div>
          </div>
        )}
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

      {/* Page context indicator */}
      {!isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75">
          {currentPage === '/' ? 'Home' : currentPage.replace('/', '').replace('-', ' ')}
        </div>
      )}
    </div>
  );
} 