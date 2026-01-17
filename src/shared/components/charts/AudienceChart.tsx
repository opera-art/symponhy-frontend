'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface AudienceDataPoint {
  date: string;
  gained: number;
  lost: number;
}

interface AudienceChartProps {
  data: AudienceDataPoint[];
  isLoading?: boolean;
}

// Ícone de audiência elegante
const AudienceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// Ponto elegante para ganhos
const GainDot = (props: { cx?: number; cy?: number }) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r="4" fill="#D97706" />
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.3" />
    </g>
  );
};

// Ponto elegante para perdas
const LossDot = (props: { cx?: number; cy?: number }) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r="3" fill="#DC2626" />
    </g>
  );
};

const AudienceChart: React.FC<AudienceChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-shimmer h-full w-full rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  // Calcular valores para as 5 linhas da pauta musical
  const allValues = data.flatMap(d => [d.gained, d.lost]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;
  const staffLines = [0.1, 0.3, 0.5, 0.7, 0.9].map(
    pct => minValue + range * pct
  );

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 flex items-center justify-center">
              <AudienceIcon />
            </div>
            <div>
              <CardTitle className="text-slate-800 tracking-tight">
                Harmonia da Audiência
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Ganhos e perdas de seguidores</p>
            </div>
          </div>
          <div className="flex gap-6 text-xs font-semibold tracking-wide">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-600">Ganhos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-600">Perdas</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                {/* Gradiente para linha de ganhos (cor de corda de violino) */}
                <linearGradient id="gainStringGradient" x1="0" y1="0" x2="1" y2="0">
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
                  strokeOpacity={0.5}
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
                tick={{ fill: '#78716C', fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 11, fontWeight: 500 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px -10px rgba(146, 64, 14, 0.2)',
                  padding: '12px',
                }}
                labelStyle={{
                  color: '#92400E',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
                itemStyle={{
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [value, name]}
              />
              <Line
                type="monotone"
                dataKey="gained"
                stroke="url(#gainStringGradient)"
                strokeWidth={3}
                dot={<GainDot />}
                activeDot={{ r: 8, fill: '#D97706', stroke: '#FFFBEB', strokeWidth: 3 }}
                name="Ganhos"
              />
              <Line
                type="monotone"
                dataKey="lost"
                stroke="#DC2626"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={<LossDot />}
                activeDot={{ r: 6, fill: '#DC2626', stroke: '#FEE2E2', strokeWidth: 2 }}
                name="Perdas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { AudienceChart };
