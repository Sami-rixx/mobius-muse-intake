import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from mobius-muse-brand-brief
        deepMuseBlue: '#0A2463',
        brushedBrass: '#C9A96E',
        headerBlue: '#1B3A5C',
        accentTeal: '#2FA6A0',
        // Text colors
        textPrimary: '#E0E0E0',
        textSecondary: '#A0A0A0',
        textMuted: '#6B7280',
        // Status colors
        success: '#2FA6A0',
        warning: '#C9A96E',
        error: '#8B5A2B',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
