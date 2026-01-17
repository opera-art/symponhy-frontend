'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { getFilteredNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Crown } from 'lucide-react';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { t } = useLanguage();
  const { hasPermission, isAgency } = usePermissions();

  const navItems = useMemo(
    () => getFilteredNavigation(hasPermission, isAgency),
    [hasPermission, isAgency]
  );

  return (
    <aside className="w-[5.5rem] bg-white hidden md:flex flex-col items-center py-8 flex-shrink-0 z-30 border-r border-slate-50/50 shadow-sidebar">
      {/* Logo */}
      <div className="mb-8 relative">
        <svg
          className="w-10 h-10 text-slate-800"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l9 4.9V17L12 22l-9-4.9V7z" />
          <path d="M9 10v4" />
          <path d="M12 8v8" />
          <path d="M15 10v4" />
        </svg>

        {/* Agency Badge */}
        {isAgency && (
          <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-md group">
            <Crown className="w-3 h-3 text-white" strokeWidth={2.5} />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {t('agencyPlan')}
            </span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-9 w-full items-center flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const label = t(item.labelKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group relative',
                isActive
                  ? 'bg-gold/10 text-gold shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              )}
              aria-label={label}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />

              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={() => {
            signOut(() => router.push('/login'));
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-status-error hover:bg-rose-50 transition-all duration-300 group relative"
          aria-label={t('logout')}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />

          {/* Tooltip */}
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            {t('logout')}
          </span>
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
