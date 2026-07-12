/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy depth hierarchy
        base:             '#0A1628',
        'base-mid':       '#0F1E36',
        'base-top':       '#13213D',
        surface:          '#121F38',
        'surface-raised': '#16274A',
        'app-border':     '#22335A',
        sidebar:          '#081220',

        // Typography
        'text-primary':   '#F5F6F8',
        'text-secondary': '#8B9BB8',

        // Brand accent
        'accent-signal':  '#F5A623',

        // Status colors (used in inline styles primarily)
        'status-available': '#10B981',
        'status-shop':      '#F5A623',
        'status-retired':   '#8B93A7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans:    ['Inter',           'sans-serif'],
        mono:    ['"JetBrains Mono"','monospace' ],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0F1E36 0%, #162B4A 50%, #1A2F50 100%)',
        'hero-amber':    'linear-gradient(135deg, #131E30 0%, #1C2A3F 50%, #1F2D3D 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'elevated': '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
}
