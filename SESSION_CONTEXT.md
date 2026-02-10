# 🏝️ 거지섬 - 세션 컨텍스트 (최종 업데이트: 2026-02-11)

## 📋 프로젝트 개요

### 핵심 컨셉
- **정의**: 생존 게임형 가계부
- **핵심 후킹**: "하루 예산을 초과하면, 섬이 침몰한다!"
- **타겟**: Gen Z (가계부를 안 쓰는 세대)
- **차별점**: 숫자가 아닌 시각적 손실(섬 침몰)로 즉각적 위기감 제공

### 배포 정보
- **GitHub**: https://github.com/wldnfkrhakfgo424-arch/ggumjisum.git
- **Live Demo**: https://ggumjisum.vercel.app/
- **브랜치**: main

---

## 🎯 최근 완료된 작업

### 1. 브랜딩 메시지 리프레이밍 (2026-02-11)
**목적**: "생존 게임형 가계부" 컨셉 강화

**수정 파일**:
- `src/app/layout.tsx`: SEO 메타데이터 업데이트
  - title: "거지섬 - 생존 게임형 가계부"
  - description: "하루 예산을 초과하면, 섬이 침몰한다!"
  
- `src/app/page.tsx`: 랜딩 페이지 히어로 섹션
  - 메인 카피: "하루 예산을 초과하면, 섬이 침몰한다! 💥"
  - 서브 카피: "생존 게임형 가계부"
  
- `public/manifest.json`: PWA 설명 업데이트
- `README.md`: 프로젝트 소개 리프레이밍

**커밋**: `feat: 브랜딩 메시지 업데이트 - 생존 게임형 가계부`

### 2. 이웃 섬 시각화 기능 구현
**기능**: 이웃 섬 방문 시 실제 섬의 생김새 표시

**구현 내용**:
- `IslandVisualizer` 컴포넌트에 readonly 모드 추가
  - `readonly?: boolean` prop
  - `visitorData?: VisitorData` prop (방문자 데이터)
  
- readonly 모드에서 숨겨지는 요소:
  - HP 바 (예산 게이지)
  - 70% 경고 표시 (큰 경고 + 작은 표지판)
  - 100% 초과 메시지
  - 레벨업/스트릭 보상 알림
  
- readonly 모드에서 표시되는 요소:
  - 실제 섬 그래픽 (레벨에 따라)
  - 물 높이 (예산 사용률 반영)
  - 날씨 효과 (맑음/흐림/폭풍)
  - 캐릭터와 대화창
  - 목표 현수막 (있는 경우)

**수정 파일**:
- `src/features/island/IslandVisualizer.tsx`
  - VisitorData interface 추가
  - readonly 모드 로직 구현
  - justLeveledUp 등 store 값 처리
  
- `src/app/island/[userId]/page.tsx`
  - 이모지 표시 → IslandVisualizer 컴포넌트로 교체
  - visitorData props 전달
  
- `src/lib/supabase.ts`
  - UserIsland 타입에 `island_status?`, `today_spend?`, `goal?` 추가

**커밋**: 
- `feat: 이웃 섬 방문 시 실제 섬 시각화 구현`
- `fix: readonly 모드에서 justLeveledUp 등 store 값 처리`

### 3. UI 레이아웃 조정
**기능**: 목표 현수막 위치 조정

**변경 사항**:
- 목표 현수막을 HP 바 옆으로 이동 (같은 수평선상)
- padding과 스타일을 HP 바와 일치시킴
- 이모티콘 제거

**수정 파일**:
- `src/features/island/IslandVisualizer.tsx`
- `src/features/onboarding/OnboardingForm.tsx` (목표 입력 필드 추가)
- `src/store/useStore.ts` (User interface에 goal 추가)

**커밋**: 
- `fix: 목표 배너를 HP 바와 같은 높이로 정렬`
- `feat: 목표를 HP 바 옆으로 이동 및 이모티콘 제거`

### 4. 모바일 UI 제한
**기능**: 데스크톱에서도 모바일 뷰포트로 제한

**변경 사항**:
- 모든 앱 화면에 `max-w-md mx-auto` 적용
  - `/island` (메인 섬)
  - `/island/[userId]` (이웃 섬 방문)
  - `/leaderboard` (리더보드)
  - `/history` (히스토리)

**수정 파일**:
- `src/app/island/page.tsx`
- `src/app/island/[userId]/page.tsx`
- `src/app/leaderboard/page.tsx`
- `src/app/history/page.tsx`

**커밋**: `fix: 데스크톱에서 모바일 뷰포트로 제한 (max-w-md)`

---

## 🏗️ 프로젝트 구조

### 주요 디렉토리
```
ggumjisum/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 메타데이터, PWA 설정
│   │   ├── page.tsx           # 랜딩 페이지
│   │   ├── onboarding/        # 온보딩 플로우
│   │   ├── island/            # 메인 앱
│   │   │   ├── page.tsx       # 내 섬
│   │   │   └── [userId]/      # 이웃 섬 방문
│   │   ├── leaderboard/       # 리더보드
│   │   └── history/           # 지출 내역
│   ├── features/
│   │   ├── island/
│   │   │   ├── IslandVisualizer.tsx  # 섬 시각화 (물, 날씨, 경고)
│   │   │   ├── IslandCharacter.tsx   # 캐릭터 & 대화창
│   │   │   └── NeighborIslands.tsx   # 이웃 섬 목록
│   │   └── onboarding/
│   │       └── OnboardingForm.tsx    # 닉네임/예산/목표 입력
│   ├── store/
│   │   └── useStore.ts        # Zustand 상태 관리
│   └── lib/
│       └── supabase.ts        # Supabase 클라이언트
├── public/
│   └── manifest.json          # PWA 매니페스트
├── HACKATHON_SUBMISSION.md    # 해커톤 제출 문서
├── VIDEO_SCRIPT.md            # 시연 영상 스크립트
└── README.md                  # 프로젝트 설명
```

### 핵심 파일 설명

#### 1. `src/store/useStore.ts`
**역할**: 전역 상태 관리 (Zustand)

**주요 상태**:
- `user`: 사용자 정보 (nickname, budget_limit, goal 등)
- `today_spend`: 오늘 지출
- `island_level`: 섬 레벨 (0-4)
- `island_status`: 섬 상태 (normal/sunk)
- `currentStreak`: 연속 절약일

**주요 함수**:
- `getRatio()`: 예산 사용률 계산 (today_spend / dailyBudget)
- `getDailyBudget()`: 일일 예산 (budget_limit / 30)
- `getRemainingBudget()`: 남은 예산

#### 2. `src/features/island/IslandVisualizer.tsx`
**역할**: 섬 시각적 상태 렌더링

**주요 기능**:
- 물 높이 애니메이션 (ratio 기반)
- 날씨 변화 (맑음 → 흐림 → 폭풍)
- 70% 경고 시스템 (큰 경고 → 작은 표지판)
- 100% 초과 시 캐릭터 휩쓸림
- HP 바 (예산 게이지)
- 목표 현수막
- **NEW**: readonly 모드 (이웃 섬 방문용)

**Props**:
- `onCharacterClick?`: 캐릭터 클릭 핸들러
- `readonly?`: 읽기 전용 모드 (방문자용)
- `visitorData?`: 방문자 데이터 (readonly 모드에서 사용)

#### 3. `src/features/island/IslandCharacter.tsx`
**역할**: 캐릭터 & 대화창 렌더링

**주요 기능**:
- 픽셀 아트 캐릭터
- ratio에 따른 대화 변화
- 물 높이에 따른 대화창 위치 조정 (위/아래)
- 100% 초과 시 휩쓸림 애니메이션

#### 4. `src/app/island/[userId]/page.tsx`
**역할**: 이웃 섬 방문 페이지

**주요 기능**:
- 섬 통계 표시 (레벨, 스트릭, 절약률)
- **IslandVisualizer (readonly 모드)로 실제 섬 표시**
- 성과 정보 표시
- 절약 팁 주고받기
- 응원하기 버튼

---

## 🎨 핵심 시스템 설명

### 1. 예산 사용률 기반 시각적 피드백
```typescript
// ratio = today_spend / (budget_limit / 30)

0-30%:  ☀️ 맑음, 물 낮음, HP 바 초록
30-70%: ⛅ 흐림, 물 중간, HP 바 노랑
70-100%: ⛈️ 폭풍, 물 높음, HP 바 빨강, ⚠️ 경고
100%+:  🌊 침몰, 캐릭터 휩쓸림
```

### 2. 섬 진화 시스템
```typescript
Lv.0 무인도 🏝️ (0일)
Lv.1 텐트 ⛺ (3일 연속)
Lv.2 오두막 🏕️ (7일 연속)
Lv.3 작은 집 🏠 (14일 연속)
Lv.4 마을 🏘️ (30일 연속)
```

### 3. 스트릭 시스템
- 3일 연속 절약: 🌟 보상
- 7일 연속 절약: 🔥 특별 보상
- 초과 시 스트릭 리셋

### 4. 70% 경고 시스템
1. **큰 경고** (4초간 표시)
   - ⚠️ 표지판 애니메이션
   - "⏰ X시간 X분 동안"
   - "X원만 써야 함!"
   
2. **작은 표지판** (지속)
   - 화면 왼쪽 상단에 작게 표시
   - 클릭 불가 (pointer-events-none)

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form

### Backend (Optional)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

### DevOps
- **Hosting**: Vercel
- **CI/CD**: Vercel + GitHub
- **Version Control**: Git + GitHub

---

## 📝 이름 변경 히스토리

### "꿈지섬" → "거지섬" (2026-02-10)
**변경 파일**:
- `src/app/layout.tsx` (title, appleWebApp.title)
- `public/manifest.json` (name, short_name)
- 온보딩 메시지 및 UI 텍스트

---

## 🐛 최근 해결한 버그

### 1. fractional currency 표시 문제
**증상**: "3,000.333원" 같이 소수점 표시됨

**원인**: `dailyBudget = budget_limit / 30`의 결과가 소수

**해결**: `Math.floor(budget_limit / 30)` 적용
- `src/store/useStore.ts`의 `getDailyBudget()`, `getRatio()`, `getRemainingBudget()`

### 2. 70% 경고가 사라지지 않는 문제
**증상**: 4초 후에도 큰 경고가 사라지지 않음

**원인**: useEffect 의존성 배열에 `hasShownWarning70` 포함

**해결**: 의존성에서 제거 및 로직 순서 변경

### 3. 대화창이 물에 가려지는 문제
**증상**: 물이 높을 때 대화창이 물 레이어 뒤로 감

**해결**: 캐릭터와 대화창을 분리하여 각각 z-index 설정
- 대화창: `z-50`
- 캐릭터: `z-0`
- Fragment로 감싸서 독립적 z-index 적용

### 4. readonly 모드에서 justLeveledUp 에러
**증상**: 이웃 섬 방문 시 "justLeveledUp is not defined" 에러

**원인**: readonly 모드에서 store 값들을 선언하지 않음

**해결**: readonly일 때 기본값 설정
```typescript
const justLeveledUp = readonly ? false : storeData.justLeveledUp;
const clearLevelUp = readonly ? (() => {}) : storeData.clearLevelUp;
const justStreakReward = readonly ? null : storeData.justStreakReward;
const clearStreakReward = readonly ? (() => {}) : storeData.clearStreakReward;
const streakRewards = readonly ? [] : storeData.streakRewards;
```

---

## ✅ 체크리스트: 해커톤 제출 준비

### 필수 항목
- [x] 프로젝트 배포 (Vercel)
- [x] GitHub 저장소 공개
- [x] README.md 작성
- [x] 랜딩 페이지 제작
- [x] 시연 가능한 상태
- [x] 브랜딩 메시지 통일
- [ ] 시연 영상 제작

### 개선 항목 (선택)
- [ ] Supabase 연동 (현재 로컬 스토리지)
- [ ] 소셜 로그인
- [ ] 푸시 알림
- [ ] 카테고리별 지출 분석 강화
- [ ] 복구 퀴즈 콘텐츠 추가

---

## 💡 개발 팁

### 로컬 개발 환경 실행
```bash
cd "거지섬 아자스!/ggumjisum"
npm run dev
```

### Git 작업 흐름
```bash
# 변경사항 확인
git status
git diff

# 커밋
git add -A
git commit -m "feat: 기능 설명"
git push

# 배포 (Vercel이 자동으로 감지)
```

### 주요 명령어
```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint
```

---

## 🎯 알려진 제약사항

1. **Supabase 미연동**: 현재 로컬 스토리지 사용 (다중 기기 동기화 불가)
2. **이웃 섬 데이터**: 실제 Supabase 연동 시에만 작동
3. **PWA 아이콘**: 기본 아이콘 사용 중 (커스텀 아이콘 필요)
4. **모바일 최적화**: 데스크톱에서 max-w-md로 제한 (반응형 개선 가능)

---

## 📞 다음 세션에서 할 일

### 우선순위 높음
1. 시연 영상 제작 (VIDEO_SCRIPT.md 참고)
2. 해커톤 제출 문서 최종 검토

### 우선순위 중간
1. Supabase 실제 연동 (현재 더미 데이터)
2. 이웃 섬 목록 실제 데이터로 채우기
3. PWA 아이콘 제작

### 우선순위 낮음
1. 카테고리별 분석 차트 개선
2. 복구 퀴즈 콘텐츠 추가
3. 소셜 공유 기능

---

## 🔑 핵심 메시지 (항상 기억)

**정의**: 생존 게임형 가계부  
**후킹**: 하루 예산을 초과하면, 섬이 침몰한다!  
**가치**: 가계부가 아닌 "생존 경험"

---

**마지막 업데이트**: 2026-02-11 01:40 KST  
**마지막 커밋**: `feat: 브랜딩 메시지 업데이트 - 생존 게임형 가계부`
