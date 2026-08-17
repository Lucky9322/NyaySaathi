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
        // Primary indigo accent
        indigo: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Saffron — Indian identity
        saffron: {
          50:  '#fff8ed',
          100: '#ffefd3',
          200: '#ffdca6',
          300: '#ffc26d',
          400: '#ffac3a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Navy surface palette
        navy: {
          900: '#0b0f1a',
          800: '#111827',
          700: '#141b2d',
          600: '#1a2236',
          500: '#1e2840',
          400: '#243050',
        },
        // Semantic
        india: {
          saffron: '#FF9933',
          white:   '#FFFFFF',
          green:   '#138808',
          navy:    '#000080',
        },
        // Legacy aliases
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-md':'0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        'card-lg':'0 8px 24px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
        'indigo': '0 4px 16px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'skeleton':    'skeleton-shimmer 1.5s ease-in-out infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'skeleton-shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      opacity: {
        '3':   '0.03',
        '4':   '0.04',
        '6':   '0.06',
        '7':   '0.07',
        '8':   '0.08',
        '12':  '0.12',
        '14':  '0.14',
        '16':  '0.16',
      },
    },
  },
  plugins: [],
}
