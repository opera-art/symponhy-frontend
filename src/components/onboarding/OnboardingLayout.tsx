'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles, Crown, Loader2, Square } from 'lucide-react';
import confetti from 'canvas-confetti';

// Cores para progresso - sempre tons dourados (sem cinza)
const getOracleColor = (progressPercent: number): string => {
  if (progressPercent < 20) return '#D4AF37';  // Dourado clássico
  if (progressPercent < 40) return '#DAA520';  // Goldenrod
  if (progressPercent < 60) return '#F4C430';  // Safron gold
  if (progressPercent < 80) return '#FFD700';  // Gold puro
  if (progressPercent < 100) return '#FFDF00'; // Golden yellow
  return '#FFE55C';                             // Light gold
};

// Escala visual da esfera
const getOracleScale = (progressPercent: number): number => {
  const minScale = 0.6;
  const maxScale = 1.3;
  const growth = Math.min(progressPercent / 100, 1);
  return minScale + Math.pow(growth, 0.7) * (maxScale - minScale);
};

// Intensidade
const getOracleIntensity = (progressPercent: number): number => {
  return Math.min(progressPercent / 100, 1) * 0.8;
};

const getMotivationalMessage = (progressPercent: number): string => {
  if (progressPercent < 10) return 'Vamos construir algo extraordinário.';
  if (progressPercent < 25) return 'Cada detalhe importa.';
  if (progressPercent < 40) return 'Sua estratégia está tomando forma.';
  if (progressPercent < 55) return 'Excelente progresso.';
  if (progressPercent < 70) return 'A visão está se consolidando.';
  if (progressPercent < 85) return 'Quase no final.';
  if (progressPercent < 100) return 'Últimos ajustes.';
  return 'Briefing completo.';
};

const triggerConfetti = (intensity: 'low' | 'medium' | 'high' = 'medium') => {
  const colors = ['#D4AF37', '#C9A227', '#B8860B', '#E5E4E2', '#C0C0C0'];
  const configs = { low: { particleCount: 30, spread: 50 }, medium: { particleCount: 60, spread: 70 }, high: { particleCount: 100, spread: 100 } };
  confetti({ ...configs[intensity], colors, origin: { y: 0.6 }, gravity: 1.2, scalar: 0.9, ticks: 150 });
};

const triggerFinalConfetti = () => {
  const colors = ['#D4AF37', '#FFD700', '#E5E4E2', '#C0C0C0'];
  confetti({ particleCount: 80, spread: 100, colors, origin: { x: 0.5, y: 0.5 }, gravity: 1, scalar: 1.1 });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 60, colors, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 40, angle: 120, spread: 60, colors, origin: { x: 1, y: 0.6 } });
  }, 200);
};

const triggerAbsorbEffect = (color: string) => {
  confetti({ particleCount: 20, spread: 360, startVelocity: 10, colors: [color, '#fff'], origin: { x: 0.5, y: 0.35 }, gravity: 0.3, scalar: 0.6, ticks: 80 });
};

// Typing Effect com cursor
const TypingText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 25 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="transition-all">{displayedText}{!isComplete && <span className="animate-pulse text-amber-500">|</span>}</span>;
};

// Parallax Background Layer
const ParallaxLayer: React.FC<{ depth: number; color: string; mouseX: number; mouseY: number }> = ({ depth, color, mouseX, mouseY }) => {
  const x = mouseX * depth * 30;
  const y = mouseY * depth * 30;
  return (
    <div
      className="absolute rounded-full blur-3xl opacity-20 transition-transform duration-300 ease-out"
      style={{
        width: `${300 + depth * 200}px`,
        height: `${300 + depth * 200}px`,
        backgroundColor: color,
        left: `${20 + depth * 15}%`,
        top: `${10 + depth * 20}%`,
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
};

// Animated Gradient Mesh Background
const GradientMesh: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[800px] h-[800px] -top-[400px] -left-[200px] rounded-full blur-3xl animate-breathe"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }}
      />
      <div
        className="absolute w-[600px] h-[600px] -bottom-[300px] -right-[100px] rounded-full blur-3xl animate-breathe-delayed"
        style={{ background: `radial-gradient(circle, ${color}10 0%, transparent 70%)` }}
      />
      <div
        className="absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-breathe-slow"
        style={{ background: `radial-gradient(circle, ${color}08 0%, transparent 60%)` }}
      />
    </div>
  );
};

interface Section { title: string; questionCount: number; }

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
  currentValue?: string;
  isRecording?: boolean;
  onStopRecording?: () => void;
  questionsWithComments?: string[]; // IDs das perguntas com comentários
  skippedQuestions?: number[]; // Índices globais das perguntas puladas
  maxProgress?: number; // Progresso máximo alcançado (para manter dots escuros ao voltar)
  onNavigateToQuestion?: (sectionIdx: number, questionIdx: number) => void; // Callback para navegar
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  type, currentSection, currentQuestion, totalSections, totalQuestions, sectionTitle, questionText,
  children, onNext, onBack, saving = false, loading = false, error = null, isLastQuestion = false,
  sections = [], currentValue = '', isRecording = false, onStopRecording,
  questionsWithComments = [], skippedQuestions = [], maxProgress = 0, onNavigateToQuestion,
}) => {
  const [previousSection, setPreviousSection] = useState(currentSection);
  const [previousQuestion, setPreviousQuestion] = useState(currentQuestion);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const [buttonPulse, setButtonPulse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isOverSphere, setIsOverSphere] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [questionTransition, setQuestionTransition] = useState<'enter' | 'exit' | 'idle'>('idle');
  const [breatheScale, setBreatheScale] = useState(1);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Progresso
  const completedQuestions = sections.slice(0, currentSection).reduce((acc, s) => acc + s.questionCount, 0) + currentQuestion;
  const progressPercent = ((completedQuestions + 1) / totalQuestions) * 100;

  // Esfera dinâmica
  const oracleColor = getOracleColor(progressPercent);
  const oracleScale = getOracleScale(progressPercent);
  const oracleIntensity = getOracleIntensity(progressPercent);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Esfera respirando
  useEffect(() => {
    const breatheInterval = setInterval(() => {
      setBreatheScale(prev => {
        const time = Date.now() / 1000;
        return 1 + Math.sin(time * 0.8) * 0.03;
      });
    }, 50);
    return () => clearInterval(breatheInterval);
  }, []);

  // 3D Transition on question change
  useEffect(() => {
    if (currentQuestion !== previousQuestion || currentSection !== previousSection) {
      setQuestionTransition('exit');
      setTimeout(() => {
        setQuestionKey(prev => prev + 1);
        setQuestionTransition('enter');
        setTimeout(() => setQuestionTransition('idle'), 400);
      }, 200);
    }
    setPreviousQuestion(currentQuestion);
  }, [currentSection, currentQuestion, previousQuestion, previousSection]);

  // Detectar digitação
  useEffect(() => {
    if (currentValue) {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
    }
  }, [currentValue]);

  // Resetar estado ao mudar de pergunta
  useEffect(() => {
    setIsTyping(false);
  }, [currentSection, currentQuestion]);

  // Mudança de seção
  useEffect(() => {
    if (currentSection !== previousSection && currentSection > previousSection) {
      triggerConfetti('medium');
      setMotivationText(getMotivationalMessage(progressPercent));
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 2500);
    }
    setPreviousSection(currentSection);
  }, [currentSection, previousSection, progressPercent]);

  // Enter - só avança se não estiver em input/textarea
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isRecording) {
      const tag = document.activeElement?.tagName;
      // Ignora se estiver em textarea ou input (ex: campo de comentário)
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      e.preventDefault();
      triggerButtonPulse();
      onNext();
    }
  }, [onNext, isRecording]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const triggerButtonPulse = () => { setButtonPulse(true); setTimeout(() => setButtonPulse(false), 300); };
  const handleNext = () => { triggerButtonPulse(); if (isLastQuestion) triggerFinalConfetti(); onNext(); };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, value: string) => { setDraggedItem(value); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragEnd = () => { setDraggedItem(null); setIsOverSphere(false); };
  const handleSphereDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsOverSphere(true); };
  const handleSphereDragLeave = () => setIsOverSphere(false);
  const handleSphereDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverSphere(false);
    if (draggedItem) {
      triggerAbsorbEffect(oracleColor);
      window.dispatchEvent(new CustomEvent('sphereAbsorb', { detail: { value: draggedItem } }));
    }
    setDraggedItem(null);
  };

  // Get 3D transform for question
  const getQuestionTransform = () => {
    switch (questionTransition) {
      case 'exit': return 'rotateY(-90deg) scale(0.8)';
      case 'enter': return 'rotateY(0deg) scale(1)';
      default: return 'rotateY(0deg) scale(1)';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500">Carregando...</p>
      </div>
    );
  }

  // RECORDING MODE - Esfera no centro da tela
  if (isRecording) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Gradient mesh de fundo */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-gradient-radial from-slate-800 to-slate-900" />
          <div className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse" style={{ background: `radial-gradient(circle, ${oracleColor}30 0%, transparent 70%)` }} />
        </div>

        {/* Ondas de áudio */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="absolute rounded-full border-2 animate-ping"
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                borderColor: `${oracleColor}${40 - i * 8}`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>

        {/* Esfera grande no centro */}
        <div className="relative z-10" style={{ transform: `scale(${1.5 + breatheScale * 0.1})` }}>
          <FloatingOracle size={280} color={oracleColor} intensity={1} isListening={true} />
        </div>

        {/* Texto */}
        <p className="text-white/80 text-lg mt-8 z-10 animate-pulse">Estou ouvindo...</p>

        {/* Botão parar */}
        <button
          onClick={onStopRecording}
          className="mt-8 z-10 flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-all hover:scale-105 shadow-lg shadow-red-500/30"
        >
          <Square className="w-5 h-5 fill-current" />
          Parar Gravação
        </button>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden relative max-w-full"
    >
      {/* Animated Gradient Mesh Background */}
      <GradientMesh color={oracleColor} />

      {/* Parallax Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParallaxLayer depth={0.2} color={oracleColor} mouseX={mousePos.x} mouseY={mousePos.y} />
        <ParallaxLayer depth={0.5} color="#D4AF37" mouseX={mousePos.x} mouseY={mousePos.y} />
        <ParallaxLayer depth={0.8} color="#C0C0C0" mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>


      {/* Error */}
      {error && <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm z-50 animate-fade-in">{error}</div>}

      {/* Motivation */}
      {showMotivation && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-up">
          <div className="bg-slate-900/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl shadow-2xl">
            <p className="text-lg font-medium text-center">{motivationText}</p>
          </div>
        </div>
      )}

      {/* Header - apenas logo */}
      <header className="p-3 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-center max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              {type === 'complete' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="font-semibold text-slate-800 text-sm">Symponhy</span>
            {type === 'complete' && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">Master</span>}
          </div>
        </div>
      </header>

      {/* Progress Bar - Compact Luxury Design */}
      <div className="px-4 flex-shrink-0 relative z-10 py-2">
        <div className="max-w-3xl mx-auto">
          {/* Minimal glass container */}
          <div className="relative px-3 py-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm overflow-hidden">
            {/* Subtle shimmer */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(120deg, transparent 40%, ${oracleColor}15 50%, transparent 60%)`,
                animation: 'shimmer 4s ease-in-out infinite',
              }}
            />

            {/* Progress dots with section indicators */}
            <div className="relative flex items-center justify-between gap-0.5">
              {sections.map((section, sectionIdx) => {
                const sectionStart = sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.questionCount, 0);
                const isCurrentSection = sectionIdx === currentSection;
                const isFutureSection = sectionIdx > currentSection;
                const isPastSection = sectionIdx < currentSection;

                return (
                  <div key={sectionIdx} className="flex-1 relative group">
                    {/* Section indicator - shows on hover or current */}
                    <div className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity ${isCurrentSection ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}>
                      <span
                        className="text-[8px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: isCurrentSection ? oracleColor : '#64748b',
                          backgroundColor: isCurrentSection ? `${oracleColor}10` : 'transparent',
                        }}
                      >
                        {section.title}
                      </span>
                    </div>

                    {/* Question dots - minimal */}
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: section.questionCount }).map((_, questionIdx) => {
                        const globalIdx = sectionStart + questionIdx;
                        const isCurrent = sectionIdx === currentSection && questionIdx === currentQuestion;
                        // Usa maxProgress para manter dots escuros mesmo quando volta
                        const isPast = globalIdx < Math.max(completedQuestions, maxProgress);
                        const isSkipped = skippedQuestions.includes(globalIdx);
                        // Permite navegar para qualquer pergunta já passada (não só puladas)
                        const canNavigate = (isPast || isSkipped) && !isCurrent && onNavigateToQuestion;

                        // Dot styling - maior para facilitar clique
                        let dotSize = isCurrent ? 'w-3 h-3' : 'w-2 h-2';
                        let dotBg = '';
                        let dotShadow = '';

                        if (isCurrent) {
                          dotBg = oracleColor;
                          dotShadow = `0 0 8px ${oracleColor}60`;
                        } else if (isSkipped) {
                          dotBg = '#ef4444';
                          dotShadow = '0 0 4px rgba(239,68,68,0.4)';
                          dotSize = 'w-2.5 h-2.5';
                        } else if (isPast) {
                          dotBg = '#22c55e'; // Verde para respondidas
                        } else {
                          dotBg = '#e2e8f0';
                        }

                        const handleDotClick = () => {
                          if (canNavigate && onNavigateToQuestion) {
                            onNavigateToQuestion(sectionIdx, questionIdx);
                          }
                        };

                        return (
                          <button
                            key={questionIdx}
                            type="button"
                            onClick={handleDotClick}
                            className={`${dotSize} rounded-full transition-all duration-200 ${canNavigate ? 'cursor-pointer hover:scale-150 hover:opacity-80' : 'cursor-default'}`}
                            style={{
                              backgroundColor: dotBg,
                              boxShadow: dotShadow,
                            }}
                            title={canNavigate ? `Voltar para: ${section.title} - Pergunta ${questionIdx + 1}` : undefined}
                          />
                        );
                      })}
                    </div>

                    {/* Section divider */}
                    {sectionIdx < sections.length - 1 && (
                      <div
                        className="absolute top-1/2 -right-0.5 w-1 h-px"
                        style={{
                          backgroundColor: isPastSection ? oracleColor : '#e2e8f0',
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Minimal info bar */}
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-100/30">
              <span className="text-[10px] text-slate-400">
                {completedQuestions + 1}/{totalQuestions}
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: oracleColor }}
              >
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-2 min-h-0 relative z-10 overflow-x-hidden overflow-y-hidden">
        {/* Sphere Container - Maior */}
        <div
          className={`relative flex-shrink-0 mb-2 transition-all duration-300 ${isOverSphere ? 'scale-105' : ''}`}
          style={{ width: 300, height: 300 }}
          onDragOver={handleSphereDragOver}
          onDragLeave={handleSphereDragLeave}
          onDrop={handleSphereDrop}
        >
          {draggedItem && <div className={`absolute inset-0 rounded-full border-4 border-dashed transition-all ${isOverSphere ? 'border-amber-400 bg-amber-50/30' : 'border-slate-300'}`} />}
          <div className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000" style={{ backgroundColor: `${oracleColor}15`, transform: `scale(${1.2 + oracleIntensity * 0.2})` }} />
          {/* Sphere with breathing + scale */}
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700" style={{ transform: `scale(${oracleScale * breatheScale})` }}>
            <FloatingOracle size={280} color={oracleColor} intensity={oracleIntensity} isListening={isTyping || isOverSphere} />
          </div>
        </div>

        {/* Question with 3D Transition */}
        <div className="w-full max-w-2xl flex-1 flex flex-col min-h-0 overflow-hidden" style={{ perspective: '1000px' }}>
          <div
            className="transition-all duration-300 ease-out flex-shrink-0"
            style={{ transform: getQuestionTransform(), transformStyle: 'preserve-3d', opacity: questionTransition === 'exit' ? 0 : 1 }}
          >
            <h2 className="text-base font-semibold text-slate-900 text-center mb-2 min-h-[1.5rem]">
              <TypingText key={questionKey} text={questionText} speed={20} />
            </h2>
          </div>

          {/* Área de conteúdo com scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto pb-16 scrollbar-hide">
            {children}
          </div>

          {/* Navigation - fixo no fundo */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-gradient-to-t from-white via-white to-transparent">
            <button onClick={onBack} className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors text-sm">Anterior</button>
            <span className="text-[10px] text-slate-400">Enter ↵</span>
            <button
              onClick={handleNext}
              disabled={saving}
              className={`px-4 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all text-sm ${buttonPulse ? 'scale-110 ring-4 ring-opacity-50' : ''}`}
              style={{ backgroundColor: oracleColor, color: progressPercent > 60 ? '#1e293b' : '#fff', '--tw-ring-color': oracleColor } as React.CSSProperties}
            >
              {isLastQuestion ? <><Check className="w-3.5 h-3.5" /> Finalizar</> : <>Próxima <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
