'use client';

import { useRef, useEffect, useState } from 'react';

interface SeamlessVideoBackgroundProps {
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
  
  /** Playback speed (0.5 = slow, 1 = normal, 2 = fast) */
  playbackRate?: number;
  
  /** Cross-fade duration in seconds */
  crossFadeDuration?: number;
  
  /** Pause video when user scrolls down (saves performance + reduces eye strain) */
  pauseOnScroll?: boolean;
  
  /** Scroll threshold in pixels before pausing */
  scrollThreshold?: number;
}

export default function SeamlessVideoBackground({
  videoSrc,
  fadeHeight = 31,
  fadeColor = '#0B0614',
  opacity = 1,
  className = '',
  playbackRate = 1,
  crossFadeDuration = 2,
  pauseOnScroll = false,
  scrollThreshold = 200
}: SeamlessVideoBackgroundProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [video1Opacity, setVideo1Opacity] = useState(1);
  const [video2Opacity, setVideo2Opacity] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Set playback rate
    v1.playbackRate = playbackRate;
    v2.playbackRate = playbackRate;

    let videoDuration = 0;
    let crossFadeStartTime = 0;
    let isCrossFading = false;
    let fadeInterval: NodeJS.Timeout | null = null;

    // Get video duration (both videos are the same)
    const onLoadedMetadata = () => {
      if (v1.duration && !videoDuration) {
        videoDuration = v1.duration;
        console.log('Video loaded, duration:', videoDuration);
      }
    };

    v1.addEventListener('loadedmetadata', onLoadedMetadata);
    v2.addEventListener('loadedmetadata', onLoadedMetadata);

    // Time update handler for seamless looping
    const onVideo1TimeUpdate = () => {
      if (!videoDuration || activeVideo !== 1) return;
      
      const timeRemaining = videoDuration - v1.currentTime;
      
      // Start cross-fade EARLIER for more seamless transition
      if (timeRemaining <= crossFadeDuration && !isCrossFading) {
        console.log(`Starting cross-fade from Video 1 to Video 2 (${crossFadeDuration}s transition)`);
        isCrossFading = true;
        crossFadeStartTime = Date.now();
        
        // Reset and start video 2
        v2.currentTime = 0;
        v2.play()
          .then(() => console.log('Video 2 started successfully'))
          .catch(err => {
            console.error('Video 2 play error:', err);
            // Retry
            setTimeout(() => {
              v2.play().catch(e => console.error('Video 2 retry failed:', e));
            }, 100);
          });
        
        // Smooth cross-fade using requestAnimationFrame with easing
        const fade = () => {
          const elapsed = (Date.now() - crossFadeStartTime) / 1000;
          let progress = Math.min(elapsed / crossFadeDuration, 1);
          
          // Ease in-out for smoother transition (less noticeable)
          progress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          setVideo1Opacity(1 - progress);
          setVideo2Opacity(progress);
          
          if (progress < 1) {
            requestAnimationFrame(fade);
          } else {
            // Fade complete
            setActiveVideo(2);
            setVideo1Opacity(0);
            setVideo2Opacity(1);
            // Don't pause - let it finish naturally, will restart on next loop
            isCrossFading = false;
          }
        };
        requestAnimationFrame(fade);
      }
    };

    const onVideo2TimeUpdate = () => {
      if (!videoDuration || activeVideo !== 2) return;
      
      const timeRemaining = videoDuration - v2.currentTime;
      
      // Start cross-fade EARLIER for more seamless transition
      if (timeRemaining <= crossFadeDuration && !isCrossFading) {
        console.log(`Starting cross-fade from Video 2 to Video 1 (${crossFadeDuration}s transition)`);
        isCrossFading = true;
        crossFadeStartTime = Date.now();
        
        // Reset and start video 1
        v1.currentTime = 0;
        v1.play()
          .then(() => console.log('Video 1 restarted successfully'))
          .catch(err => {
            console.error('Video 1 play error:', err);
            // Retry
            setTimeout(() => {
              v1.play().catch(e => console.error('Video 1 retry failed:', e));
            }, 100);
          });
        
        // Smooth cross-fade with easing
        const fade = () => {
          const elapsed = (Date.now() - crossFadeStartTime) / 1000;
          let progress = Math.min(elapsed / crossFadeDuration, 1);
          
          // Ease in-out for smoother transition (less noticeable)
          progress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          setVideo2Opacity(1 - progress);
          setVideo1Opacity(progress);
          
          if (progress < 1) {
            requestAnimationFrame(fade);
          } else {
            // Fade complete
            setActiveVideo(1);
            setVideo2Opacity(0);
            setVideo1Opacity(1);
            // Don't pause - let it finish naturally, will restart on next loop
            isCrossFading = false;
          }
        };
        requestAnimationFrame(fade);
      }
    };

    // Start video 1
    const startPlayback = () => {
      v1.play().catch(err => {
        console.log('Video 1 play error:', err);
        // Retry after a short delay
        setTimeout(startPlayback, 500);
      });
    };

    // Wait for metadata before starting
    if (v1.readyState >= 1) {
      startPlayback();
    } else {
      v1.addEventListener('loadedmetadata', startPlayback, { once: true });
    }

    // Handle video end events (fallback)
    const onVideo1Ended = () => {
      console.log('Video 1 ended - restarting');
      if (activeVideo === 1) {
        v1.currentTime = 0;
        v1.play().catch(err => console.log('Video 1 restart error:', err));
      }
    };

    const onVideo2Ended = () => {
      console.log('Video 2 ended - restarting');
      if (activeVideo === 2) {
        v2.currentTime = 0;
        v2.play().catch(err => console.log('Video 2 restart error:', err));
      }
    };

    v1.addEventListener('timeupdate', onVideo1TimeUpdate);
    v2.addEventListener('timeupdate', onVideo2TimeUpdate);
    v1.addEventListener('ended', onVideo1Ended);
    v2.addEventListener('ended', onVideo2Ended);

    return () => {
      v1.removeEventListener('loadedmetadata', onLoadedMetadata);
      v2.removeEventListener('loadedmetadata', onLoadedMetadata);
      v1.removeEventListener('timeupdate', onVideo1TimeUpdate);
      v2.removeEventListener('timeupdate', onVideo2TimeUpdate);
      v1.removeEventListener('ended', onVideo1Ended);
      v2.removeEventListener('ended', onVideo2Ended);
      if (fadeInterval) clearInterval(fadeInterval);
    };
  }, [playbackRate, crossFadeDuration, activeVideo]);

  // Scroll detection to pause video
  useEffect(() => {
    if (!pauseOnScroll) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // If scrolled past threshold, pause videos
      if (currentScrollY > scrollThreshold && !isPaused) {
        console.log('User scrolled - pausing videos');
        v1.pause();
        v2.pause();
        setIsPaused(true);
      }

      // If back at top, resume playing
      if (currentScrollY <= scrollThreshold && isPaused) {
        console.log('User at top - resuming videos');
        if (activeVideo === 1) {
          v1.play().catch(err => console.log('Resume video 1 error:', err));
        } else {
          v2.play().catch(err => console.log('Resume video 2 error:', err));
        }
        setIsPaused(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [pauseOnScroll, scrollThreshold, isPaused, activeVideo]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video Layer 1 */}
      <video
        ref={video1Ref}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        loop={false}
        style={{ 
          opacity: video1Opacity * opacity
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Video Layer 2 (for seamless cross-fade) */}
      <video
        ref={video2Ref}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        loop={false}
        style={{ 
          opacity: video2Opacity * opacity
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Bottom Fade Overlay (covers watermark + blends into page) */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: `${fadeHeight}%`,
          background: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor}00 100%)`
        }}
      />

      {/* Optional: Side vignette for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/15 via-transparent to-black/15" />
    </div>
  );
}

