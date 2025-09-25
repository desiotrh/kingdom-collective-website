import React from 'react';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient background - always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-kingdom-dark via-kingdom-darker to-kingdom-navy"></div>
      
      {/* Video Background - try to load but don't block */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-50"
        style={{ objectPosition: 'center center' }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-20"></div>
    </div>
  );
}