import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './env';

export type UserIsland = {
  id: string;
  user_id: string;
  nickname: string;
  budget_limit: number;
  island_level: number;
  island_exp: number;
  current_streak: number;
  best_streak: number;
  total_saved_days: number;
  savings_rate: number;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
};

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!hasSupabase) {
    console.warn('[Supabase] Credentials not configured');
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }
  
  return supabaseClient;
}

// Supabase 사용 가능 여부
export const isSupabaseEnabled = hasSupabase;
