import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Button, Screen } from '../../components/ui';
import { lessonId, lessonTitle, questions } from '../../content/lesson';
import { useLearning } from '../../features/learning/context';
import { isPassed, missionPassed, understandingPassed } from '../../features/learning/state';
import { SaveStatus } from '../../features/progress/status';
import { styles } from '../../styles/theme';

export default function Records() {
  const { state, dispatch, reset, notice, saveStatus } = useLearning();
  const passed = questions.filter((_, index) => isPassed(state, index)).length;
  const openLesson = () => router.push({ pathname: '/lessons/[id]', params: { id: lessonId } });
  function replay() {
    Alert.alert('처음부터 다시 풀까요?', '현재 답과 코드 실습 결과를 초기화해요. 이해 확인을 마친 이력은 유지해요.', [
      { text: '취소', style: 'cancel' }, { text: '다시 풀기', onPress: () => { dispatch({ type: 'restart' }); openLesson(); } },
    ]);
  }
  return <Screen>
    <Text accessibilityRole="header" style={styles.title}>차근차근 쌓는 이해</Text>
    <View style={styles.softCard}><Text style={styles.heading}>이 기기에 쌓이는 기록</Text>
      <SaveStatus />
      <Text style={styles.muted}>다른 기기로 옮겨지지 않아요. 앱 삭제나 앱 데이터 삭제 시 기록이 사라질 수 있어요.</Text>
      {!!notice && saveStatus !== 'error' && <Text accessibilityLiveRegion="polite" style={styles.body}>{notice}</Text>}
    </View>
    <View style={styles.card}><Text style={styles.heading}>{lessonTitle}</Text>
      <Text style={styles.body}>{state.completedOnce ? '이해 확인을 한 번 마쳤어요.' : state.step > 0 ? '학습 중이에요.' : '아직 시작하지 않았어요.'}</Text>
      <Text style={styles.muted}>현재 풀이에서 확인한 정답 · {passed} / {questions.length}</Text>
      <Text style={styles.body}>{missionPassed(state) ? '오류 수정 미션 완료 · 이해 확인 + 세 입력 검증 통과' : state.practice.results ? `코드 실행 결과 · ${state.practice.results.filter(result => result.passed).length} / 3 통과` : '코드 실습 · 현재 코드 실행 전'}</Text>
      <Button title={state.step > 0 ? '현재 학습 보기' : '학습 시작하기'} onPress={openLesson} />
      {understandingPassed(state) && <Button title="코드 실습 보기" onPress={() => router.push('/practice')} />}
      {state.step > 0 && <Button title="처음부터 다시 풀기" secondary onPress={replay} />}
    </View>
    <Button title="학습 기록 모두 지우기" secondary onPress={() => Alert.alert('학습 기록을 모두 지울까요?', '이 기기의 답·실습 결과·완료 이력을 모두 지워요. 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' }, { text: '모두 지우기', style: 'destructive', onPress: () => { void reset(); } },
    ])} />
  </Screen>;
}
