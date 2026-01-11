'use client';

import React from 'react';

export const GoldenOracle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Ambient Golden Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Soft warm backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[80px] opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Multi-Agent System Container */}
        <div className="relative w-[500px] h-[500px]">

          {/* Orbiting Agent Spheres */}
          {/* Agent 1 - Close orbit (Amber) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] animate-orbit-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
              {/* External Halo */}
              <div className="absolute inset-[-20px] rounded-full blur-2xl bg-gradient-to-tr from-amber-400/40 via-orange-400/30 to-amber-300/40 animate-gold-pulse pointer-events-none"></div>

              {/* Sphere Container */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 shadow-[0_5px_30px_-5px_rgba(217,119,6,0.6),inset_0_0_20px_rgba(0,0,0,0.1)] border border-amber-600/20">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#FDE68A_0%,_#D97706_80%)]"></div>

                {/* Molten core animation */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-viscous opacity-100 mix-blend-hard-light">
                  <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-amber-600 rounded-full blur-xl opacity-60 animate-molten"></div>
                  <div className="absolute bottom-[30%] right-[30%] w-[45%] h-[45%] bg-orange-500 rounded-full blur-lg opacity-50 animate-molten-slow"></div>
                  <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-yellow-300 rounded-full blur-md opacity-70 mix-blend-screen animate-molten"></div>
                </div>

                {/* Specular highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[35%] bg-gradient-to-b from-white/30 via-yellow-100/10 to-transparent rounded-t-full blur-[0.5px] opacity-70"></div>
                <div className="absolute top-[12%] left-[20%] w-8 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-full rotate-[-45deg] blur-sm opacity-70 mix-blend-overlay"></div>

                {/* Rim light */}
                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-amber-400/50 via-orange-500/20 to-transparent rounded-b-full blur-sm mix-blend-color-dodge"></div>
              </div>
            </div>
          </div>

          {/* Agent 2 - Medium orbit (Yellow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] animate-orbit-medium">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float delay-1000">
              {/* External Halo */}
              <div className="absolute inset-[-16px] rounded-full blur-xl bg-gradient-to-tr from-yellow-400/40 via-amber-400/30 to-yellow-300/40 animate-gold-pulse pointer-events-none"></div>

              {/* Sphere Container */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-amber-200 shadow-[0_4px_25px_-4px_rgba(234,179,8,0.6),inset_0_0_16px_rgba(0,0,0,0.1)] border border-yellow-600/20">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#FEF3C7_0%,_#EAB308_80%)]"></div>

                {/* Molten core animation */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-viscous opacity-100 mix-blend-hard-light">
                  <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-yellow-600 rounded-full blur-lg opacity-60 animate-molten"></div>
                  <div className="absolute bottom-[30%] right-[30%] w-[45%] h-[45%] bg-amber-500 rounded-full blur-md opacity-50 animate-molten-slow"></div>
                  <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-yellow-200 rounded-full blur-sm opacity-70 mix-blend-screen animate-molten"></div>
                </div>

                {/* Specular highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[35%] bg-gradient-to-b from-white/30 via-yellow-50/10 to-transparent rounded-t-full blur-[0.5px] opacity-70"></div>
                <div className="absolute top-[10%] left-[18%] w-6 h-3 bg-gradient-to-br from-white/40 to-transparent rounded-full rotate-[-45deg] blur-sm opacity-70 mix-blend-overlay"></div>

                {/* Rim light */}
                <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-yellow-400/50 via-amber-400/20 to-transparent rounded-b-full blur-sm mix-blend-color-dodge"></div>
              </div>
            </div>
          </div>

          {/* Agent 3 - Far orbit (Orange) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] animate-orbit-fast">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float delay-2000">
              {/* External Halo */}
              <div className="absolute inset-[-14px] rounded-full blur-lg bg-gradient-to-tr from-orange-400/40 via-red-400/30 to-orange-300/40 animate-gold-pulse pointer-events-none"></div>

              {/* Sphere Container */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-red-200 shadow-[0_3px_20px_-3px_rgba(249,115,22,0.6),inset_0_0_14px_rgba(0,0,0,0.1)] border border-orange-600/20">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#FED7AA_0%,_#F97316_80%)]"></div>

                {/* Molten core animation */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-viscous opacity-100 mix-blend-hard-light">
                  <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-md opacity-60 animate-molten"></div>
                  <div className="absolute bottom-[30%] right-[30%] w-[45%] h-[45%] bg-red-500 rounded-full blur-sm opacity-50 animate-molten-slow"></div>
                  <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-orange-200 rounded-full blur-sm opacity-70 mix-blend-screen animate-molten"></div>
                </div>

                {/* Specular highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[35%] bg-gradient-to-b from-white/30 via-orange-50/10 to-transparent rounded-t-full blur-[0.5px] opacity-70"></div>
                <div className="absolute top-[8%] left-[15%] w-5 h-2 bg-gradient-to-br from-white/40 to-transparent rounded-full rotate-[-45deg] blur-sm opacity-70 mix-blend-overlay"></div>

                {/* Rim light */}
                <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-t from-orange-400/50 via-red-400/20 to-transparent rounded-b-full blur-sm mix-blend-color-dodge"></div>
              </div>
            </div>
          </div>

          {/* Agent 4 - Opposite orbit (Golden Amber) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] animate-orbit-reverse">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float delay-1500">
              {/* External Halo */}
              <div className="absolute inset-[-18px] rounded-full blur-2xl bg-gradient-to-tr from-amber-400/40 via-yellow-400/30 to-amber-300/40 animate-gold-pulse pointer-events-none"></div>

              {/* Sphere Container */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-200 shadow-[0_4px_25px_-4px_rgba(217,119,6,0.6),inset_0_0_18px_rgba(0,0,0,0.1)] border border-amber-600/20">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#FEF3C7_0%,_#D97706_80%)]"></div>

                {/* Molten core animation */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-viscous opacity-100 mix-blend-hard-light">
                  <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-amber-600 rounded-full blur-lg opacity-60 animate-molten"></div>
                  <div className="absolute bottom-[30%] right-[30%] w-[45%] h-[45%] bg-yellow-500 rounded-full blur-md opacity-50 animate-molten-slow"></div>
                  <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-yellow-200 rounded-full blur-sm opacity-70 mix-blend-screen animate-molten"></div>
                </div>

                {/* Specular highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[35%] bg-gradient-to-b from-white/30 via-yellow-50/10 to-transparent rounded-t-full blur-[0.5px] opacity-70"></div>
                <div className="absolute top-[10%] left-[17%] w-6 h-3 bg-gradient-to-br from-white/40 to-transparent rounded-full rotate-[-45deg] blur-sm opacity-70 mix-blend-overlay"></div>

                {/* Rim light */}
                <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-amber-400/50 via-yellow-400/20 to-transparent rounded-b-full blur-sm mix-blend-color-dodge"></div>
              </div>
            </div>
          </div>

          {/* The Golden Orb - Main Agent (Siri-like) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer perspective-1000">

            {/* Energy Waves - Outer Rings */}
            <div className="absolute inset-[-80px] pointer-events-none">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping-slow"></div>
            </div>
            <div className="absolute inset-[-60px] pointer-events-none">
              <div className="absolute inset-0 rounded-full border border-yellow-400/30 animate-ping-slower opacity-60"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-[-100px] pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i * 360) / 20;
                const distance = 60 + (i % 3) * 15;
                const size = 2 + (i % 4);
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-1"
                    style={{
                      transform: `rotate(${angle}deg) translateX(${distance}px)`,
                    }}
                  >
                    <div
                      className={`rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 blur-[0.5px] animate-particle-float`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Main Halo - Pulsing Energy */}
            <div className="absolute inset-[-50px] rounded-full blur-3xl bg-gradient-to-tr from-yellow-400/40 via-amber-400/40 to-orange-400/30 animate-energy-pulse pointer-events-none"></div>
            <div className="absolute inset-[-40px] rounded-full blur-2xl bg-gradient-to-br from-amber-500/30 via-yellow-400/30 to-amber-300/20 animate-energy-pulse-reverse pointer-events-none"></div>

            {/* The Sphere Container */}
            <div className="
              relative
              w-[200px] h-[200px]
              rounded-full
              overflow-visible
              transform transition-transform duration-700 hover:scale-[1.05]
            ">
              {/* Glass Sphere Base */}
              <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-amber-50/90 to-yellow-100/90 backdrop-blur-sm shadow-[0_10px_60px_-10px_rgba(217,119,6,0.6),inset_0_0_60px_rgba(255,215,0,0.2)] border border-yellow-400/30">

                {/* Liquid Energy Core - Multi-layered */}
                <div className="absolute inset-[20%] rounded-full overflow-hidden">
                  {/* Core 1 - Deep amber energy */}
                  <div className="absolute inset-0 bg-gradient-radial from-amber-400 via-orange-500 to-amber-600 animate-core-pulse opacity-80"></div>

                  {/* Core 2 - Golden waves */}
                  <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-wave-flow opacity-70">
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] bg-gradient-to-tl from-amber-400 via-yellow-400 to-orange-400 rounded-full blur-xl"></div>
                  </div>

                  {/* Core 3 - Bright energy spots */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-[30%] left-[30%] w-[20%] h-[20%] bg-yellow-200 rounded-full blur-lg opacity-90 mix-blend-screen"></div>
                    <div className="absolute bottom-[35%] right-[35%] w-[15%] h-[15%] bg-white rounded-full blur-md opacity-80 mix-blend-screen"></div>
                  </div>

                  {/* Dynamic light rays */}
                  <div className="absolute inset-0 animate-rays-rotate opacity-40">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rotate-60"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent rotate-120"></div>
                  </div>
                </div>

                {/* Swirling Energy Bands */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute top-[30%] left-[-20%] w-[140%] h-[10%] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent blur-sm rotate-[-20deg] animate-band-flow"></div>
                  <div className="absolute top-[50%] left-[-20%] w-[140%] h-[8%] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent blur-md rotate-[15deg] animate-band-flow-reverse"></div>
                  <div className="absolute bottom-[30%] left-[-20%] w-[140%] h-[12%] bg-gradient-to-r from-transparent via-orange-400/25 to-transparent blur-lg rotate-[-10deg] animate-band-flow-slow"></div>
                </div>

                {/* Glass reflection - Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[75%] h-[30%] bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full blur-[2px]"></div>

                {/* Specular highlights */}
                <div className="absolute top-[12%] left-[20%] w-16 h-8 bg-gradient-to-br from-white/60 to-transparent rounded-full rotate-[-40deg] blur-sm mix-blend-overlay"></div>
                <div className="absolute top-[18%] right-[25%] w-10 h-6 bg-white/40 rounded-full blur-md mix-blend-overlay"></div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-amber-500/30 via-yellow-400/10 to-transparent rounded-b-full mix-blend-color-dodge"></div>

                {/* Edge highlight */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(255,215,0,0.3),inset_0_-20px_30px_rgba(217,119,6,0.2)]"></div>
              </div>

              {/* Outer glow rings */}
              <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-yellow-400/50 via-amber-400/30 to-orange-400/50 blur-sm animate-glow-rotate"></div>
            </div>

            {/* Orbital Energy Rings */}
            <div className="absolute inset-[-15px] border-2 border-yellow-400/20 rounded-full opacity-60 animate-orbit-ring pointer-events-none"></div>
            <div className="absolute inset-[-25px] border border-amber-400/15 rounded-full opacity-50 animate-orbit-ring-reverse pointer-events-none"></div>
            <div className="absolute inset-[-35px] border border-orange-400/10 rounded-full opacity-40 animate-orbit-ring-slow pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
