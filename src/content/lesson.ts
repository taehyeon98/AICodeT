export const lessonId = 'empty-todo';
export const lessonTitle = '빈 할 일이 추가되는 이유';
export const trimSource = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim';

export type Question = {
  id: string; category: string; title: string; description: string; options: string[];
  correctIndex: number; correct: string; retry: string; example?: string; source?: string;
};

export const questions: Question[] = [
  { id: 'observe', category: '문제 관찰', title: '무엇이 잘못됐나요?', description: '아무것도 입력하지 않고 추가를 누른 상황이에요.',
    example: '예제 앱 · 추가 후 화면\n\n기획 정리하기\n[새로 생긴 빈 항목]',
    options: ['기존 항목이 모두 사라졌어요.', '입력하지 않았는데 빈 항목이 추가됐어요.', '추가 버튼이 아예 작동하지 않아요.'], correctIndex: 1,
    correct: '내용 없는 항목이 추가된 것이 문제예요. 이 동작을 구체적으로 설명할 수 있어요.', retry: '기존 항목은 남아 있어요. 새로 생긴 빈 줄에 주목해보세요.' },
  { id: 'request', category: 'AI에게 요청하기', title: '어떤 요청이 더 구체적인가요?', description: '원하는 결과와 유지할 동작을 함께 골라보세요. 아래는 교육용 요청문 예시예요.',
    options: ['빈 내용이나 공백만 넣으면 추가하지 말고 안내해줘. 정상 입력과 기존 목록은 유지해줘.', '이상하니까 알아서 고쳐줘.', '빈 항목이 안 생기도록 추가 버튼을 없애줘.'], correctIndex: 0,
    correct: '빈 입력의 처리와 정상 동작 유지를 함께 전달했어요.', retry: '무엇을 바꿀지와 무엇을 유지할지가 함께 드러나는 요청을 골라보세요.' },
  { id: 'trim', category: '코딩 기초 · 문자열', title: '앞뒤 공백을 제거하려면?', description: '공백을 제거한 새 문자열을 만든 뒤 내용이 비었는지 확인하려고 해요.',
    options: ['toUpperCase', 'repeat', 'trim'], correctIndex: 2, source: trimSource,
    correct: 'trim()은 앞뒤 공백을 제거한 새 문자열을 반환해요. 원래 문자열 자체를 바꾸지는 않아요.', retry: '이 문맥에서 선택한 메서드는 원하는 앞뒤 공백 제거 동작을 하지 않아요.' },
  { id: 'verify', category: '결과 검증', title: '수정한 뒤 무엇을 확인할까요?', description: '문제를 해결하면서 잘 되던 동작도 유지됐는지 확인해요.',
    options: ['코드가 짧아졌는지만 확인해요.', '빈 입력·공백 입력·정상 입력을 모두 확인해요.', '정상 입력이 추가되는지만 확인해요.'], correctIndex: 1,
    correct: '예외 입력이 막히는지와 정상적인 추가가 유지되는지 함께 확인해요. 여기서는 계획을 고른 것이며 실제 코드를 검사한 것은 아니에요.', retry: '문제가 생겼던 빈 입력과 공백 입력도 확인 대상에 포함해보세요.' },
];
