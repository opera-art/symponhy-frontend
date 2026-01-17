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
  Cell,
} from 'recharts';
import {
  Eye,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  LogOut,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface MetricData {
  current: number;
  change: number;
  trend: 'up' | 'down';
}

interface StoryPerformance {
  name: string;
  views: number;
  replies: number;
  exits: number;
}

interface StoriesMetricsProps {
  metrics: {
    views: MetricData;
    replies: MetricData;
    tapsForward: MetricData;
    tapsBack: MetricData;
    exits: MetricData;
    storyPerformance: StoryPerformance[];
  };
  isLoading?: boolean;
}

// Ícone de story elegante (círculo com gradiente sutis)
const StoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-pink-600">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const MiniMetric = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  iconColor: string;
}) => {
  const isPositive = trend === 'up';
  const isGoodTrend = (label === 'Saídas' || label === 'Avançar') ? !isPositive : isPositive;

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">{value.toLocaleString('pt-BR')}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${
        isGoodTrend ? 'text-emerald-600' : 'text-red-500'
      }`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(change)}%
      </div>
    </div>
  );
};

const StoriesMetrics: React.FC<StoriesMetricsProps> = ({ metrics, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-80 animate-shimmer bg-slate-100 rounded-xl" />
      </Card>
    );
  }

  const chartColors = ['#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D'];

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200/50 flex items-center justify-center">
            <StoryIcon />
          </div>
          <div>
            <CardTitle className="text-slate-800 tracking-tight">
              Intermezzo dos Stories
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Desempenho dos seus stories</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Métricas principais */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-6">
          <MiniMetric
            icon={Eye}
            label="Visualizações"
            value={metrics.views.current}
            change={metrics.views.change}
            trend={metrics.views.trend}
            iconColor="bg-pink-500"
          />
          <MiniMetric
            icon={MessageSquare}
            label="Respostas"
            value={metrics.replies.current}
            change={metrics.replies.change}
            trend={metrics.replies.trend}
            iconColor="bg-violet-500"
          />
          <MiniMetric
            icon={ChevronRight}
            label="Avançar"
            value={metrics.tapsForward.current}
            change={metrics.tapsForward.change}
            trend={metrics.tapsForward.trend}
            iconColor="bg-amber-500"
          />
          <MiniMetric
            icon={ChevronLeft}
            label="Voltar"
            value={metrics.tapsBack.current}
            change={metrics.tapsBack.change}
            trend={metrics.tapsBack.trend}
            iconColor="bg-emerald-500"
          />
          <MiniMetric
            icon={LogOut}
            label="Saídas"
            value={metrics.exits.current}
            change={metrics.exits.change}
            trend={metrics.exits.trend}
            iconColor="bg-red-500"
          />
        </div>

        {/* Gráfico de desempenho por story */}
        <div className="h-48">
          <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
            Desempenho por Story
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.storyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FDF2F8',
                  border: '1px solid #F9A8D4',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -2px rgba(236, 72, 153, 0.2)',
                }}
                labelStyle={{ color: '#BE185D', fontWeight: 600 }}
              />
              <Bar dataKey="views" name="Visualizações" radius={[4, 4, 0, 0]}>
                {metrics.storyPerformance.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { StoriesMetrics };
