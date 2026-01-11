'use client';

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Save, Moon, Sun, Palette, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

export const PreferencesSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [preferences, setPreferences] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    emailNotifications: true,
    pushNotifications: false,
    postReminders: true,
    dailyDigest: false,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
  });

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const handleChange = (key: keyof typeof preferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log('Salvando preferências:', preferences);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Preferências Pessoais
        </h3>
        <p className="text-sm text-slate-600">
          Customize a experiência de acordo com suas necessidades
        </p>
      </div>

      {/* Appearance */}
      <Card padding="md">
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 mb-4">Aparência</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Tema
              </label>
              <div className="flex gap-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleChange('theme', theme)}
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2',
                      preferences.theme === theme
                        ? 'border-gold bg-gold/5'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {theme === 'light' && <Sun className="w-4 h-4" />}
                    {theme === 'dark' && <Moon className="w-4 h-4" />}
                    {theme === 'auto' && <Palette className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">
                      {theme === 'auto' ? 'Automático' : theme === 'light' ? 'Claro' : 'Escuro'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Language & Location */}
      <Card padding="md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gold" />
            <h4 className="font-semibold text-slate-900">
              {t('language')}
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-3">
                Escolha seu idioma preferido
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-center
                      ${
                        language === lang.code
                          ? 'border-gold bg-gold/5'
                          : 'border-slate-200 hover:border-gold/50 bg-slate-50'
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <p className="font-medium text-slate-900">{lang.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{lang.code.toUpperCase()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fuso Horário
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/Bahia">Bahia (GMT-3)</option>
                <option value="America/Fortaleza">Ceará (GMT-3)</option>
                <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="md">
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 mb-4">Notificações</h4>

          <div className="space-y-3">
            {[
              { key: 'emailNotifications', label: 'Notificações por Email' },
              { key: 'pushNotifications', label: 'Notificações Push' },
              { key: 'postReminders', label: 'Lembretes de Posts' },
              { key: 'dailyDigest', label: 'Resumo Diário' },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50"
              >
                <label className="text-sm font-medium text-slate-700 cursor-pointer">
                  {label}
                </label>
                <button
                  onClick={() =>
                    handleToggle(key as keyof typeof preferences)
                  }
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    preferences[key as keyof typeof preferences]
                      ? 'bg-gold'
                      : 'bg-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      preferences[key as keyof typeof preferences]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Button
        variant="primary"
        leftIcon={<Save className="w-4 h-4" />}
        onClick={handleSave}
      >
        Salvar Preferências
      </Button>
    </div>
  );
};
