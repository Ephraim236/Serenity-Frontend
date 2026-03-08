export const colors = {
  primary: '#4f46e5',
  primaryLight: '#6366f1',
  primaryDark: '#4338ca',
  primaryBg: '#eef2ff',
  primaryMuted: '#e0e7ff',

  success: '#22c55e',
  successBg: '#f0fdf4',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
  error: '#ef4444',
  errorBg: '#fef2f2',
  info: '#3b82f6',
  infoBg: '#eff6ff',

  neutral900: '#171717',
  neutral800: '#262626',
  neutral700: '#404040',
  neutral600: '#525252',
  neutral500: '#737373',
  neutral400: '#a3a3a3',
  neutral300: '#d4d4d4',
  neutral200: '#e5e5e5',
  neutral100: '#f5f5f5',
  neutral50: '#fafafa',
  white: '#ffffff',
  background: '#f5f5f5',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  smallMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  smallBold: { fontSize: 14, fontWeight: '700' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: '700' as const, lineHeight: 16 },
  tiny: { fontSize: 10, fontWeight: '700' as const, lineHeight: 14 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
};
