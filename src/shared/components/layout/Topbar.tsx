'use client';

import React, { useState } from 'react';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { useMobileNav } from '@/context/MobileNavContext';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, Bell, User } from 'lucide-react';
import type { TranslationKey } from '@/lib/translations';

interface TopbarProps {
  title?: string;
  showPeriodSelector?: boolean;
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  title,
  showPeriodSelector = false,
  className,
}) => {
  const { t } = useLanguage();
  const { openMobileNav } = useMobileNav();
  const [period, setPeriod] = useState<TranslationKey>('last15Days');

  return (
    <header className={cn('flex justify-between items-center mb-4', className)}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={openMobileNav}
          aria-label={t('openMenu')}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Grid and Menu icons */}
        <div className="hidden md:flex gap-2">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <div className="w-1 h-1 rounded-full bg-slate-400" />
            </div>
          </button>
          <button className="text-slate-300 hover:text-slate-500 transition-colors">
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Title */}
        {title && (
          <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Organization Switcher */}
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: 'flex items-center',
              organizationSwitcherTrigger:
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-sm font-medium text-slate-700',
              organizationPreviewMainIdentifier: 'text-sm font-medium text-slate-700',
              organizationSwitcherTriggerIcon: 'text-slate-400',
            },
          }}
          afterCreateOrganizationUrl="/dashboard"
          afterLeaveOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
        />

        {/* Period Selector */}
        {showPeriodSelector && (
          <button
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-card hover:shadow-md transition-shadow cursor-pointer text-xs"
            onClick={() => {
              // Toggle period logic here
            }}
          >
            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              {t(period)}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        )}

        {/* Notifications & Profile */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={t('notifications')}
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={t('profile')}
          >
            <User className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export { Topbar };
