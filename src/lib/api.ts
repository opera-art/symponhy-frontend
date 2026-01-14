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

// Interceptor de RESPONSE - Trata erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Log de erro para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    // Não redireciona automaticamente - deixa o componente tratar o erro
    // Isso evita que erros de API causem redirecionamentos inesperados
    return Promise.reject(error);
  }
);

export default api;
