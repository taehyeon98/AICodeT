export type CodeChoices = { trim: boolean; blockEmpty: boolean };
export type CaseResult = { id: string; items: string[]; message: string; passed: boolean };
export const initialItems = ['기획 정리하기'];
export const cases = [
  { id: 'empty', label: '빈 입력', input: '', expected: '목록 유지 + 안내 표시' },
  { id: 'spaces', label: '공백만 입력', input: '   ', expected: '목록 유지 + 안내 표시' },
  { id: 'normal', label: '정상 입력', input: '공부하기', expected: '기존 항목 유지 + 공부하기 1개 추가' },
] as const;

const transforms = {
  raw: { code: 'const text = input;', apply: (input: string) => input },
  trimmed: { code: 'const text = input.trim();', apply: (input: string) => input.trim() },
};
const emptyMessage = '할 일을 입력해주세요.';

// Display and execution choose the same reviewed operations; no text is evaluated.
export function solutionCode(choices: CodeChoices): string {
  return [
    'function addTodo(input, items) {',
    `  ${transforms[choices.trim ? 'trimmed' : 'raw'].code}`,
    ...(choices.blockEmpty ? ['  if (text === "") {', `    return { items, message: "${emptyMessage}" };`, '  }'] : []),
    '  return { items: [...items, text], message: "" };',
    '}',
  ].join('\n');
}
export function addTodo(choices: CodeChoices, input: string, items: string[]) {
  const text = transforms[choices.trim ? 'trimmed' : 'raw'].apply(input);
  if (choices.blockEmpty && text === '') return { items: [...items], message: emptyMessage };
  return { items: [...items, text], message: '' };
}
export function runCases(choices: CodeChoices): CaseResult[] {
  return cases.map(test => {
    const actual = addTodo(choices, test.input, [...initialItems]);
    const expectedItems = test.id === 'normal' ? [...initialItems, test.input] : initialItems;
    const passed = actual.items.length === expectedItems.length
      && actual.items.every((item, i) => item === expectedItems[i])
      && (test.id === 'normal' ? actual.message === '' : actual.message === emptyMessage);
    return { id: test.id, ...actual, passed };
  });
}
