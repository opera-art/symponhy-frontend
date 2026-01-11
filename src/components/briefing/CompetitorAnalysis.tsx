'use client';

import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { Users, TrendingUp, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  followers: string;
  engagement: string;
  postsPerWeek: number;
  strengths: string[];
  opportunities: string[];
  topFormats: string[];
}

interface CompetitorAnalysisProps {
  data: Competitor[];
  isLoading?: boolean;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="lg">
            <div className="h-96 bg-slate-100 rounded-xl animate-shimmer" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((competitor, index) => (
        <Card key={competitor.id} padding="lg" className="hover-lift flex flex-col">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {competitor.name}
              </h3>
              <Badge variant="default" size="sm">
                Concorrente {index + 1}
              </Badge>
            </div>
          </div>

          {/* Métricas */}
          <CardContent className="flex-1">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">
                  Seguidores
                </label>
                <p className="text-xl font-semibold text-slate-800">{competitor.followers}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">
                  Engajamento
                </label>
                <p className="text-xl font-semibold text-gold">{competitor.engagement}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">
                  Posts/Sem
                </label>
                <p className="text-xl font-semibold text-slate-800">{competitor.postsPerWeek}</p>
              </div>
            </div>

            {/* Forças */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-status-success" />
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Forças
                </label>
              </div>
              <ul className="space-y-2">
                {competitor.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Oportunidades */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-gold" />
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Oportunidades
                </label>
              </div>
              <ul className="space-y-2">
                {competitor.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formatos Top */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
                Formatos Top
              </label>
              <div className="flex flex-wrap gap-2">
                {competitor.topFormats.map((format, idx) => (
                  <Badge key={idx} variant="info" size="sm">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { CompetitorAnalysis };
