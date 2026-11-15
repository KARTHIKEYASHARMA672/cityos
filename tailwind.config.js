/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        city: {
          primary: '#176B68',
          'primary-hover': '#10524F',
          ink: '#173634',
          'ink-deep': '#0E2422',
          bg: '#F6F3E9',
          surface: '#FAF8F2',
          'surface-card': '#FFFFFF',
          border: '#E2DDD1',
          'border-dark': '#C9C2B1',
          muted: '#5B6664',
          terracotta: '#BC5434',
          'terracotta-dark': '#8E3820',
          amber: '#D9A441',
          saffron: '#E07A2B',
          navy: '#1D3557',
          forest: '#245B45',
          water: '#2A7B9B',
          danger: '#C53030',
          warning: '#DD6B20',
          success: '#2F855A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'card': '0 2px 10px rgba(23, 54, 52, 0.05), 0 1px 3px rgba(23, 54, 52, 0.03)',
        'elevated': '0 10px 30px rgba(23, 54, 52, 0.08), 0 4px 8px rgba(23, 54, 52, 0.04)',
        'hud': '0 20px 40px -15px rgba(23, 54, 52, 0.15)'
      }
    },
  },
  plugins: [],
}
