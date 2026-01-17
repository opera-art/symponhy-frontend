'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface FollowersChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

// Ponto elegante para o gráfico
const ElegantDot = (props: { cx?: number; cy?: number; payload?: DataPoint }) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r="4" fill="#D97706" />
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.3" />
    </g>
  );
};

// Ícone de crescimento elegante
const GrowthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
    <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FollowersChart: React.FC<FollowersChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-shimmer h-full w-full rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  // Calculate growth
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const growth = ((lastValue - firstValue) / firstValue * 100).toFixed(1);

  // Calcular valores para as 5 linhas da pauta musical
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const staffLines = [0.1, 0.3, 0.5, 0.7, 0.9].map(
    pct => minValue + range * pct
  );

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 flex items-center justify-center">
              <GrowthIcon />
            </div>
            <div>
              <CardTitle className="text-slate-800 tracking-tight">
                Sinfonia de Crescimento
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Evolução de Seguidores</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-semibold text-slate-900">
              {lastValue.toLocaleString('pt-BR')}
            </span>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-sm font-semibold text-status-success">
                +{growth}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {/* Gradiente com cores de madeira/âmbar do violino */}
                <linearGradient id="violinGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D97706" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.05} />
                </linearGradient>
                {/* Gradiente para a linha (cor de corda de violino) */}
                <linearGradient id="stringGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
              </defs>

              {/* Linhas da pauta musical (5 linhas como em uma partitura) */}
              {staffLines.map((value, index) => (
                <ReferenceLine
                  key={index}
                  y={value}
                  stroke="#CBD5E1"
                  strokeWidth={1}
                  strokeOpacity={0.6}
                />
              ))}

              <CartesianGrid
                strokeDasharray="0"
                stroke="transparent"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 12, fontWeight: 500 }}
                dx={-10}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px -10px rgba(146, 64, 14, 0.2)',
                  padding: '12px 16px',
                }}
                labelStyle={{
                  color: '#92400E',
                  fontWeight: 600,
                  marginBottom: '4px',
                  fontSize: '13px',
                }}
                itemStyle={{
                  color: '#78716C',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
                formatter={(value: number) => [
                  value.toLocaleString('pt-BR'),
                  'Seguidores'
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#stringGradient)"
                strokeWidth={3}
                fill="url(#violinGradient)"
                dot={<ElegantDot />}
                activeDot={{
                  r: 8,
                  fill: '#D97706',
                  stroke: '#FFFBEB',
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { FollowersChart };
