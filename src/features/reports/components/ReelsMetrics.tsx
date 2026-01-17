'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface MetricData {
  current: number;
  change: number;
  trend: 'up' | 'down';
}

interface ReelPerformance {
  name: string;
  views: number;
  likes: number;
  shares: number;
}

interface ReelsMetricsProps {
  metrics: {
    views: MetricData;
    likes: MetricData;
    comments: MetricData;
    shares: MetricData;
    saves: MetricData;
    averageWatchTime: string;
    completionRate: number;
    reelsPerformance: ReelPerformance[];
  };
  isLoading?: boolean;
}

// Ícone de Reel elegante (minimalista)
const ReelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-violet-600">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
  </svg>
);

const StatBadge = ({
  icon: Icon,
  value,
  label,
  change,
  trend,
  color,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  change?: number;
  trend?: 'up' | 'down';
  color: string;
}) => {
  const formattedValue = typeof value === 'number'
    ? value >= 1000
      ? `${(value / 1000).toFixed(1)}k`
      : value.toLocaleString('pt-BR')
    : value;

  return (
    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
      <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
      <p className="text-lg font-bold text-slate-900">{formattedValue}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {change !== undefined && trend && (
        <div className={`flex items-center justify-center gap-0.5 mt-1 text-xs font-semibold ${
          trend === 'up' ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change > 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
};

const ReelsMetrics: React.FC<ReelsMetricsProps> = ({ metrics, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-96 animate-shimmer bg-slate-100 rounded-xl" />
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200/50 flex items-center justify-center">
            <ReelIcon />
          </div>
          <div>
            <CardTitle className="text-slate-800 tracking-tight">
              Virtuoso dos Reels
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Performance dos seus vídeos curtos</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Métricas principais em grid */}
        <div className="grid grid-cols-3 lg:grid-cols-7 gap-2 mb-6">
          <StatBadge
            icon={Play}
            value={metrics.views.current}
            label="Views"
            change={metrics.views.change}
            trend={metrics.views.trend}
            color="bg-violet-500"
          />
          <StatBadge
            icon={Heart}
            value={metrics.likes.current}
            label="Curtidas"
            change={metrics.likes.change}
            trend={metrics.likes.trend}
            color="bg-rose-500"
          />
          <StatBadge
            icon={MessageCircle}
            value={metrics.comments.current}
            label="Comentários"
            change={metrics.comments.change}
            trend={metrics.comments.trend}
            color="bg-blue-500"
          />
          <StatBadge
            icon={Share2}
            value={metrics.shares.current}
            label="Compartilhamentos"
            change={metrics.shares.change}
            trend={metrics.shares.trend}
            color="bg-emerald-500"
          />
          <StatBadge
            icon={Bookmark}
            value={metrics.saves.current}
            label="Salvamentos"
            change={metrics.saves.change}
            trend={metrics.saves.trend}
            color="bg-amber-500"
          />
          <StatBadge
            icon={Clock}
            value={metrics.averageWatchTime}
            label="Tempo Médio"
            color="bg-cyan-500"
          />
          <StatBadge
            icon={CheckCircle}
            value={`${metrics.completionRate}%`}
            label="Taxa Conclusão"
            color="bg-green-500"
          />
        </div>

        {/* Gráfico comparativo de Reels */}
        <div className="h-52">
          <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
            Comparativo de Reels
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.reelsPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 10 }}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #C4B5FD',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -2px rgba(139, 92, 246, 0.2)',
                }}
                labelStyle={{ color: '#6D28D9', fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="views" name="Views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" name="Curtidas" fill="#EC4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" name="Shares" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { ReelsMetrics };
