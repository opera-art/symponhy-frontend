'use client';

import React, { useState, useMemo } from 'react';
import { Topbar } from '@/components/layout';
import { Card, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { commentsData } from '@/data/newFeaturesData';
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Reply,
  Heart,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CommentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'instagram' | 'youtube'>('all');
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const sentimentConfig = useMemo(() => ({
    positive: {
      icon: ThumbsUp,
      color: 'text-green-600 bg-green-50',
      badge: 'success',
      label: t('positive'),
    },
    negative: {
      icon: ThumbsDown,
      color: 'text-red-600 bg-red-50',
      badge: 'error',
      label: t('negative'),
    },
    neutral: {
      icon: MessageCircle,
      color: 'text-slate-600 bg-slate-50',
      badge: 'default',
      label: t('neutral'),
    },
  }), [t]);

  const filteredComments = commentsData.filter((comment) => {
    const matchesSearch =
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || comment.sentiment === filterSentiment;
    const matchesPlatform = filterPlatform === 'all' || comment.platform === filterPlatform;
    return matchesSearch && matchesSentiment && matchesPlatform;
  });

  const toggleExpand = (id: string) => {
    setExpandedComments((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Statistics
  const stats = {
    total: commentsData.length,
    positive: commentsData.filter((c) => c.sentiment === 'positive').length,
    negative: commentsData.filter((c) => c.sentiment === 'negative').length,
    neutral: commentsData.filter((c) => c.sentiment === 'neutral').length,
    replied: commentsData.filter((c) => c.isReplied).length,
  };

  const positivePercentage = Math.round((stats.positive / stats.total) * 100);
  const replyRate = Math.round((stats.replied / stats.total) * 100);

  return (
    <>
      <Topbar />

      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('commentsAnalysis')}</h2>
        <p className="text-sm text-slate-500">
          {t('commentsDescription')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5 animate-fade-in">
        <Card padding="sm" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div>
            <p className="text-xs text-slate-600 mb-1">{t('totalComments')}</p>
            <h3 className="text-2xl font-bold text-blue-600">{stats.total}</h3>
          </div>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div>
            <p className="text-xs text-slate-600 mb-1">{t('positives')}</p>
            <h3 className="text-2xl font-bold text-green-600">{stats.positive}</h3>
            <p className="text-xs text-slate-500 mt-1">{positivePercentage}%</p>
          </div>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div>
            <p className="text-xs text-slate-600 mb-1">{t('negatives')}</p>
            <h3 className="text-2xl font-bold text-red-600">{stats.negative}</h3>
          </div>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <div>
            <p className="text-xs text-slate-600 mb-1">{t('neutrals')}</p>
            <h3 className="text-2xl font-bold text-slate-600">{stats.neutral}</h3>
          </div>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div>
            <p className="text-xs text-slate-600 mb-1">{t('replyRate')}</p>
            <h3 className="text-2xl font-bold text-purple-600">{replyRate}%</h3>
            <p className="text-xs text-slate-500 mt-1">{stats.replied} {t('replied')}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 animate-fade-in flex-wrap">
        <Input
          placeholder={t('searchComments')}
          leftIcon={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1">
            {(['all', 'positive', 'negative', 'neutral'] as const).map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => setFilterSentiment(sentiment)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filterSentiment === sentiment
                    ? 'bg-gold text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {sentiment === 'all'
                  ? t('all')
                  : sentiment === 'positive'
                    ? `👍 ${t('positives')}`
                    : sentiment === 'negative'
                      ? `👎 ${t('negatives')}`
                      : `➖ ${t('neutrals')}`}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {(['all', 'instagram', 'youtube'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setFilterPlatform(platform)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filterPlatform === platform
                    ? 'bg-gold text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {platform === 'all' ? t('allPlatforms') : platform === 'instagram' ? '📷 Instagram' : '▶️ YouTube'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3 animate-fade-in">
        {filteredComments.map((comment) => {
          const config = sentimentConfig[comment.sentiment as keyof typeof sentimentConfig];
          const Icon = config.icon;

          return (
            <Card key={comment.id} padding="md" className="space-y-3">
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {comment.avatar && (
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{comment.author}</h4>
                      <Badge
                        variant={config.badge as any}
                        size="sm"
                        className={cn('text-xs', config.color)}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>

                    {comment.postTitle && (
                      <p className="text-xs text-slate-500 mb-2">
                        {t('on')}: <span className="font-medium">{comment.postTitle}</span>
                      </p>
                    )}

                    <p className="text-sm text-slate-700">{comment.text}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {comment.likes} {t('likes')}
                      </span>
                      <span>{new Date(comment.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {comment.replies.length > 0 && (
                  <button
                    onClick={() => toggleExpand(comment.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium text-slate-700 flex-shrink-0"
                  >
                    {expandedComments.includes(comment.id) ? '▼' : '▶'} {comment.replies.length}
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!comment.isReplied ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Reply className="w-3 h-3" />}
                      className="text-blue-600"
                    >
                      {t('reply')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Heart className="w-3 h-3" />}
                      className="text-rose-600"
                    >
                      {t('like')}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                    <Badge variant="success" size="sm">
                      ✓ {t('replied')}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Replies */}
              {expandedComments.includes(comment.id) && comment.replies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 ml-8">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        {reply.avatar && (
                          <img
                            src={reply.avatar}
                            alt={reply.author}
                            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 text-sm">{reply.author}</h5>
                          <p className="text-sm text-slate-700 mt-1">{reply.text}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {reply.likes}
                            </span>
                            <span>{new Date(reply.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}

        {filteredComments.length === 0 && (
          <Card padding="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('noCommentsFound')}</h3>
              <p className="text-sm text-slate-500">
                {searchTerm ? t('adjustSearchCriteria') : t('noCommentsToAnalyze')}
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
