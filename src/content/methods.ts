export type Source = { title: string; url: string; publishedAt: string };
export type Method = {
  id: string; title: string; english: string; summary: string; checkedAt: string;
  sections: { title: string; body: string; sourceIndexes?: number[] }[]; sources: Source[];
};

const contextSource: Source = {
  title: 'Anthropic · Effective context engineering for AI agents',
  url: 'https://www.anthropic.com/research/effective-context-engineering-for-ai-agents',
  publishedAt: '2025-09-29',
};

export const methods: Method[] = [
  {
    id: 'harness', title: '하네스 엔지니어링', english: 'Harness engineering', checkedAt: '2026-11-09',
    summary: 'AI가 작업하고 확인할 수 있도록 환경·도구·기록을 설계해요.',
    sections: [
      { title: '자료를 종합한 해설', body: 'AI 에이전트가 일할 환경과 도구, 실행·기록·검증·피드백 구조를 설계하는 접근으로 설명할 수 있어요. 아래 사례를 종합한 설명이며, 표준 기관의 정의를 인용한 것은 아니에요.', sourceIndexes: [0, 1] },
      { title: '공식 사례 · OpenAI', body: '에이전트가 일할 환경을 만들고, 의도를 명확히 전달하며, 결과를 확인하는 피드백 구조를 설계한 경험을 소개해요. 저장소 문서와 도구도 에이전트가 활용하도록 구성했어요.', sourceIndexes: [0] },
      { title: '공식 사례 · Anthropic', body: '긴 작업을 이어가기 위해 처음 환경을 준비하는 역할과 이후 기능을 구현하는 역할을 나눴어요. 기능 목록, 진행 기록, Git 이력과 테스트를 사용하고 한 번에 한 기능씩 진행한 사례예요.', sourceIndexes: [1] },
      { title: '교육용 예시 · AICodeT 작성', body: '빈 할 일 오류를 고친다고 가정해볼게요. 기대 결과를 적고, 코드와 검사 도구를 준비해요. 빈 입력·공백·정상 입력을 확인하고, 실패 결과를 다음 수정에 반영해요. 변경 내용과 남은 작업도 기록해요.\n\n이것은 가상 적용 예시이며 하네스의 공식 단계나 위 회사의 실제 사례가 아니에요.' },
      { title: '적용할 때 알아둘 점', body: '소개한 글은 특정 팀과 환경의 경험 보고예요. 같은 효과를 보장하지 않으며, 여러 에이전트가 필수인 것도 아니에요. 자동 검사는 정한 조건을 확인할 뿐 모든 요구를 검증하지는 못해요.' },
    ],
    sources: [
      { title: 'OpenAI · Harness engineering', url: 'https://openai.com/index/harness-engineering/', publishedAt: '2026-02-11' },
      { title: 'Anthropic · Effective harnesses for long-running agents', url: 'https://www.anthropic.com/research/effective-harnesses-for-long-running-agents', publishedAt: '2025-11-26' },
    ],
  },
  {
    id: 'context', title: '컨텍스트 엔지니어링', english: 'Context engineering', checkedAt: '2026-11-09',
    summary: '지시와 자료, 도구 정보, 대화 이력 등 AI에게 줄 맥락을 관리해요.',
    sections: [
      { title: '공식 자료 요약', body: 'Anthropic은 모델이 응답할 때 사용할 정보를 선별하고 유지하는 전략으로 설명해요. 지시문 외에도 도구, 외부 자료, 대화 이력 등을 함께 고려해요.', sourceIndexes: [0] },
      { title: '교육용 예시 · AICodeT 작성', body: '수정을 부탁할 때 현재 코드, 재현 순서, 기대 결과와 지켜야 할 조건을 함께 준비해보세요. 이 목록은 이해를 돕는 예시이며 공식 필수 항목은 아니에요.' },
      { title: '알아둘 점', body: '자료를 많이 넣기만 하면 좋은 결과가 보장되는 것은 아니에요. 작업과 관련 있는 정보를 고르고 결과를 확인해야 해요.' },
    ], sources: [contextSource],
  },
  {
    id: 'prompt', title: '프롬프트 엔지니어링', english: 'Prompt engineering', checkedAt: '2026-11-09',
    summary: 'AI에게 전달하는 지시를 작성하고 구성하는 방법이에요.',
    sections: [
      { title: '공식 자료 요약', body: 'Anthropic은 모델에 전달할 지시를 작성하고 구성하는 방법으로 설명해요. 컨텍스트 엔지니어링은 이 지시와 함께 모델이 받는 다른 정보까지 다뤄요.', sourceIndexes: [0] },
      { title: '교육용 요청 예시 · AICodeT 작성', body: '“빈 내용이나 공백만 입력하면 추가하지 말고 안내해줘. 정상 입력은 추가되고 기존 목록은 유지되게 해줘.”\n\n바꿀 동작과 유지할 동작을 구체화한 예시예요. 실제 AI 응답이나 정답을 보장하는 문구는 아니에요.' },
    ], sources: [contextSource],
  },
];
