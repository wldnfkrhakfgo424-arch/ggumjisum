# 거지섬 - 해커톤 제출 자료

## 📌 프로젝트 정보

### 제목
**거지섬 (Ggumjisum)** - 섬이 가라앉기 전에 지출을 관리하세요!

### 한 줄 소개
게이미피케이션 × 일일 예산 트래커: 지출할수록 섬이 물에 잠기는 Visual Loss Engine으로 Gen Z의 소비 습관을 바꿉니다.

### 사용 도구 (기술 스택)
- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **Animation**: Framer Motion 12
- **State Management**: Zustand 5
- **Database**: Supabase 2 (PostgreSQL)
- **Charts**: Recharts 3
- **Deployment**: Vercel
- **Version Control**: Git, GitHub

---

## 🎯 1. 프로젝트 선정 배경 및 목적

### 문제 인식
Gen Z(MZ세대)는 가계부 앱을 잘 사용하지 않습니다. 기존 가계부 앱들의 3가지 치명적 문제:

1. **월 단위는 감각이 없다**: 30일 뒤는 너무 멀어서 오늘 당장의 위기감이 없음
2. **숫자만 보여주면 지루하다**: 딱딱한 표와 그래프로는 사용자의 관심을 끌 수 없음
3. **위기감이 없어서 통제 실패**: 숫자가 늘어나는 것만으로는 행동을 바꾸기 어려움

### 솔루션: Visual Loss Engine
"내 섬이 가라앉는다" = 즉각적인 위기감

- 지출이 늘어날수록 섬이 **실시간으로 물에 잠김**
- 단순한 숫자가 아닌 **시각적 손실(Visual Loss)**로 직관적인 피드백 제공
- **일일 예산 모델**: 30일 단위가 아닌 오늘 하루에 집중

### 프로젝트 목표
1. Gen Z가 재미있게 사용할 수 있는 가계부 앱
2. 게임처럼 중독성 있는 사용자 경험
3. 실제로 소비 습관을 바꿀 수 있는 강력한 피드백 시스템

---

## 🚀 2. 주요 기능 및 구현 과정

### 핵심 기능 1: 5중 경각심 시스템

지출 비율에 따라 **5가지 시각적 피드백**이 동시에 작동:

#### 1) 날씨 변화 (Weather System)
```typescript
// 예산 사용률에 따른 날씨 이모지 변화
const weatherEmoji = ratio < 0.3 ? '☀️' : ratio < 0.7 ? '⛅' : ratio < 1 ? '⛈️' : '🌊';
```
- 0-30%: 맑음 ☀️
- 30-70%: 흐림 ⛅
- 70-100%: 폭풍 ⛈️
- 100% 이상: 침몰 🌊

#### 2) 파도 출렁임 (Wave Animation)
```typescript
// 위험 구간(70% 이상)에서 파도 속도 3배 증가
const waveDuration = ratio >= 0.7 ? 1 : 5; // seconds
```
- Framer Motion을 활용한 부드러운 애니메이션
- 위험 구간에서 파도 높이와 속도 동시 증가

#### 3) 경고 표시등 (Warning Sign)
```typescript
// 70% 초과 시 경고등 + 카운트다운
if (ratio >= 0.7) {
  // 삼각형 경고 아이콘 + 남은 시간 + 남은 예산 표시
}
```
- 첫 진입 시 4초간 큰 경고 메시지
- 이후 왼쪽 상단에 작은 경고 아이콘 상시 표시
- 자정까지 남은 시간 실시간 카운트다운

#### 4) HP 바 (Budget HP Bar)
```typescript
// 게임 스타일 HP 바
const hpPercentage = Math.max(0, (1 - ratio) * 100);
const hpColor = ratio < 0.5 ? 'green' : ratio < 0.7 ? 'yellow' : 'red';
```
- 게임처럼 남은 예산을 HP 바로 표시
- 색상 변화: 초록 → 노랑 → 주황 → 빨강

#### 5) 캐릭터 휩쓸림 (Character Sweep)
```typescript
// 100% 초과 시 캐릭터 애니메이션
animate={{
  x: ratio >= 1 ? 300 : 0,
  rotate: ratio >= 1 ? 360 : 0,
  opacity: ratio >= 1 ? 0 : 1
}}
```
- 예산 초과 시 캐릭터가 물에 휩쓸려 화면 밖으로 사라짐
- 복구 퀴즈를 풀면 70% 지점으로 복구

### 핵심 기능 2: 섬 진화 시스템 (Island Evolution)

연속으로 예산 내 소비 시 섬이 5단계로 진화:
1. Lv.0 무인도 🏝️ (0일)
2. Lv.1 텐트 ⛺ (3일)
3. Lv.2 오두막 🏕️ (7일)
4. Lv.3 작은 집 🏠 (14일)
5. Lv.4 마을 🏘️ (30일)

```typescript
export const ISLAND_LEVELS = [
  { level: 0, name: '무인도', requiredExp: 0 },
  { level: 1, name: '텐트', requiredExp: 3 },
  { level: 2, name: '오두막', requiredExp: 7 },
  { level: 3, name: '작은 집', requiredExp: 14 },
  { level: 4, name: '마을', requiredExp: 30 },
];
```

### 핵심 기능 3: 자연어 입력 (NLP)

"스타벅스 5000원" 같은 자연어를 자동으로 파싱:

```typescript
// Mock NLP Parser (실제 구현)
export function parseTransaction(input: string) {
  const amountMatch = input.match(/(\d{1,3}(?:,?\d{3})*)/);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0;
  
  const description = input.replace(/\d{1,3}(?:,?\d{3})*/g, '').trim();
  const category = categorizeByKeyword(description);
  
  return { amount, category, description };
}
```

### 핵심 기능 4: 소셜 기능

#### 리더보드
- 절약률 기준 실시간 랭킹
- Supabase를 통한 실시간 동기화

#### 이웃 섬 방문
```typescript
// 다른 사용자의 섬을 방문하여 팁 공유
<Link href={`/island/${neighbor.user_id}`}>
  <IslandIcon level={neighbor.island_level} />
</Link>
```

### 핵심 기능 5: 분석 대시보드

Recharts를 활용한 시각화:
- 주간/월간 지출 추이 그래프
- 카테고리별 지출 분석
- 절약률 트렌드

---

## 🔧 3. 기술적 문제 발생 시 해결 사례 (Troubleshooting)

### 문제 1: 소수점 화폐 표시 버그

**증상**: 
```
"3시간 24분 동안 3,000.333원만 써야 함!"
```
원화에 소수점이 표시되어 UX 저하

**원인**:
```typescript
// 월 예산 / 30 계산 시 부동소수점 발생
const dailyBudget = user.budget_limit / 30; // 예: 150000 / 30 = 5000.0
```

**해결**:
```typescript
// Math.floor()로 정수 변환
const dailyBudget = Math.floor(user.budget_limit / 30);
```

### 문제 2: 대화 말풍선이 물에 가려지는 문제

**증상**: 
물이 많이 차오르면 캐릭터의 대화 말풍선이 물(z-index: 10) 아래로 가려짐

**원인**:
말풍선이 캐릭터 컴포넌트(z-index: 0) 내부에 있어서 부모의 z-index에 제약됨

**해결**:
```typescript
// 캐릭터와 말풍선을 분리
<>
  {/* 캐릭터: z-0 (물 아래) */}
  <motion.div style={{ zIndex: 0 }}>
    <Character />
  </motion.div>
  
  {/* 말풍선: z-50 (물 위) */}
  <motion.div style={{ zIndex: 50 }}>
    <DialogueBubble />
  </motion.div>
</>
```

### 문제 3: 70% 경고 타이머가 사라지지 않는 버그

**증상**: 
4초 후 사라져야 할 경고 메시지가 계속 표시됨

**원인**:
```typescript
// useEffect 의존성 배열에 hasShownWarning70 포함
useEffect(() => {
  if (ratio >= 0.7 && !hasShownWarning70) {
    setShowBigWarning(true);
    setHasShownWarning70(true); // ❌ 이 순간 useEffect 재실행!
    setTimeout(() => setShowBigWarning(false), 4000); // 타이머 취소됨
  }
}, [ratio, hasShownWarning70]); // ❌
```

**해결**:
```typescript
// hasShownWarning70을 의존성 배열에서 제거
useEffect(() => {
  if (ratio < 0.7) {
    setHasShownWarning70(false);
    return;
  }
  if (ratio >= 0.7 && !hasShownWarning70) {
    setShowBigWarning(true);
    setHasShownWarning70(true);
    setTimeout(() => setShowBigWarning(false), 4000); // ✅ 정상 작동
  }
}, [ratio]); // ✅
```

### 문제 4: 이웃 섬이 화면 밖으로 나가는 문제

**증상**: 
랜덤 배치된 이웃 섬들이 화면 경계를 벗어남

**원인**:
```typescript
// 랜덤 left 값이 90% 이상 가능
left: `${seededRandom(seed) * 90}%`
```

**해결**:
```typescript
// 고정 위치 배치로 변경
const getFixedPosition = (index: number) => ({
  bottom: '8%',
  left: `${3 + index * 11}%`, // 3%, 14%, 25%, 36%, ...
});
```

---

## 🎉 4. 프로젝트 완주 소감 및 향후 계획

### 완주 소감

**"Visual Loss"라는 개념이 실제로 작동한다는 것을 확인했습니다.**

개발 과정에서 가장 놀라웠던 점은, 저 스스로도 테스트하면서 "섬이 가라앉는 게 싫어서" 지출을 줄이게 되었다는 것입니다. 숫자로 "10,000원 남았어요"라고 말하는 것보다, 섬이 물에 잠기는 시각적 피드백이 훨씬 강력한 동기부여가 되었습니다.

특히 5중 경각심 시스템을 구현하면서:
- 날씨가 폭풍으로 바뀌고
- 파도가 격렬하게 출렁이고
- 경고등이 깜빡이고
- HP 바가 빨개지고
- 캐릭터가 불안해하는 모습

이 모든 것이 **동시에** 작동할 때, 정말로 "위기감"을 느낄 수 있었습니다.

### 기술적 성장

1. **Framer Motion 마스터**: 복잡한 애니메이션 시스템 구축
2. **Zustand 상태 관리**: 일일 예산 리셋, 스트릭 계산 등 복잡한 로직
3. **Supabase 실시간 동기화**: 리더보드, 이웃 섬 기능
4. **반응형 디자인**: 모바일/데스크톱 완벽 대응

### 향후 계획

#### 단기 계획 (1개월)
1. **PWA 변환**: 홈 화면에 추가하여 네이티브 앱처럼 사용
2. **알림 시스템**: 70% 도달 시 푸시 알림
3. **더 많은 섬 테마**: 사막 섬, 눈 덮인 섬, 열대 섬 등

#### 중기 계획 (3개월)
1. **실제 은행 연동**: Plaid API로 자동 거래 기록
2. **AI 추천 시스템**: 지출 패턴 분석 후 절약 팁 제공
3. **커뮤니티 기능**: 절약 챌린지, 그룹 섬 만들기

#### 장기 계획 (6개월)
1. **iOS/Android 앱**: React Native 포팅
2. **수익화**: 프리미엄 섬 테마, 캐릭터 커스터마이징
3. **글로벌 확장**: 다국어 지원, 다양한 통화 지원

### 배운 점

**"복잡한 기능보다 강력한 컨셉이 중요하다"**

처음에는 AI, 블록체인, AR 등 화려한 기술을 넣고 싶었습니다. 하지만 "섬이 가라앉는다"는 단순하지만 강력한 메타포 하나가 모든 기능을 관통하는 핵심이 되었습니다.

사용자는 복잡한 기능을 원하는 게 아니라, **명확하고 즉각적인 피드백**을 원한다는 것을 깨달았습니다.

---

## 🔗 링크

### 데모 링크
- **랜딩 페이지**: https://ggumjisum.vercel.app/
- **온보딩 체험**: https://ggumjisum.vercel.app/onboarding
- **메인 앱**: https://ggumjisum.vercel.app/island

### GitHub 저장소
- **Repository**: https://github.com/wldnfkrhakfgo424-arch/ggumjisum

### 시연 영상 (예정)
- **YouTube**: (시연 영상 업로드 후 링크 추가)

---

## 📊 프로젝트 통계

- **개발 기간**: 2주
- **총 커밋 수**: 50+
- **코드 라인 수**: 3,000+ lines
- **컴포넌트 수**: 15개
- **주요 기능 수**: 10개
- **기술 스택 수**: 8개

---

## 🙏 감사의 말

이 프로젝트를 만들면서 많은 도움을 받았습니다:
- **Next.js 공식 문서**: 최고의 레퍼런스
- **Framer Motion 커뮤니티**: 애니메이션 예제
- **Supabase 튜토리얼**: 실시간 동기화 구현

그리고 무엇보다, 이 앱을 테스트해준 모든 친구들에게 감사드립니다. 여러분의 피드백이 없었다면 이렇게 완성도 높은 앱을 만들 수 없었을 것입니다.

---

**거지섬에서 당신의 섬을 지켜보세요! 🏝️**
