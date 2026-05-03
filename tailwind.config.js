/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Surface colors — deep blacks for backgrounds
        surface: {
          50:  '#e8e8ef',
          100: '#c5c5d3',
          200: '#9f9fb5',
          300: '#797997',
          400: '#53537a',
          500: '#2d2d5e',
          600: '#1e1e3a',
          700: '#16162b',
          800: '#12121a',
          900: '#0a0a0f',
          950: '#060609',
        },
        // Accent — electric cyan
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Legacy aliases for compatibility
        primary: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        dark: {
          50:  '#e8e8ef',
          100: '#c5c5d3',
          200: '#9f9fb5',
          300: '#797997',
          400: '#53537a',
          500: '#3d3d5c',
          600: '#1e1e3a',
          700: '#16162b',
          800: '#12121a',
          900: '#0a0a0f',
          950: '#060609',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(6,182,212,0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(6,182,212,0.6)' },
        },
        typing: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%':      { opacity: '1',   transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(6,182,212,0.15)',
        'glow':     '0 0 20px rgba(6,182,212,0.2)',
        'glow-lg':  '0 0 40px rgba(6,182,212,0.25)',
        'glow-xl':  '0 0 60px rgba(6,182,212,0.3)',
        'inner-glow': 'inset 0 0 20px rgba(6,182,212,0.1)',
      },
    },
  },
  plugins: [],
}
