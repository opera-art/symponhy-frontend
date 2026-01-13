'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FloatingOracle } from '@/components/chat/FloatingOracle';
import { Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900">Symponhy</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Vamos começar sua jornada
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Escolha como deseja configurar seu perfil para nossos agentes de IA
          </p>
        </div>

        {/* Oracle Sphere */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl scale-150" />
          <FloatingOracle size={200} />
        </div>

        {/* Greeting from Oracle */}
        <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 mb-10 max-w-lg">
          <p className="text-slate-700 text-center">
            <span className="text-blue-600 font-medium">Olá!</span> Sou seu assistente Symponhy.
            Para personalizar sua experiência, preciso conhecer melhor seu negócio.
            Escolha o tipo de briefing que prefere preencher.
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
          {/* Essential Briefing */}
          <button
            onClick={() => router.push('/onboarding/essential')}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Briefing Essencial
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Perguntas rápidas e objetivas para começar rapidamente.
                  Ideal se você tem pressa ou prefere simplicidade.
                </p>
                <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                  <span>~5 minutos</span>
                  <span className="text-slate-300">•</span>
                  <span>8 perguntas</span>
                </div>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Complete Briefing */}
          <button
            onClick={() => router.push('/onboarding/complete')}
            className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 text-left"
          >
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-amber-500 text-[10px] font-bold text-white rounded-full uppercase tracking-wide">
                Recomendado
              </span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Briefing Completo
                </h3>
                <p className="text-sm text-slate-400 mb-3">
                  Perguntas detalhadas para máximo contexto.
                  Nossos agentes entregarão um trabalho impecável.
                </p>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <span>~15 minutos</span>
                  <span className="text-slate-600">•</span>
                  <span>20 perguntas</span>
                </div>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5 text-white/60" />
            </div>
          </button>
        </div>

        {/* Skip option */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Pular por agora e configurar depois
        </button>
      </main>
    </div>
  );
}
