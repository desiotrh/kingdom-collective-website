'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FloatingFlameButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  currentPage: string;
}

export default function FloatingFlameButton({ onToggle, isOpen, currentPage }: FloatingFlameButtonProps) {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999]">
      <button
        onClick={onToggle}
        className="relative w-16 h-16 bg-transparent rounded-full flex items-center justify-center hover:scale-110 animate-slow"
        aria-label={`${isOpen ? 'Close' : 'Open'} Kingdom Assistant chat`}
        aria-expanded={isOpen}
      >
        {/* Burning Bush Flame - New Kingdom Icon (smaller) */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          <Image
            src="/new-flame-icon.svg"
            alt="Kingdom Assistant - Holy Flame"
            width={40}
            height={40}
            className="flame"
          />
        </div>

        {/* Status indicator - REMOVED */}
        {/* {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse">
            <div className="w-full h-full bg-green-400 rounded-full"></div>
          </div>
        )} */}
      </button>
    </div>
  );
} 