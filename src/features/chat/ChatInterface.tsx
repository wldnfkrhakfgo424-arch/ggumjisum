'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { categoryEmoji } from '@/utils/mock-nlp';

interface Message {
  id: string;
  type: 'user' | 'system' | 'income' | 'expense';
  text: string;
  transaction?: {
    type: 'expense' | 'income';
    amount: number;
    category: string;
    description: string;
  };
}

interface ChatInterfaceProps {
  onClose?: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps = {}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'system',
      text: '안녕! 오늘 얼마 썼어? 💬',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addTransaction, isLoading, setLoading, island_status } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || island_status === 'sunk') return;

    const userInput = input.trim();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      text: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // API 호출
      const response = await fetch('/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) {
        throw new Error('Parse failed');
      }

      const parsed = await response.json();

      if (parsed.error || parsed.needs_clarification) {
        const systemMessage: Message = {
          id: crypto.randomUUID(),
          type: 'system',
          text: '🤔 금액을 이해하지 못했어. "스타벅스 5000원" 처럼 말해줘!',
        };
        setMessages((prev) => [...prev, systemMessage]);
        setLoading(false);
        return;
      }

      // 트랜잭션 추가
      addTransaction({
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        original_input: userInput,
      });

      const emoji = categoryEmoji[parsed.category] || '💸';
      const prefix = parsed.type === 'income' ? '+' : '-';
      const systemMessage: Message = {
        id: crypto.randomUUID(),
        type: parsed.type === 'income' ? 'income' : 'expense',
        text: `${emoji} ${parsed.description} ${prefix}${parsed.amount.toLocaleString()}원 기록했어!`,
        transaction: parsed,
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error('Parse error:', error);
      const systemMessage: Message = {
        id: crypto.randomUUID(),
        type: 'system',
        text: '⚠️ 오류가 발생했어. 다시 시도해줘!',
      };
      setMessages((prev) => [...prev, systemMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-64 bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : msg.type === 'income'
                    ? 'bg-green-100 text-green-800 rounded-bl-md border-2 border-green-500'
                    : msg.type === 'expense'
                    ? 'bg-red-50 text-red-800 rounded-bl-md border-2 border-red-300'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={island_status === 'sunk' ? '퀴즈를 먼저 풀어주세요!' : '스타벅스 5000원'}
            disabled={isLoading || island_status === 'sunk'}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || island_status === 'sunk'}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
