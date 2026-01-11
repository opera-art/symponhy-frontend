'use client';

import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { Video, FileText, Lightbulb, ExternalLink } from 'lucide-react';

interface Reference {
  id: string;
  platform: string;
  author: string;
  type: string;
  url: string;
  transcript: string;
  insights: string[];
}

interface ReferencesAnalysisProps {
  data: Reference[];
  isLoading?: boolean;
}

const ReferencesAnalysis: React.FC<ReferencesAnalysisProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} padding="lg">
            <div className="h-64 bg-slate-100 rounded-xl animate-shimmer" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((reference, index) => (
        <Card key={reference.id} padding="lg" className="hover-lift">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    Referência {index + 1}: {reference.author}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="sm">
                      {reference.platform}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {reference.type}
                    </Badge>
                  </div>
                </div>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-dark transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <CardContent>
            {/* Transcrição */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Transcrição
                </label>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                {reference.transcript}
              </p>
            </div>

            {/* Insights */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-gold" />
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Insights Extraídos
                </label>
              </div>
              <ul className="space-y-2">
                {reference.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { ReferencesAnalysis };
