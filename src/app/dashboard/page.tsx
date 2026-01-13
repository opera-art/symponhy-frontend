'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout';
import { StatsCard } from '@/components/ui';
import { AudienceChart } from '@/components/charts/AudienceChart';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { ReferencesShowcase } from '@/components/dashboard/ReferencesShowcase';
import { RecentPostsShowcase } from '@/components/dashboard/RecentPostsShowcase';
import { UpcomingPostsShowcase } from '@/components/dashboard/UpcomingPostsShowcase';
import { dashboardStats, audienceData, pendingApprovals } from '@/data/mockData';
import { TrendingUp, Eye, Calendar, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Topbar showPeriodSelector />

      {/* Greeting */}
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
          {t('greeting')}, Ana! 👋
        </h2>
        <p className="text-sm text-slate-500">
          {t('dashboardSummary')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatsCard
          title={t('totalReach')}
          value={dashboardStats.totalReach.value}
          change={dashboardStats.totalReach.change}
          trend={dashboardStats.totalReach.trend}
          icon={<Users className="w-5 h-5" strokeWidth={1.5} />}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title={t('engagement')}
          value={dashboardStats.engagement.value}
          change={dashboardStats.engagement.change}
          trend={dashboardStats.engagement.trend}
          icon={<TrendingUp className="w-5 h-5" strokeWidth={1.5} />}
          color="green"
          isLoading={isLoading}
        />
        <StatsCard
          title={t('views')}
          value={dashboardStats.views.value}
          change={dashboardStats.views.change}
          trend={dashboardStats.views.trend}
          icon={<Eye className="w-5 h-5" strokeWidth={1.5} />}
          color="purple"
          isLoading={isLoading}
        />
        <StatsCard
          title={t('scheduledPosts')}
          value={dashboardStats.scheduledPosts.value}
          change={dashboardStats.scheduledPosts.change}
          trend={dashboardStats.scheduledPosts.trend}
          icon={<Calendar className="w-5 h-5" strokeWidth={1.5} />}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Chart */}
      <div className="mb-5 animate-fade-in">
        <AudienceChart data={audienceData} isLoading={isLoading} />
      </div>

      {/* Pending Approvals */}
      <div className="mb-5 animate-fade-in">
        <PendingApprovals approvals={pendingApprovals} isLoading={isLoading} />
      </div>

      {/* References Showcase */}
      <div className="mb-5 animate-fade-in">
        <ReferencesShowcase />
      </div>

      {/* Recent Posts */}
      <div className="mb-5 animate-fade-in">
        <RecentPostsShowcase />
      </div>

      {/* Upcoming Posts */}
      <div className="animate-fade-in">
        <UpcomingPostsShowcase />
      </div>
    </>
  );
};

export default DashboardPage;
