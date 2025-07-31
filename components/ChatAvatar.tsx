'use client';

import React from 'react';
import Lottie from "lottie-react";
import flameAnimation from "../public/flame.json";

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      {/* Flame icon removed */}
    </div>
  );
} 