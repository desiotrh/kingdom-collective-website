'use client';

import { useRef, useEffect } from 'react';

interface VideoBackgroundWithFadeProps {
  /** Path to video file */
  videoSrc: string;
  
  /** Fade from bottom - height as percentage (0-100) */
  fadeHeight?: number;
  
  /** Fade color (typically matches your page background) */
  fadeColor?: string;
  
  /** Video opacity (0-1) */
  opacity?: number;
  
  /** CSS class for container */
  className?: string;
  
  /** Enable autoplay */
  autoPlay?: boolean;
  
  /** Enable loop */
  loop?: boolean;
  
  /** Mute video */
  muted?: boolean;
  
  /** Playback speed (0.5 = slow, 1 = normal, 2 = fast) */
  playbackRate?: number;
}

export default function VideoBackgroundWithFade({
  videoSrc,
  fadeHeight = 30,
  fadeColor = '#0B0614',
  opacity = 1,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playbackRate = 1
}: VideoBackgroundWithFadeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && playbackRate !== 1) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video Layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        style={{ opacity }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Bottom Fade Overlay (covers watermark + blends into page) */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: `${fadeHeight}%`,
          background: `linear-gradient(to top, ${fadeColor} 0%, transparent 100%)`
        }}
      />

      {/* Optional: Additional side fades for vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-black/20" />
    </div>
  );
}

