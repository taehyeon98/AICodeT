# 도구와 버전

확인일: **2026-11-08 (한국시간)**

이 문서는 현재 환경과 첫 구현용 기술 제안을 구분합니다. **앱 의존성은 아직 설치하지 않았으며, `package.json`과 `package-lock.json`도 없습니다.** 버전의 배포 여부와 주요 호환 조건을 확인했지만 실제 설치·빌드 검증은 앱 초기화 단계에서 수행해야 합니다.

## 현재 확인한 환경

| 도구 | 실제 확인 버전 | 확인 방법 |
| --- | --- | --- |
| Node.js | `24.19.0` | `node --version` |
| npm | `11.17.0` | `npm --version` |
| Git for Windows | `2.54.0.windows.1` | `git --version` |
| GitHub | 클라우드 서비스, 프로젝트 고정 버전 없음 | 저장소 연결 완료 |

현재 셸은 PowerShell입니다. 셸·편집기·AI 코딩 도구의 특정 버전을 앱 실행 조건으로 강제하지 않습니다.

## 첫 구현용 버전 제안

### 앱과 개발 환경

| 도구·패키지 | 제안 버전 | 역할·선정 이유 |
| --- | --- | --- |
| Node.js | `24.22.2` LTS | 현재 환경과 같은 24 계열의 패치 기준. 아직 업그레이드하지 않음 |
| npm | `11.17.0` | 현재 설치 버전 유지, 패키지 관리 도구를 하나로 통일 |
| `react` | `19.3.1` | 학습 화면과 상호작용 |
| `react-dom` | `19.3.1` | React 웹 렌더링. React와 같은 버전 사용 |
| `typescript` | `6.0.3` | 앱 코드 타입 검사. 린트 도구 지원 범위에 맞춰 선택 |
| `vite` | `8.3.6` | 개발 서버·정적 배포용 빌드 |
| `@vitejs/plugin-react` | `6.2.1` | Vite의 React 개발 지원 |
| `@types/react` | `19.3.0` | React 타입 정의 |
| `@types/react-dom` | `19.3.0` | React DOM 타입 정의 |
| `@types/node` | `24.19.2` | Node 24 계열 개발 설정의 타입 정의 |

Node 기준의 근거: [Node.js 24.22.2 LTS 릴리스](https://nodejs.org/en/blog/release/v24.22.2). 현재 환경을 자동 변경한 것은 아닙니다.

### 검사 도구

| 도구·패키지 | 제안 버전 | 역할 |
| --- | --- | --- |
| `eslint` | `10.14.0` | 코드 정적 검사 |
| `@eslint/js` | `10.0.1` | 기본 JavaScript 검사 규칙 |
| `typescript-eslint` | `8.72.1` | TypeScript 검사 규칙 |
| `eslint-plugin-react-hooks` | `7.1.1` | React Hooks 사용 규칙 |
| `globals` | `17.14.0` | 브라우저·Node 전역 식별자 정의 |
| `vitest` | `5.1.0` | 저장·검증·완료 판정 등 핵심 로직 테스트 |
| `@playwright/test` | `1.65.0` | 실제 브라우저의 사용자 흐름 테스트 |

검사 도구는 사용할 코드와 테스트가 생길 때 구성합니다. Playwright 브라우저는 해당 패키지에 맞는 바이너리를 사용하고 설치 시점의 실제 브라우저 버전을 테스트 기록에 남깁니다.

## 확인한 호환 조건

- Vite `8.3.6`와 React 플러그인 `6.2.1`은 Node `^20.19.0 || >=22.12.0`을 선언합니다. 제안 Node `24.22.2`는 이 범위에 들어갑니다.
- React 플러그인 `6.2.1`의 Vite 조건은 `^8.0.0`이며, React DOM `19.3.1`은 React `^19.3.1`을 요구합니다.
- Vitest `5.1.0`은 Node 24 계열과 Vite 8 계열을 허용합니다. Playwright `1.65.0`의 Node 조건은 `>=20`입니다.
- **TypeScript의 확인 당시 최신 버전은 `7.0.2`지만 사용 제안은 `6.0.3`입니다.** `typescript-eslint 8.72.1`의 TypeScript 지원 범위가 `>=4.8.4 <6.1.0`이기 때문입니다. [공식 지원 범위](https://typescript-eslint.io/users/dependency-versions/)
- npm의 확인 당시 최신 버전은 `12.2.2`입니다. 초기 구성에는 현재 설치된 `11.17.0`을 유지하는 안으로 기록합니다. 최신 버전이라는 이유만으로 변경하지 않습니다.
- 위 내용은 배포 메타데이터상의 호환 확인입니다. 전체 의존성 설치, 타입 검사, 빌드 성공을 보장하는 검증은 아직 하지 않았습니다.

## 별도 패키지 없이 시작할 부분

| 기능 | 첫 구현 제안 | 버전 관리 |
| --- | --- | --- |
| 스타일 | CSS Modules·CSS 변수 | Vite와 브라우저 지원 범위에 따름 |
| 화면 이동 | 브라우저 해시 주소·React 상태 | 별도 라우터 패키지 없음 |
| 학습 기록 | `localStorage`·앱 전용 저장 어댑터 | 저장 형식 `schemaVersion: 1` 제안 |
| 학습 콘텐츠 | 타입이 지정된 정적 데이터 | 콘텐츠별 `contentVersion: 1`부터 시작 제안 |
| 코드 입력 | 기본 편집 영역 | 고급 편집기 패키지는 후속 검토 |
| 코드 결과 표시 | 제한된 iframe 실행 환경 | 브라우저 API, 별도 실행 규칙 적용 |
| AI 설명·응답 | 검토된 고정 콘텐츠·예시 | 실시간 AI API·모델 버전 미정 |

브라우저 저장·실행은 [개발 규칙](DEVELOPMENT_RULES.md)을 따릅니다. Chrome·Edge의 검증 시점 안정 버전을 우선 확인하고, 모바일 화면과 필요한 Safari 동작을 추가 확인합니다. 실제 확인하지 않은 브라우저를 지원 검증 완료로 표시하지 않습니다.

## 설치와 버전 고정 정책

1. 앱 초기화 전에 이 문서의 버전과 호환 조건을 다시 확인합니다. 변경되었다고 자동으로 최신 버전을 채택하지 않습니다.
2. 직접 의존성은 정확한 버전으로 `package.json`에 적고 `package-lock.json`을 생성·커밋합니다.
3. Node 기준은 `.node-version` 등 저장소 파일, npm 기준은 `packageManager`에 기록할 예정입니다. 이 파일·설정은 아직 만들지 않았습니다.
4. 잠금 파일 생성 후 동일 환경 재설치는 `npm ci`를 사용합니다. 앱 초기화 전에는 실행할 수 없습니다.
5. `typecheck`, `lint`, 관련 테스트와 `build`를 확인한 뒤 이 표의 상태를 실제 사용 버전으로 갱신합니다.
6. 첫 시연 가능한 앱의 버전은 `0.1.0`을 제안합니다. 현재 앱 릴리스나 배포는 없습니다.

## 아직 도입하지 않은 도구

서버 프레임워크, DB, 로그인, 상태 관리 라이브러리, 고급 코드 편집기, 실시간 AI SDK와 배포 서비스는 미정입니다. GitHub Actions 자동 검사도 아직 없으며 앱 검사 명령을 만든 뒤 구성합니다. 해당 도구가 필요해지면 용도·정확한 버전·설정과 검증 결과를 이 문서에 추가합니다.

## 버전 확인 출처

패키지 버전과 `engines`, `peerDependencies`는 확인일에 npm 공식 레지스트리에서 읽었습니다. 아래 링크는 조회한 버전의 메타데이터입니다.

- 앱: [React](https://registry.npmjs.org/react/19.3.1), [React DOM](https://registry.npmjs.org/react-dom/19.3.1), [TypeScript](https://registry.npmjs.org/typescript/6.0.3), [Vite](https://registry.npmjs.org/vite/8.3.6), [React 플러그인](https://registry.npmjs.org/@vitejs%2Fplugin-react/6.2.1)
- 타입: [React 타입](https://registry.npmjs.org/@types%2Freact/19.3.0), [React DOM 타입](https://registry.npmjs.org/@types%2Freact-dom/19.3.0), [Node 타입](https://registry.npmjs.org/@types%2Fnode/24.19.2)
- 검사: [ESLint](https://registry.npmjs.org/eslint/10.14.0), [기본 규칙](https://registry.npmjs.org/@eslint%2Fjs/10.0.1), [TypeScript ESLint](https://registry.npmjs.org/typescript-eslint/8.72.1), [React Hooks](https://registry.npmjs.org/eslint-plugin-react-hooks/7.1.1), [Globals](https://registry.npmjs.org/globals/17.14.0), [Vitest](https://registry.npmjs.org/vitest/5.1.0), [Playwright](https://registry.npmjs.org/@playwright%2Ftest/1.65.0)
- 사용 안내: [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), [Playwright](https://playwright.dev/docs/intro)
