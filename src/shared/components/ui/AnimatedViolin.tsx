'use client';

import React from 'react';

interface AnimatedViolinProps {
  className?: string;
}

export const AnimatedViolin: React.FC<AnimatedViolinProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-2xl aspect-square flex items-center justify-center mx-auto ${className}`}>
      <style jsx>{`
        /* Otimização de renderização */
        svg { shape-rendering: geometricPrecision; }

        /* Animação do Arco (Movimento de tocar nas cordas) */
        @keyframes bowStroke {
          0% { transform: translateX(-40px); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(-40px); }
        }

        /* Animação Sutil do Corpo do Violino (Expressão) */
        @keyframes violinSway {
          0%, 100% { transform: rotate(-55deg) scale(1.1); }
          50% { transform: rotate(-53deg) scale(1.1); }
        }

        /* Animação das Cordas (Vibração rápida) - sincronizada com o arco */
        @keyframes stringVibrate {
          0% { transform: translateX(0); }
          25% { transform: translateX(0.8px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(-0.8px); }
          100% { transform: translateX(0); }
        }

        /* Animação das Notas Musicais */
        @keyframes floatNote {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(20px, -40px) scale(1) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translate(60px, -200px) scale(1.2) rotate(20deg);
          }
        }

        .animate-bow {
          animation: bowStroke 1.2s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-violin {
          animation: violinSway 4s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }

        .animate-strings {
          animation: stringVibrate 0.08s linear infinite;
        }

        .note {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
        }

        .note-1 { animation: floatNote 3s ease-out infinite; animation-delay: 0s; }
        .note-2 { animation: floatNote 3.5s ease-out infinite; animation-delay: 1.2s; }
        .note-3 { animation: floatNote 4s ease-out infinite; animation-delay: 0.6s; }
        .note-4 { animation: floatNote 3.2s ease-out infinite; animation-delay: 2.0s; }
      `}</style>

      <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        {/* GRUPO MESTRE DE POSICIONAMENTO: Move tudo para o centro */}
        <g transform="translate(400, 420)">

          {/* GRUPO DE ANIMAÇÃO: Aplica apenas rotação/balanço */}
          <g className="animate-violin">

            {/* CORPO DO VIOLINO (Desenhado em torno de 0,0) */}
            {/* Camada Lateral/Profundidade (Marrom Escuro) */}
            <path d="M0,-140 C45,-140 70,-110 70,-70 C70,-50 50,-20 35,0 C50,20 85,50 85,110 C85,160 50,190 0,190 C-50,190 -85,160 -85,110 C-85,50 -50,20 -35,0 C-50,-20 -70,-50 -70,-70 C-70,-110 -45,-140 0,-140 Z" fill="#6F2C1F" transform="translate(12, 12)" />

            {/* Braço & Sombra da Voluta */}
            <rect x="-10" y="-400" width="20" height="280" fill="#6F2C1F" transform="translate(8, 8)" />
            <circle cx="0" cy="-410" r="25" fill="#6F2C1F" transform="translate(8, 8)" />

            {/* Camada Superior (Laranja Madeira) */}
            <path d="M0,-140 C45,-140 70,-110 70,-70 C70,-50 50,-20 35,0 C50,20 85,50 85,110 C85,160 50,190 0,190 C-50,190 -85,160 -85,110 C-85,50 -50,20 -35,0 C-50,-20 -70,-50 -70,-70 C-70,-110 -45,-140 0,-140 Z" fill="#F58E36" />

            {/* Linhas de contorno interno */}
            <path d="M0,-130 C40,-130 60,-105 60,-70 C60,-55 45,-25 30,0 C45,25 75,55 75,110 C75,150 45,180 0,180 C-45,180 -75,150 -75,110 C-75,55 -45,25 -30,0 C-45,-25 -60,-55 -60,-70 C-60,-105 -40,-130 0,-130 Z" fill="none" stroke="#D97224" strokeWidth="2" opacity="0.6" />

            {/* Efes (F-Holes) */}
            <g fill="#3E150F">
              <path d="M-35,-20 C-45,-20 -50,-40 -40,-55 C-38,-58 -30,-55 -35,-45 C-38,-40 -42,-30 -35,-30 C-25,-30 -30,-60 -45,-65 C-55,-70 -60,-50 -55,-40 C-50,-30 -40,-25 -35,-20 Z" />
              <circle cx="-35" cy="-20" r="3" />
              <circle cx="-45" cy="-65" r="3" />

              <path d="M35,-20 C45,-20 50,-40 40,-55 C38,-58 30,-55 35,-45 C38,-40 42,-30 35,-30 C25,-30 30,-60 45,-65 C55,-70 60,-50 55,-40 C50,-30 40,-25 35,-20 Z" />
              <circle cx="35" cy="-20" r="3" />
              <circle cx="45" cy="-65" r="3" />
            </g>

            {/* BRAÇO & ESPELHO (Fingerboard) */}
            <rect x="-12" y="-400" width="24" height="270" fill="#231F20" />

            {/* VOLUTA (Scroll) */}
            <g transform="translate(0, -410)">
              <circle cx="0" cy="0" r="25" fill="#F58E36" />
              <path d="M0,0 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0" fill="none" stroke="#6F2C1F" strokeWidth="4" strokeLinecap="round" />
              <path d="M0,0 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0" fill="#6F2C1F" />

              {/* Cravelhas */}
              <g fill="#231F20">
                <rect x="-40" y="-10" width="15" height="8" rx="2" transform="rotate(-15)" />
                <rect x="25" y="-15" width="15" height="8" rx="2" transform="rotate(15)" />
                <rect x="-38" y="10" width="15" height="8" rx="2" transform="rotate(-15)" />
                <rect x="23" y="5" width="15" height="8" rx="2" transform="rotate(15)" />
              </g>
            </g>

            {/* ESTANDARTE (Tailpiece) */}
            <path d="M-20,190 L20,190 L16,80 L-16,80 Z" fill="#231F20" />
            <circle cx="0" cy="190" r="4" fill="#111" />

            {/* QUEIXEIRA */}
            <ellipse cx="-40" cy="160" rx="35" ry="20" fill="#231F20" transform="rotate(-15 -40 160)" />
            <ellipse cx="-40" cy="158" rx="30" ry="15" fill="#3A3230" transform="rotate(-15 -40 160)" />

            {/* CAVALETE (Bridge) */}
            <path d="M-20,40 Q0,30 20,40 L20,44 Q0,34 -20,44 Z" fill="#E8B07D" stroke="#AA7040" strokeWidth="1" />

            {/* CORDAS (Com vibração sincronizada) */}
            <g stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round" className="animate-strings">
              <line x1="-9" y1="85" x2="-9" y2="-400" />
              <line x1="-3" y1="85" x2="-3" y2="-400" />
              <line x1="3" y1="85" x2="3" y2="-400" />
              <line x1="9" y1="85" x2="9" y2="-400" />
            </g>

            {/* NOTAS MUSICAIS */}
            <g transform="translate(10, 20)">
              <path d="M10,0 L10,-25 L10,-25" stroke="#3E150F" strokeWidth="3" fill="none" className="note note-1" />
              <ellipse cx="6" cy="0" rx="6" ry="4" transform="rotate(-20)" fill="#3E150F" className="note note-1" />

              <g className="note note-2" transform="translate(10, 10)">
                <path d="M15,-5 L15,-30 Q25,-20 30,-10" stroke="#3E150F" strokeWidth="3" fill="none" />
                <ellipse cx="11" cy="-5" rx="6" ry="4" transform="rotate(-20)" fill="#3E150F" />
              </g>

              <g className="note note-3" transform="translate(-10, -10)">
                <path d="M10,0 L10,-25" stroke="#3E150F" strokeWidth="3" fill="none" />
                <ellipse cx="6" cy="0" rx="6" ry="4" transform="rotate(-20)" fill="#3E150F" />
              </g>

              <path d="M0,0 Q10,-10 5,-20 Q0,-10 5,0" stroke="#3E150F" strokeWidth="2" fill="none" className="note note-4" transform="translate(5,5) scale(0.5)" />
            </g>

            {/* O ARCO - posicionado para tocar nas cordas (entre cavalete e espelho) */}
            <g className="animate-bow" transform="translate(0, -20)">
              {/* Crina (parte que toca nas cordas) */}
              <rect x="-120" y="2" width="240" height="4" fill="#FEF3D8" rx="2" />

              {/* Vareta */}
              <rect x="-130" y="-8" width="260" height="8" fill="#E86C2D" rx="4" />
              <rect x="-130" y="-8" width="260" height="3" fill="#F09C6D" rx="2" opacity="0.5" />

              {/* Talão (Frog) - lado direito */}
              <g transform="translate(115, -12)">
                <path d="M0,0 L40,0 L40,20 L8,20 C0,20 0,0 0,0 Z" fill="#4A1C17" />
                <circle cx="45" cy="10" r="6" fill="#D1D5DB" />
                <circle cx="20" cy="10" r="5" fill="#D1D5DB" />
              </g>

              {/* Ponta - lado esquerdo */}
              <path d="M-130,-8 L-145,0 L-130,8 Z" fill="#FCEBB6" />
            </g>

          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedViolin;
