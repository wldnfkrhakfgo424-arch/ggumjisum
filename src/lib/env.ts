// Environment variable validation
export const env = {
  AI_MODE: process.env.NEXT_PUBLIC_AI_MODE || 'mock',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

export function validateEnv() {
  if (env.AI_MODE === 'live' && !env.OPENAI_API_KEY) {
    console.warn('[ENV] AI_MODE is live but OPENAI_API_KEY is missing');
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.warn('[ENV] Supabase credentials missing - using local storage fallback');
  }
}

export const isAILive = env.AI_MODE === 'live';
export const hasSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
