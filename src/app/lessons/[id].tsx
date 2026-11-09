import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Screen, SourceLink } from '../../components/ui';
import { lessonId, lessonTitle, questions } from '../../content/lesson';
import { useLearning } from '../../features/learning/context';
import { finalStep, isPassed } from '../../features/learning/state';
import { SaveStatus } from '../../features/progress/status';
import { colors, styles } from '../../styles/theme';

export default function Lesson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useLearning();
  const scroll = useRef<ScrollViewInstance>(null);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [state.step]);
  if (id !== lessonId) return <Screen><Text style={styles.title}>아직 없는 학습이에요</Text><Button title="학습 홈으로" onPress={() => router.replace('/')} /></Screen>;
  const index = state.step - 1;
  const question = questions[index];
  const answer = state.answers[index];
  const passed = isPassed(state, index);
  const done = state.step === finalStep;
  const feedbackVisible = question && state.checked[index];
  const replay = () => Alert.alert('다시 풀까요?', '현재 답과 코드 실습 결과를 지우고 첫 설명으로 돌아가요. 이해 확인을 마친 이력은 유지해요.', [
    { text: '취소', style: 'cancel' }, { text: '다시 풀기', onPress: () => dispatch({ type: 'restart' }) },
  ]);
  return <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView ref={scroll} contentContainerStyle={styles.content}>
      <View style={{ gap: 10 }}>
        <Text style={styles.muted}>{lessonTitle} · {done ? '이해 확인 완료' : `${state.step + 1} / ${finalStep}`}</Text>
        <View accessibilityRole="progressbar" accessibilityLabel="학습 진행" accessibilityValue={{ min: 0, max: finalStep, now: state.step }} style={lesson.track}>
          <View style={[lesson.progress, { width: `${state.step / finalStep * 100}%` }]} />
        </View>
      </View>
      {state.step === 0 && <>
        <Text style={styles.eyebrow}>AI 개발 원칙 · 검증 기준</Text>
        <Text accessibilityRole="header" style={styles.title}>고치기 전에,{ '\n' }기준부터 정해요</Text>
        <Text style={styles.body}>AI에게 수정을 부탁할 때는 문제 상황과 원하는 결과를 함께 알려주세요.</Text>
        <View style={styles.softCard}><Text style={styles.heading}>“이상해. 고쳐줘”보다</Text>
          <Text style={styles.body}>“빈 내용은 추가하지 말고, 정상적인 할 일은 계속 추가되게 해줘.”</Text>
          <Text style={styles.muted}>교육용 요청문 예시</Text></View>
        {['어떤 문제가 생겼는지 관찰', '원하는 동작을 구체적으로 전달', '수정 후 확인할 입력 정하기'].map((line, i) =>
          <View key={line} style={styles.row}><View style={lesson.number}><Text style={lesson.numberText}>{i + 1}</Text></View><Text style={[styles.body, { flex: 1 }]}>{line}</Text></View>)}
      </>}
      {question && <>
        <Text style={styles.eyebrow}>{question.category}</Text>
        <Text accessibilityRole="header" style={styles.title}>{question.title}</Text>
        <Text style={styles.body}>{question.description}</Text>
        {question.example && <View style={styles.softCard}><Text style={styles.body}>{question.example}</Text></View>}
        {question.id === 'trim' && <View style={styles.softCard}><Text style={lesson.code}>const text = input.value.{answer == null ? '____' : question.options[answer]}();</Text></View>}
        <View accessibilityRole="radiogroup" accessibilityLabel="답 선택" style={{ gap: 14 }}>
          {question.options.map((option, value) => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: answer === value }}
            accessibilityLabel={option} onPress={() => dispatch({ type: 'select', value })}
            style={({ pressed }) => [lesson.option, answer === value && lesson.selected, pressed && { opacity: 0.75 }]}>
            <Text importantForAccessibility="no" style={lesson.radio}>{answer === value ? '●' : '○'}</Text>
            <Text style={[styles.body, { flex: 1 }]}>{option}</Text>
          </Pressable>)}
        </View>
        {question.source && <SourceLink title="설명 근거 · MDN trim() · 확인 2026-11-09" url={question.source} />}
      </>}
      {done && <>
        <View style={lesson.finish}><Text style={lesson.finishText}>✓</Text></View>
        <Text style={styles.eyebrow}>이해 확인을 마쳤어요</Text>
        <Text accessibilityRole="header" style={styles.title}>다음엔 무엇을{ '\n' }확인할지 알겠죠?</Text>
        <View style={styles.softCard}><Text style={styles.heading}>이번에 다룬 내용</Text>
          <Text style={styles.body}>• 문제 상황과 기대 결과 설명하기{ '\n' }• trim()으로 앞뒤 공백 처리하기{ '\n' }• 여러 입력으로 결과 확인하기</Text></View>
        <Text style={styles.body}>이제 코드 조각을 바꾸고 빈 입력·공백 입력·정상 입력의 실제 결과를 확인해봐요.</Text>
      </>}
      {feedbackVisible && <View accessibilityLiveRegion="polite" style={[styles.softCard, !passed && { backgroundColor: colors.warm }]}>
        <Text style={[styles.heading, !passed && { color: colors.warmText }]}>{passed ? '맞았어요' : '다시 살펴보세요'}</Text>
        <Text style={[styles.body, !passed && { color: colors.warmText }]}>{passed ? question.correct : question.retry}</Text>
      </View>}
      {done ? <>
        <Button title="코드 실습으로 이어가기" onPress={() => router.push('/practice')} />
        <Button title="학습 홈으로" onPress={() => router.replace('/')} />
        <Button title="처음부터 다시 풀기" secondary onPress={replay} />
      </> : <>
        <Text style={styles.muted}>{question ? answer == null ? '답을 선택해주세요.' : '준비된 문항 기준으로 확인해요.' : '짧은 설명부터 시작해요.'}</Text>
        <Button title={!question ? '시작하기' : passed ? '계속하기' : '확인하기'} disabled={!!question && answer == null}
          onPress={() => dispatch({ type: !question || passed ? 'next' : 'check' })} />
        {state.step > 0 && <Button title="이전 학습 화면" secondary onPress={() => dispatch({ type: 'back' })} />}
      </>}
      <SaveStatus />
    </ScrollView>
  </SafeAreaView>;
}
const lesson = StyleSheet.create({
  track: { height: 10, borderRadius: 10, backgroundColor: colors.border, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.primary },
  number: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  numberText: { color: colors.onPrimary, fontWeight: '700' },
  option: { flexDirection: 'row', gap: 12, padding: 16, minHeight: 56, backgroundColor: colors.surface,
    borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border },
  selected: { backgroundColor: colors.soft, borderColor: colors.primary },
  radio: { color: colors.primary, fontSize: 20 },
  code: { color: colors.text, fontFamily: 'monospace', fontSize: 15, lineHeight: 25 },
  finish: { alignSelf: 'center', padding: 18, borderRadius: 24, backgroundColor: colors.soft },
  finishText: { fontSize: 36, color: colors.primary },
});
