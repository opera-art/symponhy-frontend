'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

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
}) => {
  const getAccentColor = () => {
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-violet-600',
      green: 'text-emerald-600',
      amber: 'text-amber-600',
      pink: 'text-pink-600',
      cyan: 'text-cyan-600',
    };
    return colors[color];
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4" strokeWidth={2} />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4" strokeWidth={2} />;
    return <Minus className="w-4 h-4" strokeWidth={2} />;
  };

  if (isLoading) {
    return (
      <div className={cn(
        'bg-white rounded-xl p-6',
        'border border-slate-200/60',
        className
      )}>
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group bg-white rounded-xl p-6',
        'border border-slate-200/60',
        'hover:border-slate-300/80 hover:shadow-sm',
        'transition-all duration-200',
        className
      )}
    >
      {/* Title with icon */}
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span className={cn('opacity-70', getAccentColor())}>
            {icon}
          </span>
        )}
        <span className="text-[13px] font-medium text-slate-500 tracking-wide">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-[32px] font-semibold text-slate-900 tracking-tight leading-none">
          {value}
        </span>
      </div>

      {/* Trend */}
      {change !== undefined && (
        <div className={cn('flex items-center gap-1', getTrendColor())}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {change > 0 ? '+' : ''}{Math.abs(change)}%
          </span>
          <span className="text-slate-400 text-sm font-normal ml-1">
            vs mês anterior
          </span>
        </div>
      )}
    </div>
  );
};

StatsCard.displayName = 'StatsCard';

export { StatsCard };
