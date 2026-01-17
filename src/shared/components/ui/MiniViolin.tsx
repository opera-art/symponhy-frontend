'use client';

import React from 'react';

interface MiniViolinProps {
  size?: number;
  className?: string;
}

export const MiniViolin: React.FC<MiniViolinProps> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <style jsx>{`
        @keyframes bowStrokeMini {
          0% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          100% { transform: translateX(-8px); }
        }

        @keyframes violinSwayMini {
          0%, 100% { transform: rotate(-55deg) scale(1); }
          50% { transform: rotate(-53deg) scale(1); }
        }

        @keyframes stringVibrateMini {
          0% { transform: translateX(0); }
          25% { transform: translateX(0.3px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(-0.3px); }
          100% { transform: translateX(0); }
        }

        /* Notas musicais flutuando */
        @keyframes floatNote1 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: translate(8px, -15px) scale(1) rotate(5deg);
          }
          100% {
            opacity: 0;
            transform: translate(25px, -50px) scale(0.8) rotate(15deg);
          }
        }

        @keyframes floatNote2 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: translate(12px, -12px) scale(1) rotate(-5deg);
          }
          100% {
            opacity: 0;
            transform: translate(30px, -45px) scale(0.7) rotate(-10deg);
          }
        }

        @keyframes floatNote3 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(5px, -18px) scale(0.9) rotate(8deg);
          }
          100% {
            opacity: 0;
            transform: translate(20px, -55px) scale(0.6) rotate(20deg);
          }
        }

        @keyframes floatNote4 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
          }
          18% {
            opacity: 0.9;
            transform: translate(10px, -10px) scale(1) rotate(-3deg);
          }
          100% {
            opacity: 0;
            transform: translate(28px, -48px) scale(0.7) rotate(-15deg);
          }
        }

        .animate-bow-mini {
          animation: bowStrokeMini 1.2s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-violin-mini {
          animation: violinSwayMini 4s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }

        .animate-strings-mini {
          animation: stringVibrateMini 0.08s linear infinite;
        }

        .floating-note-1 {
          animation: floatNote1 2.5s ease-out infinite;
          animation-delay: 0s;
        }

        .floating-note-2 {
          animation: floatNote2 3s ease-out infinite;
          animation-delay: 0.8s;
        }

        .floating-note-3 {
          animation: floatNote3 2.8s ease-out infinite;
          animation-delay: 1.5s;
        }

        .floating-note-4 {
          animation: floatNote4 3.2s ease-out infinite;
          animation-delay: 2.2s;
        }
      `}</style>

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Notas musicais flutuantes - fora do grupo do violino para não rotacionar junto */}
        <g transform="translate(60, 45)">
          {/* Nota 1 - Semínima */}
          <g className="floating-note-1" opacity="0">
            <ellipse cx="0" cy="0" rx="3" ry="2" fill="#D97706" transform="rotate(-20)" />
            <line x1="2.5" y1="-1" x2="2.5" y2="-10" stroke="#D97706" strokeWidth="1" />
          </g>

          {/* Nota 2 - Colcheia */}
          <g className="floating-note-2" opacity="0" transform="translate(5, 5)">
            <ellipse cx="0" cy="0" rx="2.5" ry="1.8" fill="#F59E0B" transform="rotate(-15)" />
            <line x1="2" y1="-1" x2="2" y2="-9" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M2,-9 Q6,-7 5,-4" stroke="#F59E0B" strokeWidth="0.8" fill="none" />
          </g>

          {/* Nota 3 - Semínima menor */}
          <g className="floating-note-3" opacity="0" transform="translate(-3, 8)">
            <ellipse cx="0" cy="0" rx="2" ry="1.5" fill="#B45309" transform="rotate(-25)" />
            <line x1="1.8" y1="-0.8" x2="1.8" y2="-8" stroke="#B45309" strokeWidth="0.7" />
          </g>

          {/* Nota 4 - Colcheia dupla */}
          <g className="floating-note-4" opacity="0" transform="translate(8, 2)">
            <ellipse cx="0" cy="0" rx="2.2" ry="1.6" fill="#D97706" transform="rotate(-10)" />
            <ellipse cx="5" cy="1" rx="2.2" ry="1.6" fill="#D97706" transform="rotate(-10)" />
            <line x1="2" y1="-0.5" x2="2" y2="-8" stroke="#D97706" strokeWidth="0.8" />
            <line x1="7" y1="0.5" x2="7" y2="-7" stroke="#D97706" strokeWidth="0.8" />
            <line x1="2" y1="-8" x2="7" y2="-7" stroke="#D97706" strokeWidth="0.8" />
          </g>
        </g>

        <g transform="translate(55, 62)">
          <g className="animate-violin-mini">
            {/* Corpo do Violino - Sombra */}
            <path
              d="M0,-17 C5,-17 8,-13 8,-8 C8,-6 6,-2 4,0 C6,2 10,6 10,13 C10,19 6,23 0,23 C-6,23 -10,19 -10,13 C-10,6 -6,2 -4,0 C-6,-2 -8,-6 -8,-8 C-8,-13 -5,-17 0,-17 Z"
              fill="#6F2C1F"
              transform="translate(1.5, 1.5)"
            />

            {/* Braço - Sombra */}
            <rect x="-1.2" y="-50" width="2.4" height="35" fill="#6F2C1F" transform="translate(1, 1)" />
            <circle cx="0" cy="-51" r="3" fill="#6F2C1F" transform="translate(1, 1)" />

            {/* Corpo do Violino - Principal */}
            <path
              d="M0,-17 C5,-17 8,-13 8,-8 C8,-6 6,-2 4,0 C6,2 10,6 10,13 C10,19 6,23 0,23 C-6,23 -10,19 -10,13 C-10,6 -6,2 -4,0 C-6,-2 -8,-6 -8,-8 C-8,-13 -5,-17 0,-17 Z"
              fill="#F58E36"
            />

            {/* Contorno interno */}
            <path
              d="M0,-15 C4.5,-15 7,-12 7,-8 C7,-6.5 5,-3 3.5,0 C5,3 9,7 9,13 C9,18 5.5,21 0,21 C-5.5,21 -9,18 -9,13 C-9,7 -5,3 -3.5,0 C-5,-3 -7,-6.5 -7,-8 C-7,-12 -4.5,-15 0,-15 Z"
              fill="none"
              stroke="#D97224"
              strokeWidth="0.3"
              opacity="0.6"
            />

            {/* Efes (F-Holes) */}
            <g fill="#3E150F">
              <ellipse cx="-4" cy="-2" rx="1.2" ry="3" />
              <ellipse cx="4" cy="-2" rx="1.2" ry="3" />
            </g>

            {/* Braço & Espelho */}
            <rect x="-1.5" y="-50" width="3" height="34" fill="#231F20" />

            {/* Voluta */}
            <g transform="translate(0, -51)">
              <circle cx="0" cy="0" r="3" fill="#F58E36" />
              <circle cx="0" cy="0" r="1" fill="#6F2C1F" />
              {/* Cravelhas */}
              <rect x="-5" y="-1" width="2" height="1" rx="0.3" fill="#231F20" />
              <rect x="3" y="-1" width="2" height="1" rx="0.3" fill="#231F20" />
            </g>

            {/* Estandarte */}
            <path d="M-2.5,23 L2.5,23 L2,10 L-2,10 Z" fill="#231F20" />

            {/* Cavalete */}
            <path d="M-2.5,5 Q0,4 2.5,5 L2.5,5.5 Q0,4.5 -2.5,5.5 Z" fill="#E8B07D" />

            {/* Cordas */}
            <g stroke="#EAEAEA" strokeWidth="0.2" strokeLinecap="round" className="animate-strings-mini">
              <line x1="-1" y1="10" x2="-1" y2="-50" />
              <line x1="0" y1="10" x2="0" y2="-50" />
              <line x1="1" y1="10" x2="1" y2="-50" />
            </g>

            {/* O Arco */}
            <g className="animate-bow-mini" transform="translate(0, -3)">
              {/* Crina */}
              <rect x="-15" y="0.3" width="30" height="0.5" fill="#FEF3D8" rx="0.25" />
              {/* Vareta */}
              <rect x="-16" y="-1" width="32" height="1" fill="#E86C2D" rx="0.5" />
              {/* Talao */}
              <rect x="14" y="-1.5" width="4" height="2" fill="#4A1C17" rx="0.5" />
              {/* Ponta */}
              <path d="M-16,-1 L-18,0 L-16,1 Z" fill="#FCEBB6" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default MiniViolin;
