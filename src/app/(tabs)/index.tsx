import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../../components/ui';
import { lessonId, lessonTitle } from '../../content/lesson';
import { useLearning } from '../../features/learning/context';
import { finalStep, missionPassed, understandingPassed } from '../../features/learning/state';
import { SaveStatus } from '../../features/progress/status';
import { colors, styles } from '../../styles/theme';

export default function Home() {
  const { state } = useLearning();
  return <Screen>
    <View style={{ gap: 8 }}><Text style={styles.eyebrow}>AI와 만드는 첫걸음</Text>
      <Text accessibilityRole="header" style={styles.title}>코드를 만들기 전에,{ '\n' }생각하는 법부터.</Text>
      <Text style={styles.muted}>작은 설명과 질문으로 AI와 개발하는 방법을 익혀요.</Text></View>
    <View style={styles.softCard}>
      <Text style={styles.eyebrow}>개발 가이드</Text>
      <Text accessibilityRole="header" style={styles.heading}>AI 코딩 개발 방법론</Text>
      <Text style={styles.body}>하네스·컨텍스트·프롬프트,{ '\n' }출처와 함께 알아보세요.</Text>
      <Button title="AI 코딩 개발 방법론 보기" onPress={() => router.push('/methods')} />
    </View>
    <View style={{ gap: 6 }}><Text style={styles.eyebrow}>첫 단원</Text>
      <Text accessibilityRole="header" style={styles.heading}>작은 오류, 분명한 기준</Text></View>
    <View style={home.pathRow}>
      <View style={home.node}><Text style={home.nodeText}>{missionPassed(state) ? '✓' : '1'}</Text></View>
      <View style={{ flex: 1, gap: 6 }}><Text style={styles.heading}>{lessonTitle}</Text>
        <Text style={styles.muted}>설명 읽기 · 네 가지 질문 · 이해 확인</Text></View>
    </View>
    <Button title={state.step === finalStep ? '이해 확인 결과 보기' : state.step > 0 ? '학습 이어하기' : '첫 학습 시작하기'}
      onPress={() => router.push({ pathname: '/lessons/[id]', params: { id: lessonId } })} />
    <View style={home.next}><Text style={styles.eyebrow}>{missionPassed(state) ? '오류 수정 미션 완료' : '다음 활동 · 코드 실습'}</Text><Text style={styles.body}>코드 조각을 바꾸고 결과 확인하기</Text>
      <Text style={styles.muted}>{understandingPassed(state) ? '빈 입력·공백·정상 입력을 실제로 실행해봐요.' : '네 가지 이해 확인을 마치면 열려요.'}</Text>
      <Button title={missionPassed(state) ? '실습 결과 보기' : '코드 실습하기'} disabled={!understandingPassed(state)} onPress={() => router.push('/practice')} />
    </View>
    <SaveStatus />
  </Screen>;
}
const home = StyleSheet.create({
  pathRow: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  node: { backgroundColor: colors.primary, borderRadius: 24, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#194E37' },
  nodeText: { color: colors.onPrimary, fontSize: 24, fontWeight: '700' },
  next: { borderLeftWidth: 3, borderLeftColor: colors.border, marginLeft: 28, paddingLeft: 24, gap: 8 },
});
