import { questions } from '../../content/lesson';
import { initialLearningState, learningReducer } from '../learning/state';
import { decodeProgress, encodeProgress } from './storage';

function completed() {
  let state = learningReducer(initialLearningState(), { type: 'next' });
  for (const question of questions) {
    state = learningReducer(state, { type: 'select', value: question.correctIndex });
    state = learningReducer(state, { type: 'check' });
    state = learningReducer(state, { type: 'next' });
  }
  state = learningReducer(state, { type: 'code', field: 'trim', value: true });
  state = learningReducer(state, { type: 'code', field: 'blockEmpty', value: true });
  return learningReducer(state, { type: 'run' });
}
test('처음 실행과 진행 중·완료·복습 기록을 복원한다', () => {
  expect(decodeProgress(null)).toEqual(initialLearningState());
  const partial = learningReducer(initialLearningState(), { type: 'next' });
  const done = completed();
  for (const state of [partial, done, learningReducer(done, { type: 'back' }), learningReducer(done, { type: 'restart' })]) {
    expect(decodeProgress(encodeProgress(state))).toEqual(state);
  }
});
test.each(['{broken', 'null', '[]', '{}'])('손상된 기록 %s를 거부한다', raw => {
  expect(() => decodeProgress(raw)).toThrow();
});
test.each(['schemaVersion', 'contentVersion', 'missionId'])('%s가 다르면 조용히 초기화하지 않는다', field => {
  const data = JSON.parse(encodeProgress(completed()));
  data[field] = '다른 버전';
  expect(() => decodeProgress(JSON.stringify(data))).toThrow();
});
test('잘못된 답·단계·확인 상태를 거부한다', () => {
  for (const patch of [
    { step: 999 }, { answers: [100, 0, 0, 0] }, { checked: [true] },
    { step: 3, checked: [false, true, true, true] },
    { answers: [null, null, null, null], checked: [true, false, false, false] },
  ]) {
    const data = JSON.parse(encodeProgress(completed()));
    Object.assign(data.state, patch);
    expect(() => decodeProgress(JSON.stringify(data))).toThrow();
  }
});
test('조작되거나 현재 코드와 맞지 않는 실행 결과를 거부한다', () => {
  const data = JSON.parse(encodeProgress(completed()));
  data.state.practice.trim = false;
  expect(() => decodeProgress(JSON.stringify(data))).toThrow();
  const changed = JSON.parse(encodeProgress(completed()));
  changed.state.practice.results[0].items = ['거짓 결과'];
  expect(() => decodeProgress(JSON.stringify(changed))).toThrow();
});
