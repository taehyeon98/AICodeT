# Android 앱 설치·초기화 계획

작성일: 2026-11-09 (한국시간)

상태: 2026-11-09 사용자 승인 완료. 문서의 GitHub 반영·PR #5 병합, 새 작업 브랜치의 설치·기본 앱 구현을 진행합니다. 아래 계획과 사전 검사는 적용 전 기록이며, 실제 설치·검증 결과는 루트 README와 TOOLCHAIN에 별도로 기록합니다.

## 이번에 적용할 범위

현재 저장소에 Expo SDK 57 기반 앱을 구성합니다. Node `24.19.0`과 npm `11.17.0`은 유지합니다. 초기 버전 표시는 `0.1.0`이며 출시 완료를 의미하지 않습니다.

첫 구현 묶음은 **앱 실행 → 학습·방법론·내 기록 세 메뉴 → 홈에서 방법론 열기 → 출처 있는 하네스 설명 → 첫 선택형 학습과 이해 확인 완료**까지입니다. 제한된 코드 실습과 실제 진도 저장은 이어지는 구현 묶음에서 연결합니다. 첫 버전 전체 범위에서 제외하는 것은 아닙니다. 저장 기능 연결 전에는 ‘진도 저장 준비 중’으로 표시합니다.

프로젝트 로컬 의존성만 설치합니다. Android Studio·JDK·에뮬레이터·전역 CLI·Node 업그레이드는 이번 범위에 포함하지 않습니다. 사용자의 Android에서는 Expo Go로 첫 화면을 확인할 계획입니다. 사용자 휴대전화에 앱을 설치하거나 설정을 바꿨다고 주장하지 않습니다. 원격 빌드·외부 서비스 계정 연결·앱스토어 제출은 별도 결정 사항입니다.

## 정확한 설치 목록

실제 적용할 `package.json` 후보는 [android-package.proposed.json](android-package.proposed.json)입니다. 지금은 이름이 다른 검토 자료이므로 루트 앱 설정으로 동작하지 않습니다. 모든 직접 의존성을 정확한 버전으로 기재했습니다. 설치 후 생기는 간접 의존성까지 포함한 전체 해석 결과는 `package-lock.json`으로 고정합니다.

| 역할 | 패키지 | 버전 |
| --- | --- | --- |
| 앱 기반 | expo | 57.0.32 |
| UI | react / react-native | 19.2.3 / 0.86.3 |
| 화면 이동 | expo-router | 57.0.30 |
| 앱 설정·링크 | expo-constants / expo-linking | 57.0.23 / 57.0.13 |
| 상태 표시줄 | expo-status-bar | 57.0.1 |
| 화면 안전 영역·이동 | react-native-safe-area-context / react-native-screens | 5.7.0 / 4.26.0 |
| 기기 내 저장 | @react-native-async-storage/async-storage | 2.2.0 |
| Router 필수 보조 | @expo/metro-runtime / @expo/log-box / @expo/dom-webview | 57.0.18 / 57.0.5 / 57.0.1 |
| 타입 검사 | typescript / @types/react | 6.0.3 / 19.2.2 |
| 정적 검사 | eslint / eslint-config-expo | 9.39.1 / 57.0.2 |
| 테스트 | jest / jest-expo / @types/jest | 29.7.0 / 57.0.6 / 29.5.14 |
| React Native 테스트 설정 | @react-native/jest-preset | 0.86.3 |
| 환경 진단 | expo-doctor | 1.21.6 |

선정 근거:

- Expo 57.0.32가 배포한 [bundledNativeModules.json](https://unpkg.com/expo@57.0.32/bundledNativeModules.json)의 호환 범위를 기준으로 선택했습니다. AsyncStorage 2.2.0도 해당 목록에 포함됩니다.
- [Expo Router 설치 안내](https://docs.expo.dev/router/installation/)에 따른 필수 패키지에, npm의 필수 peer dependency인 Metro runtime·LogBox·DOM WebView 보조 모듈을 추가했습니다. 이 보조 모듈을 학습자 임의 코드 실행기로 사용하는 것은 아닙니다.
- [jest-expo 57.0.6 메타데이터](https://registry.npmjs.org/jest-expo/57.0.6)는 Jest 관련 내부 패키지에 29 계열 범위를 사용합니다. Jest 29.7.0과 타입 29.5.14를 후보로 맞췄으며, 최신 Jest 30을 자동 채택하지 않았습니다. 전체 조합의 실제 실행 검증은 설치 후 필요합니다.
- eslint-config-expo의 `sdk-57` 태그 조회는 존재하지 않아 실패했습니다. 전체 배포 목록에서 57 계열 정식 버전 `57.0.2`를 확인했습니다. 최신 58 계열 설정을 섞지 않습니다.
- 현재 Node 버전은 확인한 React Native·ESLint·expo-doctor의 Node 조건에 포함됩니다. 실제 설치·번들 생성 성공은 아직 확인하지 않았습니다.

공개 npm 메타데이터는 [조회 근거](android-package-metadata.json)에 기록합니다. 버전 존재와 요구 조건 확인은 전체 의존성 해석·빌드 성공 검증을 대체하지 않습니다. 선택하지 않은 선택적 peer는 자동으로 추가했다고 가정하지 않습니다. 실제 설치에서 누락·충돌이 나오면 원인을 검토하고 변경 목록을 설명합니다. `--force`나 `--legacy-peer-deps`로 덮지 않습니다.

## 생성·수정할 파일

기존 Git 저장소를 재생성하지 않습니다. 일반 템플릿 생성기로 문서가 있는 루트를 덮어쓰는 대신, 검토한 설정과 필요한 앱 파일만 추가합니다.

| 파일·영역 | 적용 내용 |
| --- | --- |
| package.json | 검토용 JSON의 정확한 버전·스크립트 적용 |
| package-lock.json | 실제 설치로 생성. 실행하지 않은 지금 미리 작성하지 않음 |
| .node-version / .npmrc | Node 24.19.0 기록 / save-exact=true |
| app.json | 이름 AICodeT, slug aicodet, version 0.1.0, scheme aicodet, Android 우선, expo-router 플러그인 |
| tsconfig.json | expo/tsconfig.base 확장, strict=true, 앱 소스·Expo 타입 포함 |
| eslint.config.js | eslint-config-expo/flat 기반. 생성물·기존 HTML 미리보기 제외 |
| src/app/_layout.tsx | 최상위 화면 이동, 학습 상세 스택 |
| src/app/(tabs)/ | 학습 홈·방법론 목록·내 기록의 세 메뉴 |
| src/app/methods/[id].tsx | 출처와 확인일이 있는 방법론 설명 |
| src/app/lessons/[id].tsx | 선택·확인·피드백·완료 흐름 |
| src/components / src/styles | 버튼·카드·색상·간격 등 공통 구성 |
| src/content | 가이드·문항 데이터. 사실 요약·해설·교육용 예시 구분 |
| src/features/learning | 진행 상태와 이해 확인 로직, 관련 단위 테스트 |
| .gitignore | node_modules, .expo, dist, 로컬 환경값·서명 파일 제외 |
| README와 기준 문서 3개 | 아래 모바일 변경안 반영. 실제 검증 결과만 추가 |

네이티브 Android 프로젝트 폴더 생성, 앱 서명과 배포용 패키지 이름 확정은 초기 Expo Go 확인에 필요하지 않으므로 이번 작업에서 하지 않습니다. 첫 화면은 준비된 한국어 콘텐츠로 구성하며 실제 AI 호출은 없습니다.

## 기존 문서 변경안

### README

제품 소개를 ‘AI와 함께 소프트웨어를 만드는 방법과 코딩 기초를 배우는 모바일 학습 앱’으로 바꿉니다. Android 우선 검증임을 명시하고, 실제 구현된 기능·구현 예정·기기 검증 결과를 구분합니다. 웹 미리보기는 디자인 참고 자료로 연결합니다.

### PRODUCT_PLAN

첫 구현 범위를 ‘로그인 없는 Android 우선 모바일 앱, 준비된 설명과 문항, 코드 조각 선택 실습, 기기 내 학습 기록’으로 바꿉니다. 하단 세 메뉴, 홈의 방법론 버튼, 하네스 상세 설명을 명시합니다. 여섯 미션 전체는 확장 계획으로 유지하고 첫 버전은 빈 할 일 오류 미션에 집중합니다. 선택형 이해 확인과 실행 결과 검증은 별도 상태로 기록합니다.

### DEVELOPMENT_RULES

React Native·Expo·TypeScript strict, Expo Router, StyleSheet를 기준으로 바꿉니다. src/app에는 화면 이동 파일을 두고 콘텐츠·학습 로직·저장 어댑터를 분리합니다. 학습 예제 언어는 JavaScript로 유지합니다.

localStorage 규칙을 AsyncStorage 어댑터로 전환합니다. 앱 전용 키, schemaVersion과 콘텐츠 버전, 데이터 검증, 저장 실패 안내, 초기화 확인 원칙은 유지합니다. 저장 순서가 뒤집혀 이전 진도가 최신 진도를 덮지 않도록 처리합니다.

iframe 실행 계획은 첫 버전의 준비된 함수 조합 실행으로 바꿉니다. `eval`·`new Function` 없이 실제 입력별 결과를 계산합니다. 자유 코드 실행 환경은 후속 범위로 남깁니다. 코드 조합 변경 시 이전 실습 결과를 무효화하고, 전체 미션 완료는 이해 확인과 실습 검증을 모두 요구합니다.

Android 뒤로 가기, 화면 안전 영역, 글자 크기 확대, 터치 영역과 접근성 이름을 확인합니다. 초기화는 명시적인 사용자 확인을 거치며, 단순히 뒤로 가거나 앱을 다시 열었다고 기록을 지우지 않습니다.

### TOOLCHAIN

웹 전용 Vite·React DOM·Vitest 제안을 Android 설치 목록으로 교체합니다. Node·npm 유지, React 19.2.3의 Expo 대응 관계, 각 직접 패키지의 정확한 버전, 잠금 파일, 실제 확인 명령·결과를 기록합니다. 이번 후보 목록과 설치 완료 상태를 혼동하지 않습니다. 기존 웹 계획은 Git 이력으로 추적할 수 있습니다.

## 설치와 확인 순서

다음은 승인 후 실행할 순서이며 아직 실행하지 않았습니다.

1. Git 상태와 원격 main을 확인합니다. 승인된 문서 작업을 PR로 정리하고, 최신 main에서 `codex/android-app-foundation` 작업 브랜치를 만듭니다. 사용자 미커밋 파일을 보존합니다.
2. 위 설정과 기본 화면·학습 로직을 작성합니다. npm은 프로젝트 로컬에 설치하며 설치 과정에서 npm 캐시와 의존 패키지 설치 스크립트가 사용될 수 있습니다.
3. `npm install`로 설치·잠금 파일을 생성합니다. 전체 의존성 해석과 실제 버전을 확인합니다.
4. `npm run check:dependencies`, `npm run doctor`로 SDK 호환과 프로젝트 구성을 확인합니다. SDK를 자동 업그레이드하지 않습니다.
5. `npm run typecheck`, `npm run lint`, `npm test`를 실행합니다. 문항 미선택·오답·답 변경·완료 판정 같은 핵심 동작을 검사합니다.
6. `npm run export:android`로 Android용 JavaScript·자산 번들을 생성합니다. 이 성공은 APK 제작이나 실제 기기 실행 성공을 뜻하지 않습니다.
7. `npm start`로 개발 서버를 실행하고 Android Expo Go에서 확인할 연결 정보를 제공합니다. 같은 네트워크 연결이 안 될 때 방화벽·네트워크 설정을 임의로 변경하지 않습니다.
8. 실제 휴대전화에서 홈·방법론·학습·완료·뒤로 가기를 확인합니다. 사용자가 확인하거나 도구로 관찰한 내용만 기기 테스트 결과로 기록합니다.

초기화의 완료 기준은 의존성·타입·린트·핵심 로직 검사와 Android 번들 생성입니다. 기기 확인이 아직이면 ‘Android 실기기 미확인’으로 남깁니다. 테스트가 없는 상태를 성공으로 만들기 위해 `--passWithNoTests`를 사용하지 않습니다. 이후 실습·저장 기능을 구현할 때 해당 검사와 재실행 후 복원 검증을 추가합니다.

## 승인된 실행 범위

사용자가 이 설치 목록과 문서 전환안 적용, 기본 앱 초기화를 승인했습니다. 기술 방향과 Android 여부도 확인됐습니다.

GitHub 작업은 기존 PR #5에 새 문서와 학습 초안을 추가해 검토 후 병합하는 범위까지 승인됐습니다. 이를 먼저 완료하고 최신 main에서 앱 구현 브랜치를 만듭니다. 실제 앱 변경을 main에 직접 커밋하거나 푸시하지 않습니다.

## 현재 검증 상태

현재까지 한 일은 공식 문서·패키지 메타데이터 조회, 설치 후보 JSON 작성, 기존 문서 변경안 작성입니다. 루트 package.json·잠금 파일·node_modules·앱 소스는 만들지 않았습니다. 새 설치안의 GitHub 업로드·PR 병합도 하지 않았습니다.

검토 자료의 실제 검사 결과: 설치 후보 JSON과 메타데이터 JSON을 파싱했고, 직접 의존성 22개 모두 정확한 버전이며 요청 버전과 조회 결과가 일치함을 확인했습니다. 설치안 문서의 로컬 링크 대상이 존재합니다. 루트 앱 설정·잠금 파일·의존성 폴더·앱 소스가 아직 없음을 확인했습니다. 이는 문서·설치 후보 검사 결과이며 앱 테스트 통과 결과가 아닙니다.
