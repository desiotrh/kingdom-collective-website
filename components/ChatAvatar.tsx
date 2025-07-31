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
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, -2, 2, 0],
        boxShadow: ["0 0 8px", "0 0 16px", "0 0 8px"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      className={`w-14 h-14 rounded-full bg-gradient-to-tr ${colors.from} ${colors.via} ${colors.to} ${colors.shadow} flex items-center justify-center`}
    >
      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
    </motion.div>
  );
} 