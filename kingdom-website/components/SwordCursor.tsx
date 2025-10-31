'use client';

import { useEffect, useState, useRef } from 'react';

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  type: 'flame' | 'bokeh';
  opacity: number;
  size: number;
  delay: number;
}

export default function SwordCursor() {
  const [particles, setParticles] = useState<CursorParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Create particles on mouse move (throttled)
      const now = Date.now();
      if (now - lastTime > 50) { // Every 50ms
        lastTime = now;

        // Get unique IDs using ref (avoids closure issues)
        const currentId = particleIdRef.current;
        particleIdRef.current += 2;

        // Flame particle
        const flameParticle: CursorParticle = {
          id: currentId,
          x: e.clientX + Math.random() * 10 - 5,
          y: e.clientY + Math.random() * 10 - 5,
          type: 'flame',
          opacity: 1,
          size: 4 + Math.random() * 4,
          delay: 0,
        };

        // Bokeh particles (smaller, more frequent)
        const bokehParticle: CursorParticle = {
          id: currentId + 1,
          x: e.clientX + Math.random() * 15 - 7.5,
          y: e.clientY + Math.random() * 15 - 7.5,
          type: 'bokeh',
          opacity: 0.8,
          size: 2 + Math.random() * 3,
          delay: Math.random() * 100,
        };

        setParticles((prev) => [...prev, flameParticle, bokehParticle]);
      }
    };

    // Animate and fade out particles
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            opacity: p.opacity - 0.02,
            y: p.y - 0.5, // Slight upward drift
            size: p.size * 0.98, // Shrink slightly
          }))
          .filter((p) => p.opacity > 0)
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // No dependencies needed - using ref

  return (
    <>
      {/* Particle trail */}
      <div className="pointer-events-none fixed inset-0 z-[10000]">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={particle.type === 'flame' ? 'cursor-flame-particle' : 'cursor-bokeh-particle'}
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              width: particle.size,
              height: particle.size,
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </>
  );
}


