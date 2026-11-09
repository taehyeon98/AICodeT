import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Screen } from '../../components/ui';
import { methods } from '../../content/methods';
import { styles } from '../../styles/theme';

export default function Methods() {
  return <Screen>
    <Text accessibilityRole="header" style={styles.title}>AI 코딩 개발 방법론</Text>
    <Text style={styles.body}>공식 자료를 바탕으로 개념과 사례를 정리했어요. 진도와 관계없이 읽을 수 있어요.</Text>
    {methods.map(method => <View key={method.id} style={styles.card}>
      <Text style={styles.eyebrow}>{method.english}</Text>
      <Text accessibilityRole="header" style={styles.heading}>{method.title}</Text>
      <Text style={styles.body}>{method.summary}</Text>
      <Button secondary title={`${method.title} 읽기`} onPress={() => router.push({ pathname: '/methods/[id]', params: { id: method.id } })} />
    </View>)}
    <Text style={styles.muted}>나열된 순서는 기술의 우열이나 필수 학습 순서가 아니에요.</Text>
  </Screen>;
}
