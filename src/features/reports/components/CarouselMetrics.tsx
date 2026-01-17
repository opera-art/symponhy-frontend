'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Layers,
  Eye,
  MousePointer,
  Award,
  TrendingDown,
} from 'lucide-react';

interface SlidePerformance {
  slide: number;
  impressions: number;
  interactions: number;
}

interface CarouselMetricsProps {
  metrics: {
    avgSlideReach: number;
    avgInteractionsPerSlide: number;
    bestPerformingSlide: number;
    dropoffRate: number;
    carouselPerformance: SlidePerformance[];
  };
  isLoading?: boolean;
}

// Ícone de carrossel elegante (minimalista)
const CarouselIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cyan-600">
    <rect x="3" y="6" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <rect x="8" y="5" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="6" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

const CarouselMetrics: React.FC<CarouselMetricsProps> = ({ metrics, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-80 animate-shimmer bg-slate-100 rounded-xl" />
      </Card>
    );
  }

  // Preparar dados para o gráfico
  const chartData = metrics.carouselPerformance.map(item => ({
    name: `Slide ${item.slide}`,
    impressions: item.impressions,
    interactions: item.interactions,
  }));

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200/50 flex items-center justify-center">
            <CarouselIcon />
          </div>
          <div>
            <CardTitle className="text-slate-800 tracking-tight">
              Movimento do Carrossel
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Desempenho por slide</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Métricas resumidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {metrics.avgSlideReach.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-600">Alcance Médio/Slide</p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-violet-500 flex items-center justify-center">
              <MousePointer className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {metrics.avgInteractionsPerSlide}
            </p>
            <p className="text-xs text-slate-600">Interações/Slide</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              Slide {metrics.bestPerformingSlide}
            </p>
            <p className="text-xs text-slate-600">Melhor Desempenho</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-rose-500 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {metrics.dropoffRate}%
            </p>
            <p className="text-xs text-slate-600">Taxa de Abandono</p>
          </div>
        </div>

        {/* Gráfico de desempenho por slide */}
        <div className="h-48">
          <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
            Retenção por Slide
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="carouselGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="interactionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
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
                  backgroundColor: '#ECFEFF',
                  border: '1px solid #A5F3FC',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -2px rgba(6, 182, 212, 0.2)',
                }}
                labelStyle={{ color: '#0891B2', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                name="Impressões"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#carouselGradient)"
              />
              <Area
                type="monotone"
                dataKey="interactions"
                name="Interações"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#interactionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { CarouselMetrics };
