'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const flameVariants = {
    initial: { 
      scale: 0, 
      rotate: -180,
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <motion.button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
        variants={flameVariants}
        initial="initial"
        animate={isAnimating ? "animate" : "hover"}
        whileHover="hover"
        whileTap="tap"
      >
        {/* Main flame button */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-yellow-300">
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400 opacity-30"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-400 opacity-20"
            variants={pulseVariants}
            animate="animate"
          />
          
          {/* Flame icon */}
          <svg 
            className="w-8 h-8 text-white relative z-10" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
          </svg>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Kingdom Assistant</span>
              </div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status indicator */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          >
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </motion.div>
        )}
      </motion.button>

      {/* Page context indicator */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75"
          >
            {currentPage === '/' ? 'Home' : currentPage.replace('/', '').replace('-', ' ')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 