'use client';

import React, { useState, useEffect } from 'react';

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-yellow-300 animate-pulse"
      >
        {/* Flame icon */}
        <svg 
          className="w-8 h-8 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
        </svg>
      </button>

      {/* Simple tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Kingdom Assistant
        </div>
      )}
    </div>
  );
} 