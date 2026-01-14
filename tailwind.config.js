/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Gold
        gold: {
          DEFAULT: '#FFC024',
          light: '#FFD666',
          dark: '#E6A500',
        },
        // Background
        background: '#F4F6F8',
        // Text
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          tertiary: '#94A3B8',
          inverse: '#FFFFFF',
        },
        // Border
        border: {
          DEFAULT: '#F1F5F9',
          muted: 'rgba(241, 245, 249, 0.5)',
        },
        // Status
        status: {
          success: '#34D399',
          warning: '#F5C564',
          error: '#E84A5F',
          info: '#1DA1F2',
        },
        // Chart colors
        chart: {
          primary: '#FFC024',
          secondary: '#E84A5F',
          tertiary: '#34D399',
          quaternary: '#1DA1F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.6875rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['2rem', { lineHeight: '2.5rem' }],
        '3xl': ['2.5rem', { lineHeight: '3rem' }],
        '4xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      letterSpacing: {
        tight: '-0.025em',
        wide: '0.05em',
        wider: '0.1em',
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3.5rem',
        '3xl': '5rem',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
        elevated: '0 20px 60px -15px rgba(0, 0, 0, 0.08)',
        sidebar: '4px 0 24px rgba(0, 0, 0, 0.02)',
        gold: '0 4px 20px -2px rgba(255, 192, 36, 0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
