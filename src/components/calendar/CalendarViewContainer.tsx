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
import { CalendarPost } from '@/data/calendarData';

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
  const [editingPost, setEditingPost] = useState<CalendarPost | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<CalendarPost | null>(null);

  // Fetch calendar events from backend
  const { posts, loading, error, createEvent, updateEvent, deleteEvent, refetch } = useCalendarEvents(currentYear, currentMonth);

  // Handle create event from modal
  const handleCreateEvent = async (data: CreateEventData) => {
    const result = await createEvent(data);
    if (result) {
      setIsCreateModalOpen(false);
      await refetch();
    }
  };

  // Handle update event from modal
  const handleUpdateEvent = async (data: CreateEventData) => {
    if (editingPost) {
      const result = await updateEvent(editingPost.id, data);
      if (result) {
        setEditingPost(null);
        await refetch();
      }
    }
  };

  // Handle edit post - open modal with post data
  const handleEditPost = (post: CalendarPost) => {
    setEditingPost(post);
  };

  // Handle delete post - show confirmation
  const handleDeletePost = (post: CalendarPost) => {
    setDeleteConfirmPost(post);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deleteConfirmPost) {
      const success = await deleteEvent(deleteConfirmPost.id);
      if (success) {
        setDeleteConfirmPost(null);
        await refetch();
      }
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
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
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

      {/* Edit Event Modal */}
      <CreateEventModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdateEvent}
        initialDate={editingPost?.date || ''}
        initialTime={editingPost?.scheduledTime || '09:00'}
        initialTitle={editingPost?.title}
        initialType={editingPost?.type}
        initialCaption={editingPost?.caption}
        initialPlatform={editingPost?.platform}
        initialThumbnail={editingPost?.thumbnail}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Excluir conteúdo?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Tem certeza que deseja excluir <strong>"{deleteConfirmPost.title}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmPost(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
