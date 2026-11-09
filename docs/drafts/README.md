# 화면·학습 기획 초안

현재 자료는 설계와 설치 계획의 기록입니다. 사용자가 React Native + Expo 구성과 Android 우선 검증, 문서 반영·PR 병합·기본 앱 초기화를 승인했습니다. 이 초안 자체는 앱 구현이나 배포 완료를 뜻하지 않습니다. 실제 상태는 루트 README를 따릅니다.

## 모바일 방향

- [홈·방법론 화면 기획](MOBILE_METHODS_PREVIEW.md)
- [하네스 엔지니어링 원고와 근거](HARNESS_ENGINEERING.md)
- [모바일 홈·방법론 화면 미리보기](previews/mobile-methods.html)
- [모바일 학습·완료 화면 기획](MOBILE_LESSON_PREVIEW.md)
- [모바일 학습·완료 화면 미리보기](previews/mobile-lesson.html)
- [모바일 범위와 기술 결정](MOBILE_MVP_DECISION.md)
- [Android 설치·초기화 계획](ANDROID_SETUP_PLAN.md)
- [검토한 패키지 목록](android-package.proposed.json)과 [공개 메타데이터](android-package-metadata.json)

## 첫 미션과 이전 화면

- [첫 미션 기획서](FIRST_MISSION.md)
- [이전 화면 구조안](FIRST_MISSION_SCREENS.md)
- [이전 데스크톱 미션 화면 미리보기](previews/first-mission.html)

미리보기 HTML은 GitHub 코드 화면에서 앱으로 실행되지 않습니다. 파일을 내려받아 브라우저로 열어보세요. 일부 스타일·아이콘을 불러올 때 인터넷 연결이 필요할 수 있습니다. HTML은 화면 검토용이며 코드 실행, AI 호출이나 실제 학습 기록을 제공하지 않습니다.

`previews/*.fragment.html`은 수정 가능한 미리보기 원본이고, 같은 이름의 `.html`은 독립적으로 열 수 있는 내보내기 파일입니다. 두 파일은 같이 갱신합니다.

## 반영 범위

2026-11-09 사용자가 새 문서를 PR #5에 반영·병합한 뒤 새 작업 브랜치에서 승인된 패키지 설치와 기본 앱 구현을 진행하도록 승인했습니다. 원격 빌드·계정 연결·스토어 제출은 포함하지 않습니다.
