'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { CalendarPost } from '@/data/calendarData';

export interface CalendarEvent {
  id: string;
  clerk_org_id: string;
  clerk_user_id: string;
  title: string;
  description?: string;
  content_type: 'post' | 'carousel' | 'reel' | 'story';
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected';
  event_date: string; // YYYY-MM-DD
  event_time?: string; // HH:MM:SS
  scheduled_at?: string;
  platform?: string;
  thumbnail_url?: string;
  caption?: string;
  hashtags?: string[];
  rejection_reason?: string;
  rejected_by?: string;
  rejected_at?: string;
  approved_by?: string;
  approved_at?: string;
  published_at?: string;
  published_url?: string;
  metrics?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventData {
  title: string;
  content_type: 'post' | 'carousel' | 'reel' | 'story';
  event_date: string;
  event_time?: string;
  description?: string;
  status?: 'draft' | 'pending' | 'approved';
  platform?: string;
  caption?: string;
  hashtags?: string[];
  thumbnail_url?: string;
}

interface UseCalendarEventsReturn {
  events: CalendarEvent[];
  posts: CalendarPost[];
  loading: boolean;
  error: string | null;
  fetchEvents: (year: number, month: number) => Promise<void>;
  createEvent: (data: CreateEventData) => Promise<CalendarEvent | null>;
  updateEvent: (id: string, data: Partial<CreateEventData>) => Promise<CalendarEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  approveEvent: (id: string) => Promise<CalendarEvent | null>;
  rejectEvent: (id: string, reason: string) => Promise<CalendarEvent | null>;
  refetch: () => Promise<void>;
}

// Convert API CalendarEvent to frontend CalendarPost format
function eventToPost(event: CalendarEvent): CalendarPost {
  // event_date comes as YYYY-MM-DD from the backend
  // Calendar component expects date in YYYY-MM-DD format
  return {
    id: event.id,
    date: event.event_date, // Keep as YYYY-MM-DD string
    title: event.title,
    type: event.content_type,
    status: event.status === 'published' || event.status === 'rejected'
      ? 'approved'
      : event.status as 'approved' | 'pending' | 'draft',
    scheduledTime: event.event_time?.substring(0, 5) || '09:00',
    thumbnail: event.thumbnail_url,
    caption: event.caption,
    platform: event.platform as CalendarPost['platform'],
  };
}

export function useCalendarEvents(year: number, month: number): UseCalendarEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (y: number, m: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/calendar/events/month', {
        params: { year: y, month: m }
      });

      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setError(response.data.error || 'Failed to fetch events');
      }
    } catch (err: unknown) {
      console.error('Error fetching calendar events:', err);
      // Extract error message for better debugging
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load calendar events';
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (data: CreateEventData): Promise<CalendarEvent | null> => {
    try {
      const response = await api.post('/calendar/events', data);

      if (response.data.success) {
        const newEvent = response.data.data;
        setEvents(prev => [...prev, newEvent]);
        return newEvent;
      } else {
        setError(response.data.error || 'Failed to create event');
        return null;
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
      return null;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, data: Partial<CreateEventData>): Promise<CalendarEvent | null> => {
    try {
      const response = await api.put(`/calendar/events/${id}`, data);

      if (response.data.success) {
        const updatedEvent = response.data.data;
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
        return updatedEvent;
      } else {
        setError(response.data.error || 'Failed to update event');
        return null;
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
      return null;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/calendar/events/${id}`);

      if (response.data.success) {
        setEvents(prev => prev.filter(e => e.id !== id));
        return true;
      } else {
        setError(response.data.error || 'Failed to delete event');
        return false;
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      return false;
    }
  }, []);

  const approveEvent = useCallback(async (id: string): Promise<CalendarEvent | null> => {
    try {
      const response = await api.patch(`/calendar/events/${id}/approve`);

      if (response.data.success) {
        const updatedEvent = response.data.data;
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
        return updatedEvent;
      } else {
        setError(response.data.error || 'Failed to approve event');
        return null;
      }
    } catch (err) {
      console.error('Error approving event:', err);
      setError('Failed to approve event');
      return null;
    }
  }, []);

  const rejectEvent = useCallback(async (id: string, reason: string): Promise<CalendarEvent | null> => {
    try {
      const response = await api.patch(`/calendar/events/${id}/reject`, { reason });

      if (response.data.success) {
        const updatedEvent = response.data.data;
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
        return updatedEvent;
      } else {
        setError(response.data.error || 'Failed to reject event');
        return null;
      }
    } catch (err) {
      console.error('Error rejecting event:', err);
      setError('Failed to reject event');
      return null;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchEvents(year, month);
  }, [fetchEvents, year, month]);

  // Fetch events when year/month changes
  useEffect(() => {
    fetchEvents(year, month);
  }, [year, month, fetchEvents]);

  // Convert events to posts format for the Calendar component
  const posts: CalendarPost[] = events.map(eventToPost);

  return {
    events,
    posts,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
    refetch,
  };
}
