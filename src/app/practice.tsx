import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Screen, SourceLink } from '../components/ui';
import { lessonId, trimSource } from '../content/lesson';
import { useLearning } from '../features/learning/context';
import { missionPassed, understandingPassed } from '../features/learning/state';
import { cases, CodeChoices, initialItems, solutionCode } from '../features/playground/runner';
import { SaveStatus } from '../features/progress/status';
import { colors, styles } from '../styles/theme';

export default function Practice() {
  const { state, dispatch } = useLearning();
  const p = state.practice;
  if (!understandingPassed(state)) return <Screen>
    <Text style={styles.title}>먼저 기준을 알아봐요</Text>
    <Text style={styles.body}>네 가지 이해 확인을 마치면 코드 실습을 할 수 있어요.</Text>
    <Button title="이해 확인 이어하기" onPress={() => router.replace({ pathname: '/lessons/[id]', params: { id: lessonId } })} />
  </Screen>;
  const choices: { field: keyof CodeChoices; title: string; options: string[] }[] = [
    { field: 'trim', title: '1. 입력의 앞뒤 공백', options: ['그대로 두기 · input', '제거하기 · input.trim()'] },
    { field: 'blockEmpty', title: '2. 처리한 값이 빈 문자열일 때', options: ['그대로 추가하기', '추가를 멈추고 안내하기'] },
  ];
  return <Screen>
    <Text style={styles.eyebrow}>AI 개발 원칙 · 결과 검증</Text>
    <Text accessibilityRole="header" style={styles.title}>고른 코드가 정말{ '\n' }문제를 고칠까요?</Text>
    <Text style={styles.body}>처음에는 두 코드를 그대로 두고 실행해 오류를 확인하세요. 그다음 코드를 바꾸고 다시 실행해보세요.</Text>
    <View style={styles.softCard}>
      <Text style={styles.heading}>확인할 기준</Text>
      <Text style={styles.body}>빈 입력과 공백만 있는 입력은 안내하고 추가하지 않아요. 정상 입력은 기존 목록을 유지하며 한 번만 추가해요.</Text>
      <Text style={styles.muted}>교육용 예제 · 실행할 때마다 각 입력을 같은 초기 목록 [“{initialItems[0]}”]에서 확인해요.</Text>
    </View>
    {choices.map(choice => <View key={choice.field} style={{ gap: 10 }} accessibilityRole="radiogroup" accessibilityLabel={choice.title}>
      <Text style={styles.heading}>{choice.title}</Text>
      {choice.options.map((label, index) => {
        const selected = p[choice.field] === (index === 1);
        return <Pressable key={label} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={label}
          onPress={() => dispatch({ type: 'code', field: choice.field, value: index === 1 })}
          style={({ pressed }) => [practice.option, selected && practice.selected, pressed && { opacity: 0.75 }]}>
          <Text style={styles.body}>{selected ? '●' : '○'} {label}</Text>
        </Pressable>;
      })}
    </View>)}
    <View style={styles.card}><Text style={styles.heading}>선택한 코드</Text>
      <Text selectable style={practice.code}>{solutionCode(p)}</Text>
      <Text style={styles.muted}>items는 현재 목록이에요. [...items, text]는 기존 항목 뒤에 새 항목을 붙인 목록을 만들어요.</Text>
    </View>
    <SourceLink title="코딩 기초 근거 · MDN trim()" url={trimSource} />
    <Button title={p.results ? '세 가지 입력 다시 실행' : '세 가지 입력 실행'} onPress={() => dispatch({ type: 'run' })} />
    {!p.results && <Text style={styles.muted}>현재 코드의 실행 결과가 없어요. 코드를 바꾸면 이전 결과는 지워져요.</Text>}
    {p.results && <View accessibilityLiveRegion="polite" style={{ gap: 16 }}>
      <Text accessibilityRole="header" style={styles.heading}>{missionPassed(state) ? '오류 수정 미션 완료!' : '아직 맞지 않는 결과가 있어요'}</Text>
      {p.results.map(result => {
        const test = cases.find(item => item.id === result.id)!;
        return <View key={result.id} style={[styles.softCard, !result.passed && { backgroundColor: colors.warm }]}>
          <Text style={styles.heading}>{result.passed ? '✓ 통과' : '다시 확인'} · {test.label}</Text>
          <Text style={styles.body}>입력: {JSON.stringify(test.input)}{ '\n' }기대: {test.expected}</Text>
          <Text style={styles.body}>실제 목록 ({result.items.length}개):{ '\n' }{result.items.map((item, i) => `${i + 1}. ${JSON.stringify(item)}`).join('\n')}</Text>
          <Text style={styles.body}>실제 안내: {result.message || '없음'}</Text>
        </View>;
      })}
      <Text style={styles.body}>{missionPassed(state)
        ? '이해 확인과 세 입력의 실행 검증을 모두 마쳤어요. 준비된 세 가지 사례를 통과한 결과이며 모든 입력에서 안전하다는 뜻은 아니에요.'
        : !p.blockEmpty ? '힌트: 값이 비어 있어도 목록에 추가되고 있어요. 추가 전에 어떤 조건을 확인해야 할까요?'
          : '힌트: 공백 세 칸과 빈 문자열은 달라요. 비교하기 전에 앞뒤 공백을 처리해보세요.'}</Text>
    </View>}
    <SaveStatus />
    <Button title="내 기록 보기" secondary onPress={() => router.push('/records')} />
  </Screen>;
}
const practice = StyleSheet.create({
  option: { padding: 16, minHeight: 56, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.primary, backgroundColor: colors.soft },
  code: { fontFamily: 'monospace', fontSize: 13, lineHeight: 23, color: colors.text },
});
