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
    <div className="w-14 h-14 rounded-full overflow-hidden">
      {/* SVG flame - always visible */}
      <svg 
        className="w-full h-full"
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="flameGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="50%" stopColor="#f7931e" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
        </defs>
        <path 
          d="M50 10 C60 20, 70 30, 50 50 C30 30, 40 20, 50 10 Z" 
          fill="url(#flameGradient2)"
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
  );
} 