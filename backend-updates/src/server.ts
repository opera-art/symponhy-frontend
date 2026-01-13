import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middleware/auth';
import { apiRateLimiter } from './middleware/rateLimiter';
import { getRedisClient, closeRedis } from './services/redisService';

// Rotas
import authRoutes from './routes/auth';
import membersRoutes from './routes/members';
import onboardingRoutes from './routes/onboarding';
import webhooksRoutes from './routes/webhooks';

const app = express();

// Initialize Redis connection
const redis = getRedisClient();

// Middlewares de segurança
app.use(helmet());

// CORS - permitir requisições do frontend
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Clerk-User-Id',
      'X-Clerk-Org-Id',
      'X-Clerk-Org-Role',
    ],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
app.use(apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    redis: redis ? 'connected' : 'disabled',
    auth: 'clerk',
  });
});

// API version
app.get('/api/version', (req, res) => {
  res.json({
    version: '2.0.0',
    auth: 'clerk-organizations',
    features: ['members', 'onboarding', 'webhooks'],
  });
});

// Rotas de autenticação (mantém para compatibilidade, mas pode remover depois)
app.use('/auth', authRoutes);

// Rotas de membros (substitui /api/clients)
app.use('/api/members', membersRoutes);

// Rotas de onboarding
app.use('/api/onboarding', onboardingRoutes);

// Webhooks do Clerk (NÃO usa rate limiter nem auth)
app.use('/api/webhooks', webhooksRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em ${config.api_url}`);
  console.log(`📡 CORS ativado para ${config.frontend_url}`);
  console.log(`🔐 Auth: Clerk Organizations`);
  console.log(`📦 Redis: ${redis ? 'conectado' : 'desabilitado'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await closeRedis();
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
