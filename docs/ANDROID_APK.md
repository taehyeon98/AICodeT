# Android 내부 테스트 APK

작성일: 2026-11-10. Expo Go와 별도로 설치하고 앱 코드·학습 콘텐츠를 포함하는 release 변형의 APK를 만드는 단계입니다. 스토어 배포용 서명은 별도입니다.

## 구성

- 표시 이름 AICodeT, 앱 버전 0.1.0, Android versionCode 1
- 테스트용 식별자 com.taehyeon98.aicodet.preview. Expo Go의 기록과 별개인 앱 저장 공간을 사용합니다.
- assets/icon.png의 기본 AI 아이콘을 사용합니다.
- 기본 대상은 arm64-v8a입니다. 32비트 전용 Android에서는 이 설치본을 사용할 수 없습니다. 에뮬레이터용은 x86_64를 지정할 수 있습니다.
- Android 자동 백업을 끄고 외부 저장소 읽기·쓰기와 다른 앱 위 표시 권한을 제외합니다. 생성된 네이티브 manifest와 최종 APK의 권한은 각각 확인해야 합니다.
- expo-system-ui 58.0.7을 SDK 호환 목록에 맞춰 추가해 밝은 화면 설정을 네이티브에도 적용합니다.

## Windows 빌드

Node·npm·앱 패키지는 TOOLCHAIN 기준을 사용합니다. Android Studio의 Java와 Android SDK가 필요합니다. 이 PC에서 확인한 Java는 Android Studio JBR OpenJDK 25.0.2이며 생성된 Gradle wrapper는 9.4.1입니다. 다른 경로를 쓸 때는 JAVA_HOME·ANDROID_HOME을 먼저 설정합니다.

이번 생성 프로젝트가 선택한 버전은 Build Tools 37.0.0, compile SDK 37, target SDK 36, min SDK 24, NDK 27.1.12297006, Kotlin 플러그인 2.2.10입니다. 최소 Android API 수준과 CPU 아키텍처 조건을 모두 만족해야 설치할 수 있습니다.

초기 기본 CMake 3.22.1의 Ninja 1.10.2에서 긴 경로 생성 오류를 확인했습니다. 이 PC의 Windows 긴 경로 설정은 이미 활성화되어 있어 변경하지 않았고, Windows 빌드 스크립트에만 android.cmakeVersion=3.31.6을 전달합니다. 공식 안내에 따라 긴 경로를 지원하는 Ninja가 포함된 도구를 사용합니다. [Expo Windows 경로 안내](https://docs.expo.dev/troubleshooting/windows-long-paths/)

Android Studio의 SDK Tools에서 CMake 3.31.6을 설치해야 합니다. 이 PC의 새 Android CLI에서는 android --no-metrics sdk install cmake/3.31.6으로 설치했습니다. 이전 sdkmanager 명령과 새 CLI의 패키지 표기법은 다르므로 설치 후 해당 디렉터리의 실제 파일을 확인합니다.

1. npm ci로 잠금 파일대로 설치합니다.
2. npm run build:android:preview를 실행합니다.
3. 스크립트가 expo prebuild로 android 디렉터리를 생성하고 assembleRelease를 실행합니다. 첫 빌드는 Gradle·네이티브 도구·의존성을 내려받아 오래 걸릴 수 있습니다.
4. 성공하면 build/AICodeT-0.1.0-arm64-v8a-preview.apk와 SHA-256이 출력됩니다.

직접 스크립트를 실행할 때는 ./scripts/build-android.ps1 -Architectures x86_64 또는 -Architectures 'arm64-v8a,x86_64'로 대상을 선택할 수 있습니다. 생성된 android 파일을 직접 수정하지 않고 app.json과 재현 가능한 구성을 수정합니다. android·build 디렉터리와 서명 파일은 Git에서 제외합니다.

## 서명과 전달 범위

현재 Expo/React Native 템플릿의 debug 서명 설정을 사용한 내부 확인용 release 변형입니다. JavaScript를 포함해 서버 없이 실행하도록 빌드하지만, 스토어 업로드 키로 서명한 배포본은 아닙니다. 테스트 키는 android/app/debug.keystore에 생성되며 커밋하지 않습니다.

스토어 제출이나 장기 배포 전에 전용 서명 키 생성·안전한 보관·업데이트 정책을 별도로 확정해야 합니다. 같은 식별자로 다른 키를 사용하면 기존 설치본 위에 업데이트할 수 없으므로, 임의로 키를 바꾸거나 사용자 기록이 있는 앱을 자동 삭제하지 않습니다.

공식 근거: [Expo 로컬 release 빌드](https://docs.expo.dev/guides/local-app-production/), [Android APK 안내](https://docs.expo.dev/build-reference/apk/).

## 설치 후 확인할 항목

- APK 서명·식별자·버전·ABI·포함된 JavaScript·최종 권한 확인
- 휴대폰에 설치 후 개발 서버 연결 없이 홈·방법론·첫 학습·실습 진입
- 네트워크를 끄고 앱 내 콘텐츠와 진도 저장·재실행 확인. 외부 출처 원문은 인터넷이 필요합니다.
- 뒤로 가기·큰 글자·기록 삭제 확인. Expo Go에서 정상이라는 보고를 이 APK의 검증으로 대체하지 않습니다.

입문자 3~5명의 사용성 관찰은 사용자 요청으로 보류했습니다. 실제 APK 생성·검사·기기 실행 결과는 확인한 후 아래에 기록합니다.

## 실제 생성·검사 결과

2026-11-10 로컬 assembleRelease 성공. 기본 CMake에서 발생한 긴 경로 오류를 CMake 3.31.6·Ninja 1.12.1로 해결했습니다. 이 PC에 없던 NDK 27.1.12297006과 CMake 도구는 공식 Android SDK 경로에 설치했습니다.

- 파일: build/AICodeT-0.1.0-arm64-v8a-preview.apk
- 크기: 28,490,748바이트 (약 27.2 MiB)
- SHA-256: 75B443E87D84B3FD0D5C07906B5CADE581A9B23F8135BB80722690E8F937DC39
- apksigner 검증 성공, APK Signature Scheme v2, 템플릿 Android Debug 인증서
- aapt 확인: 식별자 com.taehyeon98.aicodet.preview, 버전 0.1.0 / 1, min SDK 24, target SDK 36, arm64-v8a, 디버그 가능 표시 없음
- APK 안에 assets/index.android.bundle 2,069,960바이트 포함
- 최종 권한은 INTERNET·VIBRATE·앱 전용 DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION이며, 외부 저장소·다른 앱 위 표시 권한은 없음
- 타입·린트·테스트 33개·Expo 호환 검사·Doctor 20/20 통과

USB 연결 기기가 없어 APK 설치·실제 화면·오프라인 재실행은 아직 확인하지 않았습니다. 이전 Expo Go의 저장 정상 보고는 독립 APK의 확인 결과로 옮기지 않습니다. APK와 키는 Git에 올리지 않고 재생성에 필요한 설정·스크립트·아이콘·문서를 관리합니다.
