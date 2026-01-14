/**
 * Date utilities for scalable SaaS
 *
 * Architecture:
 * - Backend: Always stores dates in UTC (ISO 8601)
 * - Frontend: Converts to user's timezone using browser APIs
 * - Formatting: Uses Intl.DateTimeFormat for locale-aware formatting
 *
 * This approach:
 * - Works correctly across all timezones
 * - Automatically localizes month/day names
 * - No hardcoded translations needed
 * - Scalable for any language
 */

export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';

// Map our language codes to Intl locale codes
const LANGUAGE_TO_LOCALE: Record<string, SupportedLocale> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

/**
 * Get the Intl locale from our language code
 */
export function getLocale(language: string): SupportedLocale {
  return LANGUAGE_TO_LOCALE[language] || 'pt-BR';
}

/**
 * Get localized weekday names (short format)
 * Uses Intl for automatic localization
 */
export function getWeekDayNames(language: string, format: 'short' | 'long' | 'narrow' = 'short'): string[] {
  const locale = getLocale(language);
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });

  // Generate names for Sunday (0) through Saturday (6)
  // Using a fixed reference date (January 2024 starts on Monday, so we use specific dates)
  const baseDate = new Date(2024, 0, 7); // Sunday, January 7, 2024

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const name = formatter.format(date);
    // Capitalize first letter for short format
    return format === 'short'
      ? name.charAt(0).toUpperCase() + name.slice(1).replace('.', '')
      : name;
  });
}

/**
 * Get localized month names
 * Uses Intl for automatic localization
 */
export function getMonthNames(language: string, format: 'short' | 'long' | 'narrow' = 'long'): string[] {
  const locale = getLocale(language);
  const formatter = new Intl.DateTimeFormat(locale, { month: format });

  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    const name = formatter.format(date);
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
}

/**
 * Format a date according to user's locale
 */
export function formatDate(
  date: Date | string,
  language: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const locale = getLocale(language);
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format date for display (e.g., "15 de janeiro de 2026")
 */
export function formatDateFull(date: Date | string, language: string): string {
  return formatDate(date, language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format date short (e.g., "15/01/2026" or "01/15/2026")
 */
export function formatDateShort(date: Date | string, language: string): string {
  return formatDate(date, language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format time (e.g., "14:30" or "2:30 PM")
 */
export function formatTime(date: Date | string, language: string): string {
  return formatDate(date, language, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string, language: string): string {
  return formatDate(date, language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative date (e.g., "Hoje", "Amanhã", "Segunda-feira")
 */
export function formatRelativeDate(date: Date | string, language: string): string {
  const locale = getLocale(language);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  // Reset time for comparison
  const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffDays = Math.round((dateOnly.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24));

  // Use Intl.RelativeTimeFormat for "today", "tomorrow", etc.
  if (diffDays === 0) {
    const labels: Record<string, string> = {
      'pt-BR': 'Hoje',
      'en-US': 'Today',
      'es-ES': 'Hoy',
    };
    return labels[locale] || 'Today';
  }

  if (diffDays === 1) {
    const labels: Record<string, string> = {
      'pt-BR': 'Amanhã',
      'en-US': 'Tomorrow',
      'es-ES': 'Mañana',
    };
    return labels[locale] || 'Tomorrow';
  }

  if (diffDays === -1) {
    const labels: Record<string, string> = {
      'pt-BR': 'Ontem',
      'en-US': 'Yesterday',
      'es-ES': 'Ayer',
    };
    return labels[locale] || 'Yesterday';
  }

  // For other dates, show the weekday + date
  return formatDate(date, language, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Get calendar data for a month
 * Returns array of weeks, each containing 7 days
 */
export function getCalendarMonth(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from the Sunday of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End on the Saturday of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const weeks: Date[][] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

/**
 * Get the week containing a specific date
 */
export function getWeekDays(date: Date): Date[] {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Convert a UTC date string to local Date object
 * Use this when receiving dates from the backend
 */
export function utcToLocal(utcDateString: string): Date {
  return new Date(utcDateString);
}

/**
 * Convert a local Date to UTC ISO string
 * Use this when sending dates to the backend
 */
export function localToUtc(date: Date): string {
  return date.toISOString();
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format date with timezone info (for backend communication)
 */
export function formatWithTimezone(date: Date, language: string): string {
  const locale = getLocale(language);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}
