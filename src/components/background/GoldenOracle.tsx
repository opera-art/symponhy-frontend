'use client';

import React from 'react';

export const GoldenOracle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center overflow-hidden ${className}`}>

      {/* SVG Filters for organic nebula texture */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="nebula-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />
          </filter>
          <filter id="nebula-glow">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Nebula Container */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center">

        {/* Outer Glow Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(65,105,225,0.3) 0%, rgba(255,20,147,0.2) 40%, transparent 70%)'
          }}
        ></div>

        {/* Main Nebula Sphere */}
        <div className="relative w-[400px] h-[400px] rounded-full overflow-visible animate-spin-slow">

          {/* Core - Deep Space Purple/Blue */}
          <div className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #1a0033 0%, #0a001a 60%, #000000 100%)',
              boxShadow: '0 0 120px rgba(139,0,255,0.6), 0 0 200px rgba(255,20,147,0.4), inset 0 0 80px rgba(0,0,0,0.8)',
              filter: 'contrast(1.3) brightness(1.2)'
            }}
          >

            {/* Gas Cloud 1 - Magenta/Pink */}
            <div className="absolute top-[10%] left-[15%] w-[45%] h-[45%] rounded-full opacity-90 animate-nebula-drift-1 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle, #FF1493 0%, #FF69B4 30%, #DC143C 60%, transparent 80%)',
                filter: 'blur(35px) url(#nebula-noise)'
              }}
            ></div>

            {/* Gas Cloud 2 - Blue/Cyan */}
            <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full opacity-80 animate-nebula-drift-2 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle, #4169E1 0%, #1E90FF 40%, #00BFFF 70%, transparent 85%)',
                filter: 'blur(40px) url(#nebula-noise)'
              }}
            ></div>

            {/* Gas Cloud 3 - Purple/Violet */}
            <div className="absolute bottom-[15%] left-[20%] w-[55%] h-[55%] rounded-full opacity-85 animate-nebula-drift-3 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle, #8B00FF 0%, #9370DB 35%, #BA55D3 65%, transparent 80%)',
                filter: 'blur(45px) url(#nebula-noise)'
              }}
            ></div>

            {/* Gas Cloud 4 - Orange/Red */}
            <div className="absolute bottom-[25%] right-[18%] w-[48%] h-[48%] rounded-full opacity-75 animate-nebula-drift-4 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle, #FF6347 0%, #FF4500 40%, #DC143C 70%, transparent 85%)',
                filter: 'blur(38px) url(#nebula-noise)'
              }}
            ></div>

            {/* Gas Cloud 5 - Cyan/Teal overlay */}
            <div className="absolute top-[35%] left-[30%] w-[40%] h-[40%] rounded-full opacity-70 animate-nebula-drift-5 mix-blend-color-dodge"
              style={{
                background: 'radial-gradient(circle, #00CED1 0%, #20B2AA 50%, transparent 75%)',
                filter: 'blur(30px)'
              }}
            ></div>

            {/* Bright Energy Core Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full animate-core-pulse mix-blend-screen"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 20%, #FF1493 50%, transparent 70%)',
                filter: 'blur(20px)',
                boxShadow: '0 0 80px rgba(255,255,255,0.8), 0 0 120px rgba(255,105,180,0.6)'
              }}
            ></div>

            {/* Swirling Energy Bands */}
            <div className="absolute inset-0 animate-wave-flow mix-blend-overlay opacity-60">
              <div className="absolute top-[25%] left-[-10%] w-[120%] h-[15%] rotate-[-35deg]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #FF1493 30%, #8B00FF 50%, #4169E1 70%, transparent 100%)',
                  filter: 'blur(25px)'
                }}
              ></div>
              <div className="absolute bottom-[30%] left-[-10%] w-[120%] h-[18%] rotate-[25deg]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #00CED1 25%, #FF6347 50%, #DC143C 75%, transparent 100%)',
                  filter: 'blur(28px)'
                }}
              ></div>
            </div>

            {/* Edge Glow Enhancement */}
            <div className="absolute inset-0 rounded-full"
              style={{
                boxShadow: 'inset 0 0 60px rgba(65,105,225,0.4), inset 0 0 100px rgba(255,20,147,0.3)'
              }}
            ></div>

          </div>

          {/* Outer Nebula Glow Rings */}
          <div className="absolute inset-[-20px] rounded-full opacity-50 mix-blend-screen animate-ping-slow"
            style={{
              background: 'radial-gradient(circle, transparent 45%, rgba(139,0,255,0.4) 60%, rgba(255,20,147,0.3) 70%, transparent 80%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="absolute inset-[-40px] rounded-full opacity-40 mix-blend-screen animate-ping-slower"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(65,105,225,0.3) 55%, rgba(255,105,180,0.2) 70%, transparent 85%)',
              filter: 'blur(25px)'
            }}
          ></div>

        </div>

        {/* Floating Star Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i * 360) / 40;
            const distance = 150 + (i % 5) * 20;
            const size = 1 + (i % 3);
            const colors = ['#FFFFFF', '#FFD700', '#FF69B4', '#4169E1', '#8B00FF', '#00CED1'];
            const color = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(${distance}px)`,
                }}
              >
                <div
                  className="rounded-full animate-particle-float mix-blend-screen"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${size * 3}px ${color}`,
                    filter: 'blur(0.5px)',
                    animationDelay: `${i * 0.15}s`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
