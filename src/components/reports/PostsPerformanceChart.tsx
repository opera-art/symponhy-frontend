'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  impressions: number;
  reach: number;
  saves: number;
}

interface PostsPerformanceChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

const PostsPerformanceChart: React.FC<PostsPerformanceChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-shimmer h-full w-full rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Performance Detalhada dos Posts</CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Comparativo de impressões, alcance e salvamentos
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
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
                  marginBottom: '8px',
                  fontSize: '13px',
                }}
                itemStyle={{
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '4px 0',
                }}
                formatter={(value: number) => value.toLocaleString('pt-BR')}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="impressions"
                fill="#1DA1F2"
                radius={[8, 8, 0, 0]}
                name="Impressões"
                maxBarSize={40}
              />
              <Bar
                dataKey="reach"
                fill="#FFC024"
                radius={[8, 8, 0, 0]}
                name="Alcance"
                maxBarSize={40}
              />
              <Bar
                dataKey="saves"
                fill="#34D399"
                radius={[8, 8, 0, 0]}
                name="Salvamentos"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { PostsPerformanceChart };
