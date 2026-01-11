'use client';

import React, { Suspense } from 'react';
import { Topbar } from '@/components/layout';
import { CalendarViewContainer } from '@/components/calendar/CalendarViewContainer';
import { useLanguage } from '@/context/LanguageContext';

const CalendarPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Topbar />
      <Suspense fallback={<div className="text-center py-12 text-slate-400">{t('loading')}</div>}>
        <CalendarViewContainer />
      </Suspense>
    </>
  );
};

export default CalendarPage;
