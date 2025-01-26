<h2 align="center">
AI-Driven Development Playground
</h2>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js"/>
  <img src="https://img.shields.io/badge/React-18-blue?logo=react"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript"/>
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss"/>
  <img src="https://img.shields.io/badge/OpenAI-GPT--3.5-412991?logo=openai"/>
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite"/>
</div>

A test project for software development using AI, specifically implementing features based on PRD documentation through Cursor AI assistance. This project explores the effectiveness of AI-driven development by converting PRD specifications into actual code implementation.

## Sub-Project: Lingual Lab

### 프로젝트 소개

이 프로젝트는 AI를 활용한 영어 학습 도우미 개발 실험입니다. FSI(Foreign Service Institute)의 외교관 어학 학습 방법에서 영감을 받아 시작되었으며, Next.js와 ChatGPT를 전혀 모르는 상태에서 AI의 도움만으로 개발을 진행했습니다.

FSI 외교관 어학 학습 방법의 핵심은 '반복적인 작문과 피드백'입니다. 이 방법은 다음과 같은 특징을 가지고 있습니다:

1. 주제 기반 작문: 학습자는 다양한 주제에 대해 자신의 생각을 목표 언어로 작성합니다.
2. 즉각적인 피드백: 원어민 교사가 작문을 실시간으로 평가하고 개선점을 제시합니다.
3. 표현 확장: 같은 의미를 다양한 방식으로 표현하는 방법을 학습합니다.
4. 실제 사용 예시 학습: 원어민들이 실제로 사용하는 자연스러운 표현을 학습합니다.

이 프로젝트는 위 학습 방법을 AI 기술을 활용하여 구현했습니다. GPT가 원어민 교사 역할을 수행하며, Tavily API를 통해 실제 사용되는 다양한 표현을 검색하여 제공합니다.

### 개발 배경
- FSI 어학 학습 방법론 기반
- AI 도움만으로 전체 개발 진행
- UI는 온라인 레퍼런스 활용
- 아이콘은 Recraft AI 활용

### 실험 결과
이 프로젝트를 통해 AI 만으로도 MVP(Minimum Viable Product) 수준의 개발이 가능하다는 것을 확인했습니다. 현재 AI 기술의 한계와 가능성에 대한 주요 발견점은 다음과 같습니다:

**장점**
- PRD 문서와 명확한 룰 정의만으로도 MVP 수준 개발 가능
- 프로토타이핑에 매우 효과적
- 프론트엔드 개발에 강점

**한계**
- 복잡한 비즈니스 로직이 포함된 백엔드 개발의 어려움
- AI에만 의존할 경우 재귀적 오류 발생 가능성
- 코드 품질 관리의 어려움

### 향후 계획
- Supabase를 활용한 데이터베이스 구축
- v0을 이용한 UI 개선
- Netlify를 통한 배포

## 실험 결과

### 1. 작문 평가 실험
<div align="center">
<img src="https://github.com/user-attachments/assets/b0cc1509-4a0e-4fdb-904a-88fc45da7ae8" width="70%">
</div>

### 2. 유사 표현 검색 결과
<div align="center">
<img src="https://github.com/user-attachments/assets/1ac93b5c-1ea9-4512-bc76-5d14fe43443c" width="70%">
</div>

## 주요 기능

### 1. 작문 연습
- AI 기반 실시간 작문 피드백
- 주제별 작문 연습
- 작문 수준 자동 평가
- 강점 및 개선점 분석
- 문장 수정 제안

### 2. 유사 표현 학습
- 작성한 문장의 다양한 표현 방법 제시
- 실제 영어 사용 예시 제공
- 자동 저장 및 복습 기능

### 3. 단어장
- 학습 중 단어 저장
- GPT 기반 자동 의미/예문 생성
- 단어 관리 및 복습

## 기술 스택
- **Frontend**: Next.js 14, React, TypeScript
- **UI**: TailwindCSS, shadcn/ui
- **Database**: SQLite
- **AI**: OpenAI GPT-3.5, Tavily Search API

## 프로젝트 구조
```
ai-driven-dev-playground/
└── lingual-lab/
    ├── app/                    # Next.js 페이지
    │   ├── page.tsx           # 홈페이지
    │   ├── write/             # 작문 페이지
    │   ├── records/           # 작문 기록
    │   └── vocabulary/        # 단어장
    ├── components/            # React 컴포넌트
    ├── lib/                   # 유틸리티 함수
    └── public/               # 정적 파일
```

## 설치 및 실행
1. 저장소 클론
```bash
git clone https://github.com/yourusername/ai-driven-dev-playground.git
cd ai-driven-dev-playground/lingual-lab
```

2. 의존성 설치
```bash
pnpm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일에 필요한 API 키 입력
```

4. 개발 서버 실행
```bash
pnpm dev
```

## 환경 변수
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## 라이선스
MIT License