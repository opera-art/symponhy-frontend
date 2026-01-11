import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  isLoading?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'pink';
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
  const getTrendColor = () => {
    if (trend === 'up') return 'text-status-success';
    if (trend === 'down') return 'text-status-error';
    return 'text-slate-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getGradientColor = () => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/10',
      purple: 'from-purple-500/20 to-purple-600/10',
      green: 'from-green-500/20 to-emerald-600/10',
      amber: 'from-amber-500/20 to-orange-600/10',
      pink: 'from-pink-500/20 to-rose-600/10',
    };
    return colors[color];
  };

  const getIconBg = () => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-600',
      purple: 'bg-purple-500/20 text-purple-600',
      green: 'bg-green-500/20 text-emerald-600',
      amber: 'bg-amber-500/20 text-amber-600',
      pink: 'bg-pink-500/20 text-pink-600',
    };
    return colors[color];
  };

  const getSparkline = () => {
    // Mini bar chart pattern
    const heights = [30, 45, 35, 55, 40, 50, 35, 45];
    return heights;
  };

  if (isLoading) {
    return (
      <Card padding="md" className={cn('h-40', className)}>
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-slate-100 animate-shimmer" />
          </div>
          <div>
            <div className="h-10 w-32 bg-slate-100 rounded-lg animate-shimmer mb-2" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-shimmer" />
          </div>
        </div>
      </Card>
    );
  }

  const sparklineHeights = getSparkline();

  return (
    <Card
      padding="md"
      hover
      className={cn(
        'h-40 relative overflow-hidden bg-gradient-to-br',
        getGradientColor(),
        className
      )}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Header com Icon e Sparkline */}
        <div className="flex justify-between items-start mb-3">
          {icon && (
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getIconBg())}>
              {icon}
            </div>
          )}

          {/* Sparkline Chart */}
          <div className="flex items-end gap-0.5 h-8">
            {sparklineHeights.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 bg-current bg-opacity-40 rounded-sm"
                style={{ height: `${height}%`, minHeight: '2px', opacity: 0.4 + (idx / 20) }}
              />
            ))}
          </div>
        </div>

        {/* Value Section */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {value}
          </h3>
          <p className="text-xs font-medium text-slate-600 mt-0.5">{title}</p>
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div className={cn('flex items-center gap-1.5 text-xs font-semibold', getTrendColor())}>
            {getTrendIcon()}
            <span>{change > 0 ? '+' : ''}{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

StatsCard.displayName = 'StatsCard';

export { StatsCard };
