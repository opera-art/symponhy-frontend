'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/calendar/Calendar';
import { KanbanBoard } from '@/components/kanban';
import { kanbanTasksData } from '@/data/newFeaturesData';
import { cn } from '@/lib/utils';
import { LayoutGrid, Calendar as CalendarIcon, Loader2, Sparkles, Upload, X, UserCheck, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCalendarEvents, CreateEventData } from '@/hooks/useCalendarEvents';
import { CreateEventModal } from '@/components/calendar/CreateEventModal';
import { CalendarPost } from '@/data/calendarData';
import { useChatContent } from '@/context/ChatContentContext';

type ViewType = 'calendar' | 'kanban';

export const CalendarViewContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { setIsAddingContent, setPlanningDate, setIsPlanningDay } = useChatContent();
  const viewParam = searchParams.get('view') as ViewType | null;
  const [currentView, setCurrentView] = useState<ViewType>(viewParam || 'calendar');
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [editingPost, setEditingPost] = useState<CalendarPost | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<CalendarPost | null>(null);
  const [reviewPost, setReviewPost] = useState<CalendarPost | null>(null);
  const [reviewerSearch, setReviewerSearch] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);

  // Mock team members - in production this would come from Clerk organization members
  const teamMembers = [
    { id: '1', name: 'Ana Silva', email: 'ana@empresa.com', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Carlos Santos', email: 'carlos@empresa.com', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Maria Oliveira', email: 'maria@empresa.com', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'João Costa', email: 'joao@empresa.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(reviewerSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(reviewerSearch.toLowerCase())
  );

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

  // Handle review post - open reviewer selection modal
  const handleReviewPost = (post: CalendarPost) => {
    setReviewPost(post);
    setSelectedReviewer(null);
    setReviewerSearch('');
  };

  // Send review request
  const sendReviewRequest = async () => {
    if (reviewPost && selectedReviewer) {
      // TODO: Implement API call to send review request
      console.log(`Sending review request for "${reviewPost.title}" to reviewer ${selectedReviewer}`);
      // For now, just close the modal
      setReviewPost(null);
      setSelectedReviewer(null);
      setReviewerSearch('');
      // Show success message (you could use a toast here)
      alert('Solicitação de revisão enviada com sucesso!');
    }
  };

  // Handle slot click from calendar - show choice modal first
  const handleSlotClick = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsChoiceModalOpen(true);
  };

  // User chose manual upload
  const handleChooseManual = () => {
    setIsChoiceModalOpen(false);
    setIsCreateModalOpen(true);
  };

  // User chose to create with agents - open chat sphere
  const handleChooseAgents = () => {
    setIsChoiceModalOpen(false);
    // Parse the date to set planning context
    const dateParts = selectedDate.split('-');
    const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    setPlanningDate({
      day: dateObj.getDate(),
      month: dateObj.getMonth(),
      year: dateObj.getFullYear(),
      weekDay: weekDays[dateObj.getDay()],
      formattedDate: dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    });
    setIsPlanningDay(true);
    setIsAddingContent(true);
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
              onReviewPost={handleReviewPost}
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

      {/* Choice Modal - Manual or Agents */}
      {isChoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Como deseja criar o conteúdo?
              </h3>
              <button
                onClick={() => setIsChoiceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Escolha como você quer adicionar conteúdo para <strong>{selectedDate}</strong> às <strong>{selectedTime}</strong>
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Option: With Agents */}
              <button
                onClick={handleChooseAgents}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Com Agentes IA</p>
                  <p className="text-xs text-slate-500 mt-1">Crie com ajuda da esfera</p>
                </div>
              </button>

              {/* Option: Manual */}
              <button
                onClick={handleChooseManual}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Manual</p>
                  <p className="text-xs text-slate-500 mt-1">Faça upload direto</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Review Request Modal */}
      {reviewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Solicitar Revisão
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {reviewPost.title}
                </p>
              </div>
              <button
                onClick={() => setReviewPost(null)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar membro da equipe..."
                value={reviewerSearch}
                onChange={(e) => setReviewerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            {/* Team Members List */}
            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-4">
                  Nenhum membro encontrado
                </p>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedReviewer(member.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                      selectedReviewer === member.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {member.email}
                      </p>
                    </div>
                    {selectedReviewer === member.id && (
                      <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setReviewPost(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={sendReviewRequest}
                disabled={!selectedReviewer}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
