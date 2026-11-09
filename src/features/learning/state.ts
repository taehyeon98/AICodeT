import { questions } from '../../content/lesson';
import { CaseResult, CodeChoices, runCases } from '../playground/runner';

export type LearningState = {
  step: number; answers: (number | null)[]; checked: boolean[]; completedOnce: boolean;
  practice: CodeChoices & { results: CaseResult[] | null };
};
export type LearningAction = { type: 'select'; value: number }
  | { type: 'check' | 'next' | 'back' | 'restart' | 'run' }
  | { type: 'code'; field: keyof CodeChoices; value: boolean };
export const finalStep = questions.length + 1;
export function initialLearningState(): LearningState {
  return { step: 0, answers: questions.map(() => null), checked: questions.map(() => false), completedOnce: false,
    practice: { trim: false, blockEmpty: false, results: null } };
}
export function isPassed(state: LearningState, index: number): boolean {
  return !!state.checked[index] && state.answers[index] === questions[index]?.correctIndex;
}
export function understandingPassed(state: LearningState): boolean {
  return state.completedOnce && questions.every((_, i) => isPassed(state, i));
}
export function missionPassed(state: LearningState): boolean {
  return understandingPassed(state) && state.practice.results?.length === 3 && state.practice.results.every(result => result.passed);
}
export function learningReducer(state: LearningState, action: LearningAction): LearningState {
  const index = state.step - 1;
  const question = questions[index];
  switch (action.type) {
    case 'code':
      if (!understandingPassed(state) || state.practice[action.field] === action.value) return state;
      return { ...state, practice: { ...state.practice, [action.field]: action.value, results: null } };
    case 'run':
      if (!understandingPassed(state)) return state;
      return { ...state, practice: { ...state.practice, results: runCases(state.practice) } };
    case 'select':
      if (!question || !Number.isInteger(action.value) || !question.options[action.value]) return state;
      return { ...state, answers: state.answers.map((v, i) => i === index ? action.value : v),
        checked: state.checked.map((v, i) => i === index ? false : v) };
    case 'check':
      if (!question || state.answers[index] == null) return state;
      return { ...state, checked: state.checked.map((v, i) => i === index ? true : v) };
    case 'next': {
      if (state.step === 0) return { ...state, step: 1 };
      if (!question || !isPassed(state, index)) return state;
      const nextStep = state.step + 1;
      if (!questions.slice(0, nextStep - 1).every((_, i) => isPassed(state, i))) return state;
      return { ...state, step: nextStep, completedOnce: state.completedOnce || nextStep === finalStep };
    }
    case 'back': return { ...state, step: Math.max(0, state.step - 1) };
    case 'restart': return { ...initialLearningState(), completedOnce: state.completedOnce };
  }
}
