import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Interface para tipagem do token decodificado
interface DecodedToken {
  exp: number;
  userId: string;
  email: string;
}

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Processa a fila de requisições que falharam esperando o refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Decodifica o JWT para obter o tempo de expiração (sem verificar assinatura)
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Verifica se o token está expirando nos próximos 5 minutos
const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000; // Converter para milissegundos
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;
  const fiveMinutes = 5 * 60 * 1000;

  return timeUntilExpiry < fiveMinutes;
};

// Função que faz o refresh do token
const refreshAccessToken = async (): Promise<string> => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    throw new Error('No token available');
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newToken = response.data.token;

    // Atualizar localStorage e cookie com o novo token
    localStorage.setItem('auth_token', newToken);
    document.cookie = `auth_token=${newToken}; path=/; secure; samesite=strict`;

    // Atualizar também o usuário se vier na resposta
    if (response.data.user) {
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }

    return newToken;
  } catch (error) {
    // Se o refresh falhar, limpar autenticação
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    // Redirecionar para login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw error;
  }
};

// Interceptor de REQUEST - Adiciona token e verifica expiração
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');

    // Se não tem token, prosseguir normalmente (rotas públicas)
    if (!token) {
      return config;
    }

    // Verificar se o token está expirando
    if (isTokenExpiringSoon(token)) {
      // Se já está acontecendo um refresh, esperar
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Iniciar processo de refresh
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return config;
      } catch (error) {
        processQueue(error as Error, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Token ainda válido, adicionar ao header
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Trata erros 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se erro 401 e não foi uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não tentar refresh em rotas de autenticação
      if (originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // Se já está fazendo refresh, adicionar à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        // Retentar a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
