'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  OnboardingProgress,
  SaveSectionPayload,
  SaveProgressPayload,
  ApiResponse,
} from '@/types/onboarding';

const LOCAL_STORAGE_KEY = 'onboarding_draft';
const DEBOUNCE_MS = 2000; // 2 segundos de debounce para salvar no servidor

interface OnboardingData {
  sections: Record<string, unknown>;
  formData: Record<string, unknown>;
  progress: OnboardingProgress | null;
}

interface UseOnboardingOptions {
  type: 'essential' | 'complete';
  autoSave?: boolean;
}

export function useOnboarding({ type, autoSave = true }: UseOnboardingOptions) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<SaveSectionPayload | null>(null);

  // Carregar dados do localStorage
  const loadFromLocalStorage = useCallback((): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${type}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [type]);

  // Salvar no localStorage (instantâneo)
  const saveToLocalStorage = useCallback((formData: Record<string, unknown>) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}_${type}`,
        JSON.stringify(formData)
      );
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [type]);

  // Limpar localStorage
  const clearLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_${type}`);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [type]);

  // Carregar todos os dados do servidor
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/onboarding/all?type=${type}`);
      const result: ApiResponse<OnboardingData> = await response.json();

      if (result.success && result.data) {
        setData(result.data);

        // Mesclar com dados do localStorage (prioridade para localStorage se mais recentes)
        const localData = loadFromLocalStorage();
        if (localData) {
          setData(prev => prev ? {
            ...prev,
            formData: { ...prev.formData, ...localData },
          } : null);
        }
      } else {
        // Se não há dados no servidor, tentar carregar do localStorage
        const localData = loadFromLocalStorage();
        if (localData) {
          setData({
            sections: {},
            formData: localData,
            progress: null,
          });
        }
      }

    } catch (err) {
      console.error('Error loading onboarding data:', err);
      setError('Erro ao carregar dados');

      // Fallback para localStorage
      const localData = loadFromLocalStorage();
      if (localData) {
        setData({
          sections: {},
          formData: localData,
          progress: null,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [type, loadFromLocalStorage]);

  // Salvar seção no servidor (com debounce)
  const saveSection = useCallback(async (
    sectionIndex: number,
    sectionData: Record<string, unknown>,
    currentQuestion?: number,
    immediate = false
  ) => {
    // Salvar no localStorage imediatamente
    setData(prev => {
      const newFormData = { ...prev?.formData, ...sectionData };
      saveToLocalStorage(newFormData);
      return prev ? { ...prev, formData: newFormData } : null;
    });

    // Preparar payload para o servidor
    const payload: SaveSectionPayload = {
      onboarding_type: type,
      section_index: sectionIndex,
      data: sectionData,
      current_question: currentQuestion,
    };

    // Se não é autosave ou é imediato, salvar agora
    if (!autoSave || immediate) {
      return executeSaveSection(payload);
    }

    // Debounce para salvar no servidor
    pendingSaveRef.current = payload;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (pendingSaveRef.current) {
        executeSaveSection(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }
    }, DEBOUNCE_MS);

  }, [type, autoSave, saveToLocalStorage]);

  // Executar salvamento no servidor
  const executeSaveSection = async (payload: SaveSectionPayload) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding/section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse = await response.json();

      if (!result.success) {
        setError(result.error || 'Erro ao salvar');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving section:', err);
      setError('Erro ao salvar');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Salvar progresso
  const saveProgress = useCallback(async (payload: SaveProgressPayload) => {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          onboarding_type: type,
        }),
      });

      const result: ApiResponse<OnboardingProgress> = await response.json();

      if (result.success && result.data) {
        setData(prev => prev ? { ...prev, progress: result.data! } : null);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error saving progress:', err);
      return false;
    }
  }, [type]);

  // Marcar como completo
  const complete = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      // Salvar pendentes primeiro
      if (pendingSaveRef.current) {
        await executeSaveSection(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }

      const response = await fetch('/api/onboarding/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_type: type }),
      });

      const result: ApiResponse<OnboardingProgress> = await response.json();

      if (result.success) {
        clearLocalStorage();
        return true;
      }

      setError(result.error || 'Erro ao finalizar');
      return false;
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Erro ao finalizar');
      return false;
    } finally {
      setSaving(false);
    }
  }, [type, clearLocalStorage]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    // Estado
    loading,
    saving,
    error,
    data,
    formData: data?.formData || {},
    progress: data?.progress,

    // Ações
    loadAll,
    saveSection,
    saveProgress,
    complete,
    clearError,

    // Utils
    saveToLocalStorage,
    clearLocalStorage,
  };
}
