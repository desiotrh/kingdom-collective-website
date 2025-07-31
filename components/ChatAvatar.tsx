'use client';

import React from "react";
import Image from 'next/image';

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <Image
        src="/kingdom-flame-avatar.png"
        alt="Kingdom Flame"
        width={40}
        height={40}
        className="animate-flame-flicker"
      />
    </div>
  );
} 