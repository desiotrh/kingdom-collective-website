'use client';

import React from 'react';

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const flameColor =
    tone === 'kingdom'
      ? 'from-yellow-400 via-orange-500 to-yellow-300'
      : 'from-blue-400 via-cyan-500 to-blue-300';

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center">
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${flameColor} animate-flame`}
      />
    </div>
  );
} 