'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Cpu, Sparkles } from 'lucide-react';

// Dynamic import to avoid SSR issues with Three.js
const HolographicSphere = dynamic(
  () => import('@/components/ui/HolographicSphere').then((mod) => mod.HolographicSphere),
  { ssr: false }
);

const modeNames = ['NEBULA CLOUD', 'QUANTUM TORUS', 'CYBER LATTICE', 'WARP VORTEX'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<0 | 1 | 2 | 3>(0);
  const [colorPalette, setColorPalette] = useState<0 | 1 | 2>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [particleCount, setParticleCount] = useState(65000);

  useEffect(() => {
    // Adjust particle count based on screen size
    const isMobile = window.innerWidth < 768;
    setParticleCount(isMobile ? 35000 : 65000);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen bg-[#030305] flex flex-col overflow-hidden relative">
      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-overlay"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.06))',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 120%)',
        }}
      />

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#030305] flex flex-col items-center justify-center transition-opacity duration-1000">
          <div className="relative w-12 h-12 mb-6">
            <div
              className="absolute inset-0 rounded-full border border-white"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">
              Initializing
            </div>
            <div className="w-24 h-px bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 w-1/2 bg-white/40"
                style={{ animation: 'slide 1s infinite linear' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header / HUD */}
      <header className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex flex-row justify-between items-start pointer-events-none">
        {/* Left: Branding & Stats */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <h1 className="text-xs md:text-sm font-medium tracking-tight uppercase text-white/90">
              Symponhy<span className="opacity-40">.AI</span>
            </h1>
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-[10px] font-mono text-white/40 tracking-wider">
            <span className="text-white/70 transition-colors duration-500">
              {modeNames[currentMode]}
            </span>
            <span className="hidden xs:inline w-px h-2 bg-white/10" />
            <span className="opacity-60">{(particleCount / 1000).toFixed(0)}K NODES</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Holographic Sphere */}
        <div className="relative mb-8">
          <HolographicSphere
            size={380}
            particleCount={particleCount}
            mode={currentMode}
            colorPalette={colorPalette}
            enableMouseInteraction={true}
          />
        </div>

        {/* Greeting */}
        <p className="text-white/50 text-center max-w-md mb-10 text-[15px] leading-relaxed">
          Para personalizar sua experiencia, preciso conhecer melhor seu negocio.
          <br />
          <span className="text-white/30">Escolha o tipo de briefing.</span>
        </p>

        {/* Options */}
        <div className="flex gap-4 w-full max-w-xl">
          {/* Essential Briefing */}
          <button
            onClick={() => router.push('/onboarding/essential')}
            className="group flex-1 rounded-2xl p-5 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-left backdrop-blur-xl"
            style={{
              background: 'rgba(10, 10, 12, 0.75)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div className="flex flex-col">
              <span className="text-[13px] text-white/40 mb-1">Completo</span>
              <h3 className="text-lg font-semibold text-white/90 mb-2">
                Briefing Essencial
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed">
                Formulario completo para personalizar sua experiencia
              </p>
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-xs text-white/30 font-mono">15-20 min · 70+ perguntas</span>
              </div>
            </div>
          </button>

          {/* Complete Briefing */}
          <button
            onClick={() => router.push('/onboarding/complete')}
            className="group flex-1 relative rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 10, 12, 0.9) 100%)',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
            }}
          >
            <span className="absolute -top-2 left-5 px-2 py-0.5 text-[10px] font-medium text-emerald-400 rounded-full border border-emerald-500/30 bg-[#030305]">
              Recomendado
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] text-white/40 mb-1">Completo</span>
              <h3 className="text-lg font-semibold text-white mb-2">
                Briefing Completo
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed">
                Contexto detalhado para resultados impecaveis
              </p>
              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-xs text-white/40 font-mono">15 min · 20 perguntas</span>
              </div>
            </div>
          </button>
        </div>

        {/* Skip option */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 text-[13px] text-white/30 hover:text-white/60 transition-colors font-mono tracking-wider"
        >
          CONFIGURAR DEPOIS
        </button>
      </main>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none p-4 md:p-6 flex flex-col md:flex-row justify-between items-end gap-4">
        {/* Left: Mode Selector */}
        <div
          className="p-3 rounded-xl pointer-events-auto w-full md:w-64 max-w-[300px] backdrop-blur-xl border border-white/5"
          style={{
            background: 'rgba(10, 10, 12, 0.75)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-white/40" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                Visualization
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {(['Nebula', 'Torus', 'Lattice', 'Vortex'] as const).map((name, idx) => (
              <button
                key={name}
                onClick={() => setCurrentMode(idx as 0 | 1 | 2 | 3)}
                className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg transition-all border text-left ${
                  currentMode === idx
                    ? 'bg-white/10 border-white/10'
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    currentMode === idx ? 'text-white' : 'text-white/60 group-hover:text-white'
                  }`}
                >
                  {name}
                </span>
                <span className="text-[9px] font-mono text-white/20">0{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Color & Info */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 pointer-events-auto">
          {/* Palette Switcher */}
          <div
            className="p-1.5 rounded-full flex md:flex-col flex-row gap-2"
            style={{
              background: 'rgba(10, 10, 12, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              onClick={() => setColorPalette(0)}
              className={`w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-1 ring-white/10 hover:scale-110 transition-transform duration-300 ${
                colorPalette === 0 ? 'ring-2 ring-white/30' : ''
              }`}
            />
            <button
              onClick={() => setColorPalette(1)}
              className={`w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-blue-500 ring-1 ring-white/10 hover:scale-110 transition-transform duration-300 ${
                colorPalette === 1 ? 'ring-2 ring-white/30' : ''
              }`}
            />
            <button
              onClick={() => setColorPalette(2)}
              className={`w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 ring-1 ring-white/10 hover:scale-110 transition-transform duration-300 ${
                colorPalette === 2 ? 'ring-2 ring-white/30' : ''
              }`}
            />
          </div>

          <div className="hidden md:block text-[9px] font-mono text-right text-white/20 leading-tight">
            <p>INTERACTION ENGINE V2.0</p>
            <p className="mt-0.5">SYMPONHY.AI</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
