'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, getTranslation, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');
  const [mounted, setMounted] = useState(false);

  // Carregar idioma salvo ao iniciar
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferred_language') as Language;
      if (savedLanguage && ['en', 'pt', 'es'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    } catch (err) {
      console.error('Erro ao carregar idioma:', err);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferred_language', lang);
    } catch (err) {
      console.error('Erro ao salvar idioma:', err);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return getTranslation(language, key);
    },
    [language]
  );

  // Evitar hidratação mismatched
  if (!mounted) {
    return <>{children}</>;
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  }
  return context;
};
