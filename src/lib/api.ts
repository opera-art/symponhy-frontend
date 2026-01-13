import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Mantém para cookies se disponíveis
});

// Interceptor de REQUEST - Adiciona token do localStorage no header
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Pega token do localStorage e adiciona no header Authorization
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Trata erros 401 (não autenticado)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se erro 401 e não foi uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não redirecionar em rotas de autenticação
      if (originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // Limpar dados locais do usuário
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');

        // Redirecionar para login (a menos que já esteja lá)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
