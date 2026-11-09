import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import { colors, styles } from '../../styles/theme';
import { createProgressStore, ProgressSnapshot } from '../progress/store';

type Store = ReturnType<typeof createProgressStore>;
const LearningContext = createContext<(ProgressSnapshot & Pick<Store, 'dispatch' | 'retrySave' | 'reset'>) | null>(null);
export function LearningProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => createProgressStore(AsyncStorage));
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => { void store.load(); }, [store]);
  const reset = () => Alert.alert('학습 기록을 모두 지울까요?', '이 기기에 저장된 답·실습 결과·완료 이력을 지워요. 되돌릴 수 없어요.', [
    { text: '취소', style: 'cancel' }, { text: '모두 지우기', style: 'destructive', onPress: () => { void store.reset(); } },
  ]);
  return <LearningContext.Provider value={{ ...snapshot, dispatch: store.dispatch, retrySave: store.retrySave, reset: store.reset }}>
    {snapshot.phase !== 'ready' ? <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>{snapshot.phase === 'loading' ? '학습 기록을 불러오는 중이에요' : snapshot.phase === 'resetting' ? '학습 기록을 지우는 중이에요' : '기록을 확인해주세요'}</Text>
        {!!snapshot.notice && <Text style={styles.body}>{snapshot.notice}</Text>}
        {snapshot.phase === 'load-error' && <>
          <Button title="다시 불러오기" onPress={() => { void store.load(); }} />
          <Button title="기록 초기화" secondary onPress={reset} />
        </>}
      </View>
    </SafeAreaView> : <View style={{ flex: 1 }}>
      {children}
      {snapshot.saveStatus === 'error' && <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.warm }}>
        <View accessibilityLiveRegion="polite" style={{ padding: 16, gap: 8 }}>
          <Text style={styles.body}>{snapshot.notice}</Text>
          <Button title="현재 풀이 다시 저장" onPress={() => { void store.retrySave(); }} />
        </View>
      </SafeAreaView>}
    </View>}
  </LearningContext.Provider>;
}
export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error('LearningProvider가 필요합니다.');
  return value;
}
