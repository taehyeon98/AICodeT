import { StyleSheet } from 'react-native';

export const colors = {
  background: '#FFFDF8', surface: '#FFFFFF', text: '#24372D', muted: '#59685E',
  primary: '#26684B', onPrimary: '#FFFFFF', soft: '#EDF5E8', border: '#D5E0D2',
  warm: '#FFF0CE', warmText: '#755422', shadow: '#CBD8C7',
};

export const styles = StyleSheet.create({
  content: { padding: 22, gap: 20, paddingBottom: 32, width: '100%', maxWidth: 600, alignSelf: 'center' },
  title: { color: colors.text, fontSize: 28, lineHeight: 39, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 19, lineHeight: 28, fontWeight: '600' },
  body: { color: colors.text, fontSize: 16, lineHeight: 26 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 20, gap: 12 },
  softCard: { backgroundColor: colors.soft, borderRadius: 20, padding: 20, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.border },
});
