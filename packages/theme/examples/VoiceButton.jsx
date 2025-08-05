/**
 * Example: Kingdom Voice Button Component
 * 
 * This demonstrates how to use the shared theme system
 * while maintaining app-specific styling and personality.
 */

import React from 'react';

export function VoiceButton({ children, onClick, isRecording = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        // Shared brand colors (consistency)
        bg-kingdom-gold text-kingdom-dark
        
        // App-specific colors (individuality)
        hover:bg-voice-accent hover:text-white
        
        // App-specific animations
        ${isRecording ? 'animate-voice-recording' : 'animate-voice-pulse'}
        
        // App-specific styling
        rounded-full px-6 py-3 font-semibold
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-voice-accent
      `}
    >
      {children}
    </button>
  );
}

export function VoiceWaveform({ isActive = false }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1 h-4 rounded-full
            ${isActive ? 'bg-voice-accent animate-voice-wave' : 'bg-gray-400'}
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceControls() {
  return (
    <div className="flex items-center space-x-4">
      <VoiceButton>Record Voice</VoiceButton>
      <VoiceWaveform isActive={true} />
      <button className="bg-kingdom-dark text-voice-accent hover:bg-voice-secondary px-4 py-2 rounded-lg">
        Play
      </button>
    </div>
  );
} 