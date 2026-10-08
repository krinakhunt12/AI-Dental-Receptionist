/**
 * Design Tokens for SmileCare AI
 * Based on 8px grid spacing, clinical dark-navy theme, and WCAG AA compliant contrast.
 */

export const TOKENS = {
  colors: {
    bgDark: '#050811',
    bgNavy: '#090e1a',
    bgCard: 'rgba(15, 23, 42, 0.75)',
    borderSubtle: 'rgba(255, 255, 255, 0.10)',
    borderTeal: 'rgba(45, 212, 191, 0.30)',

    textPrimary: '#f1f5f9',   // slate-100 (Contrast > 12:1 against #050811)
    textSecondary: '#cbd5e1', // slate-300 (Contrast ~ 7.5:1)
    textMuted: '#94a3b8',     // slate-400 (Contrast ~ 4.8:1)

    tealPrimary: '#2dd4bf',   // teal-400
    tealDark: '#0d9488',      // teal-600
    emeraldPrimary: '#34d399',// emerald-400
  },

  radius: {
    sm: 'rounded-lg',   // 8px
    md: 'rounded-xl',   // 12px
    lg: 'rounded-2xl',  // 16px
    xl: 'rounded-3xl',  // 24px
    full: 'rounded-full',
  },

  spacing: {
    grid8: 'p-2 gap-2',   // 8px
    grid16: 'p-4 gap-4', // 16px
    grid24: 'p-6 gap-6', // 24px
    grid32: 'p-8 gap-8', // 32px
  },

  shadows: {
    cardGlow: 'shadow-[0_0_50px_-12px_rgba(45,212,191,0.18)]',
    buttonTeal: 'shadow-[0_4px_20px_-4px_rgba(45,212,191,0.4)]',
  },
} as const;
