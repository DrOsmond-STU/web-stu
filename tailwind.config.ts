import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Skala opacity penuh (0–100) agar penulisan seperti `bg-white/12`
      // atau `text-white/85` valid, termasuk saat dipakai di dalam @apply.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      colors: {
        // Palet diambil langsung dari logo SAESTU (biru -> cyan -> oranye -> emas)
        brand: {
          50: '#eefaff',
          100: '#d8f2ff',
          200: '#b9eaff',
          300: '#86dfff',
          400: '#4bcbfb',
          500: '#29abe2',
          600: '#1189c1',
          700: '#106d9c',
          800: '#135b81',
          900: '#154c6c',
          950: '#0d3049',
        },
        ink: {
          50: '#f3f7fa',
          100: '#e3ecf3',
          200: '#cbdde9',
          300: '#a6c6da',
          400: '#7aa7c6',
          500: '#5a8bb1',
          600: '#467196',
          700: '#3a5c7a',
          800: '#334e66',
          900: '#0b2740',
          950: '#061726',
        },
        sun: {
          50: '#fffaeb',
          100: '#fff2c6',
          200: '#ffe388',
          300: '#ffce4a',
          400: '#fbb040',
          500: '#f7941d',
          600: '#db6f08',
          700: '#b64d0b',
          800: '#933b10',
          900: '#793111',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(11,39,64,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,39,64,.05) 1px, transparent 1px)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,39,64,.04), 0 12px 32px -12px rgba(11,39,64,.18)',
        lift: '0 2px 6px rgba(11,39,64,.06), 0 24px 48px -18px rgba(11,39,64,.28)',
        glow: '0 18px 60px -20px rgba(41,171,226,.65)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slow-zoom': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.09)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .8s ease both',
        'slow-zoom': 'slow-zoom 12s ease-out forwards',
        marquee: 'marquee 38s linear infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
