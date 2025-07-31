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
      {lottieError ? (
        <div className="text-red-500 text-xs">Lottie Error: {lottieError}</div>
      ) : (
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