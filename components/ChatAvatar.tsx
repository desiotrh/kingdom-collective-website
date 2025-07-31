'use client';

import React, { useEffect, useState } from "react";
import Image from 'next/image';

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
      <Image
        src="/kingdom-flame-avatar.png"
        alt="Kingdom Flame"
        width={40}
        height={40}
        className={`transition-all duration-700 ease-in-out ${
          glow ? 'animate-pulse' : 'animate-ping'
        }`}
        style={{
          filter: glow
            ? "drop-shadow(0 0 12px #facc15) drop-shadow(0 0 24px #3b82f6)"
            : "drop-shadow(0 0 6px #dc2626)",
        }}
      />
    </div>
  );
} 