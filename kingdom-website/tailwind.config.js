/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors
        navy: '#131416',
        blue: '#b7c6e0',
        gray: '#2d2f34',
        white: '#ffffff',
        // Kingdom Collective theme colors
        'kingdom-dark': '#0f172a',
        'kingdom-darker': '#1e293b',
        'kingdom-navy': '#0f172a',
        'kingdom-gold': '#facc15',
        'kingdom-gold-soft': '#fde047',
        'kingdom-gold-matte': '#eab308',
        'kingdom-orange': '#f97316',
        'kingdom-gold-light': '#fef3c7',
        'kingdom-orange-light': '#fed7aa',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '25%': { opacity: '0.8', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '75%': { opacity: '0.9', transform: 'scale(0.98)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(255, 165, 0, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.8))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}; 