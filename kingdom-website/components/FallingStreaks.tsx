import React, { useEffect, useRef } from "react";

type Props = {
  /** % of container height where particles should stop (0.0–1.0). e.g., 0.58 */
  stopRatio?: number;
  /** How many concurrent particles; keep subtle for elegance */
  count?: number;
  /** Visual intensity (0.6–1.6 typical) */
  intensity?: number;
  /** z-index class; place between glow & sharp streaks (same as crown) */
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vy: number;       // velocity
  len: number;      // current length
  maxLen: number;   // tail length
  w: number;        // width
  hue: "gold" | "amethyst" | "rose" | "ice";
  life: number;     // 0..1 fade
  stopY: number;    // pixel y where to stop/fade
};

const PALETTES = {
  gold:    ["#FFF6E8", "#FFD580", "#FFB347", "#B8742D"],
  amethyst:["#EEDCFF", "#C29BFF", "#9B5DE5", "#5E2F6E"],
  rose:    ["#FFE9E2", "#FFC0A6", "#FF9A76", "#A45846"],
  ice:     ["#F3FBFF", "#D5F1FF", "#A6D7FF", "#3B5E7A"],
};

export default function FallingStreaks({
  stopRatio = 0.58,
  count = 14,
  intensity = 1.0,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const motionQuery = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let running = true;

    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const particles: Particle[] = [];
    function spawnOne(w: number, h: number): Particle {
      const edgeBias = Math.random();
      // bias some spawns toward edges to echo the curtain's edges
      let x: number;
      if (edgeBias < 0.12) x = Math.random() * (w * 0.16);                  // left 16%
      else if (edgeBias > 0.88) x = w * (0.84 + Math.random() * 0.16);      // right 16%
      else x = w * (0.16 + Math.random() * 0.68);                            // mid 68%

      const stopY = h * stopRatio * (0.95 + Math.random() * 0.06); // tiny jitter
      const huePick = Math.random();
      const hue: Particle["hue"] =
        huePick < 0.55 ? "gold" : huePick < 0.80 ? "amethyst" : huePick < 0.92 ? "rose" : "ice";

      const baseSpeed = 90 + Math.random() * 60; // px/s
      const p: Particle = {
        x,
        y: -10 - Math.random() * 40,     // start just above top
        vy: baseSpeed * (0.85 + Math.random() * 0.5),
        len: 0,
        maxLen: (40 + Math.random() * 90) * intensity,  // tail length
        w: Math.max(1, Math.random() * 2.6),            // width 1–2.6 px
        hue,
        life: 1,
        stopY,
      };
      return p;
    }

    function ensureParticles() {
      const { clientWidth: w, clientHeight: h } = canvas;
      while (particles.length < count) particles.push(spawnOne(w, h));
    }

    function gradientFor(p: Particle, ctx: CanvasRenderingContext2D) {
      const g = ctx.createLinearGradient(p.x, p.y - p.len, p.x, p.y);
      const c = PALETTES[p.hue];
      g.addColorStop(0.00, `${c[0]}${alphaHex(0.00)}`);
      g.addColorStop(0.15, `${c[0]}${alphaHex(0.55 * p.life)}`);
      g.addColorStop(0.45, `${c[1]}${alphaHex(0.85 * p.life)}`);
      g.addColorStop(0.75, `${c[2]}${alphaHex(0.60 * p.life)}`);
      g.addColorStop(1.00, `${c[3]}${alphaHex(0.00)}`);
      return g;
    }

    function alphaHex(a: number) {
      const v = Math.max(0, Math.min(1, a));
      return Math.round(v * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
    }

    let last = performance.now();
    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp delta
      last = now;

      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      // additive/screen-ish glow
      (ctx as any).globalCompositeOperation = "screen";

      // update/draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // advance downward
        const targetStop = p.stopY;
        if (p.y < targetStop - 4) {
          p.y += p.vy * dt; // fall
          p.len = Math.min(p.maxLen, p.len + 140 * dt); // grow tail
        } else {
          // at stop line: fade out & slightly shorten
          p.life -= 0.85 * dt;
          p.len = Math.max(0, p.len - 80 * dt);
          if (p.life <= 0.02) {
            particles.splice(i, 1);
            continue;
          }
        }

        // draw streak as rounded rect
        ctx.fillStyle = gradientFor(p, ctx);
        const x = p.x - p.w / 2;
        const y = p.y - p.len;
        const r = p.w / 2;
        roundedRect(ctx, x, y, p.w, p.len, r);
        ctx.fill();

        // subtle glow halo
        ctx.save();
        ctx.filter = "blur(2px)";
        ctx.globalAlpha = 0.35 * p.life;
        roundedRect(ctx, x, y, p.w, p.len * 0.9, r);
        ctx.fillStyle = gradientFor(p, ctx);
        ctx.fill();
        ctx.restore();
      }

      ensureParticles();
      raf = requestAnimationFrame(frame);
    }

    function roundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    // init
    fit();
    ensureParticles();
    last = performance.now();
    if (!motionQuery.matches) raf = requestAnimationFrame(frame);

    // resize
    const ro = new ResizeObserver(() => {
      fit();
      // adjust stopY for each particle on resize
      const h = canvas.clientHeight;
      particles.forEach(p => (p.stopY = h * stopRatio * (0.95 + Math.random() * 0.06)));
    });
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [count, intensity, stopRatio]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <canvas
        ref={ref}
        className="w-full h-full"
        aria-hidden
      />
    </div>
  );
}

