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

// Dicas contextuais
const getSectionTips = (sectionTitle: string): string[] => {
  const tips: Record<string, string[]> = {
    'Dados Básicos': ['Informações precisas criam conteúdo relevante.', 'Seu segmento define a comunicação.'],
    'Redes Sociais': ['Cada plataforma tem sua linguagem.', 'Links corretos facilitam a análise.'],
    'Identidade': ['Sua história conecta com o público.', 'Missão clara guia o conteúdo.'],
    'Oferta Principal': ['Foco em um produto maximiza resultados.', 'Provas sociais aceleram decisões.'],
    'Cliente Ideal': ['Quanto mais específico, melhor.', 'Frases do cliente viram headlines.'],
    'Funil de Vendas': ['Conhecer seus números é poder.', 'FAQ vira conteúdo de impacto.'],
    'Comunicação': ['Tom de voz é personalidade da marca.', 'Opiniões fortes geram engajamento.'],
    'Conteúdo': ['Menos plataformas, mais profundidade.', 'CTAs claros convertem mais.'],
    'Concorrência': ['Referências aceleram a criação.', 'Diferenciais viram argumentos de venda.'],
    'Final': ['Detalhes extras fazem diferença.', 'Quase lá!'],
  };
  return tips[sectionTitle] || ['Cada resposta fortalece sua estratégia.'];
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

// Tip Bubble com typing effect
const TipBubble: React.FC<{ tip: string; color: string; visible: boolean }> = ({ tip, color, visible }) => {
  const [displayedTip, setDisplayedTip] = useState('');

  useEffect(() => {
    if (visible) {
      setDisplayedTip('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < tip.length) {
          setDisplayedTip(tip.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [tip, visible]);

  if (!visible) return null;
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-in z-10">
      <div className="px-4 py-2 rounded-2xl text-sm font-medium text-white shadow-lg max-w-xs text-center" style={{ backgroundColor: color }}>
        {displayedTip}<span className="animate-pulse">|</span>
      </div>
      <div className="w-3 h-3 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" style={{ backgroundColor: color }} />
    </div>
  );
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
  sectionsWithComments?: number[]; // Índices das seções com comentários
  skippedSections?: number[]; // Índices das seções com perguntas puladas
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  type, currentSection, currentQuestion, totalSections, totalQuestions, sectionTitle, questionText,
  children, onNext, onBack, saving = false, loading = false, error = null, isLastQuestion = false,
  sections = [], currentValue = '', isRecording = false, onStopRecording,
  sectionsWithComments = [], skippedSections = [],
}) => {
  const [previousSection, setPreviousSection] = useState(currentSection);
  const [previousQuestion, setPreviousQuestion] = useState(currentQuestion);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const [buttonPulse, setButtonPulse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
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

  // Dicas
  useEffect(() => {
    const tips = getSectionTips(sectionTitle);
    let tipIndex = 0;
    const showNextTip = () => {
      setCurrentTip(tips[tipIndex % tips.length]);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 4000);
      tipIndex++;
    };
    const initialTimeout = setTimeout(showNextTip, 3000);
    const interval = setInterval(showNextTip, 18000);
    return () => { clearTimeout(initialTimeout); clearInterval(interval); };
  }, [sectionTitle]);

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

  // Enter
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isRecording) {
      if (document.activeElement?.tagName === 'TEXTAREA') return;
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
      className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden relative"
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

      {/* Header */}
      <header className="p-4 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              {type === 'complete' ? <Crown className="w-4 h-4 text-amber-400" /> : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            <span className="font-semibold text-slate-900">Symponhy</span>
            {type === 'complete' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Master</span>}
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </header>

      {/* Progress Bar - Creative dots design */}
      <div className="px-4 flex-shrink-0 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Dots progress - each dot is a question */}
          <div className="flex items-center justify-center gap-1 flex-wrap mb-2">
            {sections.map((section, sectionIdx) => {
              const sectionStart = sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.questionCount, 0);
              const hasComments = sectionsWithComments.includes(sectionIdx);
              const isCurrentSection = currentSection === sectionIdx;

              return (
                <div key={sectionIdx} className="flex items-center">
                  {/* Section dots */}
                  <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-full relative"
                    style={{
                      backgroundColor: isCurrentSection ? `${oracleColor}15` : 'transparent',
                      border: isCurrentSection ? `1px solid ${oracleColor}30` : '1px solid transparent'
                    }}
                    title={section.title}
                  >
                    {Array.from({ length: section.questionCount }).map((_, questionIdx) => {
                      const globalQuestionIdx = sectionStart + questionIdx;
                      const isAnswered = globalQuestionIdx < completedQuestions;
                      const isCurrent = sectionIdx === currentSection && questionIdx === currentQuestion;
                      const isPast = globalQuestionIdx < completedQuestions;
                      const isSkippedQuestion = skippedSections.includes(sectionIdx) && isPast;

                      let dotColor = '#e2e8f0'; // slate-200
                      let dotSize = 'w-1.5 h-1.5';
                      let extraClass = '';

                      if (isCurrent) {
                        dotColor = oracleColor;
                        dotSize = 'w-2.5 h-2.5';
                        extraClass = 'ring-2 ring-offset-1';
                      } else if (isSkippedQuestion && !isAnswered) {
                        dotColor = '#f87171'; // red-400
                        dotSize = 'w-1.5 h-1.5';
                      } else if (isPast) {
                        dotColor = '#1e293b'; // slate-900
                      }

                      return (
                        <div
                          key={questionIdx}
                          className={`${dotSize} rounded-full transition-all duration-300 ${extraClass}`}
                          style={{
                            backgroundColor: dotColor,
                            '--tw-ring-color': `${oracleColor}40`
                          } as React.CSSProperties}
                        />
                      );
                    })}
                    {/* Comment indicator */}
                    {hasComments && (
                      <div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white animate-pulse"
                        style={{ backgroundColor: oracleColor }}
                        title="Tem comentários"
                      />
                    )}
                  </div>
                  {/* Separator between sections */}
                  {sectionIdx < sections.length - 1 && (
                    <div className="w-3 h-px mx-0.5" style={{
                      backgroundColor: sectionIdx < currentSection ? '#1e293b' : '#e2e8f0'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Progress info */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{sectionTitle}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{completedQuestions + 1}/{totalQuestions}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${oracleColor}20`, color: oracleColor }}>
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-2 min-h-0 overflow-y-auto relative z-10">
        {/* Sphere Container with breathing */}
        <div
          className={`relative flex-shrink-0 mb-4 transition-all duration-300 ${isOverSphere ? 'scale-105' : ''}`}
          style={{ width: 320, height: 320 }}
          onDragOver={handleSphereDragOver}
          onDragLeave={handleSphereDragLeave}
          onDrop={handleSphereDrop}
        >
          <TipBubble tip={currentTip} color={oracleColor} visible={showTip} />
          {draggedItem && <div className={`absolute inset-0 rounded-full border-4 border-dashed transition-all ${isOverSphere ? 'border-amber-400 bg-amber-50/30' : 'border-slate-300'}`} />}
          <div className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000" style={{ backgroundColor: `${oracleColor}15`, transform: `scale(${1.2 + oracleIntensity * 0.2})` }} />
          {/* Sphere with breathing + scale */}
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700" style={{ transform: `scale(${oracleScale * breatheScale})` }}>
            <FloatingOracle size={280} color={oracleColor} intensity={oracleIntensity} isListening={isTyping || isOverSphere} />
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center mb-1 flex-shrink-0">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: oracleColor }}>{sectionTitle}</span>
        </div>

        {/* Question with 3D Transition */}
        <div className="w-full max-w-2xl flex-shrink-0" style={{ perspective: '1000px' }}>
          <div
            className="transition-all duration-300 ease-out"
            style={{ transform: getQuestionTransform(), transformStyle: 'preserve-3d', opacity: questionTransition === 'exit' ? 0 : 1 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 text-center mb-3 min-h-[1.75rem]">
              <TypingText key={questionKey} text={questionText} speed={20} />
            </h2>
          </div>

          <div className="mb-4">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { onDragStart: handleDragStart, onDragEnd: handleDragEnd, draggable: true });
              }
              return child;
            })}
          </div>

          {/* Navigation - sticky at bottom */}
          <div className="flex justify-between items-center sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2">
            <button onClick={onBack} className="px-5 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm">Anterior</button>
            <span className="text-xs text-slate-400">Enter para continuar</span>
            <button
              onClick={handleNext}
              disabled={saving}
              className={`px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all text-sm ${buttonPulse ? 'scale-110 ring-4 ring-opacity-50' : ''}`}
              style={{ backgroundColor: oracleColor, color: progressPercent > 60 ? '#1e293b' : '#fff', '--tw-ring-color': oracleColor } as React.CSSProperties}
            >
              {isLastQuestion ? <><Check className="w-4 h-4" /> Finalizar</> : <>Próxima <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
          {draggedItem && <p className="text-center text-xs text-amber-600 mt-2 animate-pulse">Arraste até a esfera</p>}
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
