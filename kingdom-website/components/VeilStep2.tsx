import React from 'react';

const PALETTE = {
  whiteGold: "#FFF6E8",
  warmGold:  "#FFD580",
  amber:     "#FFB347",
  bronze:    "#B8742D",
  am2:       "#C29BFF",
  am3:       "#9B5DE5",
};

export default function VeilStep2() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0614]">
      {/* Radial gradient from top center light source */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 100% at 50% 0%, #FFE5CC 0%, #FFD580 12%, #FFB347 22%, #C29BFF 45%, #5E2F6E 72%, #0B0614 100%)",
        }}
      />

      {/* broad light rays radiating from top center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[.18] mix-blend-screen">
        <defs>
          <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="15%" stopColor="rgba(255,246,232,0.42)" />
            <stop offset="35%" stopColor="rgba(255,213,128,0.28)" />
            <stop offset="55%" stopColor="rgba(255,179,71,0.16)" />
            <stop offset="75%" stopColor="rgba(155,93,229,0.08)" />
            <stop offset="90%" stopColor="rgba(155,93,229,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Create ~20 light rays spreading from top center */}
        {Array.from({ length: 20 }).map((_, i) => {
          const totalRays = 20;
          const spreadAngle = 140; // degrees of spread (wider for more spacing)
          const startAngle = -70; // start angle (left side)
          const angle = startAngle + (i / (totalRays - 1)) * spreadAngle;
          const radians = (angle * Math.PI) / 180;
          
          // Ray starts at top center (50%, 0%)
          const x1 = 50;
          const y1 = 0;
          
          // Ray ends at an angle, extending far enough to reach edges
          const length = 200; // vw units, extends beyond viewport
          const x2 = x1 + Math.sin(radians) * length;
          const y2 = y1 + Math.cos(radians) * length;
          
          // Make middle 8 rays (indices 6-13) brighter and thicker
          const isMiddleRay = i >= 6 && i <= 13;
          const rayOpacity = isMiddleRay ? 0.9 : 0.4;
          const rayWidth = isMiddleRay ? 16 : 10;
          
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#rayGrad)"
              strokeWidth={rayWidth}
              opacity={rayOpacity}
            />
          );
        })}
      </svg>

      {/* fine dust (simple) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 140 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${(Math.random() * 2 + 0.6).toFixed(1)}px`,
              height: `${(Math.random() * 2 + 0.6).toFixed(1)}px`,
              background:
                Math.random() < 0.7 ? `${PALETTE.warmGold}` : `${PALETTE.am2}`,
              opacity: 0.18 + Math.random() * 0.35,
              mixBlendMode: "screen",
            }}
          />
        ))}
      </div>
    </div>
  );
}

