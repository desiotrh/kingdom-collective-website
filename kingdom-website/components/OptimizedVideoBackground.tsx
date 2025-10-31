'use client';

import { useRef, useEffect, useState } from 'react';

interface OptimizedVideoBackgroundProps {
  videoSrc: string;
  fadeHeight?: number;
  fadeColor?: string;
  opacity?: number;
  playbackRate?: number;
  pauseOnScroll?: boolean;
  scrollThreshold?: number;
  className?: string;
  /** If true, video is paused/frozen (static frame) */
  frozen?: boolean;
  /** Which frame to show when frozen (0-1) */
  frozenFrame?: number;
}

export default function OptimizedVideoBackground({
  videoSrc,
  fadeHeight = 31,
  fadeColor = '#0B0614',
  opacity = 1,
  playbackRate = 0.6,
  pauseOnScroll = true,
  scrollThreshold = 200,
  className = '',
  frozen = false,
  frozenFrame = 0.3
}: OptimizedVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showDarkOverlay, setShowDarkOverlay] = useState(false);

  // Set playback rate or freeze at specific frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (frozen) {
      // Freeze video at specific frame
      const setFrozenFrame = () => {
        if (video.duration) {
          video.currentTime = video.duration * frozenFrame;
          console.log('✅ Video frozen at frame:', video.currentTime, '/', video.duration);
        }
      };

      if (video.readyState >= 1) {
        setFrozenFrame();
      } else {
        video.addEventListener('loadedmetadata', setFrozenFrame, { once: true });
      }
    } else {
      // Play video
      video.playbackRate = playbackRate;
      
      const startVideo = () => {
        video.play()
          .then(() => console.log('✅ Video playing at', playbackRate, 'speed'))
          .catch(err => {
            console.warn('Video autoplay blocked, retrying...', err);
            setTimeout(startVideo, 500);
          });
      };

      if (video.readyState >= 2) {
        startVideo();
      } else {
        video.addEventListener('canplay', startVideo, { once: true });
      }
    }
  }, [playbackRate, frozen, frozenFrame]);

  // Pause on scroll (performance optimization)
  useEffect(() => {
    if (!pauseOnScroll) return;

    const video = videoRef.current;
    if (!video) return;

    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      console.log('Scroll detected:', scrollY, 'Threshold:', scrollThreshold, 'IsPaused:', isPaused);

      clearTimeout(scrollTimer);

      if (scrollY > scrollThreshold) {
        // User scrolled down - pause video after delay, show overlay gradually
        scrollTimer = setTimeout(() => {
          if (!isPaused) {
            video.pause();
            setIsPaused(true);
            console.log('✅ Video PAUSED (scrolled past', scrollThreshold, 'px)');
          }
        }, 400); // Small delay before pausing
        
        // Show overlay immediately (but it fades in slowly)
        if (!showDarkOverlay) {
          setShowDarkOverlay(true);
          console.log('Subtle overlay fading in...');
        }
      } else {
        // User at top - resume video and hide overlay
        if (isPaused || showDarkOverlay) {
          if (isPaused) {
            video.play()
              .then(() => console.log('✅ Video RESUMED'))
              .catch(err => console.log('Resume error:', err));
            setIsPaused(false);
          }
          setShowDarkOverlay(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [pauseOnScroll, scrollThreshold, isPaused]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Single video with native loop - MUCH more performant */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        muted
        loop={!frozen}
        playsInline
        preload="auto"
        style={{ 
          opacity,
          // Optimized filters for compressed video
          filter: 'contrast(1.08) saturate(1.15) brightness(1.02) blur(0.3px)', 
          imageRendering: 'high-quality',
          objectFit: 'cover',
          transform: 'translateZ(0)', // GPU acceleration only, no zoom
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Bottom Fade Overlay (covers watermark + blends into page) */}
      {/* Multi-step gradient for natural fade that covers watermark on all devices */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: `${fadeHeight}%`,
          background: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor}f5 8%, ${fadeColor}dd 18%, ${fadeColor}aa 30%, ${fadeColor}66 50%, ${fadeColor}00 100%)`
        }}
      />

      {/* Side vignette for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/15 via-transparent to-black/15" />

      {/* Subtle dark overlay for better text readability when scrolling */}
      <div 
        className="absolute inset-0 pointer-events-none bg-black/35 transition-opacity duration-1000 ease-in-out z-20"
        style={{
          opacity: showDarkOverlay ? 1 : 0
        }}
      />
    </div>
  );
}

