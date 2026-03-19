/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#08080f',
        'background-secondary': '#0e0e18',
        surface: '#14141f',
        'surface-hover': '#1f1f23',
        primary: '#fafafa',
        secondary: '#b4b4bc',
        muted: '#8b8b94',
        accent: '#818cf8',
        'accent-hover': '#6366f1',
        'accent-glow': 'rgba(129, 140, 248, 0.15)',
        border: '#25253a',
        'border-hover': '#3f3f46',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        h1: ['4.5rem', { lineHeight: '1.05', fontWeight: '700' }],
        'h1-mobile': ['2.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        h2: ['2.5rem', { lineHeight: '1.15', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        body: ['1.0625rem', { lineHeight: '1.75' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        xs: ['0.75rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 0 0 1px rgba(129, 140, 248, 0.3), 0 8px 40px rgba(129, 140, 248, 0.08)',
        glow: '0 0 60px rgba(129, 140, 248, 0.15)',
      },
      maxWidth: {
        container: '72rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-text': 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(129, 140, 248, 0.05) 0%, rgba(192, 132, 252, 0.02) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marqueeReverse 30s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
