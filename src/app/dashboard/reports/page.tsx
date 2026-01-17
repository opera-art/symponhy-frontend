'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout';
import { Button, Badge, Card } from '@/components/ui';
import {
  FollowersChart,
  EngagementChart,
  TopPostsRanking,
  PostsPerformanceChart,
  MetricsSection,
  StoriesMetrics,
  ReelsMetrics,
  CarouselMetrics,
  AudienceMetrics,
} from '@/features/reports/components';
import { reportsData } from '@/data/mockData';
import {
  Users,
  TrendingUp,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  RefreshCw,
  FileDown,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleExport = () => {
    console.log('Exporting report...');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <>
      <Topbar />

      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('reportsTitle')}</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {reportsData.profile}
                </span>
              </div>
              <Badge variant="default" size="sm" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {t('updatedOn')} {reportsData.lastUpdate}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setPeriod(days)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    period === days
                      ? 'bg-white text-slate-900 shadow-card'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {days} {t('days')}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRefresh}
              isLoading={isLoading}
            >
              {t('update')}
            </Button>

            <Button
              variant="primary"
              size="md"
              leftIcon={<FileDown className="w-4 h-4" />}
              onClick={handleExport}
            >
              {t('export')}
            </Button>
          </div>
        </div>
      </div>

      {/* Executive Summary Card */}
      <Card padding="lg" className="mb-10 bg-gradient-to-br from-slate-50 to-slate-100/50 border-2 border-slate-200/60 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gold/10 backdrop-blur flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-gold" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1 text-slate-900">{t('executiveSummary')}</h3>
            <p className="text-sm text-slate-600">
              {t('performanceOverview')} {period} {t('days')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Object.entries(reportsData.metrics).map(([key, data]) => {
            const icons = {
              followers: Users,
              reach: Eye,
              engagement: TrendingUp,
              comments: MessageCircle,
              saves: Bookmark,
              shares: Share2,
            };
            const Icon = icons[key as keyof typeof icons];
            const labels = {
              followers: t('followers'),
              reach: t('reach'),
              engagement: t('engagement'),
              comments: t('comments'),
              saves: t('saves'),
              shares: t('shares'),
            };

            return (
              <div key={key} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  {labels[key as keyof typeof labels]}
                </p>
                <p className="text-2xl font-bold mb-1 text-slate-900">
                  {key === 'engagement'
                    ? `${data.current}%`
                    : data.current.toLocaleString('pt-BR')}
                </p>
                <p
                  className={`text-xs font-bold ${
                    data.trend === 'up' ? 'text-status-success' : 'text-status-error'
                  }`}
                >
                  {data.change > 0 ? '+' : ''}{data.change}%
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Métricas de Engajamento e Impressões */}
      <div className="mb-6 animate-fade-in">
        <MetricsSection
          engagementMetrics={reportsData.engagementMetrics}
          impressionsMetrics={reportsData.impressionsMetrics}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in">
        <FollowersChart
          data={reportsData.followersEvolution}
          isLoading={isLoading}
        />
        <EngagementChart
          data={reportsData.engagementRate}
          isLoading={isLoading}
        />
      </div>

      {/* Stories e Reels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in">
        <StoriesMetrics
          metrics={reportsData.storiesMetrics}
          isLoading={isLoading}
        />
        <ReelsMetrics
          metrics={reportsData.reelsMetrics}
          isLoading={isLoading}
        />
      </div>

      {/* Carrossel */}
      <div className="mb-6 animate-fade-in">
        <CarouselMetrics
          metrics={reportsData.carouselMetrics}
          isLoading={isLoading}
        />
      </div>

      {/* Audiência/Demografia */}
      <div className="mb-6 animate-fade-in">
        <AudienceMetrics
          metrics={reportsData.audienceMetrics}
          isLoading={isLoading}
        />
      </div>

      <div className="mb-6 animate-fade-in">
        <TopPostsRanking
          posts={reportsData.topPosts}
          isLoading={isLoading}
        />
      </div>

      <div className="animate-fade-in">
        <PostsPerformanceChart
          data={reportsData.postsPerformance}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ReportsPage;
