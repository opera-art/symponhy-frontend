'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  MousePointer,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface MetricData {
  current: number;
  change: number;
  trend: 'up' | 'down';
}

interface EngagementMetrics {
  likes: MetricData;
  comments: MetricData;
  shares: MetricData;
}

interface ImpressionsMetrics {
  impressions: MetricData;
  reach: MetricData;
  clicks: MetricData;
}

interface MetricsSectionProps {
  engagementMetrics: EngagementMetrics;
  impressionsMetrics: ImpressionsMetrics;
  isLoading?: boolean;
}

// Ícone de ressonância elegante (ondas sonoras minimalistas)
const ResonanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
    <path d="M12 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 11v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 11v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Ícone de engajamento elegante (coração geométrico)
const EngagementIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-rose-600">
    <path
      d="M12 7.5C12 5.5 10.5 4 8.5 4C6.5 4 5 5.5 5 7.5C5 12 12 16 12 16C12 16 19 12 19 7.5C19 5.5 17.5 4 15.5 4C13.5 4 12 5.5 12 7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const MetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down';
  color: string;
}) => {
  const isPositive = trend === 'up';
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('pt-BR')
    : value;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${
          isPositive ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
        {formattedValue}
      </p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  );
};

const MetricsSection: React.FC<MetricsSectionProps> = ({
  engagementMetrics,
  impressionsMetrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="h-48 animate-shimmer bg-slate-100 rounded-xl" />
        </Card>
        <Card padding="lg">
          <div className="h-48 animate-shimmer bg-slate-100 rounded-xl" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Engajamento */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200/50 flex items-center justify-center">
              <EngagementIcon />
            </div>
            <div>
              <CardTitle className="text-slate-800 tracking-tight">
                Melodia do Engajamento
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Curtidas, comentários e compartilhamentos</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <MetricCard
              icon={Heart}
              label="Curtidas"
              value={engagementMetrics.likes.current}
              change={engagementMetrics.likes.change}
              trend={engagementMetrics.likes.trend}
              color="bg-gradient-to-br from-rose-400 to-rose-600"
            />
            <MetricCard
              icon={MessageCircle}
              label="Comentários"
              value={engagementMetrics.comments.current}
              change={engagementMetrics.comments.change}
              trend={engagementMetrics.comments.trend}
              color="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <MetricCard
              icon={Share2}
              label="Compartilhamentos"
              value={engagementMetrics.shares.current}
              change={engagementMetrics.shares.change}
              trend={engagementMetrics.shares.trend}
              color="bg-gradient-to-br from-violet-400 to-violet-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Impressões e Alcance */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 flex items-center justify-center">
              <ResonanceIcon />
            </div>
            <div>
              <CardTitle className="text-slate-800 tracking-tight">
                Ressonância do Conteúdo
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Impressões, alcance e cliques</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <MetricCard
              icon={Eye}
              label="Impressões"
              value={impressionsMetrics.impressions.current}
              change={impressionsMetrics.impressions.change}
              trend={impressionsMetrics.impressions.trend}
              color="bg-gradient-to-br from-amber-400 to-amber-600"
            />
            <MetricCard
              icon={Users}
              label="Alcance"
              value={impressionsMetrics.reach.current}
              change={impressionsMetrics.reach.change}
              trend={impressionsMetrics.reach.trend}
              color="bg-gradient-to-br from-emerald-400 to-emerald-600"
            />
            <MetricCard
              icon={MousePointer}
              label="Cliques"
              value={impressionsMetrics.clicks.current}
              change={impressionsMetrics.clicks.change}
              trend={impressionsMetrics.clicks.trend}
              color="bg-gradient-to-br from-cyan-400 to-cyan-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { MetricsSection };
