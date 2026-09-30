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
        dark: {
          bg: '#0A0D14',
          surface: '#0F1420',
          card: '#141A29',
          cardHover: '#1A2236',
          border: '#1F293D',
          borderLight: '#2D3B55',
          text: '#F1F5F9',
          muted: '#8E9BAE',
        },
        trade: {
          green: '#10B981',
          greenGlow: 'rgba(16, 185, 129, 0.2)',
          greenBg: 'rgba(16, 185, 129, 0.1)',
          red: '#EF4444',
          redGlow: 'rgba(239, 68, 68, 0.2)',
          redBg: 'rgba(239, 68, 68, 0.1)',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
