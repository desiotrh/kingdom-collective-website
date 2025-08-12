'use client';

import React from "react";
import Image from 'next/image';

interface ChatAvatarProps {
  tone?: string;
}

export default function ChatAvatar({ tone = "friendly" }: ChatAvatarProps) {
  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <Image
        src="/kingdom-flame-avatar.png"
        alt="Holy Flame"
        width={40}
        height={40}
        className="flame w-10 h-10"
      />
    </div>
  );
} 