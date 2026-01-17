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

// Realistic Concert Hall Orchestra Scenario
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

  // Orchestra musicians data - organized like real chamber orchestra
  const orchestraMusicians = [
    // First Violins (left side, front row)
    { id: 'v1-1', instrument: 'violin' as const, x: 15, y: 52, hairColor: '#8B5CF6', name: 'Harmonia' },
    { id: 'v1-2', instrument: 'violin' as const, x: 22, y: 50, hairColor: '#A78BFA', name: 'Violin 2' },
    { id: 'v1-3', instrument: 'violin' as const, x: 29, y: 48, hairColor: '#7C3AED', name: 'Violin 3' },
    // Second Violins (left side, back row)
    { id: 'v2-1', instrument: 'violin' as const, x: 12, y: 42, hairColor: '#C4B5FD', name: 'Violin 4' },
    { id: 'v2-2', instrument: 'violin' as const, x: 19, y: 40, hairColor: '#DDD6FE', name: 'Violin 5' },
    // Violas (center-left)
    { id: 'va-1', instrument: 'viola' as const, x: 36, y: 50, hairColor: '#F59E0B', name: 'Cadenza' },
    { id: 'va-2', instrument: 'viola' as const, x: 43, y: 48, hairColor: '#FBBF24', name: 'Viola 2' },
    // Cellos (center-right)
    { id: 'vc-1', instrument: 'cello' as const, x: 57, y: 50, hairColor: '#10B981', name: 'Melody' },
    { id: 'vc-2', instrument: 'cello' as const, x: 64, y: 48, hairColor: '#34D399', name: 'Cello 2' },
    // Double Basses (right side, back)
    { id: 'db-1', instrument: 'bass' as const, x: 71, y: 42, hairColor: '#EF4444', name: 'Rhythm' },
    { id: 'db-2', instrument: 'bass' as const, x: 78, y: 44, hairColor: '#F87171', name: 'Bass 2' },
    // More violins on right (second violin section continuation)
    { id: 'v2-3', instrument: 'violin' as const, x: 71, y: 52, hairColor: '#6366F1', name: 'Sonata' },
    { id: 'v2-4', instrument: 'violin' as const, x: 78, y: 50, hairColor: '#818CF8', name: 'Violin 7' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] rounded-2xl overflow-hidden">
      {/* Theater Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a]" />

      {/* SVG Stage */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full relative z-10"
        style={{ imageRendering: 'auto' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Stage lighting gradient */}
          <radialGradient id="stageLight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFE4B5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          {/* Curtain gradient */}
          <linearGradient id="curtainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="15%" stopColor="#B22222" />
            <stop offset="30%" stopColor="#8B0000" />
            <stop offset="50%" stopColor="#B22222" />
            <stop offset="70%" stopColor="#8B0000" />
            <stop offset="85%" stopColor="#B22222" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          {/* Wood floor gradient */}
          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5344" />
          </linearGradient>
        </defs>

        {/* Back wall - dark theater */}
        <rect x="50" y="0" width="700" height="200" fill="#1a0505" />

        {/* Curtain top valance */}
        <rect x="0" y="0" width="800" height="40" fill="#8B0000" />
        <rect x="0" y="35" width="800" height="15" fill="#6B0000" />

        {/* Left curtain */}
        <path d="M0,40 Q30,40 40,50 L40,350 Q30,360 0,360 Z" fill="url(#curtainGradient)" />
        <path d="M40,50 Q60,45 70,55 L70,340 Q60,350 40,350 Z" fill="#7B0000" />

        {/* Right curtain */}
        <path d="M800,40 Q770,40 760,50 L760,350 Q770,360 800,360 Z" fill="url(#curtainGradient)" />
        <path d="M760,50 Q740,45 730,55 L730,340 Q740,350 760,350 Z" fill="#7B0000" />

        {/* Stage platform */}
        <rect x="70" y="280" width="660" height="180" fill="url(#floorGradient)" />
        {/* Stage front edge */}
        <rect x="70" y="455" width="660" height="15" fill="#5B4334" />

        {/* Wood floor lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <line key={i} x1={70 + i * 82} y1="280" x2={70 + i * 82} y2="455" stroke="#7B6355" strokeWidth="1" opacity="0.5" />
        ))}

        {/* Stage lighting effect */}
        <ellipse cx="400" cy="300" rx="350" ry="150" fill="url(#stageLight)" />

        {/* Spotlight effects */}
        <ellipse cx="250" cy="350" rx="80" ry="40" fill="#FFF8E7" opacity="0.08" />
        <ellipse cx="400" cy="340" rx="100" ry="50" fill="#FFF8E7" opacity="0.1" />
        <ellipse cx="550" cy="350" rx="80" ry="40" fill="#FFF8E7" opacity="0.08" />

        {/* Music Stands - positioned in front of each musician section */}
        <MusicStandSimple x={110} y={320} />
        <MusicStandSimple x={165} y={310} />
        <MusicStandSimple x={220} y={300} />
        <MusicStandSimple x={280} y={310} />
        <MusicStandSimple x={335} y={310} />
        <MusicStandSimple x={440} y={310} />
        <MusicStandSimple x={495} y={310} />
        <MusicStandSimple x={555} y={320} />
        <MusicStandSimple x={610} y={320} />

        {/* Conductor's podium */}
        <rect x="375" y="420" width="50" height="8" fill="#5B4334" />
        <rect x="380" y="415" width="40" height="5" fill="#4B3324" />
      </svg>

      {/* Musicians Layer - positioned over SVG */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Conductor/Maestro - front center, facing orchestra */}
        <div
          className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform"
          style={{ left: '48%', top: '72%', transform: 'translateX(-50%)' }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30" style={{ fontFamily: 'monospace' }}>
            Maestro Tempo
          </div>
          <PixelConductor className="w-10 h-14" />
        </div>

        {/* Orchestra Musicians - arranged in semicircle */}
        {orchestraMusicians.map((musician) => (
          <div
            key={musician.id}
            className="absolute pointer-events-auto cursor-pointer group hover:scale-110 transition-transform"
            style={{
              left: `${musician.x}%`,
              top: `${musician.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30"
              style={{
                fontFamily: 'monospace',
                backgroundColor: musician.hairColor
              }}
            >
              {musician.name}
            </div>
            <PixelSeatedMusician
              instrument={musician.instrument}
              hairColor={musician.hairColor}
              accentColor={musician.hairColor}
              className="w-10 h-10"
            />
          </div>
        ))}
      </div>

      {/* Chat Bubbles - Concert announcements style */}
      <div className="absolute top-16 left-4 right-4 flex flex-wrap gap-2 z-30">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 transform',
              currentMessage === index
                ? 'opacity-100 scale-100 shadow-lg'
                : 'opacity-20 scale-95'
            )}
            style={{
              backgroundColor: currentMessage === index ? msg.color : '#333',
              fontFamily: 'Georgia, serif',
            }}
          >
            <span className="text-white font-bold">{msg.user}:</span>
            <span className="text-white/90 ml-1">{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Now Playing Widget - Elegant concert style */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 border border-amber-900/50 z-30">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center shadow-inner">
          <Music className="w-6 h-6 text-amber-200" />
        </div>
        <div className="flex-1">
          <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider">Now Performing</p>
          <p className="text-white text-sm font-serif">Symphony of Content</p>
          <p className="text-white/50 text-[10px]">Violin Chamber Orchestra</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 bg-amber-900/50 hover:bg-amber-800/50 rounded-full flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-300" />
          ) : (
            <Play className="w-4 h-4 text-amber-300" />
          )}
        </button>
      </div>

      {/* Orchestra Info - Elegant style */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-900/50 z-30">
        <p className="text-amber-400 text-xs font-semibold tracking-wide">Violin Orchestra Hall</p>
        <p className="text-white/60 text-[10px]">Chamber Music Performance</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex -space-x-1">
            {orchestraMusicians.slice(0, 6).map((m, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 border-black"
                style={{ backgroundColor: m.hairColor }}
              />
            ))}
          </div>
          <span className="text-white/40 text-[10px]">{orchestraMusicians.length + 1} musicians</span>
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
