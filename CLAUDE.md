# CLAUDE.md — 꿈지섬 프로젝트 컨텍스트

> Claude Code가 이 프로젝트에서 작업할 때 자동으로 참조하는 문서입니다.

## 프로젝트 요약

꿈지섬(Ggumjisum) = 게이미피케이션 일일 예산 트래커 PWA.
섬이 지출에 따라 침몰하는 Visual Loss Engine 컨셉.
해커톤 1-day MVP.

## 기술 스택

Next.js 16 (App Router) / TypeScript / Tailwind v4 / shadcn/ui / Framer Motion / Zustand / Supabase(미연결) / OpenAI(mock 모드)

## 현재 상태

- Phase 1 + 1.5 완료
- 일일 예산 모델 (`dailyBudget = monthlyBudget / 30`)
- 데이터: localStorage (Zustand persist)
- OpenAI: mock 모드 (API 호출 없음)
- Supabase: 미연결

## 절대 규칙

1. `NEXT_PUBLIC_AI_MODE=mock` 기본값 유지
2. 파일당 200줄 이하
3. `features/` 간 직접 임포트 금지 → `lib/` 또는 `utils/` 경유
4. OpenAI는 서버 라우트 핸들러에서만 호출
5. 비밀 키 콘솔 출력 금지

## 프로젝트 구조

```
src/app/       → Next.js 라우트 (page, layout, api)
src/components/ → shadcn UI 컴포넌트만
src/features/  → 도메인별 UI+로직 (chat, island, history, onboarding, rescue)
src/lib/       → 클라이언트/환경변수 (env.ts, supabase.ts 예정)
src/store/     → Zustand 전역 스토어
src/utils/     → 순수 함수 (mock-nlp.ts)
```

## 데이터 모델

- User: {id, nickname, budget_limit, reset_day}
- Transaction: {id, type, amount, category, description, original_input, occurred_at}
- IslandStatus: 'safe' | 'warning' | 'sunk'
- 존 시스템: safe < 70%, warning < 100%, sunk >= 100%

## 카테고리 코드

coffee, food, transport, drink, shopping, entertainment, health, etc

## 다음 작업 (Phase 2)

1. Supabase 테이블 생성 (users, transactions)
2. lib/supabase.ts 작성
3. 데모 유저 자동 생성
4. 거래 CRUD 연동
5. localStorage → DB 전환

## 빌드/실행

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
```

## 알려진 이슈

1. ensureTodayReset()이 앱 로드 시 미실행 (addTransaction 내부에서만 호출)
2. Supabase 미연결 (localStorage만 사용)
3. User.reset_day 미사용 (일일 리셋만 동작)
