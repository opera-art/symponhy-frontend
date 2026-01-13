'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles, Crown } from 'lucide-react';

interface FormData {
  companyName: string;
  segment: string;
  companyDescription: string;
  targetAudience: string;
  audienceAge: string;
  audienceLocation: string;
  audienceInterests: string;
  communicationTone: string;
  brandPersonality: string[];
  brandValues: string;
  socialGoals: string[];
  specificKPIs: string;
  competitors: string;
  differentiation: string;
  socialNetworks: string[];
  postFrequency: string;
  contentPillars: string;
  visualStyle: string;
  colorPreferences: string;
  hashtagStrategy: string;
  currentChallenges: string;
  additionalInfo: string;
}

const questions = [
  {
    id: 'companyName',
    question: 'Qual o nome da sua empresa ou marca?',
    placeholder: 'Ex: Minha Marca',
    type: 'text',
    section: 'Identidade',
  },
  {
    id: 'segment',
    question: 'Qual o segmento de atuação?',
    placeholder: 'Ex: Moda feminina, SaaS B2B, Restaurante...',
    type: 'text',
    section: 'Identidade',
  },
  {
    id: 'companyDescription',
    question: 'Descreva brevemente sua empresa e o que ela oferece',
    placeholder: 'Conte sobre seus produtos/serviços, diferenciais e proposta de valor...',
    type: 'textarea',
    section: 'Identidade',
  },
  {
    id: 'targetAudience',
    question: 'Descreva seu público-alvo ideal em detalhes',
    placeholder: 'Ex: Mulheres empreendedoras de 30-45 anos, com renda média-alta, interessadas em produtividade e crescimento pessoal...',
    type: 'textarea',
    section: 'Público',
  },
  {
    id: 'audienceAge',
    question: 'Qual a faixa etária predominante do seu público?',
    type: 'select',
    options: [
      { value: '18-24', label: '18-24 anos (Gen Z)' },
      { value: '25-34', label: '25-34 anos (Millennials)' },
      { value: '35-44', label: '35-44 anos' },
      { value: '45-54', label: '45-54 anos' },
      { value: '55+', label: '55+ anos' },
      { value: 'mixed', label: 'Público misto/variado' },
    ],
    section: 'Público',
  },
  {
    id: 'audienceLocation',
    question: 'Onde está localizado seu público?',
    placeholder: 'Ex: Brasil inteiro, São Paulo e região, Estados Unidos...',
    type: 'text',
    section: 'Público',
  },
  {
    id: 'audienceInterests',
    question: 'Quais são os principais interesses e comportamentos do seu público?',
    placeholder: 'Ex: Interessados em tecnologia, sustentabilidade, lifestyle saudável, investimentos...',
    type: 'textarea',
    section: 'Público',
  },
  {
    id: 'communicationTone',
    question: 'Como você gostaria que sua marca se comunicasse?',
    type: 'select',
    options: [
      { value: 'formal', label: 'Formal e Profissional' },
      { value: 'casual', label: 'Casual e Descontraído' },
      { value: 'friendly', label: 'Amigável e Próximo' },
      { value: 'inspirational', label: 'Inspirador e Motivacional' },
      { value: 'technical', label: 'Técnico e Educativo' },
      { value: 'humorous', label: 'Bem-humorado e Divertido' },
      { value: 'luxury', label: 'Sofisticado e Premium' },
    ],
    section: 'Marca',
  },
  {
    id: 'brandPersonality',
    question: 'Quais adjetivos melhor descrevem a personalidade da sua marca?',
    type: 'multiselect',
    options: [
      { value: 'innovative', label: 'Inovadora' },
      { value: 'trustworthy', label: 'Confiável' },
      { value: 'bold', label: 'Ousada' },
      { value: 'creative', label: 'Criativa' },
      { value: 'authentic', label: 'Autêntica' },
      { value: 'sustainable', label: 'Sustentável' },
      { value: 'accessible', label: 'Acessível' },
      { value: 'premium', label: 'Premium' },
    ],
    section: 'Marca',
  },
  {
    id: 'brandValues',
    question: 'Quais são os valores fundamentais da sua marca?',
    placeholder: 'Ex: Transparência, qualidade, inovação, sustentabilidade, excelência no atendimento...',
    type: 'textarea',
    section: 'Marca',
  },
  {
    id: 'socialGoals',
    question: 'Quais são seus principais objetivos nas redes sociais?',
    type: 'multiselect',
    options: [
      { value: 'awareness', label: 'Aumentar reconhecimento da marca' },
      { value: 'engagement', label: 'Aumentar engajamento' },
      { value: 'sales', label: 'Gerar vendas diretas' },
      { value: 'leads', label: 'Captar leads qualificados' },
      { value: 'community', label: 'Construir comunidade engajada' },
      { value: 'authority', label: 'Estabelecer autoridade no setor' },
      { value: 'traffic', label: 'Gerar tráfego para site/loja' },
      { value: 'retention', label: 'Fidelizar clientes existentes' },
    ],
    section: 'Objetivos',
  },
  {
    id: 'specificKPIs',
    question: 'Você tem metas específicas que gostaria de alcançar?',
    placeholder: 'Ex: Alcançar 10k seguidores em 6 meses, aumentar vendas em 30%, gerar 100 leads/mês...',
    type: 'textarea',
    section: 'Objetivos',
  },
  {
    id: 'competitors',
    question: 'Quais são seus principais concorrentes?',
    placeholder: 'Liste 3-5 concorrentes que você admira ou compete diretamente',
    type: 'textarea',
    section: 'Mercado',
  },
  {
    id: 'differentiation',
    question: 'O que diferencia sua marca dos concorrentes?',
    placeholder: 'Descreva seus diferenciais competitivos e por que clientes escolhem você...',
    type: 'textarea',
    section: 'Mercado',
  },
  {
    id: 'socialNetworks',
    question: 'Em quais redes sociais deseja atuar?',
    type: 'multiselect',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'twitter', label: 'X (Twitter)' },
      { value: 'pinterest', label: 'Pinterest' },
      { value: 'threads', label: 'Threads' },
    ],
    section: 'Estratégia',
  },
  {
    id: 'postFrequency',
    question: 'Qual frequência de postagens você deseja?',
    type: 'select',
    options: [
      { value: 'intensive', label: 'Intensiva (10+ por semana)' },
      { value: 'daily', label: 'Diária (7x por semana)' },
      { value: 'frequent', label: 'Frequente (4-5x por semana)' },
      { value: 'moderate', label: 'Moderada (2-3x por semana)' },
      { value: 'weekly', label: 'Semanal (1x por semana)' },
    ],
    section: 'Estratégia',
  },
  {
    id: 'contentPillars',
    question: 'Quais temas/pilares de conteúdo você gostaria de abordar?',
    placeholder: 'Ex: Dicas práticas, bastidores, depoimentos de clientes, tendências do setor, tutoriais...',
    type: 'textarea',
    section: 'Conteúdo',
  },
  {
    id: 'visualStyle',
    question: 'Qual estilo visual você prefere para seu conteúdo?',
    type: 'select',
    options: [
      { value: 'minimal', label: 'Minimalista e Clean' },
      { value: 'colorful', label: 'Colorido e Vibrante' },
      { value: 'elegant', label: 'Elegante e Sofisticado' },
      { value: 'modern', label: 'Moderno e Tech' },
      { value: 'organic', label: 'Orgânico e Natural' },
      { value: 'bold', label: 'Ousado e Impactante' },
      { value: 'classic', label: 'Clássico e Tradicional' },
    ],
    section: 'Conteúdo',
  },
  {
    id: 'colorPreferences',
    question: 'Quais cores representam sua marca?',
    placeholder: 'Ex: Azul marinho e dourado, cores neutras com toques de verde, tons terrosos...',
    type: 'text',
    section: 'Conteúdo',
  },
  {
    id: 'hashtagStrategy',
    question: 'Você já usa hashtags específicas ou tem alguma preferência?',
    placeholder: 'Ex: #SuaMarca, hashtags do setor, hashtags regionais...',
    type: 'text',
    section: 'Conteúdo',
  },
  {
    id: 'currentChallenges',
    question: 'Quais são seus maiores desafios atuais com redes sociais?',
    placeholder: 'Ex: Falta de consistência, baixo engajamento, dificuldade em criar conteúdo, não sei o que postar...',
    type: 'textarea',
    section: 'Extra',
  },
  {
    id: 'additionalInfo',
    question: 'Há algo mais que gostaria de compartilhar com nossa equipe?',
    placeholder: 'Informações adicionais, referências de contas que admira, expectativas específicas...',
    type: 'textarea',
    section: 'Extra',
  },
];

export default function CompleteBriefingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    segment: '',
    companyDescription: '',
    targetAudience: '',
    audienceAge: '',
    audienceLocation: '',
    audienceInterests: '',
    communicationTone: '',
    brandPersonality: [],
    brandValues: '',
    socialGoals: [],
    specificKPIs: '',
    competitors: '',
    differentiation: '',
    socialNetworks: [],
    postFrequency: '',
    contentPillars: '',
    visualStyle: '',
    colorPreferences: '',
    hashtagStrategy: '',
    currentChallenges: '',
    additionalInfo: '',
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and redirect
      console.log('Form submitted:', formData);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/onboarding');
    }
  };

  const handleInputChange = (value: string | string[]) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    });
  };

  const isCurrentStepValid = () => {
    const value = formData[currentQuestion.id as keyof FormData];
    // Allow skipping optional fields (last 2 questions)
    if (currentStep >= questions.length - 2) return true;

    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && value.trim() !== '';
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[currentQuestion.id as keyof FormData] as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 text-lg transition-colors"
            autoFocus
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[currentQuestion.id as keyof FormData] as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 text-lg transition-colors resize-none"
            autoFocus
          />
        );

      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange(option.value)}
                className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${
                  formData[currentQuestion.id as keyof FormData] === option.value
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'multiselect':
        const selectedValues = formData[currentQuestion.id as keyof FormData] as string[];
        return (
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const newValues = isSelected
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    handleInputChange(newValues);
                  }}
                  className={`px-4 py-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="w-4 h-4" />}
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Symponhy</span>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6">
        <div className="max-w-xl mx-auto">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Briefing Completo
            </span>
          </div>
        </div>
      </div>

      {/* Section Badge */}
      <div className="px-6 mt-4">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
            {currentQuestion.section}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Oracle Sphere */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl scale-150" />
          <FloatingOracle size={100} />
        </div>

        {/* Question */}
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-8">
            {currentQuestion.question}
          </h2>

          {/* Input */}
          <div className="mb-8">{renderInput()}</div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                isCurrentStepValid()
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? (
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
        </div>
      </main>
    </div>
  );
}
