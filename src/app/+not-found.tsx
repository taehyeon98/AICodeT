import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Screen } from '../components/ui';
import { styles } from '../styles/theme';

export default function NotFound() {
  return <Screen><Text style={styles.title}>화면을 찾지 못했어요</Text>
    <Text style={styles.body}>홈에서 다시 학습을 선택해주세요.</Text>
    <Button title="학습 홈으로" onPress={() => router.replace('/')} /></Screen>;
}
