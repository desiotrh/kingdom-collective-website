/**
 * Video Background Demo
 * Test different fade settings for the Heavenly BG video
 */

import { useState } from 'react';
import Head from 'next/head';
import SeamlessVideoBackground from '../components/SeamlessVideoBackground';

export default function VideoBackgroundDemo() {
  const [fadeHeight, setFadeHeight] = useState(35);
  const [videoOpacity, setVideoOpacity] = useState(0.9);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showControls, setShowControls] = useState(true);

  return (
    <>
      <Head>
        <title>Video Background Demo | Kingdom Studios</title>
        <meta name="description" content="Heavenly background video with fade overlay" />
      </Head>

      <div className="relative w-full h-screen overflow-hidden bg-[#0B0614]">
        {/* Seamless Video Background with Cross-Fade Loop */}
        <SeamlessVideoBackground
          videoSrc="/assets/Heavenly-BG-video.mp4"
          fadeHeight={fadeHeight}
          fadeColor="#0B0614"
          opacity={videoOpacity}
          playbackRate={playbackSpeed}
          crossFadeDuration={2}
        />

        {/* Controls Panel */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setShowControls(!showControls)}
            className="mb-2 px-4 py-2 bg-black/70 text-white rounded-lg backdrop-blur-sm hover:bg-black/90 transition-colors border border-white/20"
          >
            {showControls ? 'Hide' : 'Show'} Controls
          </button>

          {showControls && (
            <div className="bg-black/80 backdrop-blur-md p-6 rounded-lg text-white space-y-5 min-w-[320px] border border-white/20">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">Video Settings</h2>

              {/* Fade Height */}
              <div>
                <label className="block text-sm mb-2 font-semibold">
                  Bottom Fade Height: {fadeHeight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={fadeHeight}
                  onChange={(e) => setFadeHeight(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <p className="text-xs text-white/50 mt-1">
                  Higher = more watermark coverage
                </p>
              </div>

              {/* Video Opacity */}
              <div>
                <label className="block text-sm mb-2 font-semibold">
                  Video Opacity: {Math.round(videoOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={videoOpacity * 100}
                  onChange={(e) => setVideoOpacity(Number(e.target.value) / 100)}
                  className="w-full accent-yellow-500"
                />
                <p className="text-xs text-white/50 mt-1">
                  Lower = more subtle effect
                </p>
              </div>

              {/* Playback Speed */}
              <div>
                <label className="block text-sm mb-2 font-semibold">
                  Playback Speed: {playbackSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <p className="text-xs text-white/50 mt-1">
                  Slower = more cinematic
                </p>
              </div>

              {/* Quick Presets */}
              <div className="pt-4 border-t border-white/30">
                <p className="text-sm font-semibold mb-2">Quick Presets:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setFadeHeight(35);
                      setVideoOpacity(0.9);
                      setPlaybackSpeed(1.0);
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Balanced
                  </button>
                  <button
                    onClick={() => {
                      setFadeHeight(45);
                      setVideoOpacity(0.8);
                      setPlaybackSpeed(0.7);
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Subtle
                  </button>
                  <button
                    onClick={() => {
                      setFadeHeight(25);
                      setVideoOpacity(1);
                      setPlaybackSpeed(1.2);
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Vibrant
                  </button>
                  <button
                    onClick={() => {
                      setFadeHeight(50);
                      setVideoOpacity(0.7);
                      setPlaybackSpeed(0.5);
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Dreamy
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 border-t border-white/30 text-xs text-white/60">
                <p className="mb-2">
                  The fade overlay covers the bottom watermark while creating a smooth transition to your page content.
                </p>
                <p className="text-yellow-400/70 text-[10px] mt-2">
                  💡 Tip: Upgrade to watermark-free when budget allows
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sample Content to Show How It Integrates */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
              Kingdom Studios
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
              Heavenly Background
            </p>
            <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              <p className="text-white/80 text-sm">
                ✨ Seamless Cross-Fade Loop
              </p>
            </div>
          </div>
        </div>

        {/* Settings Display */}
        <div className="absolute bottom-4 left-4 text-white/60 text-xs font-mono bg-black/70 px-4 py-3 rounded backdrop-blur-sm border border-white/20">
          <div className="space-y-1">
            <div><strong>Fade:</strong> {fadeHeight}% from bottom</div>
            <div><strong>Opacity:</strong> {Math.round(videoOpacity * 100)}%</div>
            <div><strong>Speed:</strong> {playbackSpeed.toFixed(1)}x</div>
          </div>
        </div>
      </div>
    </>
  );
}

