import { NextRequest, NextResponse } from 'next/server';
import { mockParseTransaction, type ParseResult } from '@/utils/mock-nlp';
import { env, isAILive } from '@/lib/env';

// Rate limiting (간단한 in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1분
    return true;
  }

  if (limit.count >= 20) {
    return false;
  }

  limit.count++;
  return true;
}

async function parseWithOpenAI(text: string): Promise<ParseResult | null> {
  if (!env.OPENAI_API_KEY) {
    console.error('[NLP API] OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a Korean financial transaction parser. Parse the user's input and return a JSON object with:
- type: "expense" or "income"
- amount: number (in KRW)
- category: one of [coffee, food, transport, drink, shopping, entertainment, health, etc]
- description: brief summary in Korean (max 30 chars)
- confidence: 0.0-1.0

If you can't parse, return null.`;

  const userPrompt = `Parse this Korean transaction: "${text}"`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('[NLP API] OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[NLP API] Empty response from OpenAI');
      return null;
    }

    const parsed = JSON.parse(content);
    console.log('[NLP API] OpenAI parsed:', parsed);

    return parsed as ParseResult;
  } catch (error) {
    console.error('[NLP API] OpenAI fetch error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    let result: ParseResult | null = null;

    if (isAILive) {
      console.log('[NLP API] Using OpenAI (live mode)');
      result = await parseWithOpenAI(text);
      
      // Fallback to mock if OpenAI fails
      if (!result) {
        console.log('[NLP API] OpenAI failed, falling back to mock');
        result = mockParseTransaction(text);
      }
    } else {
      console.log('[NLP API] Using mock parser');
      result = mockParseTransaction(text);
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Could not parse transaction', needs_clarification: true },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[NLP API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
