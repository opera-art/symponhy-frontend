'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/features/chat/components';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg" />
          <span className="font-semibold text-slate-900">Symponhy</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Oracle Sphere - Interactive */}
        <div className="relative mb-6 cursor-pointer">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl scale-150" />
          <FloatingOracle size={380} />
        </div>

        {/* Greeting */}
        <p className="text-slate-500 text-center max-w-md mb-10 text-[15px] leading-relaxed">
          Para personalizar sua experiência, preciso conhecer melhor seu negócio.
          <br />
          <span className="text-slate-400">Escolha o tipo de briefing.</span>
        </p>

        {/* Options */}
        <div className="flex gap-4 w-full max-w-xl">
          {/* Essential Briefing */}
          <button
            onClick={() => router.push('/onboarding/essential')}
            className="group flex-1 bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 text-left"
          >
            <div className="flex flex-col">
              <span className="text-[13px] text-slate-400 mb-1">Completo</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Briefing Essencial
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Formulário completo para personalizar sua experiência
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">15-20 min · 70+ perguntas</span>
              </div>
            </div>
          </button>

          {/* Complete Briefing */}
          <button
            onClick={() => router.push('/onboarding/complete')}
            className="group flex-1 relative bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition-all duration-300 text-left"
          >
            <span className="absolute -top-2 left-5 px-2 py-0.5 bg-white text-[10px] font-medium text-slate-900 rounded-full border border-slate-200">
              Recomendado
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] text-slate-500 mb-1">Completo</span>
              <h3 className="text-lg font-semibold text-white mb-2">
                Briefing Completo
              </h3>
              <p className="text-[13px] text-slate-400 leading-relaxed">
                Contexto detalhado para resultados impecáveis
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-500">15 min · 20 perguntas</span>
              </div>
            </div>
          </button>
        </div>

        {/* Skip option */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
        >
          Configurar depois
        </button>
      </main>
    </div>
  );
}
