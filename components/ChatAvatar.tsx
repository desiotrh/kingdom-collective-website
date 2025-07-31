'use client';

import React from 'react';
import Lottie from "lottie-react";
import flameAnimation from "../public/flame.json";

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden">
      <Lottie animationData={flameAnimation} loop autoplay />
    </div>
  );
} 