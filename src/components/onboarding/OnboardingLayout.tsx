'use client';

import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles, Crown, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Cores sofisticadas para progresso (dourado -> platina)
const getOracleColor = (progressPercent: number): string => {
  if (progressPercent < 20) return '#D4AF37';
  if (progressPercent < 40) return '#C9A227';
  if (progressPercent < 60) return '#B8A158';
  if (progressPercent < 80) return '#A8A8A8';
  if (progressPercent < 100) return '#C0C0C0';
  return '#E5E4E2';
};

// Tamanho da esfera - COMEÇA PEQUENA e CRESCE muito
const getOracleSize = (progressPercent: number): number => {
  const minSize = 120;  // Começa bem pequena
  const maxSize = 320;  // Fica grande no final
  const growth = Math.min(progressPercent / 100, 1);
  // Curva de crescimento exponencial suave
  const easedGrowth = Math.pow(growth, 0.7);
  return minSize + easedGrowth * (maxSize - minSize);
};

// Intensidade da esfera baseada no progresso (0-1)
const getOracleIntensity = (progressPercent: number): number => {
  return Math.min(progressPercent / 100, 1) * 0.8;
};

// Dicas contextuais por seção
const getSectionTips = (sectionTitle: string): string[] => {
  const tips: Record<string, string[]> = {
    'Dados Básicos': [
      'Informações precisas ajudam a criar conteúdo relevante.',
      'Seu segmento define o tom da comunicação.',
      'O faturamento ajuda a calibrar as estratégias.',
    ],
    'Redes Sociais': [
      'Cada plataforma tem sua linguagem.',
      'Links corretos facilitam a análise.',
      'Consistência entre canais fortalece a marca.',
    ],
    'Identidade': [
      'Sua história conecta com o público.',
      'Missão clara guia todo o conteúdo.',
      'Valores autênticos geram identificação.',
    ],
    'Oferta Principal': [
      'Foco em um produto maximiza resultados.',
      'Clareza na entrega reduz objeções.',
      'Provas sociais aceleram decisões.',
    ],
    'Cliente Ideal': [
      'Quanto mais específico, melhor.',
      'Dores reais geram conexão imediata.',
      'Frases do cliente viram headlines.',
    ],
    'Funil de Vendas': [
      'Conhecer seus números é poder.',
      'Gargalos identificados são oportunidades.',
      'FAQ vira conteúdo de alto impacto.',
    ],
    'Comunicação': [
      'Tom de voz é a personalidade da marca.',
      'Palavras proibidas evitam crises.',
      'Opiniões fortes geram engajamento.',
    ],
    'Conteúdo': [
      'Menos plataformas, mais profundidade.',
      'Consistência vence quantidade.',
      'CTAs claros convertem mais.',
    ],
    'Concorrência': [
      'Referências aceleram a criação.',
      'Diferenciais viram argumentos de venda.',
      'Saber o que evitar é tão importante quanto inspiração.',
    ],
    'Final': [
      'Detalhes extras fazem diferença.',
      'Restrições legais evitam problemas.',
      'Quase lá!',
    ],
  };
  return tips[sectionTitle] || ['Cada resposta fortalece sua estratégia.'];
};

// Mensagens motivacionais
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

// Confetti elegante
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

const triggerFinalConfetti = () => {
  const colors = ['#D4AF37', '#FFD700', '#E5E4E2', '#C0C0C0'];
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 45,
    colors,
    origin: { x: 0.5, y: 0.5 },
    gravity: 1,
    scalar: 1.1,
  });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 60, colors, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 40, angle: 120, spread: 60, colors, origin: { x: 1, y: 0.6 } });
  }, 200);
};

// Componente de partícula de texto flutuante
interface FloatingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

// Componente de Typing Effect
const TypingText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({
  text,
  speed = 30,
  onComplete,
}) => {
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
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

// Componente de Balão de Dica
const TipBubble: React.FC<{ tip: string; color: string; visible: boolean }> = ({ tip, color, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-in z-10">
      <div
        className="px-4 py-2 rounded-2xl text-sm font-medium text-white shadow-lg max-w-xs text-center"
        style={{ backgroundColor: color }}
      >
        {tip}
      </div>
      <div
        className="w-3 h-3 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"
        style={{ backgroundColor: color }}
      />
    </div>
  );
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
  onTyping?: (isTyping: boolean) => void;
  currentValue?: string;
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
  currentValue = '',
}) => {
  const [previousSection, setPreviousSection] = useState(currentSection);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const [buttonPulse, setButtonPulse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [floatingWords, setFloatingWords] = useState<FloatingWord[]>([]);
  const [questionKey, setQuestionKey] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wordIdRef = useRef(0);
  const lastValueRef = useRef('');
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Calcular progresso
  const completedQuestions = sections
    .slice(0, currentSection)
    .reduce((acc, s) => acc + s.questionCount, 0) + currentQuestion;
  const progressPercent = ((completedQuestions + 1) / totalQuestions) * 100;

  // Esfera dinâmica
  const oracleColor = getOracleColor(progressPercent);
  const oracleSize = getOracleSize(progressPercent);
  const oracleIntensity = getOracleIntensity(progressPercent);

  // Resetar typing effect quando muda a pergunta
  useEffect(() => {
    setQuestionKey(prev => prev + 1);
  }, [currentSection, currentQuestion]);

  // Detectar digitação e criar partículas de texto
  useEffect(() => {
    if (currentValue !== lastValueRef.current) {
      const newText = currentValue.slice(lastValueRef.current.length);

      if (newText.length > 0 && !newText.includes(' ')) {
        setIsTyping(true);

        // Limpar timeout anterior
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Parar de "ouvir" após 500ms sem digitar
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 500);
      }

      // Criar partícula de palavra quando termina uma palavra (espaço)
      if (newText.includes(' ') || newText.includes('\n')) {
        const words = lastValueRef.current.split(/\s+/);
        const lastWord = words[words.length - 1];

        if (lastWord && lastWord.length > 2) {
          const newWord: FloatingWord = {
            id: wordIdRef.current++,
            text: lastWord,
            x: 50 + (Math.random() - 0.5) * 40,
            y: 50,
            opacity: 1,
            scale: 1,
          };
          setFloatingWords(prev => [...prev.slice(-8), newWord]); // Máximo 8 palavras
        }
      }

      lastValueRef.current = currentValue;
    }
  }, [currentValue]);

  // Animar partículas flutuantes
  useEffect(() => {
    if (floatingWords.length === 0) return;

    const interval = setInterval(() => {
      setFloatingWords(prev =>
        prev
          .map(word => ({
            ...word,
            y: word.y - 1.5,
            opacity: word.opacity - 0.015,
            scale: word.scale * 0.995,
          }))
          .filter(word => word.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [floatingWords.length]);

  // Resetar quando muda de pergunta
  useEffect(() => {
    lastValueRef.current = '';
    setFloatingWords([]);
    setIsTyping(false);
  }, [currentSection, currentQuestion]);

  // Mostrar dica periodicamente
  useEffect(() => {
    const tips = getSectionTips(sectionTitle);
    let tipIndex = 0;

    const showNextTip = () => {
      setCurrentTip(tips[tipIndex % tips.length]);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3000);
      tipIndex++;
    };

    // Primeira dica após 2 segundos
    const initialTimeout = setTimeout(showNextTip, 2000);

    // Dicas subsequentes a cada 12 segundos
    const interval = setInterval(showNextTip, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [sectionTitle]);

  // Detectar mudança de seção
  useEffect(() => {
    if (currentSection !== previousSection && currentSection > previousSection) {
      triggerConfetti('medium');
      setMotivationText(getMotivationalMessage(progressPercent));
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 2500);
    }
    setPreviousSection(currentSection);
  }, [currentSection, previousSection, progressPercent]);

  // Enter para avançar
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      triggerButtonPulse();
      onNext();
    }
  }, [onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const triggerButtonPulse = () => {
    setButtonPulse(true);
    setTimeout(() => setButtonPulse(false), 300);
  };

  const handleNext = () => {
    triggerButtonPulse();
    if (isLastQuestion) {
      triggerFinalConfetti();
    }
    onNext();
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden"
      style={{ cursor: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\' fill=\'%23D4AF37\'>♪</text></svg>") 16 16, auto' }}
    >
      {/* Floating Words Particles */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {floatingWords.map(word => (
          <div
            key={word.id}
            className="absolute text-sm font-medium transition-none"
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              opacity: word.opacity,
              transform: `scale(${word.scale})`,
              color: oracleColor,
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm z-50 animate-fade-in">
          {error}
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
        {/* Oracle Sphere with Tip Bubble */}
        <div className="relative flex-shrink-0 mb-4">
          <TipBubble tip={currentTip} color={oracleColor} visible={showTip} />

          <div
            className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
            style={{
              backgroundColor: `${oracleColor}15`,
              transform: `scale(${1.5 + oracleIntensity * 0.3})`
            }}
          />
          <FloatingOracle
            size={oracleSize}
            color={oracleColor}
            intensity={oracleIntensity}
            isListening={isTyping}
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

        {/* Question with Typing Effect */}
        <div className="w-full max-w-2xl flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900 text-center mb-4 min-h-[2rem]">
            <TypingText key={questionKey} text={questionText} speed={25} />
          </h2>

          <div ref={inputContainerRef} className="mb-4">
            {children}
          </div>

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
              className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 ${
                buttonPulse ? 'scale-110 ring-4 ring-opacity-50' : 'scale-100'
              }`}
              style={{
                backgroundColor: oracleColor,
                color: progressPercent > 60 ? '#1e293b' : '#ffffff',
                // @ts-expect-error CSS variable for ring color
                '--tw-ring-color': oracleColor,
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

          <p className="text-center text-xs text-slate-400 mt-3">
            Campos opcionais podem ser pulados
          </p>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
