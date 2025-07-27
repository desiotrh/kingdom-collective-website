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
        kingdom: {
          navy: '#144e9c',
          royal: '#1e3a8a',
          gold: '#f1c376',
          goldLight: '#f8d89a',
          goldDark: '#d4a574',
          dark: '#0a1428',
          darker: '#0f1f3d',
          accent: '#fbbf24',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'ribbon-wave': 'ribbon-wave 8s ease-in-out infinite',
        'ribbon-slide': 'ribbon-slide 12s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ribbon-float': 'ribbon-float 10s ease-in-out infinite',
      },
      keyframes: {
        'ribbon-wave': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(2deg)' },
          '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-15px) rotate(1deg)' },
        },
        'ribbon-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'ribbon-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(3deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(241, 195, 118, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(241, 195, 118, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ribbon-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f1c376\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
} 