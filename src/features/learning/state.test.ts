import { questions } from '../../content/lesson';
import { finalStep, initialLearningState, isPassed, learningReducer, LearningState } from './state';

const act = learningReducer;
function finish(): LearningState {
  let state = act(initialLearningState(), { type: 'next' });
  for (const question of questions) {
    state = act(state, { type: 'select', value: question.correctIndex });
    state = act(state, { type: 'check' });
    state = act(state, { type: 'next' });
  }
  return state;
}
describe('첫 학습의 완료 조건', () => {
  test('미선택·미확인 답으로 다음 문제에 갈 수 없다', () => {
    const state = act(initialLearningState(), { type: 'next' });
    expect(act(state, { type: 'check' })).toEqual(state);
    expect(act(state, { type: 'next' })).toEqual(state);
    const selected = act(state, { type: 'select', value: 1 });
    expect(act(selected, { type: 'next' })).toEqual(selected);
  });
  test('오답은 이동을 막고, 답 변경은 기존 판정을 지운다', () => {
    let state = act(initialLearningState(), { type: 'next' });
    state = act(state, { type: 'select', value: 0 });
    state = act(state, { type: 'check' });
    expect(isPassed(state, 0)).toBe(false);
    expect(act(state, { type: 'next' }).step).toBe(1);
    state = act(state, { type: 'select', value: 1 });
    expect(state.checked[0]).toBe(false);
    state = act(state, { type: 'check' });
    expect(isPassed(state, 0)).toBe(true);
    state = act(state, { type: 'select', value: 0 });
    expect(state.checked[0]).toBe(false);
    expect(isPassed(state, 0)).toBe(false);
  });
  test('네 문항을 실제로 확인한 뒤에만 완료한다', () => {
    const completed = finish();
    expect(completed.step).toBe(finalStep);
    expect(completed.completedOnce).toBe(true);
    expect(questions.every((_, i) => isPassed(completed, i))).toBe(true);
    expect(act(completed, { type: 'next' })).toEqual(completed);
  });
  test('이전 화면은 답을 유지하고, 복습은 완료 이력을 유지한다', () => {
    const completed = finish();
    const previous = act(completed, { type: 'back' });
    expect(previous.step).toBe(finalStep - 1);
    expect(previous.answers).toEqual(completed.answers);
    const replay = act(completed, { type: 'restart' });
    expect(replay.step).toBe(0);
    expect(replay.answers.every(v => v === null)).toBe(true);
    expect(replay.checked.every(v => !v)).toBe(true);
    expect(replay.completedOnce).toBe(true);
  });
  test('이전 문제를 통과하지 않은 비정상 상태에서 완료할 수 없다', () => {
    const state = { ...finish(), step: finalStep - 1, checked: [false, true, true, true], completedOnce: false };
    expect(act(state, { type: 'next' })).toEqual(state);
  });
  test('잘못된 선택 값과 설명 화면의 선택 요청을 무시한다', () => {
    const intro = initialLearningState();
    expect(act(intro, { type: 'select', value: 1 })).toEqual(intro);
    const state = act(intro, { type: 'next' });
    for (const value of [-1, 3, 0.5, NaN]) expect(act(state, { type: 'select', value })).toEqual(state);
    expect(act(intro, { type: 'back' }).step).toBe(0);
  });
});
