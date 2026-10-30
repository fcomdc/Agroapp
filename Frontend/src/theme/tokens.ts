import { Platform, StyleSheet } from 'react-native';

export const palette = {
  forest: '#173F35',
  green: '#28634B',
  lime: '#D6E7A3',
  cream: '#F6F5EF',
  paper: '#FFFFFF',
  ink: '#20392F',
  muted: '#737D73',
  line: '#E3E6DB',
  pale: '#EAF0E4',
  clay: '#A66443',
  sand: '#F4E9DC',
  danger: '#A53832',
  info: '#4D716B',
};
export const fonts = {
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    default: 'system-ui',
  }),
  heading: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia',
  }),
};
export const tabPalette = {
  active: '#183F35',
  inactive: '#68736D',
  background: '#F8F7F1',
  indicator: '#E5EDDF',
};
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.cream },
  content: {
    padding: 22,
    paddingBottom: 36,
    gap: 20,
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 34,
    color: palette.ink,
    lineHeight: 42,
    flexShrink: 1,
  },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  section: { fontSize: 19, fontWeight: '600', color: palette.ink },
  card: {
    backgroundColor: palette.paper,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    minWidth: 0,
  },
  label: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    minWidth: 0,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 12,
    backgroundColor: palette.paper,
    paddingHorizontal: 14,
    color: palette.ink,
    fontSize: 16,
  },
  error: { color: palette.danger, fontSize: 13, lineHeight: 20, marginTop: 6 },
  divider: { height: 1, backgroundColor: palette.line },
});
