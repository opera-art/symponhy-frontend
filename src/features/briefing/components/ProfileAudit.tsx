'use client';

import React from 'react';
import { Card, CardContent, Badge } from '@/shared/components/ui';
import { BarChart2, Star, Shield, MessageSquare, Hash } from 'lucide-react';

interface ProfileAuditProps {
  data: any;
  isLoading?: boolean;
}

const ProfileAudit: React.FC<ProfileAuditProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} padding="lg">
            <div className="h-48 bg-slate-100 rounded-xl animate-shimmer" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas do Perfil */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Métricas do Perfil
            </h3>
            <p className="text-sm text-slate-500">
              Análise dos últimos {data.period}
            </p>
          </div>
        </div>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Posts Publicados
              </label>
              <p className="text-2xl font-semibold text-slate-800">
                {data.profileMetrics.postsPublished}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Engajamento Médio
              </label>
              <p className="text-2xl font-semibold text-gold">
                {data.profileMetrics.averageEngagement}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Melhor Formato
              </label>
              <Badge variant="success" size="lg">
                {data.profileMetrics.bestPerformingType}
              </Badge>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Pior Formato
              </label>
              <Badge variant="error" size="lg">
                {data.profileMetrics.worstPerformingType}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Top Hashtags
              </label>
              <div className="flex flex-wrap gap-2">
                {data.profileMetrics.topHashtags.map((tag: string, index: number) => (
                  <Badge key={index} variant="info" size="md">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reputação */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Análise de Reputação
            </h3>
            <p className="text-sm text-slate-500">
              Avaliações e sentimentos em diferentes plataformas
            </p>
          </div>
        </div>

        <CardContent>
          <div className="space-y-6">
            {/* Google */}
            <div className="flex items-start justify-between p-5 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">Google</h4>
                  <Badge variant="success" size="sm">
                    {data.reputation.google.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold text-slate-800">
                      {data.reputation.google.rating}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    ({data.reputation.google.reviews} avaliações)
                  </span>
                </div>
              </div>
            </div>

            {/* Reclame Aqui */}
            <div className="flex items-start justify-between p-5 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">Reclame Aqui</h4>
                  <Badge variant="default" size="sm">
                    {data.reputation.reclameAqui.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Perfil não encontrado na plataforma
                </p>
              </div>
            </div>

            {/* Instagram */}
            <div className="p-5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="font-semibold text-slate-800">Instagram</h4>
                <Badge variant="success" size="sm">
                  {data.reputation.instagram.sentimentAnalysis}
                </Badge>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Comentários Comuns
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.reputation.instagram.commonComments.map((comment: string, index: number) => (
                    <Badge key={index} variant="info" size="sm">
                      {comment}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ProfileAudit };
