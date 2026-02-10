-- 절약 팁 공유 테이블
CREATE TABLE IF NOT EXISTS island_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  tip_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_tips_to_user ON island_tips(to_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_created ON island_tips(created_at DESC);

-- RLS 정책 (해커톤용 느슨한 설정)
ALTER TABLE island_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tips"
  ON island_tips FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create tips"
  ON island_tips FOR INSERT
  WITH CHECK (true);

-- 더미 팁 데이터
INSERT INTO island_tips (from_user_id, to_user_id, tip_text) VALUES
  ('user-001', 'user-002', '커피를 텀블러에 담아가면 500원 할인받아요!'),
  ('user-003', 'user-002', '점심 도시락 싸가니 한 달에 30만원 절약됐어요 👍'),
  ('user-001', 'user-003', '자전거 출퇴근 시작하니 교통비가 0원!'),
  ('user-002', 'user-001', '무료 전시회 많이 가보세요. 문화생활 공짜로!');
