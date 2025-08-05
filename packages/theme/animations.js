/**
 * Kingdom Collective Design System - Animations
 * 
 * This module exports animation configurations and keyframes
 * for consistent motion design across all Kingdom Collective applications.
 */

// Base animations (shared across all apps)
export const baseAnimations = {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'fade-out': 'fadeOut 0.5s ease-in-out',
  'slide-up': 'slideUp 0.5s ease-out',
  'slide-down': 'slideDown 0.5s ease-out',
  'slide-left': 'slideLeft 0.5s ease-out',
  'slide-right': 'slideRight 0.5s ease-out',
  'scale-in': 'scaleIn 0.3s ease-out',
  'scale-out': 'scaleOut 0.3s ease-in',
  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'bounce-slow': 'bounce 2s infinite',
  'spin-slow': 'spin 3s linear infinite',
  'glow': 'glow 2s ease-in-out infinite',
  'flicker': 'flicker 0.5s ease-in-out infinite',
};

// App-specific animations
export const appAnimations = {
  // Kingdom Voice animations
  voice: {
    'voice-pulse': 'voicePulse 2s ease-in-out infinite',
    'voice-wave': 'voiceWave 1.5s ease-in-out infinite',
    'voice-recording': 'voiceRecording 1s ease-in-out infinite',
  },
  
  // Kingdom Circle animations
  circle: {
    'community-glow': 'communityGlow 3s ease-in-out infinite',
    'community-pulse': 'communityPulse 2s ease-in-out infinite',
    'community-connect': 'communityConnect 0.8s ease-out',
  },
  
  // Kingdom Lens animations
  lens: {
    'lens-focus': 'lensFocus 1.5s ease-in-out infinite',
    'lens-shutter': 'lensShutter 0.3s ease-out',
    'lens-zoom': 'lensZoom 0.5s ease-out',
  },
  
  // Kingdom Clips animations
  clips: {
    'recording-pulse': 'recordingPulse 1s ease-in-out infinite',
    'video-play': 'videoPlay 0.4s ease-out',
    'video-pause': 'videoPause 0.4s ease-out',
  },
  
  // Kingdom Launchpad animations
  launchpad: {
    'launch-bounce': 'launchBounce 0.6s ease-out',
    'launch-glow': 'launchGlow 2s ease-in-out infinite',
    'launch-spin': 'launchSpin 1s ease-out',
  },
};

// Base keyframes (shared across all apps)
export const baseKeyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideLeft: {
    '0%': { transform: 'translateX(20px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  slideRight: {
    '0%': { transform: 'translateX(-20px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.9)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  scaleOut: {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '100%': { transform: 'scale(0.9)', opacity: '0' },
  },
  glow: {
    '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))' },
    '50%': { filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))' },
  },
  flicker: {
    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
    '25%': { opacity: '0.8', transform: 'scale(0.95)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
    '75%': { opacity: '0.9', transform: 'scale(0.98)' },
  },
};

// App-specific keyframes
export const appKeyframes = {
  // Kingdom Voice keyframes
  voice: {
    voicePulse: {
      '0%, 100%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.05)', opacity: '0.8' },
    },
    voiceWave: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-5px)' },
    },
    voiceRecording: {
      '0%, 100%': { backgroundColor: 'rgba(139, 92, 246, 0.3)' },
      '50%': { backgroundColor: 'rgba(139, 92, 246, 0.8)' },
    },
  },
  
  // Kingdom Circle keyframes
  circle: {
    communityGlow: {
      '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))' },
      '50%': { filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8))' },
    },
    communityPulse: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.02)' },
    },
    communityConnect: {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
  },
  
  // Kingdom Lens keyframes
  lens: {
    lensFocus: {
      '0%, 100%': { filter: 'blur(0px)' },
      '50%': { filter: 'blur(1px)' },
    },
    lensShutter: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(0.95)', opacity: '0.8' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    lensZoom: {
      '0%': { transform: 'scale(1)' },
      '100%': { transform: 'scale(1.1)' },
    },
  },
  
  // Kingdom Clips keyframes
  clips: {
    recordingPulse: {
      '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
      '50%': { backgroundColor: 'rgba(239, 68, 68, 0.8)' },
    },
    videoPlay: {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    videoPause: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.8)', opacity: '0' },
    },
  },
  
  // Kingdom Launchpad keyframes
  launchpad: {
    launchBounce: {
      '0%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
      '100%': { transform: 'translateY(0)' },
    },
    launchGlow: {
      '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))' },
      '50%': { filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.8))' },
    },
    launchSpin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
};

// Get animations for a specific app
export function getAppAnimations(appName) {
  const base = baseAnimations;
  const appSpecific = appAnimations[appName] || {};
  
  return {
    ...base,
    ...appSpecific,
  };
}

// Get keyframes for a specific app
export function getAppKeyframes(appName) {
  const base = baseKeyframes;
  const appSpecific = appKeyframes[appName] || {};
  
  return {
    ...base,
    ...appSpecific,
  };
}

// Tailwind animation configuration
export const tailwindAnimations = {
  animation: baseAnimations,
  keyframes: baseKeyframes,
};

export default {
  baseAnimations,
  appAnimations,
  baseKeyframes,
  appKeyframes,
  getAppAnimations,
  getAppKeyframes,
  tailwindAnimations,
}; 