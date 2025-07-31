'use client';

import React, { useEffect, useState } from "react";

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const [glow, setGlow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black shadow-inner">
      <svg
        viewBox="0 0 100 100"
        width="40"
        height="40"
        className="transition-all duration-700 ease-in-out"
        style={{
          filter: glow
            ? "drop-shadow(0 0 10px #f97316) drop-shadow(0 0 20px #3b82f6)"
            : "drop-shadow(0 0 5px #0ea5e9)",
        }}
      >
        <path
          d="M50,10 C65,30 60,70 50,90 C40,70 35,30 50,10 Z"
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
  );
} 