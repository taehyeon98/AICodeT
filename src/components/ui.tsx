import { PropsWithChildren } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, styles } from '../styles/theme';

export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView edges={['bottom', 'left', 'right']} style={ui.screen}>
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
  </SafeAreaView>;
}

export function Button({ title, onPress, disabled = false, secondary = false }: {
  title: string; onPress: () => void; disabled?: boolean; secondary?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
    onPress={onPress} style={({ pressed }) => [ui.button, secondary && ui.secondary,
      disabled && ui.disabled, pressed && !disabled && ui.pressed]}>
    <Text style={[ui.buttonText, secondary && ui.secondaryText, disabled && ui.disabledText]}>{title}</Text>
  </Pressable>;
}

export function SourceLink({ title, url }: { title: string; url: string }) {
  return <Pressable accessibilityRole="link" accessibilityLabel={`${title}, 외부 원문 열기`}
    onPress={() => { void Linking.openURL(url).catch(() => Alert.alert('원문을 열지 못했어요', '인터넷 연결과 브라우저를 확인해주세요.')); }}
    style={({ pressed }) => [ui.source, pressed && ui.pressed]}>
    <Text style={ui.sourceText}>{title} ↗</Text>
  </Pressable>;
}

const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  button: { minHeight: 54, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary,
    borderRadius: 15, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 4, borderBottomColor: '#194E37' },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.onPrimary, textAlign: 'center' },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomColor: colors.border },
  secondaryText: { color: colors.primary },
  disabled: { backgroundColor: colors.border, borderBottomColor: colors.border },
  disabledText: { color: colors.muted },
  pressed: { opacity: 0.75 },
  source: { minHeight: 48, justifyContent: 'center', paddingVertical: 10 },
  sourceText: { color: colors.primary, fontSize: 14, lineHeight: 23, textDecorationLine: 'underline' },
});
