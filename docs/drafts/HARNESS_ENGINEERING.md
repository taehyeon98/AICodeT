# 하네스 엔지니어링

영문: Harness Engineering

상태: 모바일 설명 페이지용 검토 원고 · 마지막 출처 확인 2026-11-09 (한국시간)

## 개념 — 자료를 종합한 해설

하네스 엔지니어링은 AI 에이전트가 작업할 환경과 도구, 실행·기록·검증·피드백 구조를 설계하는 접근으로 설명할 수 있습니다. 이 문장은 아래 공식 사례를 종합한 교육용 요약이며, 표준 기관이 정한 정의를 인용한 것은 아닙니다. [OpenAI, 2026-02-11](https://openai.com/index/harness-engineering/), [Anthropic, 2025-11-26](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents)

## 공식 자료에서는 어떻게 설명하나요?

**OpenAI의 사례:** 코딩 에이전트가 일할 환경을 만들고, 의도를 명확히 하며, 결과를 확인하는 피드백 구조를 설계한 경험을 소개합니다. 저장소 문서와 개발 도구도 에이전트가 활용할 수 있도록 구성했습니다. [원문: Redefining the role of the engineer / Increasing application legibility / We made repository knowledge the system of record](https://openai.com/index/harness-engineering/)

**Anthropic의 사례:** 긴 개발 작업을 여러 세션에 걸쳐 이어가기 위해 초기 환경 설정과 이후 구현을 나눴습니다. 기능 목록, 진행 기록, Git 이력과 테스트를 활용하고, 한 번에 한 기능씩 진행하는 방식을 소개합니다. [원문: Environment management / Feature list / Incremental progress / Testing](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents)

## 우리 앱에 적용해본다면 — 교육용 예시

아래는 AICodeT에서 만든 가상 예시이며 위 회사들의 실제 사례가 아닙니다.

‘빈 할 일이 추가되는 문제’를 AI에게 맡긴다고 가정해봅시다.

1. 고칠 문제와 완료 조건을 전달합니다.
2. 변경할 코드와 실행·검사 도구를 사용할 수 있게 준비합니다.
3. 빈 입력·공백 입력·정상 입력의 결과를 확인합니다.
4. 실패한 결과를 다음 수정에 반영합니다.
5. 변경 내용과 남은 작업을 기록합니다.

이 순서는 이해를 돕기 위한 예시입니다. ‘하네스의 공식 5단계’라는 명칭을 붙이지 않습니다. 이 예시를 문서에 적는 것만으로 실행·검증 구조가 구현되는 것은 아닙니다.

## 적용할 때 알아둘 점

- 여기서 소개한 두 글은 특정 팀과 환경의 경험 보고입니다. 모든 모델·도구·프로젝트에서 같은 결과를 보장하지 않습니다.
- 작업의 성격에 따라 필요한 도구, 기록과 검증 방식이 달라집니다. 여러 에이전트 사용을 필수 조건으로 설명하지 않습니다.
- 자동 검사는 정해진 조건을 확인합니다. 제품의 모든 문제나 사용자의 모든 요구를 검증했다고 간주하지 않습니다.

## 출처와 문장 대응

| 구분 | 자료 | 발행일 | 뒷받침하는 내용 |
| --- | --- | --- | --- |
| 공식 기술 경험 보고 | [Harness engineering: leveraging Codex in an agent-first world — OpenAI](https://openai.com/index/harness-engineering/) | 2026-02-11 | 환경 설계, 의도 전달, 피드백 구조, 저장소 지식·도구 활용 |
| 공식 기술 경험 보고 | [Effective harnesses for long-running agents — Anthropic](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | 2025-11-26 | 초기 환경, 기능 목록, 점진적 구현, 진행 기록·Git·테스트 |

교육용 예시는 AICodeT 작성 내용으로 구분합니다. 외부 성능 수치는 사용하지 않았습니다. 출처가 확인된 범위를 넘어 단일 표준 절차나 효과가 입증되었다고 주장하지 않습니다.
