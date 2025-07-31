'use client';

import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import flameAnimation from "../public/flame.json";

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const [lottieError, setLottieError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ChatAvatar mounted, flameAnimation:', flameAnimation);
  }, []);

  const handleLottieError = (error: any) => {
    console.error('Lottie error:', error);
    setLottieError(error.message);
  };

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden">
      {/* Better SVG flame - always visible */}
      <svg 
        className="w-full h-full"
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="flameGradient2" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="30%" stopColor="#f7931e" />
            <stop offset="60%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id="glow2">
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
          fill="url(#flameGradient2)"
          filter="url(#glow2)"
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
  );
} 