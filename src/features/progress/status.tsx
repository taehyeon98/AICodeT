import { Text } from 'react-native';
import { styles } from '../../styles/theme';
import { useLearning } from '../learning/context';

export function SaveStatus() {
  const { saveStatus } = useLearning();
  return <Text accessibilityLiveRegion="polite" style={styles.muted}>
    {saveStatus === 'saving' ? '기기에 저장 중…' : saveStatus === 'error' ? '최근 변경을 저장하지 못했어요.' : '이 기기에 진도를 보관해요. 앱을 다시 열어 이어갈 수 있어요.'}
  </Text>;
}
