'use client';

import React from 'react';
import { Card, Badge } from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { recentPostsData, RecentPost } from '@/data/newFeaturesData';
import { TrendingUp, MessageCircle, Eye, Heart } from 'lucide-react';

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

const typeLabels: { [key: string]: string } = {
  post: 'Post',
  reel: 'Reel',
  carousel: 'Carrossel',
  story: 'Story',
  short: 'Short',
};

const getPerformanceColor = (score: number) => {
  if (score >= 85) return 'text-green-600 bg-green-50';
  if (score >= 70) return 'text-amber-600 bg-amber-50';
  return 'text-slate-600 bg-slate-50';
};

export const RecentPostsShowcase: React.FC = () => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Últimos Posts</h3>
        <p className="text-sm text-slate-600">
          Veja o desempenho dos seus últimos conteúdos publicados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recentPostsData.map((post) => (
          <Card
            key={post.id}
            padding="sm"
            className={cn(
              'relative overflow-hidden bg-gradient-to-br border-l-4',
              platformColors[post.platform as keyof typeof platformColors],
              post.platform === 'instagram'
                ? 'border-l-pink-500'
                : post.platform === 'youtube'
                  ? 'border-l-red-500'
                  : 'border-l-slate-600'
            )}
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-start gap-2">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {post.title}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Badge
                      variant="default"
                      size="sm"
                      className={cn('text-white text-xs', platformBadgeColors[post.platform as keyof typeof platformBadgeColors])}
                    >
                      {post.platform.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="default"
                      size="sm"
                      className="bg-slate-200 text-slate-700 text-xs"
                    >
                      {typeLabels[post.type]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-1">
                <div className="bg-white/50 rounded p-1.5 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <Heart className="w-2.5 h-2.5 text-rose-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(post.metrics.likes / 1000).toFixed(1)}k
                  </p>
                </div>
                <div className="bg-white/50 rounded p-1.5 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <MessageCircle className="w-2.5 h-2.5 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(post.metrics.comments / 100).toFixed(0)}c
                  </p>
                </div>
                <div className="bg-white/50 rounded p-1.5 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <Eye className="w-2.5 h-2.5 text-purple-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {(post.metrics.views / 1000).toFixed(0)}k
                  </p>
                </div>
                <div
                  className={cn(
                    'rounded p-1.5 text-center',
                    getPerformanceColor(post.performanceScore)
                  )}
                >
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                  </div>
                  <p className="text-xs font-semibold">
                    {post.performanceScore}%
                  </p>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-slate-500">
                Publicado em {new Date(post.publishedDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
