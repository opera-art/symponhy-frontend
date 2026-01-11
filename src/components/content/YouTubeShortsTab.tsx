'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { youtubeData, YouTubeShort } from '@/data/newFeaturesData';
import {
  Play,
  Search,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';

const getStatusColor = (status: string) => {
  if (status === 'published') return 'bg-green-50 border-l-green-500';
  if (status === 'scheduled') return 'bg-blue-50 border-l-blue-500';
  return 'bg-slate-50 border-l-slate-400';
};

const getStatusLabel = (status: string) => {
  if (status === 'published') return 'Publicado';
  if (status === 'scheduled') return 'Agendado';
  return 'Rascunho';
};

const getStatusBadgeVariant = (status: string) => {
  if (status === 'published') return 'success';
  if (status === 'scheduled') return 'info';
  return 'default';
};

export const YouTubeShortsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredShorts = youtubeData.filter((short) => {
    const matchesSearch =
      short.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      short.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || short.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Buscar YouTube Shorts..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />

          <div className="flex gap-2">
            {(['all', 'draft', 'scheduled', 'published'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filterStatus === status
                    ? 'bg-gold text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {status === 'all'
                  ? 'Todos'
                  : status === 'draft'
                    ? 'Rascunhos'
                    : status === 'scheduled'
                      ? 'Agendados'
                      : 'Publicados'}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Novo Short
        </Button>
      </div>

      {/* Grid/List View */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
            : 'space-y-3'
        )}
      >
        {filteredShorts.map((short) => (
          <Card
            key={short.id}
            padding={viewMode === 'grid' ? 'none' : 'md'}
            hover
            className={cn(
              'overflow-hidden',
              viewMode === 'list'
                ? 'flex items-start gap-4 border-l-4'
                : '',
              getStatusColor(short.status)
            )}
          >
            {/* Grid View */}
            {viewMode === 'grid' && (
              <>
                <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <Badge
                    variant="default"
                    className="absolute top-2 right-2 bg-black/70 text-white"
                  >
                    {short.duration}s
                  </Badge>

                  {/* Status Badge */}
                  <Badge
                    variant={getStatusBadgeVariant(short.status)}
                    size="sm"
                    className="absolute bottom-2 left-2"
                  >
                    {getStatusLabel(short.status)}
                  </Badge>
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                      {short.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {short.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {short.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" size="sm" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Metrics */}
                  {short.metrics && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(short.metrics.views / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {(short.metrics.likes / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {short.metrics.comments}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Edit3 className="w-3 h-3" />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-status-error"
                      leftIcon={<Trash2 className="w-3 h-3" />}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{short.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-1">
                        {short.description}
                      </p>
                    </div>

                    <Badge variant={getStatusBadgeVariant(short.status)} size="sm">
                      {getStatusLabel(short.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {short.duration}s
                    </span>
                    {short.metrics && (
                      <>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(short.metrics.views / 1000).toFixed(1)}k visualizações
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {(short.metrics.likes / 1000).toFixed(1)}k likes
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit3 className="w-3 h-3" />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 className="w-3 h-3" />}
                      className="text-status-error"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredShorts.length === 0 && (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Play className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Nenhum Short encontrado
            </h3>
            <p className="text-sm text-slate-500">
              {searchTerm
                ? 'Tente ajustar seus critérios de busca'
                : 'Comece criando seu primeiro YouTube Short'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
