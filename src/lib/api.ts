import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuração base do Axios
// Usa proxy local para requisições seguras (BFF Pattern)
const api = axios.create({
  baseURL: '/api/proxy', // Proxy local - mais seguro
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Token é gerenciado pelo Clerk no servidor via proxy
    // Não precisamos mais manipular tokens no cliente
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
      // Redirecionar para sign-in do Clerk
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
