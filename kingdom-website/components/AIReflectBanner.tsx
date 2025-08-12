import React, { useEffect, useState } from 'react';

export default function AIReflectBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'ai_reflect_banner_dismissed_until';
    const now = Date.now();
    const dismissedUntil = Number(localStorage.getItem(key) || 0);
    if (dismissedUntil > now) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-3xl">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b1220]/90 px-4 py-2 backdrop-blur">
        <p className="text-xs text-white/80">
          AI is a tool—not your voice. Pause, reflect, and lead your vision.
        </p>
        <button
          aria-label="Dismiss"
          onClick={() => {
            setVisible(false);
            try {
              const sevenDays = 7 * 24 * 60 * 60 * 1000;
              localStorage.setItem('ai_reflect_banner_dismissed_until', String(Date.now() + sevenDays));
            } catch {}
          }}
          className="ml-3 rounded-lg border border-white/10 bg-[#1f2937] px-2 py-1 text-xs font-semibold text-kingdom-gold hover:bg-[#111827]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}


