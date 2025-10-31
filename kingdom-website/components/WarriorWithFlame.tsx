'use client';

import { useEffect, useRef } from 'react';

interface WarriorWithFlameProps {
  crownPos: {
    left: number;
    bottom: number;
    width: number;
  };
}

export default function WarriorWithFlame({ crownPos }: WarriorWithFlameProps) {
  const embersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const embers = embersRef.current;
    if (!embers || embers.dataset.ready) return;

    embers.dataset.ready = '1';

    // Create 36 rising ember particles
    for (let i = 0; i < 36; i++) {
      const e = document.createElement('div');
      e.className = 'ember';
      const size = (Math.random() * 3 + 1).toFixed(1);
      e.style.width = `${size}px`;
      e.style.height = `${size}px`;
      e.style.left = `${Math.random() * 100}%`;
      e.style.bottom = '-8px';
      e.style.animation = `rise ${7 + Math.random() * 5}s linear ${Math.random() * 6}s infinite`;
      embers.appendChild(e);
    }

    // Add keyframes for rising animation
    if (!document.getElementById('ember-rise-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ember-rise-keyframes';
      style.innerHTML = `
        @keyframes rise {
          0% { transform: translateY(0); opacity: .8; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="relative w-full flex justify-center items-end">
      {/* Warrior PNG with soft bottom fade */}
      <img
        src="/woman-with-sword.svg"
        alt=""
        className="pointer-events-none select-none absolute z-[40]"
        style={{
          left: crownPos.left + (crownPos.width * 0.35),
          transform: "translateX(-50%)",
          bottom: `${crownPos.bottom * 0.298}px`,
          width: `min(40.2vw, ${Math.max(419, crownPos.width * 0.550)}px)`,
          filter: "drop-shadow(0 20px 40px rgba(255,180,80,0.30))",
          opacity: 1,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Rising embers */}
      <div 
        id="embers" 
        ref={embersRef}
        className="pointer-events-none absolute inset-0" 
        style={{ zIndex: 42 }}
      />
    </div>
  );
}

