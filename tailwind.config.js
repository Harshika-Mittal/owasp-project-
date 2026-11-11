/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * ===== 60-30-10 COLOR SYSTEM =====
       * 
       * 60% — BASE (backgrounds, large surfaces)
       *   Light: warm cream stone   #F7F5F2
       *   Dark:  deep midnight navy #0D1117
       * 
       * 30% — SECONDARY (cards, panels, inputs, borders)
       *   Light: pure white / soft sage   #FFFFFF / #EFF6F0
       *   Dark:  charcoal slate          #161B22 / #1C2333
       * 
       * 10% — ACCENT (CTAs, links, badges, focus rings)
       *   Primary: warm teal    #0D9488
       *   Hover:   deep teal   #0F766E
       *   CTA glow:            #14B8A6
       */
      colors: {
        // 60% base surface
        base: {
          50:  '#FDFCFB',
          100: '#F7F5F2',
          150: '#F0EDEA',
          200: '#E8E4DF',
          800: '#1C2333',
          900: '#161B22',
          950: '#0D1117',
        },
        // 30% card / panel surfaces
        surface: {
          50:  '#FFFFFF',
          100: '#F9FAF9',
          150: '#EFF6F0',
          200: '#E5EDE7',
          300: '#D1DDD4',
          700: '#2A3140',
          800: '#1F2635',
          900: '#181E2A',
        },
        // 10% accent — teal
        accent: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',  // CTA glow
          600: '#0D9488',  // primary accent
          700: '#0F766E',  // hover
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Semantic colors — used sparingly for status
        success: {
          50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
        },
        warning: {
          50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
        },
        danger: {
          50: '#FEF2F2', 100: '#FEE2E2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
        },
        // Neutral text palette
        ink: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        // Headings — decorative geometric sans-serif with personality
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        // Body — ultra-readable workhorse
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        // Mono — for codes, references, UPI IDs
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display / Hero headings
        'display-xl': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Section headings
        'heading-lg': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-md': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        // Subheadings — clean, medium weight
        'sub-lg': ['0.9375rem', { lineHeight: '1.5', fontWeight: '500' }],
        'sub-md': ['0.8125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'sub-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        // Body / Paragraph — regular weight, maximum readability
        'body-lg': ['0.9375rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-md': ['0.8125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.55', fontWeight: '400' }],
        'body-xs': ['0.6875rem', { lineHeight: '1.5', fontWeight: '400' }],
        // Labels & Captions
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
        'caption': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'elevated': '0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -4px rgba(0,0,0,0.04)',
        'glow-accent': '0 0 20px -4px rgba(13,148,136,0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
