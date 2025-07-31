'use client';

import React from 'react';

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const flameColor = tone === 'kingdom' ? 'kingdom' : 'marketplace';

  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg 
        className="w-10 h-10 animate-flame" 
        viewBox="0 0 24 24" 
        fill="none"
      >
        {/* Main flame body */}
        <path 
          d="M12 2C14 2 15 3 15 5C15 7 14 8 12 8C10 8 9 7 9 5C9 3 10 2 12 2ZM12 9C14 9 15 10 15 12C15 14 14 15 12 15C10 15 9 14 9 12C9 10 10 9 12 9ZM12 16C14 16 15 17 15 19C15 21 14 22 12 22C10 22 9 21 9 19C9 17 10 16 12 16Z"
          fill={flameColor === 'kingdom' ? "url(#kingdomFlameGradient)" : "url(#marketplaceFlameGradient)"}
        />
        
        {/* Inner flame glow */}
        <path 
          d="M12 3C13 3 13.5 3.5 13.5 4.5C13.5 5.5 13 6 12 6C11 6 10.5 5.5 10.5 4.5C10.5 3.5 11 3 12 3ZM12 10C13 10 13.5 10.5 13.5 11.5C13.5 12.5 13 13 12 13C11 13 10.5 12.5 10.5 11.5C10.5 10.5 11 10 12 10ZM12 17C13 17 13.5 17.5 13.5 18.5C13.5 19.5 13 20 12 20C11 20 10.5 19.5 10.5 18.5C10.5 17.5 11 17 12 17Z"
          fill={flameColor === 'kingdom' ? "url(#kingdomInnerGradient)" : "url(#marketplaceInnerGradient)"}
        />
        
        {/* Flame tip */}
        <path 
          d="M12 1C12.5 1 13 1.5 13 2C13 2.5 12.5 3 12 3C11.5 3 11 2.5 11 2C11 1.5 11.5 1 12 1Z"
          fill={flameColor === 'kingdom' ? "url(#kingdomTipGradient)" : "url(#marketplaceTipGradient)"}
        />
        
        {/* Gradient definitions */}
        <defs>
          {/* Kingdom flame gradients */}
          <linearGradient id="kingdomFlameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="30%" stopColor="#FFA500" />
            <stop offset="70%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#DC143C" />
          </linearGradient>
          <linearGradient id="kingdomInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFF00" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
          <linearGradient id="kingdomTipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFFF00" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          
          {/* Marketplace flame gradients */}
          <linearGradient id="marketplaceFlameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="marketplaceInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="marketplaceTipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
} 