'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  isLoading?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'pink' | 'cyan';
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className,
  isLoading = false,
  color = 'blue',
  subtitle,
}) => {
  const getColorConfig = () => {
    const configs = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        ring: 'ring-blue-500/20',
        text: 'text-blue-600',
        glow: 'shadow-blue-500/25',
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50',
        ring: 'ring-purple-500/20',
        text: 'text-purple-600',
        glow: 'shadow-purple-500/25',
      },
      green: {
        gradient: 'from-emerald-500 to-emerald-600',
        light: 'bg-emerald-50',
        ring: 'ring-emerald-500/20',
        text: 'text-emerald-600',
        glow: 'shadow-emerald-500/25',
      },
      amber: {
        gradient: 'from-amber-500 to-orange-500',
        light: 'bg-amber-50',
        ring: 'ring-amber-500/20',
        text: 'text-amber-600',
        glow: 'shadow-amber-500/25',
      },
      pink: {
        gradient: 'from-pink-500 to-rose-500',
        light: 'bg-pink-50',
        ring: 'ring-pink-500/20',
        text: 'text-pink-600',
        glow: 'shadow-pink-500/25',
      },
      cyan: {
        gradient: 'from-cyan-500 to-teal-500',
        light: 'bg-cyan-50',
        ring: 'ring-cyan-500/20',
        text: 'text-cyan-600',
        glow: 'shadow-cyan-500/25',
      },
    };
    return configs[color];
  };

  const getTrendConfig = () => {
    if (trend === 'up') return { color: 'text-emerald-600 bg-emerald-50', icon: ArrowUpRight };
    if (trend === 'down') return { color: 'text-rose-600 bg-rose-50', icon: ArrowDownRight };
    return { color: 'text-slate-500 bg-slate-100', icon: Minus };
  };

  const colorConfig = getColorConfig();
  const trendConfig = getTrendConfig();
  const TrendIcon = trendConfig.icon;

  // Generate sparkline data with smooth wave pattern
  const generateSparkline = () => {
    const points = [];
    for (let i = 0; i < 12; i++) {
      const base = 30 + Math.sin(i * 0.8) * 20;
      const variation = Math.random() * 15;
      points.push(Math.max(10, Math.min(90, base + variation)));
    }
    return points;
  };

  const sparklineData = generateSparkline();

  if (isLoading) {
    return (
      <div className={cn(
        'relative rounded-2xl bg-white p-5 overflow-hidden',
        'border border-slate-100',
        'shadow-sm',
        className
      )}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
            <div className="w-16 h-6 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-12 bg-slate-50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white p-5 overflow-hidden',
        'border border-slate-100/80',
        'shadow-sm hover:shadow-lg hover:shadow-slate-200/50',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5',
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-br from-slate-50/50 to-transparent'
      )} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon Container */}
          {icon && (
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br shadow-lg',
              colorConfig.gradient,
              colorConfig.glow,
              'text-white',
              'transform group-hover:scale-105 transition-transform duration-300'
            )}>
              {icon}
            </div>
          )}

          {/* Trend Badge */}
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
              trendConfig.color,
              'transition-transform duration-300 group-hover:scale-105'
            )}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{change > 0 ? '+' : ''}{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Value & Title */}
        <div className="mb-4">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1 tabular-nums">
            {value}
          </h3>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Sparkline Chart */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between gap-1 h-10">
            {sparklineData.map((height, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex-1 rounded-sm transition-all duration-300',
                  'bg-gradient-to-t',
                  colorConfig.gradient,
                  idx === sparklineData.length - 1 ? 'opacity-100' : 'opacity-30',
                  'group-hover:opacity-60',
                  idx === sparklineData.length - 1 && 'group-hover:opacity-100'
                )}
                style={{
                  height: `${height}%`,
                  minHeight: '4px',
                  transitionDelay: `${idx * 20}ms`
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400 font-medium">Últimos 7 dias</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <TrendingUp className="w-3 h-3" />
              <span>Tendência</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div className={cn(
        'absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20',
        'bg-gradient-to-br',
        colorConfig.gradient,
        'group-hover:opacity-30 transition-opacity duration-500'
      )} />
    </div>
  );
};

StatsCard.displayName = 'StatsCard';

export { StatsCard };
