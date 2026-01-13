'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

interface FormData {
  companyName: string;
  segment: string;
  targetAudience: string;
  communicationTone: string;
  socialGoals: string[];
  competitors: string;
  socialNetworks: string[];
  postFrequency: string;
}

const questions = [
  {
    id: 'companyName',
    question: 'Qual o nome da sua empresa ou marca?',
    placeholder: 'Ex: Minha Marca',
    type: 'text',
  },
  {
    id: 'segment',
    question: 'Qual o segmento de atuação?',
    placeholder: 'Ex: Moda, Tecnologia, Alimentação...',
    type: 'text',
  },
  {
    id: 'targetAudience',
    question: 'Quem é seu público-alvo principal?',
    placeholder: 'Ex: Mulheres de 25-35 anos interessadas em moda sustentável',
    type: 'textarea',
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
    ],
  },
  {
    id: 'socialGoals',
    question: 'Quais são seus principais objetivos nas redes sociais?',
    type: 'multiselect',
    options: [
      { value: 'awareness', label: 'Aumentar reconhecimento da marca' },
      { value: 'engagement', label: 'Aumentar engajamento' },
      { value: 'sales', label: 'Gerar vendas' },
      { value: 'leads', label: 'Captar leads' },
      { value: 'community', label: 'Construir comunidade' },
      { value: 'authority', label: 'Estabelecer autoridade' },
    ],
  },
  {
    id: 'competitors',
    question: 'Quais são seus principais concorrentes?',
    placeholder: 'Liste 2-3 concorrentes separados por vírgula',
    type: 'text',
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
    ],
  },
  {
    id: 'postFrequency',
    question: 'Qual frequência de postagens você deseja?',
    type: 'select',
    options: [
      { value: 'daily', label: 'Diária (7x por semana)' },
      { value: 'frequent', label: 'Frequente (4-5x por semana)' },
      { value: 'moderate', label: 'Moderada (2-3x por semana)' },
      { value: 'weekly', label: 'Semanal (1x por semana)' },
    ],
  },
];

export default function EssentialBriefingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    segment: '',
    targetAudience: '',
    communicationTone: '',
    socialGoals: [],
    competitors: '',
    socialNetworks: [],
    postFrequency: '',
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
