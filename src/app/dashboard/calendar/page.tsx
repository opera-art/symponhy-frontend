import React, { Suspense } from 'react';
import { Topbar } from '@/components/layout';
import { CalendarViewContainer } from '@/components/calendar/CalendarViewContainer';

const CalendarPage: React.FC = () => {
  return (
    <>
      <Topbar />
      <Suspense fallback={<div className="text-center py-12 text-slate-400">Carregando...</div>}>
        <CalendarViewContainer />
      </Suspense>
    </>
  );
};

export default CalendarPage;
