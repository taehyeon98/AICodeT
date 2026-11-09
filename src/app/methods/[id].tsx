import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Screen, SourceLink } from '../../components/ui';
import { methods } from '../../content/methods';
import { lessonId } from '../../content/lesson';
import { styles } from '../../styles/theme';

export default function MethodDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const method = methods.find(item => item.id === id);
  if (!method) return <Screen><Text style={styles.title}>아직 없는 설명이에요</Text><Button title="방법론 목록으로" onPress={() => router.replace('/methods')} /></Screen>;
  return <Screen>
    <Text style={styles.eyebrow}>{method.english}</Text>
    <Text accessibilityRole="header" style={styles.title}>{method.title}</Text>
    <Text style={styles.muted}>마지막 출처 확인 · {method.checkedAt}</Text>
    {method.sections.map(section => <View key={section.title} style={section.title.startsWith('교육용') ? styles.softCard : { gap: 12 }}>
      <Text accessibilityRole="header" style={styles.heading}>{section.title}</Text>
      <Text style={styles.body}>{section.body}</Text>
      {section.sourceIndexes?.map(index => {
        const source = method.sources[index];
        return source ? <SourceLink key={source.url} title={`근거 · ${source.title}`} url={source.url} /> : null;
      })}
    </View>)}
    <View style={styles.divider} />
    <Text accessibilityRole="header" style={styles.heading}>원문 출처</Text>
    {method.sources.map(source => <View key={source.url}>
      <SourceLink title={source.title} url={source.url} /><Text style={styles.muted}>발행일 · {source.publishedAt}</Text>
    </View>)}
    <Text style={styles.muted}>원문은 외부 브라우저에서 열려요. 인터넷 연결이 필요해요.</Text>
    <Button title="검증 기준을 정하는 첫 학습" onPress={() => router.push({ pathname: '/lessons/[id]', params: { id: lessonId } })} />
  </Screen>;
}
