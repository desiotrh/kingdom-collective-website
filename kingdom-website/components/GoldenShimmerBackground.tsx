import React, { useMemo } from "react";

/** Deterministic PRNG so design is stable across renders */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randNormal(r: () => number, mean = 0.5, sd = 0.15) {
  const u = 1 - r();
  const v = 1 - r();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + sd * z;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randBetween(r: () => number, min: number, max: number) {
  return min + r() * (max - min);
}

// Linear interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

type Props = {
  width?: number;
  height?: number;
  count?: number;
  seed?: number;
  className?: string;
  intensity?: 'minimal' | 'full';
  showSword?: boolean;
};

export default function GoldenShimmerBackground({
  width = 1440,
  height = 800,
  count = 300,
  seed = 2025,
  className = "",
  intensity = 'full',
  showSword = false,
}: Props) {
  const rnd = useMemo(() => mulberry32(seed), [seed]);

  const palette = {
    whiteGold: "#FFF6E8",
    warmGold: "#FFD580",
    amber: "#FFB347",
    bronze: "#B8742D",
    deepViolet: "#2E093F",
    nearBlack: "#0B0614",
  };

  type Streak = {
    x: number;
    yTop: number;
    len: number;
    w: number;
    opacity: number;
    blur: number;
    layer: "sharp" | "blur";
    gradientId: string;
    hero?: boolean;
  };

  const streaks: Streak[] = [];
  const gradientDefs: JSX.Element[] = [];
  const baseCount = intensity === 'minimal' ? Math.floor(count * 0.2) : count;
  const finalCount = Math.floor(baseCount * 1.18); // +18% more streaks for left bias

  // LENGTH SCALING HELPER - Edges longer, center unchanged
  const CENTER_BAND = { start: 0.36, end: 0.64 }; // 36-64% = untouched
  const EDGE_ZONE = 0.18; // 18% on each side
  const EDGE_LENGTH_BOOST = 0.35; // +35% at edges
  const MAX_LEN_RATIO = 0.65; // 65% max height
  const MIN_LEN_RATIO = 0.22; // 22% min height

  function lengthScaleForX(xRatio: number) {
    // If inside center band -> no change
    if (xRatio >= CENTER_BAND.start && xRatio <= CENTER_BAND.end) return 1;

    // Distance toward left or right edge (0 at band edge → 1 at page edge)
    const distToBand =
      xRatio < CENTER_BAND.start
        ? (CENTER_BAND.start - xRatio) / (CENTER_BAND.start - EDGE_ZONE)
        : (xRatio - CENTER_BAND.end) / (1 - EDGE_ZONE - CENTER_BAND.end);

    // Clamp 0..1
    const t = Math.max(0, Math.min(1, distToBand));

    // Ease-out for smooth transition
    const eased = 1 - Math.pow(1 - t, 2);

    // Scale = 1 at band edge → (1 + EDGE_LENGTH_BOOST) at page edge
    return 1 + EDGE_LENGTH_BOOST * eased;
  }

  for (let i = 0; i < finalCount; i++) {
    // 1. ANCHOR AT TOP EDGE: All streaks begin at/above top
    const yTop = -5 + rnd() * 5; // -5px → 0px (slight variation, always at/above top)
    
    // LEFT BIAS: Skew more streaks toward left side (15-20% boost)
    const skewedRand = () => {
      const r = rnd();
      // Bias leftward (0-0.4 area gets more density)
      return Math.pow(r, 0.85);
    };
    
    let x;
    const edgeForce = rnd();
    if (edgeForce < 0.125) {
      // 12.5% left edge
      x = rnd() * width * 0.15;
    } else if (edgeForce > 0.875) {
      // 12.5% right edge
      x = width * (0.85 + rnd() * 0.15);
    } else {
      // 75% with left bias
      x = skewedRand() * width;
    }
    
    // Base length
    let len = randBetween(rnd, height * 0.25, height * 0.55); // 25-55% base
    
    // APPLY LENGTH SCALING BY X POSITION
    const xRatio = x / width;
    const baseLenRatio = len / height;
    const scaledLenRatio = baseLenRatio * lengthScaleForX(xRatio);
    
    // SYMMETRICAL DOWNWARD ARCH: Edges dip lower, center stays higher
    // edgeDip: 0 at center, 1 at both edges (U-shape)
    const edgeDip = Math.pow(Math.abs(xRatio - 0.5) * 2, 1.6); // Smooth curve
    const dip = edgeDip * 0.08 * height; // ±8% dip at edges
    
    // Apply arch (edges extend longer)
    let calculatedEndY = yTop + scaledLenRatio * height + dip;
    
    // Cap and floor
    const finalLenRatio = Math.max(MIN_LEN_RATIO, Math.min(MAX_LEN_RATIO, (calculatedEndY - yTop) / height));
    len = finalLenRatio * height;
    
    // WIDTH: Edge streaks thinner
    const isEdge = x < width * 0.15 || x > width * 0.85;
    let w;
    if (isEdge) {
      w = 1 + rnd() * 2; // 1-3px for edges
    } else {
      w = rnd() < 0.1 ? 4 + rnd() * 2 : 1 + Math.pow(rnd(), 1.5) * 3;
    }
    w = clamp(w, 1, 6);
    
    // OPACITY: Brighter at top, dims as extends down
    const finalEndY = yTop + len;
    const heightFactor = finalEndY / height;
    let opacity = clamp(0.9 - heightFactor * 0.5 + rnd() * 0.15, 0.4, 0.95);
    
    // Edge fade boost for natural blending
    if (xRatio < 0.15 || xRatio > 0.85) {
      opacity *= 0.85; // Slightly dim at edges for graceful fade
    }
    
    // LAYER
    const layer: "sharp" | "blur" = rnd() < 0.65 ? "sharp" : "blur";
    const blur = layer === "blur" ? 3 + rnd() * 3 : 0;
    
    // MULTI-HUE COLOR SELECTION: Edge-biased
    const edgeFactor = Math.abs(x / width - 0.5) * 2; // 0 center, 1 edge
    const isHero = i < 8; // First 8 are heroes
    
    let fillId = "grad-gold";
    const colorRoll = rnd();
    
    // Color distribution based on position
    if (colorRoll < 0.20) {
      fillId = "grad-rose"; // 20% rose-gold
    } else if (colorRoll < 0.20 + 0.30 + edgeFactor * 0.15) {
      fillId = "grad-amethyst"; // 30-45% amethyst (boost near edges)
    } else if (isHero && colorRoll > 0.92) {
      fillId = "grad-ice"; // 8% ice-gold (rare hero highlights)
    } else {
      fillId = "grad-gold"; // Rest warm gold
    }
    
    streaks.push({ x, yTop, len, w, opacity, blur, layer, gradientId: fillId, hero: isHero });
  }

  // 5. MICRO-CLUSTERS: 4-7 streaks with gaps
  const clusteredStreaks: Streak[] = [];
  let clusterIndex = 0;
  
  for (let i = 0; i < streaks.length; i++) {
    if (rnd() < 0.4) {
      const s = streaks[i];
      const clusterSize = 4 + Math.floor(rnd() * 4); // 4-7
      
      for (let k = 0; k < clusterSize; k++) {
        const dx = (rnd() < 0.5 ? -1 : 1) * (2 + rnd() * 4); // 2-6px
        const variant = { ...s };
        variant.x = clamp(s.x + dx, 0, width);
        variant.w = clamp(s.w * (0.7 + rnd() * 0.5), 1, 6);
        variant.len = clamp(s.len * (0.85 + rnd() * 0.3), height * 0.25, height * 0.6);
        variant.opacity = s.opacity * (0.75 + rnd() * 0.25);
        variant.layer = rnd() < 0.5 ? "blur" : s.layer;
        variant.blur = variant.layer === "blur" ? 3 + rnd() * 3 : 0;
        
        // Color selection for cluster members
        const edgeFactor = Math.abs(variant.x / width - 0.5) * 2;
        let fillId = "grad-gold";
        const colorRoll = rnd();
        
        if (colorRoll < 0.18) {
          fillId = "grad-rose";
        } else if (colorRoll < 0.18 + 0.32 + edgeFactor * 0.15) {
          fillId = "grad-amethyst";
        } else {
          fillId = "grad-gold";
        }
        
        variant.gradientId = fillId;
        clusteredStreaks.push(variant);
      }
      
      clusterIndex++;
      i += Math.floor(2 + rnd() * 3); // 40-70px gap
    }
  }

  // ADD DEPTH LAYER: New streaks in Amber → Bronze for depth
  const depthStreaks: Streak[] = [];
  const depthCount = Math.floor(finalCount * 0.4); // 40% additional for depth
  
  for (let i = 0; i < depthCount; i++) {
    // Start from top edge
    const yTop = -5 + rnd() * 5;
    
    // Horizontal distribution (similar to main streaks)
    let x;
    const edgeForce = rnd();
    if (edgeForce < 0.125) {
      x = rnd() * width * 0.15;
    } else if (edgeForce > 0.875) {
      x = width * (0.85 + rnd() * 0.15);
    } else {
      x = clamp(randNormal(rnd, 0.5, 0.25), 0, 1) * width;
    }
    
    // Base length for depth streaks
    let len = randBetween(rnd, height * 0.25, height * 0.55);
    
    // Apply same length scaling for depth streaks
    const xRatio = x / width;
    const baseLenRatio = len / height;
    const scaledLenRatio = baseLenRatio * lengthScaleForX(xRatio);
    
    // Same symmetrical arch curve
    const edgeDip = Math.pow(Math.abs(xRatio - 0.5) * 2, 1.6);
    const dip = edgeDip * 0.08 * height;
    let calculatedEndY = yTop + scaledLenRatio * height + dip;
    
    const finalLenRatio = Math.max(MIN_LEN_RATIO, Math.min(MAX_LEN_RATIO, (calculatedEndY - yTop) / height));
    len = finalLenRatio * height;
    
    // Slightly thinner for depth effect
    const w = 1 + Math.pow(rnd(), 1.8) * 3; // Bias toward thinner
    
    // Lower opacity for depth layer
    const depthEndY = yTop + len;
    const heightFactor = depthEndY / height;
    let opacity = clamp(0.6 - heightFactor * 0.3 + rnd() * 0.15, 0.3, 0.7);
    
    // Edge fade boost (same as main streaks)
    if (xRatio < 0.15 || xRatio > 0.85) {
      opacity *= 0.85;
    }
    
    // More likely to be blurred for depth
    const layer: "sharp" | "blur" = rnd() < 0.5 ? "sharp" : "blur";
    const blur = layer === "blur" ? 3 + rnd() * 3 : 0;
    
    // COLOR SELECTION: Edge-biased (edges more purple, center warmer)
    const edgeFactor = Math.abs(x / width - 0.5) * 2; // 0 center, 1 edge
    let fillId = "grad-amber"; // Default to amber for depth layer
    const colorRoll = rnd();
    
    // Depth streaks use amber/bronze tones primarily
    if (colorRoll < 0.15) {
      fillId = "grad-rose"; // 15% rose-gold
    } else if (colorRoll < 0.15 + 0.25 + edgeFactor * 0.2) {
      fillId = "grad-amethyst"; // 25-45% amethyst (more at edges)
    } else {
      fillId = "grad-amber"; // Rest amber
    }
    
    depthStreaks.push({ x, yTop, len, w, opacity, blur, layer, gradientId: fillId });
  }
  
  const allStreaks = [...streaks, ...clusteredStreaks, ...depthStreaks];
  
  // Prune any that extend too far
  const pruned = allStreaks.filter((s) => s.yTop + s.len <= height * 0.65);

  return (
    <svg
      className={`fixed inset-0 w-full h-full -z-10 ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={palette.nearBlack} />
          <stop offset="45%" stopColor={palette.deepViolet} />
          <stop offset="100%" stopColor="#3b113d" />
        </linearGradient>

        {/* MULTI-HUE GRADIENTS for depth */}
        
        {/* Warm Gold (main) */}
        <linearGradient id="grad-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6E8"/>
          <stop offset="35%" stopColor="#FFD580"/>
          <stop offset="70%" stopColor="#FFB347"/>
          <stop offset="100%" stopColor="#B8742D" stopOpacity="0"/>
        </linearGradient>

        {/* Amethyst Gold (purple-infused) */}
        <linearGradient id="grad-amethyst" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEDCFF"/>
          <stop offset="30%" stopColor="#C29BFF"/>
          <stop offset="65%" stopColor="#9B5DE5"/>
          <stop offset="100%" stopColor="#5E2F6E" stopOpacity="0"/>
        </linearGradient>

        {/* Rose Gold */}
        <linearGradient id="grad-rose" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9E2"/>
          <stop offset="30%" stopColor="#FFC0A6"/>
          <stop offset="65%" stopColor="#FF9A76"/>
          <stop offset="100%" stopColor="#A45846" stopOpacity="0"/>
        </linearGradient>

        {/* Ice Gold (cool highlight for heroes) */}
        <linearGradient id="grad-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3FBFF"/>
          <stop offset="35%" stopColor="#D5F1FF"/>
          <stop offset="70%" stopColor="#A6D7FF"/>
          <stop offset="100%" stopColor="#3B5E7A" stopOpacity="0"/>
        </linearGradient>
        
        {/* Amber (for depth streaks) */}
        <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB347"/>
          <stop offset="40%" stopColor="#D4894A"/>
          <stop offset="75%" stopColor="#B8742D"/>
          <stop offset="100%" stopColor="#8B5A2B" stopOpacity="0"/>
        </linearGradient>

        {/* Blur filters */}
        <filter id="blur3">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="blur5">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        
        {/* 3. EXPONENTIAL FADE MASK - Darkens below 55% */}
        <linearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="55%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
        </linearGradient>
        
        {/* Purple fog for depth */}
        <radialGradient id="fog" cx="50%" cy="20%" r="65%">
          <stop offset="0%" stopColor="#4B1970" stopOpacity="0.35"/>
          <stop offset="60%" stopColor="#2E093F" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#0B0614" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      
      {/* Purple fog layer behind curtain for depth */}
      <rect x="0" y="0" width={width} height={height} fill="url(#fog)" />

      {/* Streaks */}
      <g>
        {/* 6. Blurred layer with UPWARD offset (light from above) */}
        {pruned
          .filter((s) => s.layer === "blur")
          .map((s, i) => {
            const blurOffset = -6 + rnd() * 2; // -6 to -4px upward
            return (
              <g
                key={`b-${i}`}
                opacity={s.opacity * 0.75}
                filter={s.blur > 4 ? "url(#blur5)" : "url(#blur3)"}
                style={{ mixBlendMode: "screen" as any }}
              >
                <rect
                  x={s.x - s.w / 2}
                  y={s.yTop + blurOffset}
                  width={s.w}
                  height={s.len}
                  fill={`url(#${s.gradientId})`}
                  rx={s.w / 2}
                />
              </g>
            );
          })}

        {/* Sharp layer */}
        {pruned
          .filter((s) => s.layer === "sharp")
          .map((s, i) => (
            <g key={`s-${i}`} opacity={s.opacity} style={{ mixBlendMode: "screen" as any }}>
              <rect
                x={s.x - s.w / 2}
                y={s.yTop}
                width={s.w}
                height={s.len}
                fill={`url(#${s.gradientId})`}
                rx={s.w / 2}
              />
              {/* White-gold inner core for hero streaks */}
              {s.hero && (
                <rect
                  x={s.x - (s.w * 0.45) / 2}
                  y={s.yTop}
                  width={s.w * 0.45}
                  height={s.len * 0.92}
                  fill="#FFF6E8"
                  opacity={0.5}
                  rx={(s.w * 0.45) / 2}
                  style={{ mixBlendMode: 'screen' as any }}
                />
              )}
            </g>
          ))}
      </g>

      {/* Spark dots */}
      {Array.from({ length: 28 }).map((_, i) => {
        const x = clamp(randNormal(rnd, 0.5, 0.24) * width, 0.08 * width, 0.92 * width);
        const y = clamp(randNormal(rnd, 0.2, 0.15) * height, 0, height * 0.5);
        const r = 0.8 + rnd() * 1.6;
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={palette.warmGold}
            opacity={0.1 + rnd() * 0.12}
            style={{ mixBlendMode: "screen" as any }}
          />
        );
      })}
      
      {/* BOKEH ORBS - Color-cycled for depth */}
      {Array.from({ length: 45 }).map((_, i) => {
        const x = clamp(randNormal(rnd, 0.5, 0.28) * width, 0.05 * width, 0.95 * width);
        const y = clamp(randNormal(rnd, 0.25, 0.2) * height, 0, height * 0.6);
        const r = 3 + rnd() * 8;
        const opacityVal = 0.08 + rnd() * 0.15;
        
        // Color-cycle bokeh: 60% gold, 30% amethyst, 10% ice
        let bokehColor;
        const colorRoll = rnd();
        if (colorRoll < 0.60) {
          bokehColor = palette.amber; // 60% warm gold
        } else if (colorRoll < 0.90) {
          bokehColor = "#C29BFF"; // 30% amethyst
        } else {
          bokehColor = "#D5F1FF"; // 10% ice-gold
        }
        
        return (
          <circle
            key={`bokeh-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={bokehColor}
            opacity={opacityVal}
            filter="url(#blur3)"
            style={{ mixBlendMode: "screen" as any }}
          />
        );
      })}
      
      {/* SHIMMER PARTICLES - White-gold sparkles */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = clamp(randNormal(rnd, 0.5, 0.3) * width, 0.05 * width, 0.95 * width);
        const y = clamp(randNormal(rnd, 0.15, 0.2) * height, 0, height * 0.4);
        const r = 0.4 + rnd() * 1.2; // Small sparkles
        const shimmerOpacity = 0.15 + rnd() * 0.25; // Brighter shimmer
        return (
          <circle
            key={`shimmer-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={palette.whiteGold}
            opacity={shimmerOpacity}
            style={{ mixBlendMode: "screen" as any }}
          />
        );
      })}
      
      {/* GOLDEN GLOW ORBS - Medium blurred circles */}
      {Array.from({ length: 35 }).map((_, i) => {
        const x = clamp(randNormal(rnd, 0.5, 0.25) * width, 0.1 * width, 0.9 * width);
        const y = clamp(randNormal(rnd, 0.2, 0.18) * height, 0, height * 0.5);
        const r = 2 + rnd() * 5; // 2-7px
        const glowOpacity = 0.1 + rnd() * 0.2;
        return (
          <circle
            key={`glow-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={palette.warmGold}
            opacity={glowOpacity}
            filter="url(#blur3)"
            style={{ mixBlendMode: "screen" as any }}
          />
        );
      })}
      
      {/* BRONZE SHIMMER - Warmer tones */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = clamp(randNormal(rnd, 0.5, 0.32) * width, 0.05 * width, 0.95 * width);
        const y = clamp(randNormal(rnd, 0.3, 0.22) * height, 0, height * 0.55);
        const r = 0.5 + rnd() * 1.5;
        const bronzeOpacity = 0.12 + rnd() * 0.18;
        return (
          <circle
            key={`bronze-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={palette.bronze}
            opacity={bronzeOpacity}
            style={{ mixBlendMode: "screen" as any }}
          />
        );
      })}
      
      {/* 3. FADE MASK OVERLAY - Darkens below 55% for clean text */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#fadeMask)"
        style={{ mixBlendMode: 'multiply' as any }}
      />
    </svg>
  );
}
