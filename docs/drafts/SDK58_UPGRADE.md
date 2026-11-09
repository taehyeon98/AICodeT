# Expo SDK 58 전환안

작성일: 2026-11-09. 상태: 사용자 승인 후 로컬 전환·검증 완료. 현재 실행·설치 기준은 SDK 58입니다. 아래 표는 승인 당시 전환안을 보존합니다.

사용자가 Expo Go에서 SDK 58이 필요하다는 안내를 보고했습니다. 적용 작업에서 기존 서버 로그를 확인한 결과, 설치된 Expo Go는 SDK 58이고 프로젝트는 SDK 57이라는 오류가 확인됐습니다. 공식 Expo Go 다운로드 페이지는 SDK 58을 현재 버전으로 안내합니다. 기존 시작 문서의 전환 기간 안내만으로 휴대전화의 지원 버전을 확정하지 않습니다.

## 적용할 변경

현재 작업 브랜치와 미커밋 앱 변경을 보존하고 Expo·React Native·React·Router·관련 보조 도구를 한 호환 조합으로 전환합니다. Node 24.19.0과 npm 11.17.0은 유지합니다. 후보 manifest는 [sdk58-package.proposed.json](sdk58-package.proposed.json)입니다.

| 패키지 | 전환 전 | 승인·적용 버전 |
| --- | --- | --- |
| @expo/dom-webview | 57.0.1 | 58.0.2 |
| @expo/log-box | 57.0.5 | 58.0.15 |
| @expo/metro-runtime | 57.0.18 | 58.0.17 |
| @react-native-async-storage/async-storage | 2.2.0 | 2.2.0 |
| expo | 57.0.32 | 58.0.23 |
| expo-constants | 57.0.23 | 58.0.15 |
| expo-font | 57.0.4 | 58.0.11 |
| expo-linking | 57.0.13 | 58.0.16 |
| expo-router | 57.0.30 | 58.0.30 |
| expo-status-bar | 57.0.1 | 58.0.4 |
| react | 19.2.3 | 19.3.0 |
| react-dom | 19.2.3 | 19.3.0 |
| react-native | 0.86.3 | 0.88.1 |
| react-native-reanimated | 4.5.1 | 4.7.1 |
| react-native-safe-area-context | 5.7.0 | 5.11.1 |
| react-native-screens | 4.26.0 | 4.30.1 |
| react-native-worklets | 0.10.1 | 0.13.0 |
| @react-native/jest-preset | 0.86.3 | 0.88.1 |
| @types/jest | 29.5.14 | 30.0.0 |
| @types/react | 19.2.4 | 19.3.0 |
| eslint | 9.39.1 | 9.39.1 |
| eslint-config-expo | 57.0.2 | 58.0.4 |
| expo-doctor | 1.21.6 | 1.21.6 |
| jest | 29.7.0 | 30.5.2 |
| jest-expo | 57.0.6 | 58.0.14 |
| typescript | 6.0.3 | 6.0.3 |

SDK 58의 템플릿 58.0.32와 Expo 58.0.23의 bundledNativeModules.json을 근거로 선택했습니다. LogBox 58.0.15의 DOM WebView 조건, React Native 0.88.1의 React·Node 조건, jest-expo 58.0.14의 검사 도구 조건도 npm에서 확인했습니다. jest-expo의 내부 Jest 패키지가 30 계열이므로 Jest와 타입을 함께 30 계열로 맞추는 안입니다. 승인 후 이 조합을 실제로 설치·검증했으며 루트 manifest·잠금 파일·설치 버전이 일치합니다.

## 실행 순서

1. 현재 package.json·잠금 파일의 로컬 복구 사본을 보존하고 개발 서버를 잠시 종료합니다.
2. 후보 버전을 적용하고 설치합니다. 패키지 해석 충돌은 원인을 확인해 수정하며 --force·--legacy-peer-deps를 사용하지 않습니다.
3. Expo 호환 검사와 Doctor, 타입·린트·학습 테스트, Android 번들 생성을 다시 확인합니다. React Native 0.88의 엄격한 타입 변경에 따라 ScrollView ref 등의 필요한 코드만 수정합니다.
4. package.json·잠금 파일·TOOLCHAIN·README를 실제 버전과 검사 결과로 맞춥니다. 기존 보안 경고는 다시 조회하며 해결됐다고 미리 주장하지 않습니다.
5. 캐시를 비운 개발 서버를 다시 켜고 Android manifest의 SDK와 연결 주소를 확인합니다. 휴대전화의 Expo Go에서 다시 연결합니다.

휴대전화 연결에 실패하면 버전 오류와 LAN 시간 초과를 구분해 추가 진단합니다. 방화벽 변경, 외부 터널 서비스, 기기 APK 설치, GitHub 업로드·병합은 이번 전환안에 포함하지 않습니다.

## 확인한 공식 자료

- [Expo Go 지원 버전](https://expo.dev/go)
- [SDK 불일치 오류](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)
- [SDK 전환 절차](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [SDK 58 릴리스와 변경점](https://expo.dev/changelog/sdk-58)
- [SDK 58 대응표](https://docs.expo.dev/versions/v58.0.0/)
- [Expo 58.0.23 호환 목록](https://unpkg.com/expo@58.0.23/bundledNativeModules.json)

## 실제 수행 결과

- SDK 57 설정·잠금 파일·관련 문서를 .expo/sdk57-backup-20261109-174719에 보관했습니다. 백업 manifest는 package.json.backup입니다.
- 승인된 26개 직접 의존성을 설치하고 잠금 파일을 갱신했습니다. 학습 화면의 스크롤 참조를 새 ScrollViewInstance 타입으로 수정했습니다.
- 타입·린트, Jest 6개, Expo 의존성 검사, Doctor 20/20, Android Hermes 번들 생성이 통과했습니다. 전체 의존성 트리에서도 문제가 보고되지 않았습니다.
- npm audit는 낮음 1·중간 30·높음 0·치명적 0입니다. 남은 경고와 제한은 TOOLCHAIN에 기록했습니다.
- 캐시를 비우고 LAN 개발 서버를 다시 시작했습니다. 상태 확인과 Android manifest 요청은 HTTP 200이며 SDK 58.0.0, runtime exposdk:58.0.0을 확인했습니다.
- SDK 58 전환 후 사용자가 Android Expo Go에서 정상 작동한다고 확인했습니다. 이 보고는 후속 코드 실습·저장 기능 추가 전의 실행 확인입니다. GitHub 업로드·병합은 수행하지 않았습니다.
