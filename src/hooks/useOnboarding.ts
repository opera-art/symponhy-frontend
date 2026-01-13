'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import api from '@/lib/api';
import {
  OnboardingProgress,
  SaveSectionPayload,
  SaveProgressPayload,
  ApiResponse,
} from '@/types/onboarding';

const DEBOUNCE_MS = 500; // 0.5 segundos - salva quase imediatamente

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

  // Carregar todos os dados do servidor (backend)
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<OnboardingData>>(
        `/onboarding/all?type=${type}`
      );
      const result = response.data;

      if (result.success && result.data) {
        setData(result.data);
      } else {
        // Inicializar vazio se não há dados
        setData({
          sections: {},
          formData: {},
          progress: null,
        });
      }
    } catch (err: any) {
      console.error('Error loading onboarding data:', err);
      setError(err.response?.data?.error || 'Erro ao carregar dados');
      // Inicializar vazio em caso de erro
      setData({
        sections: {},
        formData: {},
        progress: null,
      });
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Executar salvamento no servidor
  const executeSaveSection = async (payload: SaveSectionPayload): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const response = await api.post<ApiResponse>('/onboarding/section', payload);
      const result = response.data;

      if (!result.success) {
        setError(result.error || 'Erro ao salvar');
        return false;
      }

      return true;
    } catch (err: any) {
      console.error('Error saving section:', err);
      setError(err.response?.data?.error || 'Erro ao salvar');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Salvar seção no servidor (com debounce)
  const saveSection = useCallback(async (
    sectionIndex: number,
    sectionData: Record<string, unknown>,
    currentQuestion?: number,
    immediate = false
  ) => {
    // Atualizar estado local imediatamente (para UI responsiva)
    setData(prev => {
      const newFormData = { ...prev?.formData, ...sectionData };
      return prev ? { ...prev, formData: newFormData } : { sections: {}, formData: newFormData, progress: null };
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

  }, [type, autoSave]);

  // Salvar progresso
  const saveProgress = useCallback(async (payload: SaveProgressPayload) => {
    try {
      const response = await api.post<ApiResponse<OnboardingProgress>>(
        '/onboarding/progress',
        {
          ...payload,
          onboarding_type: type,
        }
      );
      const result = response.data;

      if (result.success && result.data) {
        setData(prev => prev ? { ...prev, progress: result.data! } : null);
        return true;
      }

      return false;
    } catch (err: any) {
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

      const response = await api.patch<ApiResponse<OnboardingProgress>>(
        '/onboarding/progress',
        { onboarding_type: type }
      );
      const result = response.data;

      if (result.success) {
        return true;
      }

      setError(result.error || 'Erro ao finalizar');
      return false;
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.response?.data?.error || 'Erro ao finalizar');
      return false;
    } finally {
      setSaving(false);
    }
  }, [type]);

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
  };
}
