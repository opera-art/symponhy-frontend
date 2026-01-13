import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuração base do Axios
// Com HttpOnly cookies, o token é enviado automaticamente via cookie
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Envia cookies HttpOnly automaticamente
});

// Interceptor de REQUEST - Com HttpOnly cookies, não precisamos adicionar token manualmente
// O cookie é enviado automaticamente pelo browser com withCredentials: true
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Com HttpOnly cookies, o token é enviado automaticamente via cookie
    // Não precisamos mais manipular o header Authorization manualmente
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
