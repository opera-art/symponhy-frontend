'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { Card } from '@/shared/components/ui';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-semibold text-slate-900">
          {t('language')}
        </h3>
      </div>

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

      <p className="text-sm text-slate-500 mt-4">
        Seu idioma está configurado para: <strong>{language.toUpperCase()}</strong>
      </p>
    </Card>
  );
}
