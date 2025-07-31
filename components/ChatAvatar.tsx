'use client';

import React from 'react';
import { motion } from "framer-motion";

interface ChatAvatarProps {
  tone: string;
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const colors =
    tone === "kingdom"
      ? {
          from: "from-yellow-400",
          via: "via-orange-500",
          to: "to-yellow-300",
          shadow: "shadow-yellow-500",
        }
      : {
          from: "from-blue-400",
          via: "via-cyan-500",
          to: "to-blue-300",
          shadow: "shadow-cyan-500",
        };

  return (
    <div className="w-12 h-12 flex items-center justify-center">
      {/* Flame icon will be added here */}
    </div>
  );
} 