// Mock NLP Parser - 수입/지출 감지 + 카테고리 분류 + 키워드 요약

export interface ParseResult {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  confidence: number;
}

// 수입 감지 키워드 (강한/약한 분리)
const STRONG_INCOME_KEYWORDS = [
  '용돈', '월급', '알바비', '수입', '환불', '입금', '이체받', '페이백', '캐시백'
];

const WEAK_INCOME_KEYWORDS = [
  '받았', '벌었', '들어왔', '받음', '받아', '받아서'
];

// 카테고리 사전
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  coffee: [
    '커피', '스타벅스', '카페', '이디야', '투썸', '아메리카노', '라떼',
    '카푸치노', '에스프레소', '카페라떼', '빽다방', '메가커피', '컴포즈',
    '탐앤탐스', '할리스', '엔제리너스', '파스쿠찌'
  ],
  food: [
    '밥', '식사', '점심', '저녁', '아침', '배달', '요기요', '배민', '배달의민족',
    '쿠팡이츠', '편의점', 'GS25', 'CU', '세븐일레븐', '마트', '라면', '김밥',
    '떡볶이', '치킨', '피자', '햄버거', '맥도날드', '버거킹', '롯데리아',
    '도시락', '김치찌개', '삼겹살', '회', '초밥', '족발', '보쌈', '국밥'
  ],
  transport: [
    '택시', '버스', '지하철', '교통', '카카오택시', 'KTX', '고속버스',
    '티머니', '캐시비', '교통카드', '우버', '따릉이', '킥보드', '주차',
    '톨비', '기름', '주유', '기름값'
  ],
  drink: [
    '술', '맥주', '소주', '와인', '포장마차', '막걸리', '위스키', '양주',
    '칵테일', '하이볼', '호프', '치맥', '생맥주', '병맥주'
  ],
  shopping: [
    '쇼핑', '옷', '신발', '쿠팡', '올리브영', '다이소', '무신사', '에이블리',
    '지그재그', '29CM', 'SSG', '롯데백화점', '현대백화점', '코스메틱',
    '화장품', '가방', '시계', '액세서리', '반지', '목걸이'
  ],
  entertainment: [
    '영화', '게임', '넷플릭스', '유튜브', '노래방', 'PC방', '피시방',
    'CGV', '롯데시네마', '메가박스', '왓챠', '디즈니플러스', '티빙',
    '스팀', '플레이스테이션', '닌텐도', '볼링', '당구', '스크린골프'
  ],
  health: [
    '병원', '약국', '약', '헬스', '필라테스', '요가', '운동', '짐',
    '피트니스', '크로스핏', '의료', '치과', '안과', '피부과', '한의원',
    '영양제', '비타민'
  ],
};

// 조사 및 불용어
const PARTICLES = [
  '에서', '에게', '한테', '께', '이랑', '하고', '과', '와',
  '이', '가', '을', '를', '의', '도', '만', '에', '로',
  '으로', '부터', '까지', '처럼', '같이', '보다', '으', '고'
];

const FILLER_WORDS = ['아니', '그냥', '좀', '막', '진짜', '완전', '엄청', '나', '내', '우리', '저', '제'];

export function mockParseTransaction(text: string): ParseResult | null {
  const lowerText = text.toLowerCase().trim();

  // 1. 금액 추출 (개선됨: "숫자 + 원" 패턴 우선)
  const amountWithWonMatch = text.match(/(\d{1,3}(?:,?\d{3})*)\s*원/);
  const amountOnlyMatch = !amountWithWonMatch ? text.match(/(\d{4,})\s*$/) : null;
  
  if (!amountWithWonMatch && !amountOnlyMatch) return null;

  let amountStr = '';
  if (amountWithWonMatch && amountWithWonMatch[1]) {
    amountStr = amountWithWonMatch[1];
  } else if (amountOnlyMatch && amountOnlyMatch[1]) {
    amountStr = amountOnlyMatch[1];
  }
  
  if (!amountStr) return null;
  
  const amount = parseInt(amountStr.replace(/,/g, ''), 10);
  if (isNaN(amount) || amount <= 0) return null;

  // 2. 수입/지출 판단 (개선됨: 강한/약한 키워드 분리)
  const hasStrongIncome = STRONG_INCOME_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword)
  );
  const hasWeakIncome = WEAK_INCOME_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword)
  ) && /받았.*\d|받음.*\d|받아.*\d|벌었.*\d|들어왔.*\d|\d.*받았|\d.*받음|\d.*받아|\d.*벌었|\d.*들어왔/.test(lowerText);

  const isIncome = hasStrongIncome || hasWeakIncome;
  const type: 'expense' | 'income' = isIncome ? 'income' : 'expense';

  // 3. 카테고리 추론
  let category = 'etc';
  let maxMatchCount = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter((keyword) =>
      lowerText.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      category = cat;
    }
  }

  // 4. 키워드 요약 (description 생성 - 개선됨)
  let description = text;

  // 4-1. 카테고리 키워드 매칭 우선 사용
  const matchedKeywords = CATEGORY_KEYWORDS[category]?.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  ) || [];

  if (matchedKeywords.length > 0) {
    // 가장 긴 키워드 사용 (더 구체적)
    description = matchedKeywords.sort((a, b) => b.length - a.length)[0];
  } else {
    // 키워드 매칭 없으면 원문 정리
    // 숫자와 "원" 제거
    description = description.replace(/(\d+(?:,\d{3})*)\s*원?/g, '').trim();

    // 수입 키워드 제거
    [...STRONG_INCOME_KEYWORDS, ...WEAK_INCOME_KEYWORDS].forEach((keyword) => {
      const regex = new RegExp(keyword, 'gi');
      description = description.replace(regex, '').trim();
    });

    // 불용어 제거 (띄어쓰기 고려)
    FILLER_WORDS.forEach((word) => {
      // 단어 앞뒤에 공백이나 시작/끝이 있는 경우
      const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'gi');
      description = description.replace(regex, ' ').trim();
    });

    // 조사 제거 (한글 특성: 붙어있는 경우도 처리)
    PARTICLES.forEach((particle) => {
      // 조사가 붙어있거나 띄어쓰기 후에 있는 경우 모두 제거
      const regex = new RegExp(`${particle}(?=\\s|$)`, 'g');
      description = description.replace(regex, ' ');
    });

    // 종결어미 제거
    description = description.replace(/[다요]\s*$/g, '');
    description = description.replace(/어요\s*$/g, '');
    description = description.replace(/았다\s*$/g, '');
    description = description.replace(/었다\s*$/g, '');

    // 연속 공백 제거
    description = description.replace(/\s+/g, ' ').trim();

    // description이 비어있으면 카테고리명 사용
    if (!description) {
      const categoryNames: Record<string, string> = {
        coffee: '커피',
        food: '식비',
        transport: '교통',
        drink: '술',
        shopping: '쇼핑',
        entertainment: '여가',
        health: '건강',
        etc: '기타',
      };
      description = categoryNames[category] || '기타';
    }

    // 너무 길면 자르기 (30자 제한)
    if (description.length > 30) {
      description = description.slice(0, 30) + '...';
    }
  }

  return {
    type,
    amount,
    category,
    description,
    confidence: maxMatchCount > 0 ? 0.8 : 0.5,
  };
}

// 카테고리별 이모지
export const categoryEmoji: Record<string, string> = {
  coffee: '☕',
  food: '🍚',
  transport: '🚕',
  drink: '🍺',
  shopping: '🛍️',
  entertainment: '🎮',
  health: '💊',
  etc: '💸',
};

// 카테고리 한글명
export const categoryNames: Record<string, string> = {
  coffee: '커피',
  food: '식비',
  transport: '교통',
  drink: '술',
  shopping: '쇼핑',
  entertainment: '여가',
  health: '건강',
  etc: '기타',
};
