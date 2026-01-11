'use client';

import React, { useState, useMemo } from 'react';
import { Topbar } from '@/components/layout';
import { Card } from '@/components/ui';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { PlatformIntegrations } from '@/components/settings/PlatformIntegrations';
import { Settings, Sliders, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { t } = useLanguage();

  const settingsSections = useMemo(
    () => [
      {
        id: 'general',
        icon: Settings,
        label: t('general'),
        description: t('generalDesc'),
      },
      {
        id: 'preferences',
        icon: Sliders,
        label: t('preferences'),
        description: t('preferencesDesc'),
      },
      {
        id: 'integrations',
        icon: Zap,
        label: t('integrations'),
        description: t('integrationsDesc'),
      },
    ],
    [t]
  );

  return (
    <>
      <Topbar />

      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('settingsTitle')}</h2>
        <p className="text-sm text-slate-500">
          {t('settingsDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card padding="md" className="sticky top-24 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 px-2">
              {t('sections')}
            </h3>

            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-gold/10 border-l-4 border-l-gold'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        isActive ? 'text-gold' : 'text-slate-400'
                      )}
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium leading-tight',
                          isActive ? 'text-slate-900' : 'text-slate-700'
                        )}
                      >
                        {section.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <GeneralSettings />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="animate-fade-in">
              <PreferencesSettings />
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="animate-fade-in">
              <PlatformIntegrations />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const dynamic = 'force-dynamic';

export default SettingsPage;
