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
        primary: {
          50: '#fef3f2',
          100: '#fde4e1',
          200: '#fbc9c3',
          300: '#f7a198',
          400: '#f16e62',
          500: '#e64535',
          600: '#d32f20',
          700: '#b02418',
          800: '#922118',
          900: '#7a211a',
          950: '#420c08',
        },
        saffron: {
          50: '#fff8ed',
          100: '#ffefd3',
          200: '#ffdca6',
          300: '#ffc26d',
          400: '#ff9e32',
          500: '#ff7f0a',
          600: '#f06200',
          700: '#c74a00',
          800: '#9e3a07',
          900: '#7f320b',
        },
        india: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#000080',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
}
