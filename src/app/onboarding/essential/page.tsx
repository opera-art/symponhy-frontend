'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

interface FormData {
  companyName: string;
  segment: string;
  whatYouDo: string;
  socialNetworks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  idealClient: string;
  priorityProduct: string;
  communicationTone: string[];
  socialGoals: string[];
}

const questions = [
  {
    id: 'companyName',
    question: 'Qual o nome fantasia da sua empresa?',
    placeholder: 'Ex: Minha Marca',
    type: 'text',
  },
  {
    id: 'segment',
    question: 'Qual é o segmento específico da empresa?',
    placeholder: 'Ex: clínica de estética, consultoria financeira, agência de tráfego...',
    type: 'text',
  },
  {
    id: 'whatYouDo',
    question: 'O que sua empresa faz e para quem?',
    placeholder: 'Ex: Ajudamos pequenos empresários a organizarem suas finanças através de consultoria personalizada',
    type: 'textarea',
  },
  {
    id: 'socialNetworks',
    question: 'Quais são suas redes sociais?',
    type: 'socialLinks',
    placeholder: 'Cole os links das suas redes',
  },
  {
    id: 'idealClient',
    question: 'Descreva seu cliente ideal e suas maiores dores',
    placeholder: 'Ex: Donos de PMEs, 30-50 anos, que sofrem com fluxo de caixa desorganizado e não sabem precificar...',
    type: 'textarea',
  },
  {
    id: 'priorityProduct',
    question: 'Qual produto/serviço é PRIORIDADE para os próximos 90 dias?',
    placeholder: 'Ex: Consultoria de 3 meses - R$ 2.500 - inclui análise financeira completa + 4 reuniões mensais',
    type: 'textarea',
  },
  {
    id: 'communicationTone',
    question: 'Como você quer que sua marca soe?',
    type: 'multiselect',
    options: [
      { value: 'educativo', label: 'Educativo' },
      { value: 'inspirador', label: 'Inspirador' },
      { value: 'provocador', label: 'Provocador' },
      { value: 'tecnico', label: 'Técnico' },
      { value: 'humor', label: 'Com Humor' },
      { value: 'sofisticado', label: 'Sofisticado' },
      { value: 'popular', label: 'Popular' },
      { value: 'polemico', label: 'Polêmico' },
    ],
  },
  {
    id: 'socialGoals',
    question: 'Qual seu objetivo principal nas redes nos próximos 90 dias?',
    type: 'multiselect',
    options: [
      { value: 'autoridade', label: 'Autoridade' },
      { value: 'leads', label: 'Gerar Leads' },
      { value: 'vendas', label: 'Vendas Diretas' },
      { value: 'comunidade', label: 'Construir Comunidade' },
      { value: 'branding', label: 'Branding' },
    ],
  },
];

export default function EssentialBriefingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    segment: '',
    whatYouDo: '',
    socialNetworks: {
      instagram: '',
      tiktok: '',
      youtube: '',
      linkedin: '',
    },
    idealClient: '',
    priorityProduct: '',
    communicationTone: [],
    socialGoals: [],
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
    if (currentQuestion.id === 'socialNetworks') {
      const networks = value as FormData['socialNetworks'];
      // At least one social network should be filled
      return Object.values(networks).some(v => v && v.trim() !== '');
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return false;
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
            rows={3}
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

      case 'socialLinks':
        const socialData = formData.socialNetworks;
        const handleSocialChange = (network: keyof FormData['socialNetworks'], value: string) => {
          setFormData({
            ...formData,
            socialNetworks: {
              ...formData.socialNetworks,
              [network]: value,
            },
          });
        };
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <input
                type="url"
                value={socialData.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="instagram.com/suamarca"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">TT</span>
              </div>
              <input
                type="url"
                value={socialData.tiktok || ''}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                placeholder="tiktok.com/@suamarca"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">YT</span>
              </div>
              <input
                type="url"
                value={socialData.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="youtube.com/@suamarca"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">IN</span>
              </div>
              <input
                type="url"
                value={socialData.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="linkedin.com/company/suamarca"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none text-slate-800 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">Preencha pelo menos uma rede social</p>
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
              className="h-full bg-slate-900 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-xs text-slate-400">Briefing Essencial</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Oracle Sphere */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150" />
          <FloatingOracle size={120} />
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
