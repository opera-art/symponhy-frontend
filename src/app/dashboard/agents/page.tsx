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

// Pixel Art Conductor/Maestro
const PixelConductor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 48" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Hair - back view */}
    <rect x="10" y="2" width="12" height="5" fill="#1E293B" />
    <rect x="9" y="4" width="2" height="4" fill="#1E293B" />
    <rect x="21" y="4" width="2" height="4" fill="#1E293B" />
    {/* Head - back of head */}
    <rect x="11" y="5" width="10" height="8" fill="#FFDFC4" />
    {/* Neck */}
    <rect x="14" y="13" width="4" height="2" fill="#FFDFC4" />
    {/* Tuxedo body - back view */}
    <rect x="8" y="15" width="16" height="14" fill="#1E293B" />
    {/* Tuxedo tails */}
    <rect x="10" y="29" width="5" height="8" fill="#1E293B" />
    <rect x="17" y="29" width="5" height="8" fill="#1E293B" />
    {/* White collar visible from back */}
    <rect x="12" y="15" width="8" height="2" fill="#FFFFFF" />
    {/* Right arm raised with baton */}
    <rect x="24" y="10" width="3" height="8" fill="#1E293B" />
    <rect x="25" y="6" width="2" height="5" fill="#FFDFC4" />
    {/* Baton */}
    <rect x="25" y="0" width="1" height="8" fill="#F5F5F4" />
    {/* Left arm extended */}
    <rect x="5" y="18" width="3" height="6" fill="#1E293B" />
    <rect x="2" y="17" width="4" height="3" fill="#FFDFC4" />
    {/* Legs */}
    <rect x="12" y="37" width="4" height="8" fill="#1E293B" />
    <rect x="18" y="37" width="4" height="8" fill="#1E293B" />
    {/* Shoes */}
    <rect x="11" y="44" width="5" height="3" fill="#0F172A" />
    <rect x="18" y="44" width="5" height="3" fill="#0F172A" />
  </svg>
);

// Seated Musician Component (for orchestra members)
const PixelSeatedMusician = ({ instrument, hairColor, accentColor, className }: {
  instrument: 'violin' | 'viola' | 'cello' | 'bass';
  hairColor: string;
  accentColor: string;
  className?: string;
}) => (
  <svg viewBox="0 0 40 40" className={cn('pixel-art', className)} style={{ shapeRendering: 'crispEdges' }}>
    {/* Chair */}
    <rect x="12" y="28" width="16" height="3" fill="#1E293B" />
    <rect x="14" y="31" width="2" height="6" fill="#1E293B" />
    <rect x="24" y="31" width="2" height="6" fill="#1E293B" />
    {/* Legs on chair */}
    <rect x="15" y="25" width="4" height="6" fill="#1E293B" />
    <rect x="21" y="25" width="4" height="6" fill="#1E293B" />
    {/* Body - Tuxedo */}
    <rect x="14" y="14" width="12" height="12" fill="#1E293B" />
    <rect x="19" y="14" width="2" height="10" fill="#FFFFFF" />
    <rect x="19" y="16" width="2" height="2" fill={accentColor} />
    {/* Hair */}
    <rect x="15" y="2" width="10" height="4" fill={hairColor} />
    <rect x="14" y="4" width="2" height="3" fill={hairColor} />
    <rect x="24" y="4" width="2" height="3" fill={hairColor} />
    {/* Face */}
    <rect x="16" y="5" width="8" height="9" fill="#FFDFC4" />
    {/* Eyes */}
    <rect x="17" y="8" width="2" height="1" fill="#1E293B" />
    <rect x="21" y="8" width="2" height="1" fill="#1E293B" />
    {/* Arms playing */}
    <rect x="10" y="16" width="4" height="2" fill="#1E293B" />
    <rect x="26" y="16" width="4" height="2" fill="#1E293B" />
    <rect x="7" y="14" width="4" height="4" fill="#FFDFC4" />
    <rect x="29" y="14" width="4" height="4" fill="#FFDFC4" />
    {/* Instrument based on type */}
    {instrument === 'violin' && (
      <>
        <rect x="4" y="18" width="6" height="8" fill="#92400E" />
        <rect x="5" y="19" width="4" height="6" fill="#78350F" />
        <rect x="6" y="12" width="1" height="7" fill="#451A03" />
        <rect x="2" y="22" width="6" height="1" fill="#FDE047" />
      </>
    )}
    {instrument === 'viola' && (
      <>
        <rect x="3" y="17" width="7" height="10" fill="#92400E" />
        <rect x="4" y="18" width="5" height="8" fill="#78350F" />
        <rect x="5" y="11" width="1" height="7" fill="#451A03" />
        <rect x="1" y="23" width="7" height="1" fill="#FDE047" />
      </>
    )}
    {instrument === 'cello' && (
      <>
        <rect x="2" y="14" width="8" height="16" fill="#92400E" />
        <rect x="3" y="15" width="6" height="14" fill="#78350F" />
        <rect x="5" y="4" width="1" height="11" fill="#451A03" />
        <rect x="0" y="26" width="7" height="1" fill="#FDE047" />
      </>
    )}
    {instrument === 'bass' && (
      <>
        <rect x="0" y="10" width="10" height="22" fill="#92400E" />
        <rect x="1" y="11" width="8" height="20" fill="#78350F" />
        <rect x="4" y="0" width="2" height="12" fill="#451A03" />
        <rect x="0" y="28" width="8" height="1" fill="#FDE047" />
      </>
    )}
  </svg>
);

// Music Stand for orchestra
const MusicStandSimple = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Stand pole */}
    <rect x="8" y="15" width="2" height="25" fill="#1E293B" />
    {/* Base */}
    <rect x="4" y="38" width="10" height="2" fill="#1E293B" />
    {/* Sheet holder */}
    <rect x="0" y="0" width="18" height="16" fill="#F5F5F4" stroke="#1E293B" strokeWidth="1" />
    {/* Music lines */}
    {[3, 6, 9, 12].map(y => (
      <line key={y} x1="2" y1={y} x2="16" y2={y} stroke="#CBD5E1" strokeWidth="0.5" />
    ))}
    {/* Notes */}
    <circle cx="5" cy="5" r="1.5" fill="#1E293B" />
    <circle cx="10" cy="8" r="1.5" fill="#1E293B" />
    <circle cx="14" cy="4" r="1.5" fill="#1E293B" />
  </g>
);

// Professional Symphony Orchestra Scenario
const OrchestraScenario: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % chatMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Professional orchestra layout - organized by section with proper hierarchy
  // Row 1 (Front): First Violins (left) | Conductor | Second Violins (right)
  // Row 2: Violas (left-center) | Cellos (right-center)
  // Row 3 (Back): Double Basses (far left & right edges)

  const orchestraSections = {
    // First Violins - Stage Left, Front (closest to audience, left of conductor)
    firstViolins: [
      { id: 'v1-1', x: 20, y: 72, hairColor: '#8B5CF6', name: 'Harmonia' },
      { id: 'v1-2', x: 26, y: 70, hairColor: '#A78BFA', name: 'Violin I-2' },
      { id: 'v1-3', x: 32, y: 68, hairColor: '#7C3AED', name: 'Violin I-3' },
      { id: 'v1-4', x: 38, y: 66, hairColor: '#C4B5FD', name: 'Violin I-4' },
    ],
    // Second Violins - Stage Right, Front (right of conductor)
    secondViolins: [
      { id: 'v2-1', x: 62, y: 66, hairColor: '#6366F1', name: 'Sonata' },
      { id: 'v2-2', x: 68, y: 68, hairColor: '#818CF8', name: 'Violin II-2' },
      { id: 'v2-3', x: 74, y: 70, hairColor: '#A5B4FC', name: 'Violin II-3' },
      { id: 'v2-4', x: 80, y: 72, hairColor: '#C7D2FE', name: 'Violin II-4' },
    ],
    // Violas - Center Left, Second Row
    violas: [
      { id: 'va-1', x: 28, y: 58, hairColor: '#F59E0B', name: 'Cadenza' },
      { id: 'va-2', x: 36, y: 56, hairColor: '#FBBF24', name: 'Viola 2' },
      { id: 'va-3', x: 44, y: 55, hairColor: '#FCD34D', name: 'Viola 3' },
    ],
    // Cellos - Center Right, Second Row
    cellos: [
      { id: 'vc-1', x: 56, y: 55, hairColor: '#10B981', name: 'Melody' },
      { id: 'vc-2', x: 64, y: 56, hairColor: '#34D399', name: 'Cello 2' },
      { id: 'vc-3', x: 72, y: 58, hairColor: '#6EE7B7', name: 'Cello 3' },
    ],
    // Double Basses - Back Row, Far Edges
    basses: [
      { id: 'db-1', x: 18, y: 50, hairColor: '#EF4444', name: 'Rhythm' },
      { id: 'db-2', x: 82, y: 50, hairColor: '#F87171', name: 'Bass 2' },
    ],
  };

  // Flatten for rendering
  const allMusicians = [
    ...orchestraSections.firstViolins.map(m => ({ ...m, instrument: 'violin' as const })),
    ...orchestraSections.secondViolins.map(m => ({ ...m, instrument: 'violin' as const })),
    ...orchestraSections.violas.map(m => ({ ...m, instrument: 'viola' as const })),
    ...orchestraSections.cellos.map(m => ({ ...m, instrument: 'cello' as const })),
    ...orchestraSections.basses.map(m => ({ ...m, instrument: 'bass' as const })),
  ];

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] rounded-2xl overflow-hidden">
      {/* Deep Theater Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505] via-[#1a0a0a] to-[#0d0808]" />

      {/* SVG Concert Hall Stage */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Conductor spotlight - bright center */}
          <radialGradient id="conductorSpotlight" cx="50%" cy="85%" r="25%">
            <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFE4B5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          {/* Orchestra ambient light */}
          <radialGradient id="orchestraLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#FFE4B5" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          {/* Curtain fabric gradient */}
          <linearGradient id="curtainFabric" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5C0A0A" />
            <stop offset="20%" stopColor="#8B0000" />
            <stop offset="40%" stopColor="#6B0000" />
            <stop offset="60%" stopColor="#8B0000" />
            <stop offset="80%" stopColor="#6B0000" />
            <stop offset="100%" stopColor="#5C0A0A" />
          </linearGradient>
          {/* Stage floor - polished wood */}
          <linearGradient id="stageFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="50%" stopColor="#7A6548" />
            <stop offset="100%" stopColor="#5D4E3A" />
          </linearGradient>
          {/* Stage depth gradient */}
          <linearGradient id="stageDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D1B0E" />
            <stop offset="100%" stopColor="#1A0F08" />
          </linearGradient>
        </defs>

        {/* Back wall - deep theater darkness */}
        <rect x="0" y="0" width="800" height="220" fill="#0a0303" />

        {/* Back wall paneling */}
        <rect x="80" y="50" width="640" height="150" fill="#120808" rx="5" />
        <rect x="90" y="60" width="620" height="130" fill="#0d0505" rx="3" />

        {/* Curtain valance (top) */}
        <rect x="0" y="0" width="800" height="50" fill="#4A0000" />
        <path d="M0,45 Q100,55 200,45 Q300,55 400,45 Q500,55 600,45 Q700,55 800,45 L800,50 L0,50 Z" fill="#6B0000" />

        {/* Left curtain with folds */}
        <path d="M0,45 C20,50 30,50 50,55 L50,420 C30,425 20,425 0,420 Z" fill="url(#curtainFabric)" />
        <path d="M50,55 C60,52 65,52 75,58 L75,415 C65,418 60,418 50,420 Z" fill="#7B0000" />
        <path d="M75,58 C82,55 85,55 90,60 L90,410 C85,415 82,415 75,415 Z" fill="#5C0A0A" />

        {/* Right curtain with folds */}
        <path d="M800,45 C780,50 770,50 750,55 L750,420 C770,425 780,425 800,420 Z" fill="url(#curtainFabric)" />
        <path d="M750,55 C740,52 735,52 725,58 L725,415 C735,418 740,418 750,420 Z" fill="#7B0000" />
        <path d="M725,58 C718,55 715,55 710,60 L710,410 C715,415 718,415 725,415 Z" fill="#5C0A0A" />

        {/* Stage platform with depth */}
        {/* Back riser (elevated for back row) */}
        <rect x="100" y="200" width="600" height="30" fill="#3D2817" />
        <rect x="100" y="225" width="600" height="8" fill="#2D1B0E" />

        {/* Middle riser */}
        <rect x="100" y="233" width="600" height="50" fill="url(#stageFloor)" />

        {/* Main stage floor */}
        <rect x="90" y="283" width="620" height="180" fill="url(#stageFloor)" />

        {/* Stage front edge/apron */}
        <rect x="90" y="458" width="620" height="12" fill="#4A3728" />
        <rect x="90" y="468" width="620" height="5" fill="#2D1B0E" />

        {/* Floor wood grain lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <line
            key={`grain-${i}`}
            x1={90 + i * 62}
            y1="233"
            x2={90 + i * 62}
            y2="468"
            stroke="#6B5847"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Orchestra ambient lighting */}
        <ellipse cx="400" cy="320" rx="300" ry="120" fill="url(#orchestraLight)" />

        {/* Conductor spotlight - prominent */}
        <ellipse cx="400" cy="440" rx="80" ry="35" fill="url(#conductorSpotlight)" />

        {/* Section spotlights */}
        <ellipse cx="200" cy="380" rx="100" ry="50" fill="#FFF8E7" opacity="0.04" />
        <ellipse cx="600" cy="380" rx="100" ry="50" fill="#FFF8E7" opacity="0.04" />

        {/* Conductor's podium - prominent */}
        <rect x="380" y="430" width="40" height="6" fill="#5D4037" />
        <rect x="375" y="424" width="50" height="8" fill="#4E342E" />
        <rect x="370" y="418" width="60" height="8" fill="#3E2723" />

        {/* Music stands - organized by section */}
        {/* First Violins stands */}
        <MusicStandSimple x={130} y={365} />
        <MusicStandSimple x={175} y={355} />
        <MusicStandSimple x={220} y={345} />
        <MusicStandSimple x={265} y={335} />

        {/* Second Violins stands */}
        <MusicStandSimple x={500} y={335} />
        <MusicStandSimple x={545} y={345} />
        <MusicStandSimple x={590} y={355} />
        <MusicStandSimple x={635} y={365} />

        {/* Violas stands */}
        <MusicStandSimple x={190} y={290} />
        <MusicStandSimple x={250} y={280} />
        <MusicStandSimple x={310} y={275} />

        {/* Cellos stands */}
        <MusicStandSimple x={460} y={275} />
        <MusicStandSimple x={520} y={280} />
        <MusicStandSimple x={580} y={290} />

        {/* Basses stands */}
        <MusicStandSimple x={115} y={245} />
        <MusicStandSimple x={655} y={245} />

        {/* Section labels (subtle) */}
        <text x="180" y="395" fill="#8B7355" fontSize="8" fontFamily="serif" opacity="0.5">1st Violins</text>
        <text x="560" y="395" fill="#8B7355" fontSize="8" fontFamily="serif" opacity="0.5">2nd Violins</text>
        <text x="230" y="310" fill="#8B7355" fontSize="8" fontFamily="serif" opacity="0.5">Violas</text>
        <text x="500" y="310" fill="#8B7355" fontSize="8" fontFamily="serif" opacity="0.5">Cellos</text>
      </svg>

      {/* Musicians Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* CONDUCTOR - Prominent, center front with spotlight effect */}
        <div
          className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform z-30"
          style={{ left: '50%', top: '82%', transform: 'translateX(-50%)' }}
        >
          {/* Spotlight glow behind conductor */}
          <div
            className="absolute -inset-4 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(255,248,220,0.4) 0%, transparent 70%)',
              filter: 'blur(8px)'
            }}
          />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-700 to-amber-600 text-white text-[11px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
            🎼 Maestro Tempo
          </div>
          <PixelConductor className="w-12 h-16 drop-shadow-lg" />
        </div>

        {/* Orchestra Musicians - organized by section */}
        {allMusicians.map((musician) => (
          <div
            key={musician.id}
            className="absolute pointer-events-auto cursor-pointer group hover:scale-105 transition-transform"
            style={{
              left: `${musician.x}%`,
              top: `${musician.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.round(musician.y) // Back rows behind front rows
            }}
          >
            <div
              className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-[8px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md"
              style={{
                fontFamily: 'Georgia, serif',
                backgroundColor: musician.hairColor,
              }}
            >
              {musician.name}
            </div>
            <PixelSeatedMusician
              instrument={musician.instrument}
              hairColor={musician.hairColor}
              accentColor={musician.hairColor}
              className="w-8 h-8"
            />
          </div>
        ))}
      </div>

      {/* Chat Bubbles - Minimal, elegant */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs transition-all duration-500',
              currentMessage === index
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-90 hidden'
            )}
            style={{
              backgroundColor: msg.color,
              fontFamily: 'Georgia, serif',
            }}
          >
            <span className="text-white font-semibold">{msg.user}:</span>
            <span className="text-white/90 ml-1">{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Now Playing Widget - Bottom right, elegant */}
      <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border border-amber-800/30 z-30 shadow-2xl">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-inner">
          <Music className="w-7 h-7 text-amber-100" />
        </div>
        <div className="flex-1 min-w-[140px]">
          <p className="text-amber-400/80 text-[9px] font-semibold uppercase tracking-widest">Now Performing</p>
          <p className="text-white text-sm font-serif mt-0.5">Symphony of Content</p>
          <p className="text-amber-200/40 text-[10px] font-serif">Violin Chamber Orchestra</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-amber-800/40 hover:bg-amber-700/50 rounded-full flex items-center justify-center transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-amber-200" />
          ) : (
            <Play className="w-5 h-5 text-amber-200" />
          )}
        </button>
      </div>

      {/* Orchestra Info - Bottom left */}
      <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md rounded-xl p-4 border border-amber-800/30 z-30 shadow-2xl">
        <p className="text-amber-400 text-sm font-semibold font-serif">Violin Orchestra Hall</p>
        <p className="text-amber-200/40 text-[10px] mt-1">Chamber Music Performance</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex -space-x-2">
            {allMusicians.slice(0, 5).map((m, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-black shadow-sm"
                style={{ backgroundColor: m.hairColor }}
              />
            ))}
          </div>
          <span className="text-amber-200/50 text-[10px]">{allMusicians.length + 1} musicians</span>
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
