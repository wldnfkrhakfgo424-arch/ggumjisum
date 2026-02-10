'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Waves, TrendingDown, Users, BarChart3, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 50%, #4FC3F7 100%)',
            }}
          />
          
          {/* Floating islands background */}
          <motion.div
            className="absolute text-6xl opacity-20"
            style={{ top: '20%', left: '10%' }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🏝️
          </motion.div>
          <motion.div
            className="absolute text-5xl opacity-20"
            style={{ top: '60%', right: '15%' }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            ⛺
          </motion.div>
          <motion.div
            className="absolute text-4xl opacity-20"
            style={{ top: '40%', right: '25%' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          >
            🏕️
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-7xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏝️
            </motion.p>
            
            <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              거지섬
            </h1>
            
            <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              섬이 가라앉기 전에
            </p>
            <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              지출을 관리하세요!
            </p>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              게이미피케이션 × 일일 예산 트래커<br />
              지출할수록 섬이 물에 잠기는 시각적 경고로<br />
              <span className="font-bold text-blue-600">Gen Z의 소비 습관을 바꿉니다</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-xl px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-2xl"
                  onClick={() => router.push('/onboarding')}
                >
                  앱 시작하기
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  데모 보기
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-16 flex justify-center gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">5중</p>
                <p className="text-sm text-gray-600">경각심 시스템</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">10개</p>
                <p className="text-sm text-gray-600">핵심 기능</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">1일</p>
                <p className="text-sm text-gray-600">단위 예산</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-gray-400 text-sm">아래로 스크롤 ↓</p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-6">
              Gen Z는 왜 가계부를 안 쓸까?
            </h2>
            <p className="text-xl text-center text-gray-400 mb-16">
              숫자만 보여주는 앱으로는 절대 습관이 안 생깁니다
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '📅',
                  title: '월 단위는 감각이 없다',
                  desc: '30일 뒤는 너무 멀어요. 오늘 당장의 위기감이 필요합니다.',
                },
                {
                  icon: '😴',
                  title: '숫자만 보여주면 지루하다',
                  desc: '딱딱한 표와 그래프로는 사용자의 관심을 끌 수 없습니다.',
                },
                {
                  icon: '⚠️',
                  title: '위기감이 없어서 통제 실패',
                  desc: '숫자가 늘어나는 것만으로는 행동을 바꾸기 어렵습니다.',
                },
              ].map((problem, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <p className="text-6xl mb-4">{problem.icon}</p>
                  <h3 className="text-2xl font-bold mb-3">{problem.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{problem.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              해결책: Visual Loss Engine
            </h2>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              "내 섬이 가라앉는다" = 즉각적인 위기감
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              지출이 늘어날수록 섬이 실시간으로 물에 잠깁니다.<br />
              단순한 숫자가 아닌, <span className="font-bold text-blue-600">시각적 손실</span>로 직관적인 피드백을 제공합니다.
            </p>
          </motion.div>

          {/* Live Demo Preview */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/3] bg-gradient-to-b from-sky-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-8xl mb-4">🏝️</p>
                <p className="text-gray-600 text-lg">
                  지출할수록 섬이 물에 잠깁니다
                </p>
                <motion.div
                  className="mt-8 inline-block"
                  whileHover={{ scale: 1.1 }}
                >
                  <Button
                    size="lg"
                    onClick={() => router.push('/onboarding')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    실제 앱 체험하기
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - 5중 경각심 시스템 */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              5중 경각심 시스템
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              날씨, 파도, 경고등, HP바, 캐릭터까지<br />
              <span className="font-bold text-blue-600">5가지 시각적 피드백</span>으로 위기를 전달합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '☀️',
                title: '날씨 변화',
                desc: '맑음 → 흐림 → 폭풍 → 침몰',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: '🌊',
                title: '파도 출렁임',
                desc: '위험 구간에서 3배 빠르게',
                color: 'from-blue-400 to-cyan-500',
              },
              {
                icon: '⚠️',
                title: '경고 표시등',
                desc: '70% 초과 시 삼각형 경고 + 남은 시간',
                color: 'from-red-500 to-orange-500',
              },
              {
                icon: '❤️',
                title: 'HP 바',
                desc: '게임처럼 남은 예산 실시간 표시',
                color: 'from-pink-500 to-red-500',
              },
              {
                icon: '🌀',
                title: '캐릭터 휩쓸림',
                desc: '100% 초과 시 물에 쓸려 사라짐',
                color: 'from-purple-500 to-blue-500',
              },
              {
                icon: '📊',
                title: '시각적 피드백',
                desc: '물 높이, 색상, 애니메이션 동시 작동',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              10가지 핵심 기능
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              단순 가계부가 아닌, 게임같은 경험
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Waves className="w-8 h-8" />, title: 'Visual Loss', desc: '섬 가라앉기' },
              { icon: <TrendingDown className="w-8 h-8" />, title: 'NLP 입력', desc: '자연어 파싱' },
              { icon: '🏝️', title: '섬 진화', desc: '5단계 성장' },
              { icon: '🔥', title: '스트릭', desc: '연속 절약일' },
              { icon: <Users className="w-8 h-8" />, title: '소셜', desc: '이웃 섬 방문' },
              { icon: <BarChart3 className="w-8 h-8" />, title: '분석', desc: '주간/월간 차트' },
              { icon: '🎯', title: '퀴즈', desc: '복구 미션' },
              { icon: <Zap className="w-8 h-8" />, title: '실시간', desc: '동기화' },
              { icon: '🎮', title: '게임화', desc: '경험치/레벨' },
              { icon: <Globe className="w-8 h-8" />, title: 'PWA', desc: '앱 설치' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-center hover:bg-white/20 transition-all"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-4xl mb-3 flex justify-center">
                  {typeof feat.icon === 'string' ? feat.icon : feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              기술 스택
            </h2>
            <p className="text-xl text-gray-600">
              최신 기술로 구현한 고품질 앱
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Next.js', version: '16', color: 'bg-black' },
              { name: 'React', version: '19', color: 'bg-cyan-500' },
              { name: 'TypeScript', version: '5', color: 'bg-blue-600' },
              { name: 'Tailwind', version: '4', color: 'bg-sky-500' },
              { name: 'Framer Motion', version: '12', color: 'bg-pink-500' },
              { name: 'Supabase', version: '2', color: 'bg-green-600' },
              { name: 'Zustand', version: '5', color: 'bg-amber-600' },
              { name: 'Recharts', version: '3', color: 'bg-indigo-500' },
            ].map((tech, i) => (
              <motion.div
                key={i}
                className={`${tech.color} text-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <h3 className="text-xl font-bold mb-1">{tech.name}</h3>
                <p className="text-sm opacity-80">v{tech.version}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              이렇게 작동합니다
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: '자연어로 입력',
                desc: '"스타벅스 5000원" → AI가 자동 파싱',
                icon: '💬',
              },
              {
                step: '2',
                title: '섬이 실시간으로 잠김',
                desc: '지출 비율에 따라 물이 차오름',
                icon: '🌊',
              },
              {
                step: '3',
                title: '경고 시스템 작동',
                desc: '70%부터 날씨, 파도, 경고등, HP바',
                icon: '⚠️',
              },
              {
                step: '4',
                title: '100% 초과 시',
                desc: '캐릭터 휩쓸림 + 퀴즈로 복구',
                icon: '🆘',
              },
              {
                step: '5',
                title: '습관 형성',
                desc: '스트릭, 섬 진화, 이웃 방문',
                icon: '🎮',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-8 bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
                  {step.step}
                </div>
                <div className="flex-shrink-0 text-6xl">{step.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 text-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute text-9xl"
            style={{ top: '10%', left: '5%' }}
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🏝️
          </motion.div>
          <motion.div
            className="absolute text-8xl"
            style={{ bottom: '10%', right: '10%' }}
            animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            🌊
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-black mb-6">
            지금 바로 시작하세요!
          </h2>
          <p className="text-2xl mb-12 opacity-90">
            당신의 섬을 지켜보세요
          </p>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-2xl px-12 py-8 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
              onClick={() => router.push('/onboarding')}
            >
              앱 시작하기
              <ArrowRight className="ml-3 w-8 h-8" />
            </Button>
          </motion.div>

          <p className="mt-8 text-sm opacity-70">
            회원가입 없이 바로 시작 가능
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-3xl mb-4">🏝️ 거지섬</p>
          <p className="text-gray-400 mb-6">
            게이미피케이션 × 일일 예산 트래커
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Demo Video
            </a>
          </div>
          <p className="text-sm text-gray-600">
            2026 Hackathon Project
          </p>
        </div>
      </footer>
    </div>
  );
}
