/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#07080D',
          card: '#0D0F16',
          panel: '#121520',
          border: '#1A1F2C',
          borderLight: '#262D40',
          deepPurple: '#240047',
          electricPurple: '#7C2CFF',
          violet: '#A855F7',
          cyan: '#00D9FF',
          green: '#22C55E',
          orange: '#F59E0B',
          threat: '#EF4444',
        },
        obsidian: {
          950: '#07080D',
          900: '#0D0F16',
          850: '#121520',
          800: '#181C2B',
          750: '#1F2436',
          700: '#282F45',
          600: '#38425F',
          500: '#4D5A80',
        },
        intel: {
          purple: {
            DEFAULT: '#7C2CFF',
            light: '#A855F7',
            dark: '#240047',
            glow: 'rgba(124, 44, 255, 0.25)',
          },
          threat: {
            DEFAULT: '#EF4444',
            light: '#F87171',
            dark: '#991B1B',
            glow: 'rgba(239, 68, 68, 0.25)',
          },
          warning: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            dark: '#B45309',
            glow: 'rgba(245, 158, 11, 0.25)',
          },
          verified: {
            DEFAULT: '#22C55E',
            light: '#4ADE80',
            dark: '#166534',
            glow: 'rgba(34, 197, 94, 0.25)',
          },
          cyan: {
            DEFAULT: '#00D9FF',
            light: '#38BDF8',
            dark: '#0369A1',
            glow: 'rgba(0, 217, 255, 0.25)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'nexus-glow': '0 0 30px -5px rgba(124, 44, 255, 0.35)',
        'nexus-card': '0 4px 24px -1px rgba(0, 0, 0, 0.55)',
        'intel-purple': '0 0 25px -5px rgba(124, 44, 255, 0.3)',
        'intel-threat': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'intel-warning': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'intel-verified': '0 0 25px -5px rgba(34, 197, 94, 0.3)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
