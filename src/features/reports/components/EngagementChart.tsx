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
} from 'recharts';

interface DataPoint {
  date: string;
  rate: number;
}

interface EngagementChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-shimmer h-full w-full rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  const currentRate = data[data.length - 1]?.rate || 0;
  const previousRate = data[data.length - 2]?.rate || 0;
  const change = ((currentRate - previousRate) / previousRate * 100).toFixed(1);

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Taxa de Engajamento</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-semibold text-gold">
                {currentRate.toFixed(1)}%
              </span>
              <span className={`text-sm font-semibold ${parseFloat(change) >= 0 ? 'text-status-success' : 'text-status-error'}`}>
                {parseFloat(change) >= 0 ? '+' : ''}{change}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `${value}%`}
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
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Engajamento']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#FFC024"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: '#FFC024',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#FFC024',
                  stroke: '#FFFFFF',
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { EngagementChart };
