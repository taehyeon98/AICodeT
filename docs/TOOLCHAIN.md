# 도구와 버전

실제 설치·검증일: 2026-11-09 (한국시간). 이전 웹 기술 제안에서 승인된 Android 우선 구성으로 전환했습니다. 현재 기준은 루트 package.json과 package-lock.json입니다. 검토 당시 후보는 docs/drafts에 이력으로 보존합니다.

## 실제 환경

- Node.js 24.19.0 / npm 11.17.0 / Git for Windows 2.54.0.windows.1
- Windows PowerShell, React Native + Expo, Android 우선. iOS는 기기 미검증.
- 앱 표시 버전 0.1.0. 출시·스토어 배포 버전으로 발표한 상태가 아닙니다.

## 실제 직접 의존성

| 구분 | 패키지 | 설치 버전 |
| --- | --- | --- |
| 앱 | @expo/dom-webview | 58.0.2 |
| 앱 | @expo/log-box | 58.0.15 |
| 앱 | @expo/metro-runtime | 58.0.17 |
| 앱 | @react-native-async-storage/async-storage | 2.2.0 |
| 앱 | expo | 58.0.23 |
| 앱 | expo-constants | 58.0.15 |
| 앱 | expo-font | 58.0.11 |
| 앱 | expo-linking | 58.0.16 |
| 앱 | expo-router | 58.0.30 |
| 앱 | expo-status-bar | 58.0.4 |
| 앱 | react | 19.3.0 |
| 앱 | react-dom | 19.3.0 |
| 앱 | react-native | 0.88.1 |
| 앱 | react-native-reanimated | 4.7.1 |
| 앱 | react-native-safe-area-context | 5.11.1 |
| 앱 | react-native-screens | 4.30.1 |
| 앱 | react-native-worklets | 0.13.0 |
| 개발·검사 | @react-native/jest-preset | 0.88.1 |
| 개발·검사 | @types/jest | 30.0.0 |
| 개발·검사 | @types/react | 19.3.0 |
| 개발·검사 | eslint | 9.39.1 |
| 개발·검사 | eslint-config-expo | 58.0.4 |
| 개발·검사 | expo-doctor | 1.21.6 |
| 개발·검사 | jest | 30.5.2 |
| 개발·검사 | jest-expo | 58.0.14 |
| 개발·검사 | typescript | 6.0.3 |

직접 의존성 26개를 정확한 버전으로 고정했습니다. 간접 의존성은 잠금 파일로 관리하며 재설치 명령은 npm ci입니다. AsyncStorage 2.2.0으로 영구 진도 저장·복원·초기화를 연결했습니다. 이번 기능 추가에서 패키지·잠금 파일의 버전은 변경하지 않았습니다.

## SDK 58 전환

- 사용자의 승인으로 SDK 57에서 SDK 58로 전환했습니다. 최신 버전이라는 이유가 아니라, 설치된 Expo Go가 SDK 58을 요구해 기존 프로젝트를 열지 못한 문제를 해결하기 위한 변경입니다. 서버 로그에서도 버전 불일치를 확인했습니다.
- Expo 58.0.23의 호환 목록에 맞춰 React 19.3.0, React Native 0.88.1, Router 58.0.30과 보조 패키지를 함께 변경했습니다. Jest와 관련 타입도 30 계열로 맞췄습니다.
- React Native의 새 타입에 맞춰 학습 화면의 스크롤 참조를 ScrollViewInstance로 수정했습니다. TypeScript 엄격 검사는 유지했습니다.
- 직접 의존성 26개의 설정·실제 설치·잠금 파일 버전이 일치하며 npm ls --all에서 의존성 문제는 없습니다. --force와 --legacy-peer-deps를 사용하지 않았습니다. Node·npm 버전은 유지했습니다.
- 이전 SDK 57 설정은 Git에서 제외되는 .expo/sdk57-backup-20261109-174719에 보관했습니다. 백업 manifest 이름은 Jest의 중복 패키지 탐색을 피하도록 package.json.backup입니다.

근거: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), [Expo 58.0.23 호환 목록](https://unpkg.com/expo@58.0.23/bundledNativeModules.json), 설치 후 Expo CLI 호환 검사. [전환안과 수행 기록](drafts/SDK58_UPGRADE.md)을 함께 보존합니다.

## 실제 검사 결과

| 검사 | 결과 |
| --- | --- |
| TypeScript / ESLint | 통과 |
| Jest | 학습·실습·저장 검사 33개 통과 |
| Expo 의존성 검사 | 통과 |
| Expo Doctor | 20/20 통과 |
| Android export | Hermes JavaScript 번들·자산 생성 성공 |
| 개발 서버 | 재시작 후 HTTP 200, Android manifest SDK 58.0.0 확인 |
| Android 실제 기기 | SDK 58 전환 직후 정상 작동 사용자 보고. 11월 10일 버튼·저장 복원·삭제 취소·삭제 후 재실행 정상 사용자 보고. 실습 세부·접근성은 미확인 |
| iOS / 사용자 관찰 | 미수행 |

Jest 검사는 학습 진행·판정·복습, 네 코드 조합의 실제 실행 결과·완료·무효화, 저장 형식 검증, 복원 전 입력 차단, 연속 저장 순서, 읽기·쓰기·삭제 실패, 재시도와 초기화 순서를 확인합니다. 저장 검사는 메모리 어댑터를 사용하며 Android 기기의 실제 저장소 검증을 대신하지 않습니다. UI의 실제 터치·뒤로 가기·큰 글자 표시는 기기에서 별도 확인해야 합니다. [Android 확인 기록](ANDROID_VALIDATION.md)에 확인 범위와 기기 점검 순서를 기록합니다. Android export는 APK/AAB 빌드나 기기 실행 성공을 의미하지 않습니다.

## 자동 검사 구성 — 2026-11-10

작업 브랜치에 GitHub Actions 구성을 작성하고 로컬에서 YAML 해석, 타입·린트·테스트 33개·Expo 호환·Android export를 확인했습니다. 이후 PR #7의 GitHub Ubuntu 환경에서 npm ci부터 전체 검사가 통과했습니다. [최초 실행 결과](https://github.com/taehyeon98/AICodeT/actions/runs/42764777553)에서 확인할 수 있습니다. Node·npm·직접 패키지·잠금 파일 버전은 변경하지 않았습니다.

Ubuntu 24.04, Node 24.19.0, npm 11.17.0을 사용합니다. 공식 actions/checkout v6 참조는 d23441a48e516b6c34aea4fa41551a30e30af803, actions/setup-node v6 참조는 249970729cb0ef3589644e2896645e5dc5ba9c38 커밋으로 고정했습니다. [자동 검사 구성](CI.md)과 워크플로 파일을 함께 관리합니다.

## 남은 의존성 보안 경고

2026-11-09 SDK 58 설치 후 npm audit에서 총 31개 경고(낮음 1, 중간 30, 높음 0, 치명적 0)를 확인했습니다. 같은 하위 취약점이 여러 상위 패키지에 전파된 집계를 포함하므로 독립된 취약점 31개라는 뜻은 아닙니다.

- 이전 SDK 57의 Router → query-string → decode-uri-component 관련 높음 경고는 이번 검사에서 보고되지 않았습니다.
- glob·minimatch 관련 중간 경고와 deepmerge 관련 낮음 경고가 Expo CLI·검사 도구·Jest 등의 의존성 경로에 남았습니다. 실제 배포 영향은 별도 검토 대상이며 취약점이 전부 해결됐다고 표현하지 않습니다.
- audit의 자동 수정안에는 Expo 52 등 주요 버전 변경이 포함되어 있어 강제 적용하지 않았습니다. 이번 작업에서는 승인된 SDK 58 호환 구성을 유지했습니다.
- 2026-11-10 동일 잠금 파일의 첫 재조회는 29개(낮음 1·중간 28), 이후 npm audit --audit-level=high 실행은 30개(낮음 1·중간 29)를 보고했습니다. 높음·치명적은 두 조회 모두 0입니다. 패키지를 바꾸지 않았으므로 경고 감소를 수정 실적으로 집계하지 않습니다. 보안 조회 결과는 실행마다 달라질 수 있습니다.
- 이번 높은 등급 차단 기준 검사는 종료 코드 0이며, 낮음·중간 경고가 해결됐다는 의미는 아닙니다. GitHub 최초 실행에서는 29개(낮음 1·중간 28)를 보고했고 전체 검사는 통과했습니다.
- 상세 로컬 검사 결과는 Git에서 제외되는 .expo/audit-sdk58.json과 .expo/audit-20261110.json에 있습니다.

## 안정성 검토 — 2026-11-10

이번 검토에서 패키지·잠금 파일은 변경하지 않았습니다. audit는 낮음 1·중간 28·높음 및 치명적 0입니다. 일반 자동 수정의 dry-run도 29개 경고를 보고해 적용하지 않았습니다. 분석용 Android 소스맵 1,148개 원본 경로에서 경고 대상 세 패키지 경로를 발견하지 못했으나 개발·CI 경고는 남아 있습니다. [검토 근거와 후속 조치](SECURITY_REVIEW.md)를 참고합니다.

## 실행·검증 명령

개발 서버: npm start. 타입: npm run typecheck. 린트: npm run lint. 단위 테스트: npm test. SDK: npm run check:dependencies. 진단: npm run doctor. Android 번들: npm run export:android.

Expo Go는 초기 기기 확인용입니다. Android Studio·JDK·전역 CLI를 설치하지 않았습니다. 원격 빌드·서명·스토어 제출·서버·실제 AI 모델은 이번 구현에 포함하지 않았습니다.
