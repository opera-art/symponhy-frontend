'use client';

import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { User, MapPin, Briefcase, Target, Heart, MessageCircle } from 'lucide-react';

interface BriefingSummaryProps {
  data: any;
  isLoading?: boolean;
}

const BriefingSummary: React.FC<BriefingSummaryProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="lg">
            <div className="h-32 bg-slate-100 rounded-xl animate-shimmer" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Perfil */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Perfil</h3>
            <p className="text-sm text-slate-500">Informações básicas do criador</p>
          </div>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Nome
              </label>
              <p className="text-base font-medium text-slate-800">{data.profile.name}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Instagram
              </label>
              <p className="text-base font-medium text-slate-800">{data.profile.instagram}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Localização
              </label>
              <p className="text-base font-medium text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {data.profile.location}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Área de Atuação
              </label>
              <p className="text-base font-medium text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {data.profile.area}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Objetivos</h3>
            <p className="text-sm text-slate-500">Metas e resultados esperados</p>
          </div>
        </div>
        <CardContent>
          <ul className="space-y-3">
            {data.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-base text-slate-700">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Identidade */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Identidade</h3>
            <p className="text-sm text-slate-500">Valores e características pessoais</p>
          </div>
        </div>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Valores Principais
              </label>
              <div className="flex flex-wrap gap-2">
                {data.identity.values.map((value: string, index: number) => (
                  <Badge key={index} variant="gold" size="lg">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comunicação */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Comunicação</h3>
            <p className="text-sm text-slate-500">Tom de voz e estilo de linguagem</p>
          </div>
        </div>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Tom de Voz
              </label>
              <div className="flex flex-wrap gap-2">
                {data.voice.tone.map((tone: string, index: number) => (
                  <Badge key={index} variant="info" size="lg">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Expressões Favoritas
              </label>
              <div className="flex flex-wrap gap-2">
                {data.voice.favoriteExpressions.map((expr: string, index: number) => (
                  <Badge key={index} variant="default" size="lg">
                    "{expr}"
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Tópicos a Evitar
              </label>
              <div className="flex flex-wrap gap-2">
                {data.voice.avoidTopics.map((topic: string, index: number) => (
                  <Badge key={index} variant="error" size="lg">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BriefingSummary };
