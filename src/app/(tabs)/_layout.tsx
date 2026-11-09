import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../styles/theme';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text,
    headerShadowVisible: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }, tabBarLabelStyle: { fontSize: 12 } }}>
    <Tabs.Screen name="index" options={{ title: '학습', headerTitle: 'AICodeT', tabBarIcon: ({ color }) => <Text accessibilityElementsHidden style={{ color, fontSize: 22 }}>◎</Text> }} />
    <Tabs.Screen name="methods" options={{ title: '방법론', tabBarIcon: ({ color }) => <Text accessibilityElementsHidden style={{ color, fontSize: 22 }}>▤</Text> }} />
    <Tabs.Screen name="records" options={{ title: '내 기록', tabBarIcon: ({ color }) => <Text accessibilityElementsHidden style={{ color, fontSize: 22 }}>✓</Text> }} />
  </Tabs>;
}
