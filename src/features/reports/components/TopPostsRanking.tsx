'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/shared/components/ui';
import { Heart, MessageCircle, Bookmark, Share2, TrendingUp, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopPost {
  id: string;
  thumbnail: string;
  type: string;
  date: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
}

interface TopPostsRankingProps {
  posts: TopPost[];
  isLoading?: boolean;
}

const TopPostsRanking: React.FC<TopPostsRankingProps> = ({ posts, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-shimmer h-full w-full rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-amber-400 to-amber-600';
    if (index === 1) return 'from-slate-300 to-slate-500';
    if (index === 2) return 'from-amber-600 to-amber-800';
    return 'from-slate-200 to-slate-300';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-4 h-4" />;
    return null;
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
            <TrendingUp className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <CardTitle>Top Posts do Período</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Posts com melhor desempenho
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-card',
                index === 0 ? 'bg-gradient-to-r from-gold/5 to-amber-50 border border-gold/20' : 'bg-slate-50'
              )}
            >
              {/* Rank */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-card bg-gradient-to-br',
                    getRankColor(index)
                  )}
                >
                  {getRankIcon(index) || (index + 1)}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-card">
                <img
                  src={post.thumbnail}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" size="sm">
                    {post.type}
                  </Badge>
                  <span className="text-xs text-slate-500">{post.date}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {post.likes.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {post.comments.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs font-semibold text-slate-700">
                      {post.saves.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {post.shares.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reach */}
              <div className="text-right flex-shrink-0 hidden lg:block">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Alcance
                </p>
                <p className="text-2xl font-bold text-gold">
                  {(post.reach / 1000).toFixed(1)}k
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { TopPostsRanking };
