/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This will be extended by each app to include their specific paths
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kingdom Collective Brand Colors
        'kingdom-dark': '#0f172a',
        'kingdom-darker': '#1e293b',
        'kingdom-navy': '#0f172a',
        'kingdom-gold': '#facc15',
        'kingdom-orange': '#f97316',
        'kingdom-gold-light': '#fef3c7',
        'kingdom-orange-light': '#fed7aa',
        
        // Legacy colors (for backward compatibility)
        navy: '#131416',
        blue: '#b7c6e0',
        gray: '#2d2f34',
        white: '#ffffff',
        
        // Semantic colors
        primary: '#facc15', // kingdom-gold
        secondary: '#f97316', // kingdom-orange
        accent: '#0f172a', // kingdom-dark
        background: '#0f172a',
        surface: '#1e293b',
        text: '#ffffff',
        'text-secondary': '#b7c6e0',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '25%': { opacity: '0.8', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '75%': { opacity: '0.9', transform: 'scale(0.98)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'kingdom': '0 0 20px rgba(250, 204, 21, 0.3)',
        'kingdom-lg': '0 0 30px rgba(250, 204, 21, 0.4)',
        'kingdom-xl': '0 0 40px rgba(250, 204, 21, 0.5)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    // Custom plugins can be added here
  ],
}; 