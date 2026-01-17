'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  MapPin,
  Clock,
  Globe,
} from 'lucide-react';

interface GenderData {
  name: string;
  value: number;
  color: string;
}

interface AgeGroup {
  range: string;
  percentage: number;
}

interface Location {
  city: string;
  percentage: number;
}

interface Country {
  country: string;
  percentage: number;
}

interface ActiveHour {
  hour: string;
  activity: number;
}

interface AudienceMetricsProps {
  metrics: {
    totalAudience: number;
    demographics: {
      gender: GenderData[];
      ageGroups: AgeGroup[];
      topLocations: Location[];
      topCountries: Country[];
    };
    activeHours: ActiveHour[];
  };
  isLoading?: boolean;
}

// Ícone de audiência elegante (pessoas minimalistas)
const AudienceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
    <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="9" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="19" cy="9" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const AudienceMetrics: React.FC<AudienceMetricsProps> = ({ metrics, isLoading = false }) => {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 flex items-center justify-center">
              <AudienceIcon />
            </div>
            <div>
              <CardTitle className="text-slate-800 tracking-tight">
                Orquestra da Audiência
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Dados demográficos do seu público</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">
              {metrics.totalAudience.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500">Total de Seguidores</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gênero (Pizza) */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Gênero
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.demographics.gender}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {metrics.demographics.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {metrics.demographics.gender.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Faixa Etária */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-violet-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Faixa Etária
              </p>
            </div>
            <div className="space-y-2">
              {metrics.demographics.ageGroups.map((group) => (
                <div key={group.range} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-12">{group.range}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-10 text-right">
                    {group.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Top Cidades
              </p>
            </div>
            <div className="space-y-2">
              {metrics.demographics.topLocations.map((loc, index) => (
                <div key={loc.city} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700 flex-1">{loc.city}</span>
                  <span className="text-sm font-semibold text-slate-900">{loc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Países */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Top Países
              </p>
            </div>
            <div className="space-y-2">
              {metrics.demographics.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700 flex-1">{country.country}</span>
                  <span className="text-sm font-semibold text-slate-900">{country.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horários de Maior Atividade */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Horários de Maior Atividade
            </p>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.activeHours} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#78716C', fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value}% atividade`, '']}
                  labelStyle={{ color: '#92400E', fontWeight: 600 }}
                />
                <Bar
                  dataKey="activity"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AudienceMetrics };
