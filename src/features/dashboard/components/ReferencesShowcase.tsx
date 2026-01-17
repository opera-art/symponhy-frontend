'use client';

import React from 'react';
import { Card, Button, Badge } from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { referencesData } from '@/data/newFeaturesData';
import { ArrowRight, Eye, MessageCircle, Heart, Bookmark } from 'lucide-react';

export const ReferencesShowcase: React.FC = () => {
  const [selectedReference, setSelectedReference] = React.useState(referencesData[0]);

  const platformColors = {
    instagram: 'from-pink-500/20 to-rose-600/10',
    youtube: 'from-red-500/20 to-rose-600/10',
    tiktok: 'from-slate-500/20 to-slate-600/10',
  };

  const platformBadgeColors = {
    instagram: 'bg-gradient-to-r from-pink-500 to-rose-600',
    youtube: 'bg-gradient-to-r from-red-500 to-rose-600',
    tiktok: 'bg-gradient-to-r from-slate-600 to-slate-800',
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Base de Referências</h3>
        <p className="text-sm text-slate-600">
          Inspirações e análises de conteúdo que funcionam bem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Reference Card */}
        <div className="lg:col-span-2">
          <Card
            padding="md"
            className={cn(
              'relative overflow-hidden bg-gradient-to-br',
              platformColors[selectedReference.platform as keyof typeof platformColors]
            )}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="default"
                      size="sm"
                      className={cn('text-white', platformBadgeColors[selectedReference.platform as keyof typeof platformBadgeColors])}
                    >
                      {selectedReference.platform.toUpperCase()}
                    </Badge>
                    <Badge variant="default" size="sm" className="bg-slate-200 text-slate-900">
                      {selectedReference.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{selectedReference.author}</h4>
                  <p className="text-sm text-slate-600">{selectedReference.description}</p>
                </div>

                {selectedReference.avatar && (
                  <img
                    src={selectedReference.avatar}
                    alt={selectedReference.author}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                )}
              </div>

              {/* Thumbnail */}
              {selectedReference.thumbnail && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-200">
                  <img
                    src={selectedReference.thumbnail}
                    alt={selectedReference.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Copy Section */}
              <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-600 mb-1">Copy</p>
                <p className="text-sm text-slate-900 line-clamp-3">{selectedReference.copy}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-3 h-3 text-rose-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.likes / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500">Likes</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.comments / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500">Comentários</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="w-3 h-3 text-purple-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.views / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-slate-500">Visualizações</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bookmark className="w-3 h-3 text-amber-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(selectedReference.metrics.saves || 0) / 100 > 0 ? `${Math.round((selectedReference.metrics.saves || 0) / 100)}` : '0'}
                  </p>
                  <p className="text-xs text-slate-500">Salvos</p>
                </div>
              </div>

              {/* Tags */}
              {selectedReference.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedReference.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="default" size="sm" className="bg-slate-200 text-slate-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm" className="flex-1" leftIcon={<ArrowRight className="w-4 h-4" />}>
                  Analisar com IA
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Copiar Estratégia
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* References List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {referencesData.map((ref) => (
            <Card
              key={ref.id}
              padding="sm"
              hover
              className={cn(
                'cursor-pointer transition-all border-2',
                selectedReference.id === ref.id
                  ? 'border-gold bg-gold/5'
                  : 'border-slate-200 hover:border-slate-300'
              )}
              onClick={() => setSelectedReference(ref)}
            >
              <div className="flex gap-2">
                {ref.thumbnail && (
                  <img
                    src={ref.thumbnail}
                    alt={ref.author}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{ref.author}</p>
                  <p className="text-xs text-slate-600 truncate">{ref.description}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="default" size="sm" className="text-xs bg-slate-200 text-slate-700">
                      {ref.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
