import React from 'react';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kingdom-dark via-kingdom-darker to-kingdom-navy"></div>
      
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{ objectPosition: 'center center' }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-20"></div>
    </div>
  );
}