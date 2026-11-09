import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LearningProvider } from '../features/learning/context';
import { colors } from '../styles/theme';

export default function RootLayout() {
  return <LearningProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text,
      contentStyle: { backgroundColor: colors.background }, headerShadowVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="methods/[id]" options={{ title: 'AI 코딩 개발 방법론' }} />
      <Stack.Screen name="lessons/[id]" options={{ title: '첫 번째 학습' }} />
      <Stack.Screen name="practice" options={{ title: '코드로 확인하기' }} />
      <Stack.Screen name="+not-found" options={{ title: '화면을 찾지 못했어요' }} />
    </Stack>
  </LearningProvider>;
}
