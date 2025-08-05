/**
 * Example: Kingdom Circle Button Component
 * 
 * This demonstrates community-focused styling with green accents
 * while maintaining Kingdom Collective brand consistency.
 */

import React from 'react';

export function CircleButton({ children, onClick, isActive = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        // Shared brand colors (consistency)
        bg-kingdom-gold text-kingdom-dark
        
        // App-specific colors (individuality)
        hover:bg-community-primary hover:text-white
        
        // App-specific animations
        ${isActive ? 'animate-community-glow' : 'animate-community-pulse'}
        
        // App-specific styling
        rounded-lg px-6 py-3 font-semibold
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-community-primary
      `}
    >
      {children}
    </button>
  );
}

export function CommunityCard({ title, members, isOnline = false }) {
  return (
    <div className="bg-kingdom-darker border border-community-primary/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{title}</h3>
        <div className={`
          w-3 h-3 rounded-full
          ${isOnline ? 'bg-community-primary animate-community-pulse' : 'bg-gray-500'}
        `} />
      </div>
      <p className="text-white/70 text-sm mb-4">{members} members</p>
      <CircleButton>Join Community</CircleButton>
    </div>
  );
}

export function CommunityList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CommunityCard title="Faith Builders" members={156} isOnline={true} />
      <CommunityCard title="Kingdom Creators" members={89} isOnline={false} />
    </div>
  );
} 