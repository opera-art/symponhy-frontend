'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/calendar/Calendar';
import { KanbanBoard } from '@/components/kanban';
import { kanbanTasksData } from '@/data/newFeaturesData';
import { cn } from '@/lib/utils';
import { LayoutGrid, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCalendarEvents, CreateEventData } from '@/hooks/useCalendarEvents';
import { CreateEventModal } from '@/components/calendar/CreateEventModal';

type ViewType = 'calendar' | 'kanban';

export const CalendarViewContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const viewParam = searchParams.get('view') as ViewType | null;
  const [currentView, setCurrentView] = useState<ViewType>(viewParam || 'calendar');
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('09:00');

  // Fetch calendar events from backend
  const { posts, loading, error, createEvent, refetch } = useCalendarEvents(currentYear, currentMonth);

  // Handle create event from modal
  const handleCreateEvent = async (data: CreateEventData) => {
    const result = await createEvent(data);
    if (result) {
      setIsCreateModalOpen(false);
      await refetch();
    }
  };

  // Handle slot click from calendar
  const handleSlotClick = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsCreateModalOpen(true);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">{t('calendarEditorial')}</h2>
            <p className="text-sm text-slate-500">
              {t('calendarDescription')}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1.5 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('calendar')}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 text-xs font-medium',
                currentView === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              {t('calendar')}
            </button>
            <button
              onClick={() => setCurrentView('kanban')}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 text-xs font-medium',
                currentView === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {t('kanban')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {currentView === 'calendar' ? (
          loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[500px] text-red-500">
              {error}
            </div>
          ) : (
            <Calendar
              posts={posts}
              year={currentYear}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              onSlotClick={handleSlotClick}
            />
          )
        ) : (
          <div className="h-[calc(100vh-220px)]">
            <KanbanBoard tasks={kanbanTasksData} />
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />
    </>
  );
};
