-- 꿈지섬 Supabase 테이블 설정 스크립트
-- Supabase Dashboard > SQL Editor에서 이 파일 내용 전체를 복사해서 실행하세요

-- 사용자 섬 데이터 테이블
CREATE TABLE user_islands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  budget_limit INTEGER NOT NULL,
  
  island_level INTEGER DEFAULT 0,
  island_exp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  
  total_saved_days INTEGER DEFAULT 0,
  savings_rate DECIMAL(5,2) DEFAULT 0,
  
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (리더보드 쿼리 최적화)
CREATE INDEX idx_savings_rate ON user_islands(savings_rate DESC);
CREATE INDEX idx_island_level ON user_islands(island_level DESC, island_exp DESC);
CREATE INDEX idx_best_streak ON user_islands(best_streak DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE user_islands ENABLE ROW LEVEL SECURITY;

-- 익명 앱이므로 모든 작업 허용 (해커톤용)
CREATE POLICY "Anyone can do anything"
  ON user_islands FOR ALL
  USING (true)
  WITH CHECK (true);

-- 테스트용 더미 데이터 추가
INSERT INTO user_islands (user_id, nickname, budget_limit, island_level, island_exp, current_streak, best_streak, total_saved_days, savings_rate)
VALUES
  ('test-user-1', '절약왕김철수', 500000, 4, 35, 10, 15, 35, 85.5),
  ('test-user-2', '아낀다맨', 400000, 3, 20, 7, 12, 20, 78.2),
  ('test-user-3', '부자되고싶어', 600000, 2, 10, 3, 8, 10, 65.0),
  ('test-user-4', '돈모으기', 300000, 1, 5, 2, 5, 5, 55.3);
