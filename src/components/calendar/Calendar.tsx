'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MoreHorizontal, FileText } from 'lucide-react';
import { CalendarPost } from '@/data/calendarData';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useChatContent } from '@/context/ChatContentContext';
import { AddContentModal } from './AddContentModal';

interface CalendarProps {
  posts: CalendarPost[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

type CalendarView = 'month' | 'week' | 'day';

interface SelectedSlot {
  day: number;
  time: string;
  date: string;
}

const Calendar: React.FC<CalendarProps> = ({ posts, year, month, onMonthChange }) => {
  const { t } = useLanguage();
  const { setIsAddingContent, setCallbacks } = useChatContent();
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [view, setView] = useState<CalendarView>('week');
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const monthNames = useMemo(() => [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ], [t]);

  const weekDays = useMemo(() => [
    t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')
  ], [t]);

  const timeSlots = ['8h', '10h', '12h', '14h', '16h', '18h'];

  const previousMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth());
    setSelectedDay(today.getDate());
  };

  const handleSlotClick = (day: number, timeSlot: string) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const timeHour = parseInt(timeSlot.replace('h', ''));
    const formattedTime = `${String(timeHour).padStart(2, '0')}:00`;

    const handleManualUpload = () => {
      console.log(`Manual upload for ${dateStr} at ${formattedTime}`);
    };

    const handleCreateWithAgents = () => {
      console.log(`Create with agents for ${dateStr} at ${formattedTime}`);
    };

    setCallbacks(handleManualUpload, handleCreateWithAgents);
    setIsAddingContent(true);
  };

  const getSlotKey = (dayIdx: number, timeIdx: number) => `${dayIdx}-${timeIdx}`;

  const getWeekDays = () => {
    const startOfWeek = selectedDay - new Date(year, month, selectedDay).getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek + i;
      const date = new Date(year, month, day);
      return {
        day: date.getDate(),
        weekDay: weekDays[date.getDay()],
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  };

  const getPostsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(post => post.date === dateStr);
  };

  const getPostColor = (index: number) => {
    const colors = [
      'bg-blue-200/40',
      'bg-purple-200/60',
      'bg-green-200/50',
      'bg-orange-200/50',
      'bg-pink-200/50',
      'bg-yellow-200/50',
      'bg-indigo-200/50',
    ];
    return colors[index % colors.length];
  };

  const getTimePosition = (time: string) => {
    const [hours] = time.split(':').map(Number);
    const startHour = 8;
    if (hours < startHour) return 0;
    return ((hours - startHour) / 2) * 60;
  };

  const weekDaysData = getWeekDays();

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 flex flex-col relative overflow-hidden h-[calc(100vh-200px)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
          {monthNames[month]}, {year}
        </h1>

        {/* View Toggle */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-medium">
          <button
            onClick={() => setView('month')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all duration-200',
              view === 'month'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {t('month')}
          </button>
          <button
            onClick={() => setView('week')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all duration-200',
              view === 'week'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {t('week')}
          </button>
          <button
            onClick={() => setView('day')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all duration-200',
              view === 'day'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {t('day')}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={previousMonth}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-1.5 bg-slate-100 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-all duration-200 text-xs"
          >
            {t('today')}
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Days Header */}
      <div className="grid grid-cols-[50px_1fr] gap-3 mb-3">
        <div className="flex items-center justify-center">
          <button className="text-slate-400 hover:text-slate-600">
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDaysData.map((dayData, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer',
                dayData.isToday
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              )}
              onClick={() => setSelectedDay(dayData.day)}
            >
              <span className={cn(
                'text-[10px] font-medium mb-0.5',
                dayData.isToday ? 'text-slate-400' : 'text-slate-500'
              )}>
                {dayData.weekDay}
              </span>
              <span className="text-lg font-semibold tracking-tight">
                {dayData.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="grid grid-cols-[50px_1fr] gap-3">
          {/* Time Column */}
          <div className="flex flex-col text-xs text-slate-400 font-medium">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="h-[60px] flex items-start">
                {time}
              </div>
            ))}
          </div>

          {/* Events Grid */}
          <div className="relative grid grid-cols-7 gap-2">
            {/* Horizontal Lines */}
            <div className="absolute inset-0 flex flex-col w-full pointer-events-none">
              {timeSlots.map((_, idx) => (
                <div key={idx} className="h-[60px] border-b border-slate-100 w-full" />
              ))}
            </div>

            {/* Columns for each day */}
            {weekDaysData.map((dayData, dayIdx) => {
              const dayPosts = getPostsForDate(dayData.day);

              return (
                <div key={dayIdx} className="relative h-full">
                  {/* Clickable time slots */}
                  {timeSlots.map((time, timeIdx) => {
                    const slotKey = getSlotKey(dayIdx, timeIdx);
                    const isHovered = hoveredSlot === slotKey;
                    const timeHour = parseInt(time.replace('h', ''));

                    // Check if there's a post in this time slot
                    const hasPostInSlot = dayPosts.some(post => {
                      const postHour = parseInt(post.scheduledTime.split(':')[0]);
                      return postHour >= timeHour && postHour < timeHour + 2;
                    });

                    if (hasPostInSlot) return null;

                    return (
                      <div
                        key={slotKey}
                        className={cn(
                          'absolute left-0 right-0 h-[60px] rounded-xl cursor-pointer transition-all duration-200',
                          isHovered
                            ? 'bg-amber-50/80 border-2 border-dashed border-amber-300'
                            : 'hover:bg-slate-50/50'
                        )}
                        style={{ top: `${timeIdx * 60}px` }}
                        onMouseEnter={() => setHoveredSlot(slotKey)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        onClick={() => handleSlotClick(dayData.day, time)}
                      >
                        {isHovered && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-amber-600">
                              {time} - Criar conteúdo
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Posts */}
                  {dayPosts.map((post, postIdx) => {
                    const topPosition = getTimePosition(post.scheduledTime);
                    const height = 80;

                    return (
                      <div
                        key={post.id}
                        className={cn(
                          'absolute left-0 right-0 rounded-xl p-2 flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer z-10',
                          getPostColor(postIdx)
                        )}
                        style={{
                          top: `${topPosition}px`,
                          height: `${height}px`,
                        }}
                        onClick={() => setSelectedPost(post)}
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            {post.scheduledTime}
                          </div>
                        </div>

                        {post.type && (
                          <div className="flex gap-1">
                            <Badge variant="default" size="sm" className="text-[9px] px-1.5 py-0.5 bg-white/60">
                              {post.type}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Modal - Event Detail */}
        {selectedPost && (
          <div className="absolute top-[20px] left-[30%] w-[340px] bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-100 p-5 z-50 animate-fade-in">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={selectedPost.title}
                readOnly
                className="text-lg font-semibold text-slate-900 w-full outline-none"
              />
            </div>

            {/* Thumbnail */}
            {selectedPost.thumbnail && (
              <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden mb-3">
                <img
                  src={selectedPost.thumbnail}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-2 mb-4">
              {/* Date */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  {new Date(selectedPost.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  {selectedPost.scheduledTime}
                </span>
              </div>

              {/* Type */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  {selectedPost.type}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <button className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-semibold hover:bg-purple-200 transition-colors">
                {selectedPost.type}
              </button>
              {selectedPost.status === 'approved' && (
                <button className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-semibold hover:bg-green-200 transition-colors">
                  {t('approved')}
                </button>
              )}
              {selectedPost.status === 'pending' && (
                <button className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-semibold hover:bg-amber-200 transition-colors">
                  {t('pending')}
                </button>
              )}
              {selectedPost.status === 'draft' && (
                <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold hover:bg-slate-200 transition-colors">
                  {t('draft')}
                </button>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all duration-200 text-xs"
              >
                {t('close')}
              </button>
              <button className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AddContentModal is now just for managing state */}
      <AddContentModal
        onManualUpload={() => console.log('Manual upload')}
        onCreateWithAgents={() => console.log('Create with agents')}
      />
    </div>
  );
};

export { Calendar };
