import React from 'react';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fallback gradient background - only show if video fails */}
      <div className="absolute inset-0 bg-gradient-to-br from-kingdom-dark via-kingdom-darker to-kingdom-navy"></div>
      
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{ objectPosition: 'center center' }}
        onError={(e) => {
          console.error('Video failed to load:', e);
          // Hide video and show fallback
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
        }}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-20"></div>
      
      {/* Additional gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-20"></div>
    </div>
  );
} 