/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '768px',
      md: '1024px',
      lg: '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      // Ground
      ink: '#17150F',
      paper: '#F7F4EE',
      chalk: '#EFEAE0',
      graphite: '#6A6459',   // Direction A muted. Checked ≥4.5:1 on #F7F4EE.
      hairline: '#DCD5C7',

      // The dye range — used as large colour fields, not decoration.
      madder: '#C0392B',
      clay: '#C97B5A',
      rust: '#A8542E',
      ochre: '#D99A2B',
      saffron: '#E8B84B',
      forest: '#2D5443',
      sage: '#8BA888',
      teal: '#1B6B6B',
      indigo: '#1E3A5F',
      lapis: '#2E5C8A',
      plum: '#5E2A47',
    },
    fontFamily: {
      // Family names must match what fontsource registers, or the browser
      // silently falls back to Arial. Verify in node_modules before changing.
      display: ['Cormorant Garamond Variable', 'Georgia', 'serif'],
      body: ['Schibsted Grotesk Variable', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      utility: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      xs: ['0.8125rem', { lineHeight: '1.5' }],
      sm: ['0.9375rem', { lineHeight: '1.55' }],
      base: ['1.0625rem', { lineHeight: '1.6' }],
      lg: ['1.25rem', { lineHeight: '1.5' }],
      xl: ['1.5rem', { lineHeight: '1.35' }],
      // Display steps (2xl-7xl) cut 20% from every value below, site-wide, per
      // the client's fold/readability request — not per-page tweaks.
      '2xl': ['1.6rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      '3xl': ['2.2rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      '4xl': ['3rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
      '5xl': ['4rem', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      '6xl': ['5.6rem', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
      '7xl': ['7.6rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
    },
    // Full contiguous scale on purpose. A previous build used a sparse scale,
    // so classes like `gap-9` / `text-xs` silently resolved to nothing instead
    // of erroring — invisible layout bugs. Keep every step defined.
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      18: '4.5rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      gutter: '4rem',
      'gutter-mobile': '1.5rem',
      section: '9rem',
      'section-mobile': '5rem',
    },
    extend: {
      maxWidth: {
        content: '100rem',
        measure: '60ch',
        narrow: '46rem',
      },
      lineHeight: {
        body: '1.6',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      aspectRatio: {
        portrait: '3 / 4',
        landscape: '4 / 3',
        wide: '16 / 9',
        cinema: '21 / 9',
      },
    },
  },
  plugins: [],
};
