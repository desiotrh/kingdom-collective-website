'use client';

import { useRef, useEffect } from 'react';

interface StaticVideoBackgroundProps {
  videoSrc: string;
  fadeHeight?: number;
  fadeColor?: string;
  opacity?: number;
  darkOverlay?: number;
  className?: string;
  /** Which frame to show (0-1, where 0 = start, 1 = end) */
  framePosition?: number;
}

export default function StaticVideoBackground({
  videoSrc,
  fadeHeight = 45,
  fadeColor = '#0B0614',
  opacity = 0.95,
  darkOverlay = 0.35,
  className = '',
  framePosition = 0.3
}: StaticVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for metadata to load
    const setFrame = () => {
      if (video.duration) {
        // Set to specific frame (paused)
        video.currentTime = video.duration * framePosition;
        console.log('Static video frame set to:', video.currentTime, '/', video.duration);
      }
    };

    if (video.readyState >= 1) {
      setFrame();
    } else {
      video.addEventListener('loadedmetadata', setFrame, { once: true });
    }
  }, [framePosition]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video (PAUSED - static frame) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        muted
        playsInline
        preload="auto"
        style={{ 
          opacity,
          filter: 'contrast(1.05) saturate(1.1) brightness(1.01)',
          objectFit: 'cover',
          transform: 'scale(3.0)', // Zoom out 200%
          transformOrigin: 'center center'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Bottom Fade Overlay (covers watermark + blends into page) */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: `${fadeHeight}%`,
          background: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor}f5 8%, ${fadeColor}dd 18%, ${fadeColor}aa 30%, ${fadeColor}66 50%, ${fadeColor}00 100%)`
        }}
      />

      {/* Side vignette for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/15 via-transparent to-black/15" />

      {/* Subtle dark overlay for text readability (always on for non-hero pages) */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,${darkOverlay}) 40%, rgba(0,0,0,${darkOverlay}) 100%)`
        }}
      />
    </div>
  );
}

