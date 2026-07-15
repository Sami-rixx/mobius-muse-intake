// Brand colors from mobius-muse-brand-brief
export const colors = {
  // Primary colors
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

  // Background colors
  nightBackground: '#0A2463',
  cardBackground: 'rgba(27, 58, 92, 0.2)', // headerBlue with 20% opacity
  glassBackground: 'rgba(255, 255, 255, 0.1)',

  // Border colors
  borderPrimary: 'rgba(27, 58, 92, 0.3)',
  borderSecondary: 'rgba(255, 255, 255, 0.2)',
} as const;

// Type-safe color keys
export type ColorKey = keyof typeof colors;
