'use client';

import React, { useState } from 'react';
import { motion } from "framer-motion";

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    from: "from-yellow-400",
    via: "via-orange-500", 
    to: "to-yellow-300",
    shadow: "shadow-yellow-500",
  };

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
        
        {/* Burning Bush Flame */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -2, 2, 0],
              boxShadow: ["0 0 8px", "0 0 16px", "0 0 8px"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className={`w-10 h-10 rounded-full bg-gradient-to-tr ${colors.from} ${colors.via} ${colors.to} ${colors.shadow} flex items-center justify-center`}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </motion.div>
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