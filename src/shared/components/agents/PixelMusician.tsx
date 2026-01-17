'use client';

import React from 'react';

type InstrumentType = 'violin' | 'cello' | 'flute' | 'trumpet' | 'drums';
type HairColor = '#1E293B' | '#8B5CF6' | '#F59E0B' | '#EF4444' | '#10B981';

interface PixelMusicianProps {
  instrument: InstrumentType;
  hairColor?: HairColor;
  size?: number;
  isPlaying?: boolean;
  name?: string;
  role?: string;
}

export const PixelMusician: React.FC<PixelMusicianProps> = ({
  instrument,
  hairColor = '#1E293B',
  size = 48,
  isPlaying = true,
  name,
  role
}) => {
  const renderInstrument = () => {
    switch (instrument) {
      case 'violin':
        return (
          <g className={isPlaying ? 'animate-violin' : ''}>
            {/* Violin Body */}
            <rect x="6" y="10" width="4" height="6" fill="#92400E" />
            <rect x="7" y="11" width="2" height="4" fill="#78350F" />
            {/* Neck */}
            <rect x="4" y="7" width="1" height="5" fill="#451A03" />
            {/* Bow */}
            <rect x="2" y="12" width="6" height="1" fill="#FDE047" />
          </g>
        );
      case 'cello':
        return (
          <g className={isPlaying ? 'animate-cello' : ''}>
            {/* Cello Body */}
            <rect x="4" y="14" width="5" height="10" fill="#92400E" />
            <rect x="5" y="15" width="3" height="8" fill="#78350F" />
            {/* Neck */}
            <rect x="6" y="8" width="1" height="6" fill="#451A03" />
            {/* Bow */}
            <rect x="1" y="18" width="5" height="1" fill="#FDE047" />
          </g>
        );
      case 'flute':
        return (
          <g className={isPlaying ? 'animate-flute' : ''}>
            {/* Flute */}
            <rect x="2" y="11" width="8" height="1" fill="#CBD5E1" />
            <rect x="3" y="11" width="1" height="1" fill="#94A3B8" />
            <rect x="5" y="11" width="1" height="1" fill="#94A3B8" />
            <rect x="7" y="11" width="1" height="1" fill="#94A3B8" />
          </g>
        );
      case 'trumpet':
        return (
          <g className={isPlaying ? 'animate-trumpet' : ''}>
            {/* Trumpet */}
            <rect x="2" y="10" width="6" height="2" fill="#FDE047" />
            <rect x="1" y="9" width="2" height="4" fill="#FCD34D" />
            <rect x="7" y="9" width="2" height="4" fill="#F59E0B" />
          </g>
        );
      case 'drums':
        return (
          <g className={isPlaying ? 'animate-drums' : ''}>
            {/* Drum */}
            <rect x="3" y="20" width="8" height="5" fill="#DC2626" />
            <rect x="3" y="20" width="8" height="1" fill="#FECACA" />
            {/* Drumsticks */}
            <rect x="2" y="17" width="1" height="4" fill="#FDE047" />
            <rect x="11" y="17" width="1" height="4" fill="#FDE047" />
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 24 32"
        width={size * 0.75}
        height={size}
        className="pixel-art"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Shadow */}
        <rect x="6" y="28" width="12" height="2" fill="#000000" opacity="0.1" />

        {/* Chair/Stool */}
        <rect x="7" y="24" width="10" height="4" fill="#475569" />
        <rect x="8" y="28" width="2" height="2" fill="#334155" />
        <rect x="14" y="28" width="2" height="2" fill="#334155" />

        {/* Legs */}
        <rect x="9" y="20" width="2" height="6" fill="#1E293B" />
        <rect x="13" y="20" width="2" height="6" fill="#1E293B" />
        <rect x="8" y="25" width="3" height="1" fill="#0F172A" />
        <rect x="13" y="25" width="3" height="1" fill="#0F172A" />

        {/* Body */}
        <rect x="8" y="12" width="8" height="9" fill="#1E293B" />
        <rect x="11" y="12" width="2" height="9" fill="#FFFFFF" />
        <rect x="11" y="13" width="2" height="1" fill="#6366F1" /> {/* Colored tie */}

        {/* Head */}
        <g className={isPlaying ? 'animate-musician-head' : ''}>
          <rect x="8" y="4" width="8" height="8" fill="#FFDFC4" />
          {/* Hair */}
          <rect x="7" y="3" width="10" height="3" fill={hairColor} />
          <rect x="7" y="4" width="1" height="4" fill={hairColor} />
          <rect x="16" y="4" width="1" height="4" fill={hairColor} />
          {/* Eyes */}
          <rect x="9" y="7" width="2" height="1" fill="#1E293B" />
          <rect x="13" y="7" width="2" height="1" fill="#1E293B" />
          {/* Mouth */}
          <rect x="11" y="10" width="2" height="1" fill="#E5B89F" />
        </g>

        {/* Arms */}
        <rect x="5" y="12" width="3" height="2" fill="#1E293B" />
        <rect x="16" y="12" width="3" height="2" fill="#1E293B" />
        <rect x="4" y="10" width="2" height="4" fill="#FFDFC4" />
        <rect x="18" y="10" width="2" height="4" fill="#FFDFC4" />

        {/* Instrument */}
        {renderInstrument()}
      </svg>

      {name && (
        <div className="text-center">
          <p className="text-[10px] font-semibold text-slate-700 leading-tight">{name}</p>
          {role && <p className="text-[8px] text-slate-500">{role}</p>}
        </div>
      )}
    </div>
  );
};
