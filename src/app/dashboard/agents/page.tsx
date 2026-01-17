'use client';

import React, { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout';
import {
  Bot,
  Star,
  Download,
  ArrowRight,
  Flame,
  Megaphone,
  PenTool,
  Microscope,
  Settings2,
  Users2,
  LayoutGrid,
  Store,
  Music,
  Play,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

// Tab types
type TabType = 'marketplace' | 'scenario';

// Pixel Art Musicians SVG Components
const PixelViolinist = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#8B5CF6" />
    <rect x="9" y="5" width="2" height="4" fill="#8B5CF6" />
    <rect x="21" y="5" width="2" height="4" fill="#8B5CF6" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body - Tuxedo */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#8B5CF6" />
    {/* Legs */}
    <rect x="12" y="22" width="3" height="6" fill="#1E293B" />
    <rect x="17" y="22" width="3" height="6" fill="#1E293B" />
    {/* Shoes */}
    <rect x="11" y="27" width="4" height="2" fill="#0F172A" />
    <rect x="17" y="27" width="4" height="2" fill="#0F172A" />
    {/* Arms */}
    <rect x="7" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="21" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="5" y="12" width="3" height="4" fill="#FFDFC4" />
    <rect x="24" y="12" width="3" height="4" fill="#FFDFC4" />
    {/* Violin */}
    <rect x="3" y="16" width="5" height="7" fill="#92400E" />
    <rect x="4" y="17" width="3" height="5" fill="#78350F" />
    <rect x="5" y="12" width="1" height="5" fill="#451A03" />
    {/* Bow */}
    <rect x="1" y="19" width="6" height="1" fill="#FDE047" />
  </svg>
);

const PixelCellist = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#F59E0B" />
    <rect x="9" y="5" width="2" height="4" fill="#F59E0B" />
    <rect x="21" y="5" width="2" height="4" fill="#F59E0B" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#F59E0B" />
    {/* Legs on chair */}
    <rect x="12" y="22" width="3" height="4" fill="#1E293B" />
    <rect x="17" y="22" width="3" height="4" fill="#1E293B" />
    {/* Chair */}
    <rect x="10" y="25" width="12" height="3" fill="#475569" />
    <rect x="11" y="28" width="2" height="2" fill="#334155" />
    <rect x="19" y="28" width="2" height="2" fill="#334155" />
    {/* Arms */}
    <rect x="7" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="5" y="16" width="3" height="3" fill="#FFDFC4" />
    {/* Cello */}
    <rect x="2" y="16" width="6" height="10" fill="#92400E" />
    <rect x="3" y="17" width="4" height="8" fill="#78350F" />
    <rect x="4" y="10" width="1" height="7" fill="#451A03" />
    {/* Bow */}
    <rect x="0" y="22" width="5" height="1" fill="#FDE047" />
  </svg>
);

const PixelFlutist = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#10B981" />
    <rect x="9" y="5" width="2" height="4" fill="#10B981" />
    <rect x="21" y="5" width="2" height="4" fill="#10B981" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#10B981" />
    {/* Legs */}
    <rect x="12" y="22" width="3" height="6" fill="#1E293B" />
    <rect x="17" y="22" width="3" height="6" fill="#1E293B" />
    {/* Shoes */}
    <rect x="11" y="27" width="4" height="2" fill="#0F172A" />
    <rect x="17" y="27" width="4" height="2" fill="#0F172A" />
    {/* Arms holding flute */}
    <rect x="7" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="21" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="5" y="11" width="3" height="3" fill="#FFDFC4" />
    <rect x="24" y="11" width="3" height="3" fill="#FFDFC4" />
    {/* Flute */}
    <rect x="3" y="12" width="10" height="1" fill="#CBD5E1" />
    <rect x="4" y="12" width="1" height="1" fill="#94A3B8" />
    <rect x="6" y="12" width="1" height="1" fill="#94A3B8" />
    <rect x="8" y="12" width="1" height="1" fill="#94A3B8" />
  </svg>
);

const PixelTrumpeter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#EF4444" />
    <rect x="9" y="5" width="2" height="4" fill="#EF4444" />
    <rect x="21" y="5" width="2" height="4" fill="#EF4444" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#EF4444" />
    {/* Legs */}
    <rect x="12" y="22" width="3" height="6" fill="#1E293B" />
    <rect x="17" y="22" width="3" height="6" fill="#1E293B" />
    {/* Shoes */}
    <rect x="11" y="27" width="4" height="2" fill="#0F172A" />
    <rect x="17" y="27" width="4" height="2" fill="#0F172A" />
    {/* Arms */}
    <rect x="7" y="14" width="4" height="2" fill="#1E293B" />
    <rect x="5" y="10" width="3" height="4" fill="#FFDFC4" />
    {/* Trumpet */}
    <rect x="1" y="11" width="6" height="2" fill="#FDE047" />
    <rect x="0" y="10" width="2" height="4" fill="#FCD34D" />
    <rect x="6" y="10" width="2" height="4" fill="#F59E0B" />
  </svg>
);

const PixelDrummer = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#1E293B" />
    <rect x="9" y="5" width="2" height="4" fill="#1E293B" />
    <rect x="21" y="5" width="2" height="4" fill="#1E293B" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#6366F1" />
    {/* Legs on stool */}
    <rect x="12" y="22" width="3" height="3" fill="#1E293B" />
    <rect x="17" y="22" width="3" height="3" fill="#1E293B" />
    {/* Stool */}
    <rect x="10" y="24" width="12" height="2" fill="#475569" />
    {/* Arms up with sticks */}
    <rect x="7" y="12" width="4" height="2" fill="#1E293B" />
    <rect x="21" y="12" width="4" height="2" fill="#1E293B" />
    <rect x="5" y="9" width="3" height="4" fill="#FFDFC4" />
    <rect x="24" y="9" width="3" height="4" fill="#FFDFC4" />
    {/* Drumsticks */}
    <rect x="4" y="6" width="1" height="5" fill="#FDE047" />
    <rect x="27" y="6" width="1" height="5" fill="#FDE047" />
    {/* Drum */}
    <rect x="8" y="26" width="16" height="4" fill="#DC2626" />
    <rect x="8" y="26" width="16" height="1" fill="#FECACA" />
  </svg>
);

const PixelPianist = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair */}
    <rect x="10" y="3" width="12" height="4" fill="#6366F1" />
    <rect x="9" y="5" width="2" height="4" fill="#6366F1" />
    <rect x="21" y="5" width="2" height="4" fill="#6366F1" />
    {/* Face */}
    <rect x="11" y="6" width="10" height="8" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="13" y="9" width="2" height="1" fill="#1E293B" />
    <rect x="17" y="9" width="2" height="1" fill="#1E293B" />
    {/* Body */}
    <rect x="11" y="14" width="10" height="8" fill="#1E293B" />
    <rect x="15" y="14" width="2" height="8" fill="#FFFFFF" />
    <rect x="15" y="15" width="2" height="1" fill="#6366F1" />
    {/* Arms on keys */}
    <rect x="7" y="16" width="4" height="2" fill="#1E293B" />
    <rect x="21" y="16" width="4" height="2" fill="#1E293B" />
    <rect x="4" y="18" width="4" height="2" fill="#FFDFC4" />
    <rect x="24" y="18" width="4" height="2" fill="#FFDFC4" />
    {/* Piano keys */}
    <rect x="2" y="20" width="28" height="4" fill="#FFFFFF" />
    <rect x="4" y="20" width="2" height="3" fill="#1E293B" />
    <rect x="8" y="20" width="2" height="3" fill="#1E293B" />
    <rect x="14" y="20" width="2" height="3" fill="#1E293B" />
    <rect x="18" y="20" width="2" height="3" fill="#1E293B" />
    <rect x="22" y="20" width="2" height="3" fill="#1E293B" />
    <rect x="26" y="20" width="2" height="3" fill="#1E293B" />
    {/* Piano body */}
    <rect x="2" y="24" width="28" height="6" fill="#451A03" />
    {/* Bench */}
    <rect x="10" y="22" width="12" height="2" fill="#78350F" />
  </svg>
);

// Agent data with musicians
const featuredAgents = [
  {
    id: 'harmonia',
    name: 'Harmonia, Content Creator',
    description: 'Creates personalized content for all your social media platforms with AI-powered copywriting',
    creator: 'Violin AI',
    icon: PixelViolinist,
    color: 'bg-purple-50',
    tagColor: 'text-purple-700 bg-white/60 border-purple-100',
    rating: 4.8,
    reviews: 127,
    downloads: 2543,
    price: 'Free',
  },
  {
    id: 'tempo',
    name: 'Tempo, Smart Scheduler',
    description: 'Automatically schedules your posts at optimal times based on audience engagement patterns',
    creator: 'Violin AI',
    icon: PixelDrummer,
    color: 'bg-amber-50',
    tagColor: 'text-amber-700 bg-white/60 border-amber-100',
    rating: 4.6,
    reviews: 89,
    downloads: 1876,
    price: 'Free',
  },
  {
    id: 'melody',
    name: 'Melody, Analytics Expert',
    description: 'Deep analysis of your metrics with actionable insights and performance recommendations',
    creator: 'Violin AI',
    icon: PixelFlutist,
    color: 'bg-emerald-50',
    tagColor: 'text-emerald-700 bg-white/60 border-emerald-100',
    rating: 4.7,
    reviews: 156,
    downloads: 3201,
    price: 'Free',
  },
  {
    id: 'rhythm',
    name: 'Rhythm, Engagement Manager',
    description: 'Monitors and responds to comments, DMs and mentions to keep your audience engaged',
    creator: 'Violin AI',
    icon: PixelTrumpeter,
    color: 'bg-rose-50',
    tagColor: 'text-rose-700 bg-white/60 border-rose-100',
    rating: 4.5,
    reviews: 67,
    downloads: 1234,
    price: '$4.99/mo',
  },
  {
    id: 'cadenza',
    name: 'Cadenza, Strategy Planner',
    description: 'Plans your content strategy based on trends, competitors and audience preferences',
    creator: 'Violin AI',
    icon: PixelCellist,
    color: 'bg-blue-50',
    tagColor: 'text-blue-700 bg-white/60 border-blue-100',
    rating: 4.9,
    reviews: 203,
    downloads: 4521,
    price: 'Free',
  },
  {
    id: 'sonata',
    name: 'Sonata, Visual Designer',
    description: 'Generates stunning visuals, carousels and video thumbnails for your social posts',
    creator: 'Violin AI',
    icon: PixelPianist,
    color: 'bg-indigo-50',
    tagColor: 'text-indigo-700 bg-white/60 border-indigo-100',
    rating: 4.4,
    reviews: 45,
    downloads: 987,
    price: '$2.99/mo',
  },
];

const categories = [
  { id: 'sales', icon: Flame, label: 'sales', count: 24, color: 'text-red-500', fill: 'fill-red-100' },
  { id: 'marketing', icon: Megaphone, label: 'marketing', count: 31, color: 'text-orange-500', fill: 'fill-orange-100' },
  { id: 'content', icon: PenTool, label: 'contentCreation', count: 45, color: 'text-yellow-500', fill: 'fill-yellow-100' },
  { id: 'research', icon: Microscope, label: 'research', count: 18, color: 'text-green-600', fill: '' },
  { id: 'operations', icon: Settings2, label: 'operations', count: 22, color: 'text-blue-600', fill: '' },
  { id: 'hr', icon: Users2, label: 'hrTalent', count: 8, color: 'text-purple-600', fill: 'fill-purple-100' },
];

// Chat messages for the scenario
const chatMessages = [
  { user: 'Harmonia', message: 'Creating your next viral post!', color: '#F472B6' },
  { user: 'Tempo', message: 'Scheduling optimized for max reach', color: '#FBBF24' },
  { user: 'Melody', message: 'Engagement up 23% this week!', color: '#34D399' },
  { user: 'Cadenza', message: 'New trend detected in your niche', color: '#60A5FA' },
];

// Habbo-style Isometric Tile Component (2:1 ratio - 64x32)
const IsoTile = ({ x, y, color, stroke = "#1a1a1a" }: { x: number; y: number; color: string; stroke?: string }) => {
  // Convert grid position to isometric screen position
  const screenX = (x - y) * 32 + 400; // 32 = half tile width
  const screenY = (x + y) * 16 + 100; // 16 = half tile height

  return (
    <polygon
      points={`${screenX},${screenY - 16} ${screenX + 32},${screenY} ${screenX},${screenY + 16} ${screenX - 32},${screenY}`}
      fill={color}
      stroke={stroke}
      strokeWidth="1"
    />
  );
};

// Habbo-style Wall (left side)
const IsoWallLeft = ({ x, y, height, color }: { x: number; y: number; height: number; color: string }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Wall face */}
      <polygon
        points={`${screenX - 32},${screenY} ${screenX - 32},${screenY - height} ${screenX},${screenY - 16 - height} ${screenX},${screenY - 16}`}
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Wall top */}
      <polygon
        points={`${screenX - 32},${screenY - height} ${screenX},${screenY - 16 - height} ${screenX + 32},${screenY - height} ${screenX},${screenY + 16 - height}`}
        fill={adjustBrightness(color, 20)}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </g>
  );
};

// Habbo-style Wall (right side)
const IsoWallRight = ({ x, y, height, color }: { x: number; y: number; height: number; color: string }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Wall face */}
      <polygon
        points={`${screenX},${screenY - 16} ${screenX},${screenY - 16 - height} ${screenX + 32},${screenY - height} ${screenX + 32},${screenY}`}
        fill={adjustBrightness(color, -15)}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </g>
  );
};

// Helper to adjust color brightness
const adjustBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

// Habbo-style Furniture: Stage Platform
const IsoStagePlatform = ({ x, y }: { x: number; y: number }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;
  const platformHeight = 12;

  return (
    <g>
      {/* Platform top */}
      <polygon
        points={`${screenX},${screenY - 16 - platformHeight} ${screenX + 64},${screenY - platformHeight} ${screenX},${screenY + 16 - platformHeight} ${screenX - 64},${screenY - platformHeight}`}
        fill="#8B4513"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Platform front left */}
      <polygon
        points={`${screenX - 64},${screenY - platformHeight} ${screenX},${screenY + 16 - platformHeight} ${screenX},${screenY + 16} ${screenX - 64},${screenY}`}
        fill="#6B3410"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Platform front right */}
      <polygon
        points={`${screenX},${screenY + 16 - platformHeight} ${screenX + 64},${screenY - platformHeight} ${screenX + 64},${screenY} ${screenX},${screenY + 16}`}
        fill="#5B2D0F"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </g>
  );
};

// Habbo-style Furniture: Chair
const IsoChair = ({ x, y, color = "#dc2626" }: { x: number; y: number; color?: string }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Seat */}
      <polygon
        points={`${screenX},${screenY - 24} ${screenX + 12},${screenY - 18} ${screenX},${screenY - 12} ${screenX - 12},${screenY - 18}`}
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Back */}
      <polygon
        points={`${screenX - 12},${screenY - 18} ${screenX - 12},${screenY - 38} ${screenX},${screenY - 44} ${screenX},${screenY - 24}`}
        fill={adjustBrightness(color, -20)}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Legs */}
      <line x1={screenX - 10} y1={screenY - 16} x2={screenX - 10} y2={screenY - 4} stroke="#1a1a1a" strokeWidth="2" />
      <line x1={screenX + 10} y1={screenY - 16} x2={screenX + 10} y2={screenY - 4} stroke="#1a1a1a" strokeWidth="2" />
    </g>
  );
};

// Habbo-style Furniture: Music Stand
const IsoMusicStand = ({ x, y }: { x: number; y: number }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Stand pole */}
      <line x1={screenX} y1={screenY - 5} x2={screenX} y2={screenY - 35} stroke="#1a1a1a" strokeWidth="2" />
      {/* Sheet holder */}
      <polygon
        points={`${screenX - 10},${screenY - 35} ${screenX + 10},${screenY - 35} ${screenX + 10},${screenY - 50} ${screenX - 10},${screenY - 50}`}
        fill="#f5f5f4"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Music notes on sheet */}
      <circle cx={screenX - 4} cy={screenY - 42} r="2" fill="#1a1a1a" />
      <circle cx={screenX + 4} cy={screenY - 45} r="2" fill="#1a1a1a" />
    </g>
  );
};

// Habbo-style Furniture: Grand Piano
const IsoPiano = ({ x, y }: { x: number; y: number }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Piano body - top */}
      <polygon
        points={`${screenX - 40},${screenY - 30} ${screenX + 20},${screenY - 60} ${screenX + 50},${screenY - 45} ${screenX - 10},${screenY - 15}`}
        fill="#1a1a1a"
        stroke="#0a0a0a"
        strokeWidth="1"
      />
      {/* Piano body - front */}
      <polygon
        points={`${screenX - 10},${screenY - 15} ${screenX + 50},${screenY - 45} ${screenX + 50},${screenY - 20} ${screenX - 10},${screenY + 10}`}
        fill="#2d2d2d"
        stroke="#0a0a0a"
        strokeWidth="1"
      />
      {/* Piano body - side */}
      <polygon
        points={`${screenX - 40},${screenY - 30} ${screenX - 10},${screenY - 15} ${screenX - 10},${screenY + 10} ${screenX - 40},${screenY - 5}`}
        fill="#404040"
        stroke="#0a0a0a"
        strokeWidth="1"
      />
      {/* Keys */}
      <polygon
        points={`${screenX - 5},${screenY - 12} ${screenX + 25},${screenY - 27} ${screenX + 25},${screenY - 22} ${screenX - 5},${screenY - 7}`}
        fill="#f5f5f4"
        stroke="#0a0a0a"
        strokeWidth="1"
      />
      {/* Black keys */}
      {[0, 1, 3, 4, 5].map(i => (
        <rect key={i} x={screenX - 3 + i * 5} y={screenY - 11 - i * 2.5} width="3" height="4" fill="#1a1a1a" />
      ))}
    </g>
  );
};

// Habbo-style Plant
const IsoPlant = ({ x, y }: { x: number; y: number }) => {
  const screenX = (x - y) * 32 + 400;
  const screenY = (x + y) * 16 + 100;

  return (
    <g>
      {/* Pot */}
      <polygon
        points={`${screenX - 10},${screenY - 8} ${screenX + 10},${screenY - 8} ${screenX + 8},${screenY + 4} ${screenX - 8},${screenY + 4}`}
        fill="#c2410c"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Soil */}
      <ellipse cx={screenX} cy={screenY - 8} rx="10" ry="4" fill="#78350f" stroke="#1a1a1a" strokeWidth="1" />
      {/* Leaves */}
      <ellipse cx={screenX - 8} cy={screenY - 25} rx="8" ry="12" fill="#22c55e" stroke="#1a1a1a" strokeWidth="1" />
      <ellipse cx={screenX + 8} cy={screenY - 28} rx="8" ry="12" fill="#16a34a" stroke="#1a1a1a" strokeWidth="1" />
      <ellipse cx={screenX} cy={screenY - 32} rx="7" ry="10" fill="#4ade80" stroke="#1a1a1a" strokeWidth="1" />
    </g>
  );
};

// Habbo-style Chandelier
const IsoChandelier = ({ x, y }: { x: number; y: number }) => {
  const screenX = x;
  const screenY = y;

  return (
    <g>
      {/* Chain */}
      <line x1={screenX} y1={screenY - 60} x2={screenX} y2={screenY - 40} stroke="#fbbf24" strokeWidth="2" />
      {/* Main body */}
      <polygon
        points={`${screenX},${screenY - 40} ${screenX + 30},${screenY - 25} ${screenX},${screenY - 15} ${screenX - 30},${screenY - 25}`}
        fill="#fbbf24"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Candles */}
      {[-20, 0, 20].map((offset, i) => (
        <g key={i}>
          <rect x={screenX + offset - 3} y={screenY - 35 - Math.abs(offset) * 0.3} width="6" height="10" fill="#f5f5f4" stroke="#1a1a1a" strokeWidth="1" />
          <ellipse
            cx={screenX + offset}
            cy={screenY - 40 - Math.abs(offset) * 0.3}
            rx="4"
            ry="6"
            fill="#fde047"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        </g>
      ))}
    </g>
  );
};

// Isometric Room Scenario Component - Authentic Habbo Style
const OrchestraScenario: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % chatMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Floor tile colors - warm wood tones
  const floorColor1 = "#d4a574";
  const floorColor2 = "#c4956a";
  const wallColor = "#7c9885";
  const wallColorDark = "#5a7562";

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] bg-[#1e3a5f] rounded-2xl overflow-hidden">
      {/* SVG Room */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Background - Dark blue gradient like Habbo night scene */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#bgGradient)" />

        {/* Back Wall */}
        {[...Array(12)].map((_, i) => (
          <IsoWallLeft key={`wall-l-${i}`} x={i - 6} y={-6} height={120} color={wallColor} />
        ))}
        {[...Array(12)].map((_, i) => (
          <IsoWallRight key={`wall-r-${i}`} x={5} y={i - 6} height={120} color={wallColorDark} />
        ))}

        {/* Window on left wall */}
        <rect x="180" y="50" width="40" height="50" fill="#1e3a5f" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="200" y1="50" x2="200" y2="100" stroke="#5a7562" strokeWidth="2" />
        <line x1="180" y1="75" x2="220" y2="75" stroke="#5a7562" strokeWidth="2" />

        {/* Window on right wall */}
        <rect x="580" y="50" width="40" height="50" fill="#1e3a5f" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="600" y1="50" x2="600" y2="100" stroke="#5a7562" strokeWidth="2" />
        <line x1="580" y1="75" x2="620" y2="75" stroke="#5a7562" strokeWidth="2" />

        {/* Floor Tiles - Checkered pattern */}
        {[...Array(10)].map((_, row) =>
          [...Array(10)].map((_, col) => (
            <IsoTile
              key={`tile-${row}-${col}`}
              x={col - 3}
              y={row - 3}
              color={(row + col) % 2 === 0 ? floorColor1 : floorColor2}
            />
          ))
        )}

        {/* Stage Platform */}
        <IsoStagePlatform x={1} y={1} />

        {/* Chandelier */}
        <IsoChandelier x={400} y={120} />

        {/* Red Carpet - center aisle */}
        {[0, 1, 2, 3].map(i => (
          <IsoTile key={`carpet-${i}`} x={i - 1} y={4 + i} color="#991b1b" stroke="#7f1d1d" />
        ))}

        {/* Plants */}
        <IsoPlant x={-4} y={-2} />
        <IsoPlant x={5} y={-2} />
        <IsoPlant x={-4} y={5} />
        <IsoPlant x={5} y={5} />

        {/* Grand Piano */}
        <IsoPiano x={-2} y={-1} />

        {/* Music Stands */}
        <IsoMusicStand x={0} y={0} />
        <IsoMusicStand x={2} y={0} />
        <IsoMusicStand x={1} y={2} />

        {/* Chairs for musicians */}
        <IsoChair x={-1} y={1} color="#dc2626" />
        <IsoChair x={1} y={1} color="#dc2626" />
        <IsoChair x={3} y={1} color="#dc2626" />
        <IsoChair x={0} y={3} color="#dc2626" />
        <IsoChair x={2} y={3} color="#dc2626" />
      </svg>

      {/* Musicians Layer - positioned over SVG */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pianist at piano */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '28%', top: '42%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Sonata
          </div>
          <PixelPianist className="w-10 h-10" />
        </div>

        {/* Violinist */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '40%', top: '48%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Harmonia
          </div>
          <PixelViolinist className="w-10 h-10" />
        </div>

        {/* Cellist */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '52%', top: '48%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Cadenza
          </div>
          <PixelCellist className="w-10 h-10" />
        </div>

        {/* Flutist */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '64%', top: '48%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Melody
          </div>
          <PixelFlutist className="w-10 h-10" />
        </div>

        {/* Trumpeter - front */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '46%', top: '58%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Rhythm
          </div>
          <PixelTrumpeter className="w-10 h-10" />
        </div>

        {/* Drummer */}
        <div className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform" style={{ left: '58%', top: '58%' }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" style={{ fontFamily: 'monospace' }}>
            Tempo
          </div>
          <PixelDrummer className="w-10 h-10" />
        </div>
      </div>

      {/* Chat Bubbles - Habbo style */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-20">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 transform border-2 border-black/20',
              currentMessage === index
                ? 'opacity-100 scale-100'
                : 'opacity-30 scale-95'
            )}
            style={{
              backgroundColor: msg.color,
              fontFamily: 'monospace',
              imageRendering: 'pixelated'
            }}
          >
            <span className="text-white font-bold">{msg.user}:</span>
            <span className="text-white/90 ml-1">{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Now Playing Widget - Habbo style */}
      <div className="absolute bottom-4 right-4 bg-[#1a1a1a]/90 rounded-lg p-3 flex items-center gap-3 border-2 border-[#333] z-20" style={{ fontFamily: 'monospace' }}>
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-600 rounded flex items-center justify-center border-2 border-black">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-gold text-xs font-bold uppercase">Now Playing</p>
          <p className="text-white text-[10px]">Symphony of Content</p>
          <p className="text-white/50 text-[8px]">by: Violin Orchestra</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-7 h-7 bg-[#333] hover:bg-[#444] rounded flex items-center justify-center transition-colors border border-[#555]"
        >
          {isPlaying ? (
            <Volume2 className="w-3 h-3 text-gold" />
          ) : (
            <Play className="w-3 h-3 text-gold" />
          )}
        </button>
      </div>

      {/* Room Info - Habbo style */}
      <div className="absolute bottom-4 left-4 bg-[#1a1a1a]/90 rounded-lg p-3 border-2 border-[#333] z-20" style={{ fontFamily: 'monospace' }}>
        <p className="text-gold text-xs font-bold">Studio: Violin Orchestra Hall</p>
        <p className="text-white/60 text-[10px]">Owner: ViolinAI</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex -space-x-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-black"
                style={{ backgroundColor: ['#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#6366f1', '#64748b'][i] }}
              />
            ))}
          </div>
          <span className="text-white/40 text-[10px]">6 agents online</span>
        </div>
      </div>
    </div>
  );
};

const AgentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('marketplace');

  return (
    <>
      <Topbar />

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === 'marketplace'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Store className="w-4 h-4" />
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('scenario')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === 'scenario'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Music className="w-4 h-4" />
            {t('scenario') || 'Cenário'}
          </button>
        </div>
      </div>

      {/* Scenario Tab */}
      {activeTab === 'scenario' && (
        <div className="max-w-7xl mx-auto animate-fade-in">
          <OrchestraScenario />
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Agent Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px] border border-purple-100/50">
            <div className="z-10">
              <span className="inline-block bg-white/60 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full mb-4 border border-purple-100">
                {t('featuredAgent')}
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                Harmonia, Content Creator
              </h1>
              <p className="text-slate-500 text-lg mb-6 max-w-md">
                Create engaging content for all your social media platforms with AI-powered copywriting
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-gold/20 p-1.5 rounded-md">
                  <Bot className="w-4 h-4 text-gold" />
                </div>
                <span className="text-slate-600 font-medium">Violin AI</span>
              </div>
            </div>

            {/* Pixel Art Character */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200/50 rounded-xl overflow-hidden shadow-sm hidden md:flex items-center justify-center border-4 border-white/50">
              <PixelViolinist className="w-32 h-32" />
            </div>

            {/* Carousel Indicators */}
            <div className="flex items-center gap-2 mt-auto pt-8">
              <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-purple-200 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-purple-200 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-purple-200 rounded-full"></div>
            </div>
          </div>

          {/* Top Creator Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 relative flex flex-col justify-between min-h-[320px] border border-amber-100/50">
            <div>
              <span className="inline-block bg-white/60 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-full mb-4 border border-amber-100">
                {t('topCreator')}
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">Violin Orchestra</h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Scale your social media with AI Agents that work 24/7 and create content that resonates
              </p>
            </div>
            <div className="self-end mt-4">
              <LayoutGrid className="w-10 h-10 text-amber-900 fill-amber-900/20" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={cn(
                  'group bg-slate-50 hover:bg-slate-100 rounded-xl p-5 transition-colors cursor-pointer text-left',
                  selectedCategory === category.id && 'bg-gold/10 ring-2 ring-gold/30'
                )}
              >
                <Icon className={cn('w-6 h-6 mb-3', category.color, category.fill)} />
                <h3 className="font-medium text-slate-900 text-base">{t(category.label as any)}</h3>
                <p className="text-slate-500 text-sm mt-1">{category.count} {t('templates')}</p>
              </button>
            );
          })}
        </div>

        {/* Featured Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t('featuredAgent')}</h2>
            <a href="#" className="text-gold text-sm font-medium hover:text-gold/80 flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAgents.slice(0, 3).map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col h-full group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', agent.color)}>
                      <IconComponent className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="font-medium text-slate-900 text-lg mb-2 group-hover:text-gold transition-colors">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Agent
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {agent.rating} ({agent.reviews})
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> {agent.downloads.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {agent.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-[10px] text-white font-bold">V</div>
                      <span className="text-slate-600 text-xs font-medium">{agent.creator}</span>
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      agent.price === 'Free' ? 'text-slate-400' : 'text-slate-900'
                    )}>
                      {agent.price === 'Free' ? t('free') : agent.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Agents Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t('topAgents')}</h2>
            <a href="#" className="text-gold text-sm font-medium hover:text-gold/80 flex items-center gap-1">
              {t('viewAllAgents')} <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAgents.slice(3).map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col h-full group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', agent.color)}>
                      <IconComponent className="w-10 h-10" />
                    </div>
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-indigo-500">IG</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-blue-500">TW</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-slate-900 text-lg mb-2 group-hover:text-gold transition-colors">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Agent
                    </div>
                    {agent.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {agent.rating} ({agent.reviews})
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> {agent.downloads.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {agent.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-[10px] text-white font-bold">V</div>
                      <span className="text-slate-600 text-xs font-medium">{agent.creator}</span>
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      agent.price === 'Free' ? 'text-slate-400' : 'text-slate-900'
                    )}>
                      {agent.price === 'Free' ? t('free') : agent.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      <style jsx global>{`
        .pixel-art {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-60px) rotate(10deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-120px) rotate(-5deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default AgentsPage;
