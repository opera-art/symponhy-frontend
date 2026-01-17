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

// Isometric Room Scenario Component - Habbo Style
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

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[600px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* City Skyline Background */}
      <div className="absolute bottom-[40%] left-0 right-0 h-32">
        <svg viewBox="0 0 1200 150" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          {/* Buildings silhouette */}
          <rect x="0" y="80" width="60" height="70" fill="#1e293b" />
          <rect x="70" y="50" width="80" height="100" fill="#1e293b" />
          <rect x="160" y="70" width="50" height="80" fill="#1e293b" />
          <rect x="220" y="30" width="100" height="120" fill="#1e293b" />
          <rect x="330" y="60" width="70" height="90" fill="#1e293b" />
          <rect x="410" y="40" width="90" height="110" fill="#1e293b" />
          <rect x="510" y="80" width="60" height="70" fill="#1e293b" />
          <rect x="580" y="20" width="120" height="130" fill="#1e293b" />
          <rect x="710" y="50" width="80" height="100" fill="#1e293b" />
          <rect x="800" y="70" width="60" height="80" fill="#1e293b" />
          <rect x="870" y="35" width="100" height="115" fill="#1e293b" />
          <rect x="980" y="55" width="70" height="95" fill="#1e293b" />
          <rect x="1060" y="45" width="90" height="105" fill="#1e293b" />
          {/* Windows */}
          {[...Array(40)].map((_, i) => (
            <rect
              key={i}
              x={70 + (i % 10) * 100 + Math.random() * 50}
              y={40 + Math.floor(i / 10) * 25 + Math.random() * 20}
              width="4"
              height="6"
              fill="#fef08a"
              opacity={Math.random() > 0.3 ? 0.8 : 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Isometric Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%]">
        <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          {/* Floor tiles - isometric grid */}
          <defs>
            <pattern id="isoGrid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 L20 0 L40 10 L20 20 Z" fill="none" stroke="#475569" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Main floor */}
          <polygon points="400,20 800,150 400,280 0,150" fill="url(#floorGradient)" />
          <polygon points="400,20 800,150 400,280 0,150" fill="url(#isoGrid)" />

          {/* Stage platform */}
          <polygon points="400,80 600,150 400,220 200,150" fill="#475569" />
          <polygon points="400,75 600,145 400,215 200,145" fill="#64748b" />

          {/* Red carpet */}
          <polygon points="400,150 500,195 400,240 300,195" fill="#991b1b" />
          <polygon points="400,145 500,190 400,235 300,190" fill="#dc2626" />
        </svg>
      </div>

      {/* Stage Elements */}
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-full max-w-4xl">
        {/* Chandelier */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2">
          <svg viewBox="0 0 120 80" className="w-32 h-24">
            <rect x="55" y="0" width="10" height="15" fill="#fef08a" />
            <polygon points="60,15 90,40 60,50 30,40" fill="#fef08a" />
            <polygon points="60,15 90,40 60,50 30,40" fill="#fde047" opacity="0.5" />
            <circle cx="35" cy="50" r="4" fill="#fef9c3" className="animate-pulse" />
            <circle cx="60" cy="55" r="4" fill="#fef9c3" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
            <circle cx="85" cy="50" r="4" fill="#fef9c3" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
          </svg>
        </div>

        {/* Musicians positioned on stage */}
        <div className="relative h-48 flex items-end justify-center gap-4">
          {/* Pianist - back left */}
          <div className="absolute left-[15%] bottom-[60%] transform hover:scale-110 transition-transform cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Sonata
              </div>
              <PixelPianist className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>

          {/* Cellist - back right */}
          <div className="absolute right-[15%] bottom-[60%] transform hover:scale-110 transition-transform cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cadenza
              </div>
              <PixelCellist className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>

          {/* Violinist - middle left */}
          <div className="absolute left-[25%] bottom-[35%] transform hover:scale-110 transition-transform cursor-pointer group animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Harmonia
              </div>
              <PixelViolinist className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>

          {/* Flutist - middle right */}
          <div className="absolute right-[25%] bottom-[35%] transform hover:scale-110 transition-transform cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Melody
              </div>
              <PixelFlutist className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>

          {/* Drummer - center back */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[50%] transform hover:scale-110 transition-transform cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Tempo
              </div>
              <PixelDrummer className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>

          {/* Trumpeter - front center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[15%] transform hover:scale-110 transition-transform cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Rhythm
              </div>
              <PixelTrumpeter className="w-16 h-16 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* Plants */}
      <div className="absolute bottom-[15%] left-[5%]">
        <svg viewBox="0 0 40 60" className="w-12 h-16">
          <rect x="12" y="45" width="16" height="15" fill="#78350f" />
          <ellipse cx="20" cy="35" rx="15" ry="20" fill="#166534" />
          <ellipse cx="15" cy="30" rx="10" ry="15" fill="#22c55e" />
        </svg>
      </div>
      <div className="absolute bottom-[15%] right-[5%]">
        <svg viewBox="0 0 40 60" className="w-12 h-16">
          <rect x="12" y="45" width="16" height="15" fill="#78350f" />
          <ellipse cx="20" cy="35" rx="15" ry="20" fill="#166534" />
          <ellipse cx="25" cy="30" rx="10" ry="15" fill="#22c55e" />
        </svg>
      </div>

      {/* Chat Bubbles */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 transform',
              currentMessage === index
                ? 'opacity-100 scale-100'
                : 'opacity-40 scale-95'
            )}
            style={{ backgroundColor: msg.color }}
          >
            <span className="text-white font-bold">{msg.user}:</span>
            <span className="text-white/90 ml-1">{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Now Playing Widget */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/10">
        <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-lg flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">{t('nowPlaying') || 'Now Playing'}</p>
          <p className="text-white/60 text-xs">Symphony of Content</p>
          <p className="text-white/40 text-[10px]">by: Violin AI Orchestra</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Room Info */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/10">
        <p className="text-white text-sm font-medium">Studio: Violin AI Rooftop Oasis</p>
        <p className="text-white/60 text-xs">Owner: Violin Orchestra</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex -space-x-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-gradient-to-br from-gold to-amber-600 border border-white/20"
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">6 agents online</span>
        </div>
      </div>

      {/* Musical Notes Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '30%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Music className="w-4 h-4" />
          </div>
        ))}
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
