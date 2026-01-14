'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { usePermissions } from '@/hooks/usePermissions';
import { getFilteredNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { X, LogOut, Crown } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { t } = useLanguage();
  const { hasPermission, isAgency } = usePermissions();

  const navItems = useMemo(
    () => getFilteredNavigation(hasPermission, isAgency),
    [hasPermission, isAgency]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-slate-800"
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
            <span className="font-semibold text-slate-800">Symponhy</span>
            {isAgency && (
              <div className="px-2 py-0.5 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-white" strokeWidth={2.5} />
                <span className="text-[10px] font-bold text-white">{t('agencyPlan')}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const label = t(item.labelKey);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gold/10 text-gold font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              signOut(() => router.push('/login'));
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-rose-50 hover:text-status-error transition-all duration-200"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm">{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export { MobileNav };
