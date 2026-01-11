import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook customizado para fazer requisições à API com estados de loading e erro
 * Usa o cliente Axios com refresh automático de tokens
 */
export const useApi = <T = any>(options?: UseApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      url: string,
      payload?: any
    ) => {
      setLoading(true);
      setError(null);

      try {
        let response;

        switch (method) {
          case 'get':
            response = await api.get(url);
            break;
          case 'post':
            response = await api.post(url, payload);
            break;
          case 'put':
            response = await api.put(url, payload);
            break;
          case 'patch':
            response = await api.patch(url, payload);
            break;
          case 'delete':
            response = await api.delete(url);
            break;
        }

        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string; message?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Ocorreu um erro';

        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Métodos convenientes para cada tipo de requisição
  const get = useCallback(
    (url: string) => execute('get', url),
    [execute]
  );

  const post = useCallback(
    (url: string, data?: any) => execute('post', url, data),
    [execute]
  );

  const put = useCallback(
    (url: string, data?: any) => execute('put', url, data),
    [execute]
  );

  const patch = useCallback(
    (url: string, data?: any) => execute('patch', url, data),
    [execute]
  );

  const del = useCallback(
    (url: string) => execute('delete', url),
    [execute]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
};
