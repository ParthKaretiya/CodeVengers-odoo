/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light warm surface hierarchy
        base:             '#FAF7F2',  // warm off-white body
        'base-mid':       '#F5F0E8',  // slightly deeper beige
        'base-top':       '#EDE7DB',  // hover/active surface
        surface:          '#FFFFFF',  // card white
        'surface-raised': '#F5F0E8',  // input fields, nested panels
        'app-border':     '#E8E2D8',  // warm light border
        sidebar:          '#1C2333',  // dark navy sidebar (intentional contrast)

        // Typography — dark navy-charcoal on light
        'text-primary':   '#1C2333',
        'text-secondary': '#6B7280',

        // Brand accent — unchanged
        'accent-signal':  '#F5A623',

        // Status colors — unchanged hex values
        'status-available':  '#10B981',
        'status-shop':       '#F5A623',
        'status-retired':    '#8B93A7',
        'status-dispatched': '#3B82F6',
        'status-cancelled':  '#F43F5E',
      },
      fontFamily: {
        display:   ['"Space Grotesk"', 'sans-serif'],
        fraunces:  ['"Fraunces"',      'serif'],
        sans:      ['Inter',           'sans-serif'],
        mono:      ['"JetBrains Mono"','monospace' ],
      },
      backgroundImage: {
        // Warm amber-cream hero band — echoes the amber brand accent
        'hero-gradient': 'linear-gradient(135deg, #FFF8ED 0%, #FDEDD3 100%)',
        'hero-amber':    'linear-gradient(135deg, #FFF8ED 0%, #FDE8C8 100%)',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(28,35,51,0.08), 0 1px 2px rgba(28,35,51,0.04)',
        'card-hover': '0 4px 16px rgba(28,35,51,0.12), 0 1px 4px rgba(28,35,51,0.06)',
        'elevated':   '0 4px 16px rgba(28,35,51,0.12), 0 1px 4px rgba(28,35,51,0.06)',
      },
    },
  },
  plugins: [],
}
