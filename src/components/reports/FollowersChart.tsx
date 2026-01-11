'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface FollowersChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

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

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evolução de Seguidores</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-semibold text-slate-900">
                {lastValue.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm font-semibold text-status-success">
                +{growth}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC024" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFC024" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                dx={-10}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
                  padding: '12px 16px',
                }}
                labelStyle={{
                  color: '#1E293B',
                  fontWeight: 600,
                  marginBottom: '4px',
                  fontSize: '13px',
                }}
                itemStyle={{
                  color: '#64748B',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
                formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Seguidores']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFC024"
                strokeWidth={3}
                fill="url(#followersGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#FFC024',
                  stroke: '#FFFFFF',
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
