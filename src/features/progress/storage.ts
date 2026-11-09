import { lessonId, questions } from '../../content/lesson';
import { finalStep, initialLearningState, isPassed, LearningState } from '../learning/state';
import { runCases } from '../playground/runner';

export const progressKey = '@aicodet/progress';
export const schemaVersion = 1;
export const contentVersion = 1;
export type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};
export function encodeProgress(state: LearningState): string {
  return JSON.stringify({ schemaVersion, contentVersion, missionId: lessonId, state });
}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function decodeProgress(raw: string | null): LearningState {
  if (raw === null) return initialLearningState();
  const invalid = () => new Error('기록 형식이 손상됐거나 현재 학습 버전과 맞지 않아요.');
  let data: unknown;
  try { data = JSON.parse(raw); } catch { throw invalid(); }
  if (!object(data) || data.schemaVersion !== schemaVersion || data.contentVersion !== contentVersion || data.missionId !== lessonId) throw invalid();
  const s = data.state;
  if (!object(s) || !Number.isInteger(s.step) || typeof s.step !== 'number' || s.step < 0 || s.step > finalStep
    || typeof s.completedOnce !== 'boolean' || !Array.isArray(s.answers) || !Array.isArray(s.checked)
    || s.answers.length !== questions.length || s.checked.length !== questions.length
    || !s.answers.every((v, i) => v === null || (Number.isInteger(v) && v >= 0 && v < questions[i]!.options.length))
    || !s.checked.every((v, i) => typeof v === 'boolean' && (!v || (s.answers as unknown[])[i] !== null))) throw invalid();
  const p = s.practice;
  if (!object(p) || typeof p.trim !== 'boolean' || typeof p.blockEmpty !== 'boolean'
    || !(p.results === null || Array.isArray(p.results))) throw invalid();
  const state: LearningState = { step: s.step, answers: s.answers, checked: s.checked, completedOnce: s.completedOnce,
    practice: { trim: p.trim, blockEmpty: p.blockEmpty, results: null } };
  if (!questions.slice(0, state.step - 1).every((_, i) => isPassed(state, i)) && state.step > 1) throw invalid();
  if (state.step === finalStep && !state.completedOnce) throw invalid();
  if (p.results !== null) {
    const expected = runCases(state.practice);
    if (p.results.length !== expected.length || !p.results.every((r, i) => {
      const e = expected[i]!;
      return object(r) && r.id === e.id && r.passed === e.passed && r.message === e.message
        && Array.isArray(r.items) && r.items.length === e.items.length && r.items.every((item, j) => item === e.items[j]);
    }) || !state.completedOnce) throw invalid();
    state.practice.results = expected;
  }
  return state;
}
