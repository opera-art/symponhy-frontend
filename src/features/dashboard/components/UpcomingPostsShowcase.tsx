'use client';

import React from 'react';
import { Card, Badge } from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { upcomingPostsData, UpcomingPost } from '@/data/newFeaturesData';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

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

const getStatusIcon = (status: string) => {
  if (status === 'scheduled')
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (status === 'pending')
    return <AlertCircle className="w-4 h-4 text-amber-600" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
};

const getStatusLabel = (status: string) => {
  if (status === 'scheduled') return 'Agendado';
  if (status === 'pending') return 'Pendente';
  return 'Rascunho';
};

const getStatusColor = (status: string) => {
  if (status === 'scheduled')
    return 'bg-green-50 border-l-green-500';
  if (status === 'pending')
    return 'bg-amber-50 border-l-amber-500';
  return 'bg-slate-50 border-l-slate-400';
};

export const UpcomingPostsShowcase: React.FC = () => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Próximos Posts</h3>
        <p className="text-sm text-slate-600">
          Acompanhe os conteúdos que serão publicados em breve
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {upcomingPostsData.map((post) => (
          <Card
            key={post.id}
            padding="sm"
            className={cn(
              'relative overflow-hidden border-l-4',
              platformColors[post.platform as keyof typeof platformColors],
              getStatusColor(post.status)
            )}
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
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

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <Badge
                    variant="default"
                    size="sm"
                    className={cn(
                      'text-xs gap-1 flex items-center',
                      post.status === 'scheduled'
                        ? 'bg-green-100 text-green-700'
                        : post.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {getStatusIcon(post.status)}
                    {getStatusLabel(post.status)}
                  </Badge>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="bg-white/50 rounded p-2 space-y-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <p className="text-xs text-slate-700 font-medium">
                    {new Date(post.scheduledDate).toLocaleDateString('pt-BR')} às{' '}
                    {post.scheduledTime}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {(() => {
                    const scheduledDate = new Date(post.scheduledDate);
                    const today = new Date();
                    const daysUntil = Math.ceil(
                      (scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (daysUntil === 0) return 'Hoje';
                    if (daysUntil === 1) return 'Amanhã';
                    if (daysUntil < 7) return `Em ${daysUntil} dias`;
                    return `Em ${Math.ceil(daysUntil / 7)} semanas`;
                  })()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
