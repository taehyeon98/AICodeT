import { questions } from '../../content/lesson';
import { initialLearningState, learningReducer, missionPassed } from '../learning/state';
import { addTodo, initialItems, runCases, solutionCode } from './runner';

function understood() {
  let state = learningReducer(initialLearningState(), { type: 'next' });
  for (const question of questions) {
    state = learningReducer(state, { type: 'select', value: question.correctIndex });
    state = learningReducer(state, { type: 'check' });
    state = learningReducer(state, { type: 'next' });
  }
  return state;
}
test.each([
  [false, false, [false, false, true]],
  [true, false, [false, false, true]],
  [false, true, [true, false, true]],
  [true, true, [true, true, true]],
])('공백 처리 %s, 빈 값 차단 %s의 실제 결과', (trim, blockEmpty, expected) => {
  expect(runCases({ trim: trim as boolean, blockEmpty: blockEmpty as boolean }).map(r => r.passed)).toEqual(expected);
});
test('각 입력은 같은 초기 목록에서 시작하고 정상 추가는 원본을 변경하지 않는다', () => {
  const items = ['기존 1', '기존 2'];
  const result = addTodo({ trim: true, blockEmpty: true }, '  새 항목  ', items);
  expect(result).toEqual({ items: ['기존 1', '기존 2', '새 항목'], message: '' });
  expect(items).toEqual(['기존 1', '기존 2']);
  const runs = runCases({ trim: false, blockEmpty: false });
  expect(runs.map(r => r.items)).toEqual([
    [...initialItems, ''], [...initialItems, '   '], [...initialItems, '공부하기'],
  ]);
});
test('표시 코드는 선택한 변환과 차단 동작을 포함한다', () => {
  expect(solutionCode({ trim: false, blockEmpty: false })).toContain('const text = input;');
  expect(solutionCode({ trim: false, blockEmpty: false })).not.toContain('if (');
  expect(solutionCode({ trim: true, blockEmpty: true })).toContain('const text = input.trim();');
  expect(solutionCode({ trim: true, blockEmpty: true })).toContain('if (text === "")');
});
test('실행 전에는 완료되지 않고 코드 변경 시 결과를 무효화한다', () => {
  let state = understood();
  state = learningReducer(state, { type: 'code', field: 'trim', value: true });
  state = learningReducer(state, { type: 'code', field: 'blockEmpty', value: true });
  expect(missionPassed(state)).toBe(false);
  state = learningReducer(state, { type: 'run' });
  expect(missionPassed(state)).toBe(true);
  const changed = learningReducer(state, { type: 'code', field: 'trim', value: false });
  expect(changed.practice.results).toBeNull();
  expect(missionPassed(changed)).toBe(false);
  const restarted = learningReducer(state, { type: 'restart' });
  expect(restarted.practice).toEqual(initialLearningState().practice);
  expect(restarted.completedOnce).toBe(true);
  expect(missionPassed(restarted)).toBe(false);
});
test('이해 확인을 통과하기 전에는 실행·코드 선택이 잠긴다', () => {
  const state = initialLearningState();
  expect(learningReducer(state, { type: 'run' })).toBe(state);
  expect(learningReducer(state, { type: 'code', field: 'trim', value: true })).toBe(state);
});
test('마지막 답 확인 뒤 완료 화면까지 진행해야 첫 실습이 열린다', () => {
  let state = learningReducer(initialLearningState(), { type: 'next' });
  questions.forEach((question, i) => {
    state = learningReducer(state, { type: 'select', value: question.correctIndex });
    state = learningReducer(state, { type: 'check' });
    if (i < questions.length - 1) state = learningReducer(state, { type: 'next' });
  });
  expect(learningReducer(state, { type: 'run' })).toBe(state);
  state = learningReducer(state, { type: 'next' });
  expect(learningReducer(state, { type: 'run' }).practice.results).not.toBeNull();
});
