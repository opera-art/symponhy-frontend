'use client';

import React from 'react';

interface PixelMaestroProps {
  size?: number;
  isAnimating?: boolean;
}

export const PixelMaestro: React.FC<PixelMaestroProps> = ({
  size = 64,
  isAnimating = true
}) => {
  const scale = size / 32;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="pixel-art"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Floor Shadow */}
      <rect x="10" y="27" width="12" height="2" fill="#000000" opacity="0.1" rx="1" />

      {/* Podium Base */}
      <rect x="8" y="28" width="16" height="4" fill="#78350F" />
      <rect x="9" y="28" width="14" height="1" fill="#92400E" />

      {/* Character Group */}
      <g>
        {/* LEGS/PANTS */}
        <rect x="13" y="21" width="2" height="7" fill="#1E293B" />
        <rect x="17" y="21" width="2" height="7" fill="#1E293B" />
        <rect x="12" y="27" width="3" height="1" fill="#0F172A" />
        <rect x="17" y="27" width="3" height="1" fill="#0F172A" />

        {/* BODY (Tailcoat Tuxedo) */}
        <rect x="12" y="14" width="8" height="8" fill="#1E293B" />
        <rect x="13" y="20" width="1" height="4" fill="#1E293B" />
        <rect x="18" y="20" width="1" height="4" fill="#1E293B" />

        <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
        <rect x="15" y="15" width="2" height="1" fill="#000000" />
        <rect x="14" y="20" width="4" height="1" fill="#E2E8F0" />

        {/* HEAD (Animated Bob) */}
        <g className={isAnimating ? 'animate-head' : ''}>
          <rect x="11" y="5" width="10" height="9" fill="#FFDFC4" />
          {/* Hair - Grey/White for Maestro */}
          <rect x="10" y="4" width="12" height="3" fill="#94A3B8" />
          <rect x="10" y="5" width="1" height="6" fill="#94A3B8" />
          <rect x="21" y="5" width="1" height="6" fill="#94A3B8" />
          <rect x="12" y="5" width="2" height="2" fill="#94A3B8" />

          {/* Face Details */}
          <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
          <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
          <rect x="15" y="11" width="2" height="1" fill="#E5B89F" />
          <rect x="20" y="8" width="1" height="3" fill="#FFDFC4" />
        </g>

        {/* ARMS */}
        {/* Left Arm */}
        <g className={isAnimating ? 'animate-left-arm' : ''}>
          <rect x="8" y="14" width="4" height="2" fill="#1E293B" />
          <rect x="7" y="12" width="2" height="3" fill="#1E293B" />
          <rect x="6" y="10" width="3" height="3" fill="#FFDFC4" />
        </g>

        {/* Right Arm with Baton */}
        <g className={isAnimating ? 'animate-baton' : ''}>
          <rect x="20" y="14" width="4" height="2" fill="#1E293B" />
          <rect x="23" y="12" width="2" height="3" fill="#1E293B" />
          <rect x="23" y="10" width="3" height="3" fill="#FFDFC4" />

          {/* The Baton */}
          <rect x="25" y="5" width="1" height="7" fill="#FDE047" />
          <rect x="24" y="11" width="1" height="1" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );
};
