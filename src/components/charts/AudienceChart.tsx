'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Evolução de Seguidores</CardTitle>
          <div className="flex gap-6 text-xs font-semibold tracking-wide">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-slate-600">Ganhos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-error" />
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
              <CartesianGrid
                strokeDasharray="0"
                stroke="#F1F5F9"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                labelStyle={{
                  color: '#1E293B',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
                itemStyle={{
                  color: '#64748B',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="gained"
                stroke="#FFC024"
                strokeWidth={2}
                dot={{ fill: '#FFC024', r: 4 }}
                activeDot={{ r: 6, fill: '#FFC024' }}
                name="Ganhos"
              />
              <Line
                type="monotone"
                dataKey="lost"
                stroke="#E84A5F"
                strokeWidth={2}
                dot={{ fill: '#E84A5F', r: 4 }}
                activeDot={{ r: 6, fill: '#E84A5F' }}
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
