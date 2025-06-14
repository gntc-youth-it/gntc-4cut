# 은진네컷 (Eunjin 4-Cut Photo Booth)

웹캠을 이용해 4컷 사진을 촬영하고, 다양한 프레임을 선택해 결과물을 바로 다운로드할 수 있는 웹 포토부스 애플리케이션입니다.

## 주요 기능
- 웹캠으로 3초마다 자동 촬영 (4컷)
- 다양한 프레임 중 선택 가능 (프레임 미리보기 제공)
- 촬영 결과를 프레임에 합성하여 미리보기 및 다운로드
- 반응형 UI, 직관적인 사용성

## 실행 방법

### 1. 프로젝트 클론
```bash
git clone [YOUR_REPO_URL]
cd [YOUR_REPO_FOLDER]
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```

브라우저에서 `http://localhost:3000` 으로 접속하면 바로 사용 가능합니다.

## 사용법
1. 시작 화면에서 클릭하여 시작
2. 원하는 프레임을 선택
3. 안내에 따라 웹캠을 바라보고, 3초마다 자동으로 4컷 촬영
4. 결과물을 확인하고, 파일명을 입력한 뒤 다운로드

## 기술 스택
- React (TypeScript)
- HTML5, CSS3
- react-slick (슬라이더)
- 기타 오픈소스 라이브러리

## 폴더 구조 예시
```
src/
  ├── App.tsx
  ├── FrameSelection.tsx
  ├── PhotoStudio.tsx
  ├── PhotoDisplay.tsx
  ├── TitleScreen.tsx
  ├── assets/ (프레임 이미지, 로고 등)
  └── ...
```

## 라이선스
MIT License

---
문의 및 피드백은 언제든 환영합니다!
