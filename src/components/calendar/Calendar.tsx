'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MoreHorizontal, FileText, Plus } from 'lucide-react';
import { CalendarPost } from '@/data/calendarData';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useChatContent } from '@/context/ChatContentContext';
import { useDate } from '@/hooks/useDate';
import { AddContentModal } from './AddContentModal';

// Platform logos mapping
const PLATFORM_LOGOS: Record<string, string> = {
  instagram: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
  tiktok: 'https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png',
  youtube: 'https://waryhub.com/files/preview/960x960/11767610313jrhof02aap4tz9sc5zd4jruev8rjau7kuv4wouxfagagliudlz5b2bh6gvqmrz29amwaflw2mumipqcbul5xibtd7dxyo7jr4pip.png',
  facebook: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png',
  linkedin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png',
  twitter: 'https://about.x.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png',
};

interface CalendarProps {
  posts: CalendarPost[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  onSlotClick?: (date: string, time: string) => void;
}

type CalendarView = 'month' | 'week' | 'day';

interface SelectedSlot {
  day: number;
  time: string;
  date: string;
}

const Calendar: React.FC<CalendarProps> = ({ posts, year, month, onMonthChange, onSlotClick }) => {
  const { t } = useLanguage();
  const { setIsAddingContent, setCallbacks, setIsPlanningDay, setPlanningDate } = useChatContent();
  const { weekDays: weekDayNames, monthNames: monthNamesList, format } = useDate();
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [view, setView] = useState<CalendarView>('week');
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [hoveredMonthDay, setHoveredMonthDay] = useState<number | null>(null);
  const [hoveredPost, setHoveredPost] = useState<{ post: CalendarPost; x: number; y: number } | null>(null);

  // Use Intl-based month and weekday names (auto-localized)
  const monthNames = monthNamesList.long;
  const weekDays = weekDayNames.short;
  const weekDaysLong = weekDayNames.long;

  // Full day time slots (6am to midnight)
  const timeSlots = ['6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];

  // Get all days for month view calendar grid
  const getMonthDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Get days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: startingDayOfWeek }, (_, i) => ({
      day: prevMonthLastDay - startingDayOfWeek + i + 1,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false,
    }));

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false,
    }));

    // Get days from next month to fill the last week
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true,
    }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [year, month]);

  // Get the selected day data for day view
  const getSelectedDayData = () => {
    const date = new Date(year, month, selectedDay);
    return {
      day: selectedDay,
      weekDay: weekDaysLong[date.getDay()],
      isToday: date.toDateString() === new Date().toDateString(),
    };
  };

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

  const previousWeek = () => {
    const currentDate = new Date(year, month, selectedDay);
    currentDate.setDate(currentDate.getDate() - 7);
    onMonthChange(currentDate.getFullYear(), currentDate.getMonth());
    setSelectedDay(currentDate.getDate());
  };

  const nextWeek = () => {
    const currentDate = new Date(year, month, selectedDay);
    currentDate.setDate(currentDate.getDate() + 7);
    onMonthChange(currentDate.getFullYear(), currentDate.getMonth());
    setSelectedDay(currentDate.getDate());
  };

  const previousDay = () => {
    const currentDate = new Date(year, month, selectedDay);
    currentDate.setDate(currentDate.getDate() - 1);
    onMonthChange(currentDate.getFullYear(), currentDate.getMonth());
    setSelectedDay(currentDate.getDate());
  };

  const nextDay = () => {
    const currentDate = new Date(year, month, selectedDay);
    currentDate.setDate(currentDate.getDate() + 1);
    onMonthChange(currentDate.getFullYear(), currentDate.getMonth());
    setSelectedDay(currentDate.getDate());
  };

  const handlePrevious = () => {
    if (view === 'month') previousMonth();
    else if (view === 'week') previousWeek();
    else previousDay();
  };

  const handleNext = () => {
    if (view === 'month') nextMonth();
    else if (view === 'week') nextWeek();
    else nextDay();
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth());
    setSelectedDay(today.getDate());
  };

  const handleDayHeaderClick = (dayData: { day: number; weekDay: string; isCurrentMonth: boolean; isToday: boolean }) => {
    const date = new Date(year, month, dayData.day);
    // Use Intl-based formatting (respects user's language)
    const formattedDate = format.full(date);

    setPlanningDate({
      day: dayData.day,
      month: month,
      year: year,
      weekDay: dayData.weekDay,
      formattedDate: formattedDate,
    });
    setIsPlanningDay(true);
  };

  const handleSlotClick = (day: number, timeSlot: string) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const timeHour = parseInt(timeSlot.replace('h', ''));
    const formattedTime = `${String(timeHour).padStart(2, '0')}:00`;

    // Call external handler if provided (for CreateEventModal)
    if (onSlotClick) {
      onSlotClick(dateStr, formattedTime);
      return;
    }

    // Fallback to chat context modal
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
    const startHour = 6;
    if (hours < startHour) return 0;
    return (hours - startHour) * 60; // 60px per hour
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
            onClick={handlePrevious}
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
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===== MONTH VIEW ===== */}
      {view === 'month' && (
        <>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className="text-center text-xs font-medium text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-7 gap-1">
              {getMonthDays.map((dayData, idx) => {
                const isToday =
                  dayData.isCurrentMonth &&
                  dayData.day === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear();

                const dayPosts = dayData.isCurrentMonth
                  ? getPostsForDate(dayData.day)
                  : [];

                const isHovered = hoveredMonthDay === idx;

                return (
                  <div
                    key={idx}
                    className={cn(
                      'min-h-[100px] p-2 rounded-xl border transition-all duration-200 cursor-pointer relative group',
                      dayData.isCurrentMonth
                        ? 'bg-white border-slate-100 hover:border-amber-300 hover:shadow-sm'
                        : 'bg-slate-50/50 border-transparent',
                      isToday && 'ring-2 ring-amber-400 ring-offset-1'
                    )}
                    onMouseEnter={() => setHoveredMonthDay(idx)}
                    onMouseLeave={() => setHoveredMonthDay(null)}
                    onClick={() => {
                      if (dayData.isCurrentMonth) {
                        setSelectedDay(dayData.day);
                        setView('day');
                      }
                    }}
                  >
                    {/* Day Number */}
                    <div
                      className={cn(
                        'text-sm font-semibold mb-1',
                        dayData.isCurrentMonth
                          ? isToday
                            ? 'text-amber-600'
                            : 'text-slate-800'
                          : 'text-slate-300'
                      )}
                    >
                      {dayData.day}
                    </div>

                    {/* Events for this day */}
                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map((post, postIdx) => (
                        <div
                          key={post.id}
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1 hover:ring-1 hover:ring-amber-300 transition-all',
                            getPostColor(postIdx)
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPost({ post, x: rect.right + 10, y: rect.top });
                          }}
                          onMouseLeave={() => setHoveredPost(null)}
                        >
                          {post.platform && PLATFORM_LOGOS[post.platform] && (
                            <img
                              src={PLATFORM_LOGOS[post.platform]}
                              alt={post.platform}
                              className="w-3 h-3 rounded-sm object-contain flex-shrink-0"
                            />
                          )}
                          <span className="truncate">{post.scheduledTime} {post.title}</span>
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-[10px] text-slate-500 px-1.5">
                          +{dayPosts.length - 3} mais
                        </div>
                      )}
                    </div>

                    {/* Add button on hover */}
                    {dayData.isCurrentMonth && isHovered && (
                      <button
                        className="absolute top-1 right-1 w-6 h-6 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlotClick(dayData.day, '9h');
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-700" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ===== WEEK VIEW ===== */}
      {view === 'week' && (
        <>
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
                    'flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer hover:ring-2 hover:ring-amber-300 hover:ring-offset-1',
                    dayData.isToday
                      ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-800 hover:bg-amber-50'
                  )}
                  onClick={() => handleDayHeaderClick(dayData)}
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
                          return postHour === timeHour;
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
                        const height = 56; // Slightly less than 60px slot height

                        return (
                          <div
                            key={post.id}
                            className={cn(
                              'absolute left-0 right-0 rounded-xl p-2 flex flex-col justify-between group hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer z-10',
                              getPostColor(postIdx)
                            )}
                            style={{
                              top: `${topPosition}px`,
                              height: `${height}px`,
                            }}
                            onClick={() => setSelectedPost(post)}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredPost({ post, x: rect.right + 10, y: rect.top });
                            }}
                            onMouseLeave={() => setHoveredPost(null)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-0.5">
                                  {post.scheduledTime}
                                </div>
                              </div>
                              {/* Platform Logo */}
                              {post.platform && PLATFORM_LOGOS[post.platform] && (
                                <img
                                  src={PLATFORM_LOGOS[post.platform]}
                                  alt={post.platform}
                                  className="w-4 h-4 rounded object-contain flex-shrink-0"
                                />
                              )}
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
          </div>
        </>
      )}

      {/* ===== DAY VIEW ===== */}
      {view === 'day' && (
        <>
          {/* Day Header */}
          <div className="grid grid-cols-[80px_1fr] gap-3 mb-3">
            <div className="flex items-center justify-center">
              <button className="text-slate-400 hover:text-slate-600">
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>
            <div>
              {(() => {
                const dayData = getSelectedDayData();
                return (
                  <div
                    className={cn(
                      'flex items-center gap-4 py-3 px-4 rounded-xl transition-all cursor-pointer hover:ring-2 hover:ring-amber-300 hover:ring-offset-1',
                      dayData.isToday
                        ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800'
                        : 'bg-slate-50 text-slate-800 hover:bg-amber-50'
                    )}
                    onClick={() => handleDayHeaderClick({ ...dayData, isCurrentMonth: true })}
                  >
                    <span className="text-3xl font-bold tracking-tight">
                      {dayData.day}
                    </span>
                    <div className="flex flex-col">
                      <span className={cn(
                        'text-sm font-medium',
                        dayData.isToday ? 'text-slate-300' : 'text-slate-500'
                      )}>
                        {dayData.weekDay}
                      </span>
                      <span className={cn(
                        'text-xs',
                        dayData.isToday ? 'text-slate-400' : 'text-slate-400'
                      )}>
                        {monthNames[month]} {year}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Day Grid Area */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="grid grid-cols-[80px_1fr] gap-3">
              {/* Time Column */}
              <div className="flex flex-col text-sm text-slate-400 font-medium">
                {timeSlots.map((time, idx) => (
                  <div key={idx} className="h-[80px] flex items-start pt-1">
                    {time}
                  </div>
                ))}
              </div>

              {/* Events Area */}
              <div className="relative">
                {/* Horizontal Lines */}
                <div className="absolute inset-0 flex flex-col w-full pointer-events-none">
                  {timeSlots.map((_, idx) => (
                    <div key={idx} className="h-[80px] border-b border-slate-100 w-full" />
                  ))}
                </div>

                {/* Clickable time slots */}
                {(() => {
                  const dayPosts = getPostsForDate(selectedDay);

                  return (
                    <>
                      {timeSlots.map((time, timeIdx) => {
                        const slotKey = `day-${timeIdx}`;
                        const isHovered = hoveredSlot === slotKey;
                        const timeHour = parseInt(time.replace('h', ''));

                        // Check if there's a post in this time slot
                        const hasPostInSlot = dayPosts.some(post => {
                          const postHour = parseInt(post.scheduledTime.split(':')[0]);
                          return postHour === timeHour;
                        });

                        if (hasPostInSlot) return null;

                        return (
                          <div
                            key={slotKey}
                            className={cn(
                              'absolute left-0 right-0 h-[80px] rounded-xl cursor-pointer transition-all duration-200',
                              isHovered
                                ? 'bg-amber-50/80 border-2 border-dashed border-amber-300'
                                : 'hover:bg-slate-50/50'
                            )}
                            style={{ top: `${timeIdx * 80}px` }}
                            onMouseEnter={() => setHoveredSlot(slotKey)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            onClick={() => handleSlotClick(selectedDay, time)}
                          >
                            {isHovered && (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-sm font-medium text-amber-600">
                                  {time} - {t('createContent') || 'Criar conteúdo'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Posts */}
                      {dayPosts.map((post, postIdx) => {
                        const [hours] = post.scheduledTime.split(':').map(Number);
                        const startHour = 6;
                        const topPosition = hours < startHour ? 0 : (hours - startHour) * 80;
                        const height = 76; // Slightly less than 80px slot height

                        return (
                          <div
                            key={post.id}
                            className={cn(
                              'absolute left-0 right-0 rounded-xl p-3 flex flex-col justify-between group hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer z-10',
                              getPostColor(postIdx)
                            )}
                            style={{
                              top: `${topPosition}px`,
                              height: `${height}px`,
                            }}
                            onClick={() => setSelectedPost(post)}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredPost({ post, x: rect.right + 10, y: rect.top });
                            }}
                            onMouseLeave={() => setHoveredPost(null)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-xs text-slate-600 mt-0.5">
                                  {post.scheduledTime}
                                </div>
                              </div>
                              {/* Platform Logo */}
                              {post.platform && PLATFORM_LOGOS[post.platform] && (
                                <img
                                  src={PLATFORM_LOGOS[post.platform]}
                                  alt={post.platform}
                                  className="w-5 h-5 rounded object-contain flex-shrink-0 ml-2"
                                />
                              )}
                            </div>

                            <div className="flex gap-1.5">
                              {post.type && (
                                <Badge variant="default" size="sm" className="text-[10px] px-2 py-0.5 bg-white/60">
                                  {post.type}
                                </Badge>
                              )}
                              {post.status && (
                                <Badge
                                  variant="default"
                                  size="sm"
                                  className={cn(
                                    'text-[10px] px-2 py-0.5',
                                    post.status === 'approved' && 'bg-green-100 text-green-700',
                                    post.status === 'pending' && 'bg-amber-100 text-amber-700',
                                    post.status === 'draft' && 'bg-slate-100 text-slate-600'
                                  )}
                                >
                                  {t(post.status) || post.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Calendar Grid Area - Shared floating elements */}
      <div className="relative">

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
                  {format.date(new Date(selectedPost.date), {
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

      {/* Hover Preview - Floating thumbnail card */}
      {hoveredPost && (
        <div
          className="fixed bg-white rounded-xl shadow-2xl shadow-slate-300/50 border border-slate-100 p-3 z-[60] pointer-events-none animate-fade-in"
          style={{
            left: `${Math.min(hoveredPost.x, window.innerWidth - 220)}px`,
            top: `${Math.max(10, Math.min(hoveredPost.y, window.innerHeight - 200))}px`,
            width: '200px',
          }}
        >
          {/* Thumbnail */}
          {hoveredPost.post.thumbnail ? (
            <div className="w-full h-28 bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img
                src={hoveredPost.post.thumbnail}
                alt={hoveredPost.post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
          )}

          {/* Title and Platform */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 line-clamp-2">
                {hoveredPost.post.title}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {hoveredPost.post.scheduledTime} • {hoveredPost.post.type}
              </div>
            </div>
            {hoveredPost.post.platform && PLATFORM_LOGOS[hoveredPost.post.platform] && (
              <img
                src={PLATFORM_LOGOS[hoveredPost.post.platform]}
                alt={hoveredPost.post.platform}
                className="w-6 h-6 rounded object-contain flex-shrink-0"
              />
            )}
          </div>

          {/* Caption preview */}
          {hoveredPost.post.caption && (
            <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 border-t border-slate-100 pt-2">
              {hoveredPost.post.caption}
            </div>
          )}
        </div>
      )}

      {/* AddContentModal is now just for managing state */}
      <AddContentModal
        onManualUpload={() => console.log('Manual upload')}
        onCreateWithAgents={() => console.log('Create with agents')}
      />
    </div>
  );
};

export { Calendar };
