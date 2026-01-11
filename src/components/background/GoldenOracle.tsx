'use client';

import React from 'react';

export const GoldenOracle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center overflow-hidden ${className}`}>

      {/* SVG Container */}
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">

        <svg viewBox="0 0 600 600" className="w-full h-full">
          <defs>
            {/* Gradientes para esfera azul/roxo */}
            <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A86FF" stopOpacity="0.9">
                <animate attributeName="stop-color" values="#3A86FF;#5B9FFF;#3A86FF" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#8338EC" stopOpacity="0.8">
                <animate attributeName="stop-color" values="#8338EC;#9D5EFF;#8338EC" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <linearGradient id="blueGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E5FCC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.6" />
            </linearGradient>

            {/* Gradientes para esfera vermelha/laranja/rosa */}
            <linearGradient id="redGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF006E" stopOpacity="0.95">
                <animate attributeName="stop-color" values="#FF006E;#FF1A7F;#FF006E" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#FB5607" stopOpacity="0.9">
                <animate attributeName="stop-color" values="#FB5607;#FF6B1A;#FB5607" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.85">
                <animate attributeName="stop-color" values="#EC4899;#F764B3;#EC4899" dur="5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <linearGradient id="redGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C90052" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0.7" />
            </linearGradient>

            {/* Filtros para efeito fluido */}
            <filter id="fluidFlow">
              <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" result="turbulence">
                <animate attributeName="baseFrequency" dur="80s" values="0.008;0.012;0.008" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Esfera Azul/Roxo (esquerda inferior) */}
          <g className="animate-sphere-float-1">
            {/* Linhas fluidas que formam a esfera */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 180) / 24;
              const offset = i * 15;
              return (
                <ellipse
                  key={`blue-${i}`}
                  cx="220"
                  cy="320"
                  rx="120"
                  ry="140"
                  fill="none"
                  stroke="url(#blueGrad1)"
                  strokeWidth={2.5 - (i % 3) * 0.3}
                  strokeLinecap="round"
                  opacity={0.4 - (i % 5) * 0.05}
                  transform={`rotate(${angle + offset} 220 320)`}
                  filter="url(#fluidFlow)"
                  style={{
                    animation: `rotate-sphere ${20 + i % 4}s linear infinite`,
                    transformOrigin: '220px 320px'
                  }}
                />
              );
            })}

            {/* Linhas horizontais para profundidade */}
            {Array.from({ length: 12 }).map((_, i) => {
              const y = 200 + i * 20;
              const rx = Math.sin((i / 12) * Math.PI) * 120;
              return (
                <ellipse
                  key={`blue-h-${i}`}
                  cx="220"
                  cy={y}
                  rx={rx}
                  ry="6"
                  fill="none"
                  stroke="url(#blueGrad2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={0.3}
                  filter="url(#glow)"
                />
              );
            })}

            {/* Núcleo luminoso */}
            <circle
              cx="220"
              cy="320"
              r="40"
              fill="url(#blueGrad1)"
              opacity="0.15"
              filter="url(#strongGlow)"
            >
              <animate attributeName="r" values="40;50;40" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.25;0.15" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Esfera Vermelha/Rosa/Laranja (direita superior) */}
          <g className="animate-sphere-float-2">
            {/* Linhas fluidas que formam a esfera */}
            {Array.from({ length: 28 }).map((_, i) => {
              const angle = (i * 180) / 28;
              const offset = i * 12;
              return (
                <ellipse
                  key={`red-${i}`}
                  cx="380"
                  cy="260"
                  rx="130"
                  ry="150"
                  fill="none"
                  stroke="url(#redGrad1)"
                  strokeWidth={2.8 - (i % 4) * 0.3}
                  strokeLinecap="round"
                  opacity={0.45 - (i % 6) * 0.05}
                  transform={`rotate(${-angle + offset} 380 260)`}
                  filter="url(#fluidFlow)"
                  style={{
                    animation: `rotate-sphere-reverse ${18 + i % 5}s linear infinite`,
                    transformOrigin: '380px 260px'
                  }}
                />
              );
            })}

            {/* Linhas horizontais para profundidade */}
            {Array.from({ length: 14 }).map((_, i) => {
              const y = 140 + i * 20;
              const rx = Math.sin((i / 14) * Math.PI) * 130;
              return (
                <ellipse
                  key={`red-h-${i}`}
                  cx="380"
                  cy={y}
                  rx={rx}
                  ry="5"
                  fill="none"
                  stroke="url(#redGrad2)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity={0.35}
                  filter="url(#glow)"
                />
              );
            })}

            {/* Núcleo luminoso */}
            <circle
              cx="380"
              cy="260"
              r="45"
              fill="url(#redGrad1)"
              opacity="0.2"
              filter="url(#strongGlow)"
            >
              <animate attributeName="r" values="45;55;45" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.3;0.2" dur="3.5s" repeatCount="indefinite" />
            </circle>

            {/* Linhas extras de brilho */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <line
                  key={`red-ray-${i}`}
                  x1="380"
                  y1="260"
                  x2={380 + Math.cos((angle * Math.PI) / 180) * 80}
                  y2={260 + Math.sin((angle * Math.PI) / 180) * 80}
                  stroke="url(#redGrad1)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.2"
                  filter="url(#glow)"
                  style={{
                    animation: `pulse-ray ${4 + i * 0.5}s ease-in-out infinite`,
                    transformOrigin: '380px 260px'
                  }}
                />
              );
            })}
          </g>

          {/* Partículas flutuantes */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = 150 + Math.random() * 300;
            const y = 150 + Math.random() * 300;
            const size = 1 + Math.random() * 2;
            const color = i % 2 === 0 ? '#3A86FF' : '#FF006E';
            return (
              <circle
                key={`particle-${i}`}
                cx={x}
                cy={y}
                r={size}
                fill={color}
                opacity="0.4"
                filter="url(#glow)"
              >
                <animate
                  attributeName="cy"
                  values={`${y};${y - 30};${y}`}
                  dur={`${6 + i % 4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur={`${6 + i % 4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </svg>

      </div>
    </div>
  );
};
