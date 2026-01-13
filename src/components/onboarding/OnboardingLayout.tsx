'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles, Crown, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Cores sofisticadas para progresso (dourado -> platina)
const getOracleColor = (progressPercent: number): string => {
  if (progressPercent < 20) return '#D4AF37';      // Dourado clássico
  if (progressPercent < 40) return '#C9A227';      // Dourado escuro
  if (progressPercent < 60) return '#B8A158';      // Dourado envelhecido
  if (progressPercent < 80) return '#A8A8A8';      // Prata
  if (progressPercent < 100) return '#C0C0C0';     // Prata clara
  return '#E5E4E2';                                 // Platina
};

// Tamanho da esfera baseado no progresso
const getOracleSize = (progressPercent: number): number => {
  const baseSize = 280;
  const growth = Math.min(progressPercent / 100, 1) * 40;
  return baseSize + growth;
};

// Mensagens motivacionais sofisticadas (sem emojis infantis)
const getMotivationalMessage = (progressPercent: number, sectionTitle: string): string => {
  if (progressPercent < 10) return 'Vamos construir algo extraordinário.';
  if (progressPercent < 25) return 'Cada detalhe importa.';
  if (progressPercent < 40) return 'Sua estratégia está tomando forma.';
  if (progressPercent < 55) return 'Excelente progresso.';
  if (progressPercent < 70) return 'A visão está se consolidando.';
  if (progressPercent < 85) return 'Quase no final.';
  if (progressPercent < 100) return 'Últimos ajustes.';
  return 'Briefing completo.';
};

// Confetti elegante (dourado/prata, não colorido)
const triggerConfetti = (intensity: 'low' | 'medium' | 'high' = 'medium') => {
  const colors = ['#D4AF37', '#C9A227', '#B8860B', '#E5E4E2', '#C0C0C0'];

  const configs = {
    low: { particleCount: 30, spread: 50, startVelocity: 20 },
    medium: { particleCount: 60, spread: 70, startVelocity: 30 },
    high: { particleCount: 100, spread: 100, startVelocity: 40 },
  };

  const config = configs[intensity];

  confetti({
    particleCount: config.particleCount,
    spread: config.spread,
    startVelocity: config.startVelocity,
    colors,
    origin: { y: 0.6 },
    gravity: 1.2,
    scalar: 0.9,
    ticks: 150,
    disableForReducedMotion: true,
  });
};

// Confetti de conclusão final
const triggerFinalConfetti = () => {
  const colors = ['#D4AF37', '#FFD700', '#E5E4E2', '#C0C0C0'];

  // Explosão central
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 45,
    colors,
    origin: { x: 0.5, y: 0.5 },
    gravity: 1,
    scalar: 1.1,
  });

  // Laterais
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 60,
      colors,
      origin: { x: 0, y: 0.6 },
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 60,
      colors,
      origin: { x: 1, y: 0.6 },
    });
  }, 200);
};

interface Section {
  title: string;
  questionCount: number;
}

interface OnboardingLayoutProps {
  type: 'essential' | 'complete';
  currentSection: number;
  currentQuestion: number;
  totalSections: number;
  totalQuestions: number;
  sectionTitle: string;
  questionText: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  saving?: boolean;
  loading?: boolean;
  error?: string | null;
  isLastQuestion?: boolean;
  sections?: Section[];
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  type,
  currentSection,
  currentQuestion,
  totalSections,
  totalQuestions,
  sectionTitle,
  questionText,
  children,
  onNext,
  onBack,
  saving = false,
  loading = false,
  error = null,
  isLastQuestion = false,
  sections = [],
}) => {
  const [previousSection, setPreviousSection] = useState(currentSection);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Calcular progresso
  const completedQuestions = sections
    .slice(0, currentSection)
    .reduce((acc, s) => acc + s.questionCount, 0) + currentQuestion;
  const progressPercent = ((completedQuestions + 1) / totalQuestions) * 100;

  // Esfera dinâmica
  const oracleColor = getOracleColor(progressPercent);
  const oracleSize = getOracleSize(progressPercent);

  // Detectar mudança de seção
  useEffect(() => {
    if (currentSection !== previousSection && currentSection > previousSection) {
      // Seção completada - confetti
      triggerConfetti('medium');

      // Mostrar mensagem motivacional
      setMotivationText(getMotivationalMessage(progressPercent, sectionTitle));
      setShowMotivation(true);

      setTimeout(() => setShowMotivation(false), 2500);
    }
    setPreviousSection(currentSection);
  }, [currentSection, previousSection, progressPercent, sectionTitle]);

  // Enter para avançar
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Não avançar se estiver em textarea
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      onNext();
    }
  }, [onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Confetti final
  const handleNext = () => {
    if (isLastQuestion) {
      triggerFinalConfetti();
    }
    onNext();
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm z-50 animate-fade-in">
          {error}
        </div>
      )}

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed top-4 left-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-50">
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </div>
      )}

      {/* Motivational Message */}
      {showMotivation && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-up">
          <div className="bg-slate-900/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl shadow-2xl">
            <p className="text-lg font-medium text-center">{motivationText}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              {type === 'complete' ? (
                <Crown className="w-4 h-4 text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-semibold text-slate-900">Symponhy</span>
            {type === 'complete' && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Master
              </span>
            )}
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="px-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Checkpoints */}
          <div className="relative mb-2">
            <div className="flex justify-between">
              {sections.map((section, idx) => {
                const sectionStart = sections
                  .slice(0, idx)
                  .reduce((acc, s) => acc + s.questionCount, 0);
                const sectionEnd = sectionStart + section.questionCount;
                const isCompleted = completedQuestions >= sectionEnd;
                const isCurrent = currentSection === idx;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      sections.length > 6 ? 'w-4' : 'w-8'
                    }`}
                    title={section.title}
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-slate-900 scale-100'
                          : isCurrent
                          ? 'bg-amber-500 scale-125 ring-4 ring-amber-100'
                          : 'bg-slate-200 scale-75'
                      }`}
                    />
                    {sections.length <= 6 && (
                      <span className={`text-[9px] mt-1 text-center leading-tight ${
                        isCurrent ? 'text-amber-600 font-medium' : 'text-slate-400'
                      }`}>
                        {section.title.length > 12
                          ? section.title.slice(0, 10) + '...'
                          : section.title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${oracleColor}, ${getOracleColor(progressPercent + 20)})`
                }}
              />
            </div>

            {/* XP Label */}
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-slate-400">
                {completedQuestions + 1} de {totalQuestions}
              </span>
              <span className="text-xs font-medium" style={{ color: oracleColor }}>
                {Math.round(progressPercent)}% XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 min-h-0">
        {/* Oracle Sphere */}
        <div className="relative flex-shrink-0 mb-4">
          <div
            className="absolute inset-0 rounded-full blur-3xl scale-150 transition-colors duration-1000"
            style={{ backgroundColor: `${oracleColor}15` }}
          />
          <FloatingOracle
            size={oracleSize}
            color={oracleColor}
          />
        </div>

        {/* Section Title */}
        <div className="text-center mb-2 flex-shrink-0">
          <span
            className="text-xs font-medium uppercase tracking-wider transition-colors duration-500"
            style={{ color: oracleColor }}
          >
            {sectionTitle}
          </span>
        </div>

        {/* Question */}
        <div className="w-full max-w-2xl flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900 text-center mb-4">
            {questionText}
          </h2>

          {/* Input Container */}
          <div ref={inputContainerRef} className="mb-4">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Anterior
            </button>

            <span className="text-xs text-slate-400">
              Pressione Enter para continuar
            </span>

            <button
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              style={{
                backgroundColor: oracleColor,
                color: progressPercent > 60 ? '#1e293b' : '#ffffff'
              }}
            >
              {isLastQuestion ? (
                <>
                  Finalizar
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Skip hint */}
          <p className="text-center text-xs text-slate-400 mt-3">
            Campos opcionais podem ser pulados
          </p>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
