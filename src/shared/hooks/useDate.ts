'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  getWeekDayNames,
  getMonthNames,
  formatDate,
  formatDateFull,
  formatDateShort,
  formatTime,
  formatDateTime,
  formatRelativeDate,
  getCalendarMonth,
  getWeekDays,
  isSameDay,
  isToday,
  getUserTimezone,
  formatWithTimezone,
  utcToLocal,
  localToUtc,
} from '@/lib/date';

/**
 * Hook for date formatting and calendar utilities
 * Automatically uses the current language from context
 *
 * Usage:
 * const { weekDays, monthNames, format } = useDate();
 *
 * // Get localized weekday names
 * weekDays.short // ['Dom', 'Seg', 'Ter', ...]
 *
 * // Get localized month names
 * monthNames.long // ['Janeiro', 'Fevereiro', ...]
 *
 * // Format dates
 * format.full(new Date()) // "15 de janeiro de 2026"
 * format.short(new Date()) // "15/01/2026"
 */
export function useDate() {
  const { language } = useLanguage();

  // Memoize weekday names to avoid recalculating on every render
  const weekDays = useMemo(
    () => ({
      short: getWeekDayNames(language, 'short'),
      long: getWeekDayNames(language, 'long'),
      narrow: getWeekDayNames(language, 'narrow'),
    }),
    [language]
  );

  // Memoize month names
  const monthNames = useMemo(
    () => ({
      short: getMonthNames(language, 'short'),
      long: getMonthNames(language, 'long'),
      narrow: getMonthNames(language, 'narrow'),
    }),
    [language]
  );

  // Format functions bound to current language
  const format = useMemo(
    () => ({
      // Basic formatting
      date: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
        formatDate(date, language, options),

      // Preset formats
      full: (date: Date | string) => formatDateFull(date, language),
      short: (date: Date | string) => formatDateShort(date, language),
      time: (date: Date | string) => formatTime(date, language),
      dateTime: (date: Date | string) => formatDateTime(date, language),
      relative: (date: Date | string) => formatRelativeDate(date, language),
      withTimezone: (date: Date) => formatWithTimezone(date, language),

      // Custom weekday format
      weekday: (date: Date, format: 'short' | 'long' | 'narrow' = 'short') =>
        formatDate(date, language, { weekday: format }),

      // Custom month format
      month: (date: Date, format: 'short' | 'long' | 'narrow' = 'long') =>
        formatDate(date, language, { month: format }),
    }),
    [language]
  );

  // Calendar utilities
  const calendar = useMemo(
    () => ({
      getMonth: getCalendarMonth,
      getWeek: getWeekDays,
      isSameDay,
      isToday,
    }),
    []
  );

  // Timezone utilities
  const timezone = useMemo(
    () => ({
      get: getUserTimezone,
      toLocal: utcToLocal,
      toUtc: localToUtc,
    }),
    []
  );

  return {
    language,
    weekDays,
    monthNames,
    format,
    calendar,
    timezone,
  };
}

export default useDate;
