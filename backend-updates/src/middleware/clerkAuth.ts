import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';

// Inicializar cliente Clerk
const clerk = process.env.CLERK_SECRET_KEY
  ? createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  : null;

export interface ClerkAuthenticatedRequest extends Request {
  clerkUserId?: string;      // ID do usuário no Clerk (user_xxx)
  clerkOrgId?: string;       // ID da Organization (org_xxx)
  clerkOrgRole?: string;     // Role na org ('admin' ou 'member')
  userEmail?: string;
}

/**
 * Middleware para verificar autenticação via Clerk
 * O proxy do frontend envia:
 * - X-Clerk-User-Id: ID do usuário
 * - Authorization: Bearer <token> (opcional, para validação extra)
 */
export const clerkAuthMiddleware = async (
  req: ClerkAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar header X-Clerk-User-Id (enviado pelo proxy do frontend)
    const clerkUserId = req.headers['x-clerk-user-id'] as string;
    const clerkOrgId = req.headers['x-clerk-org-id'] as string;
    const clerkOrgRole = req.headers['x-clerk-org-role'] as string;

    if (!clerkUserId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Adicionar dados ao request
    req.clerkUserId = clerkUserId;
    req.clerkOrgId = clerkOrgId || undefined;
    req.clerkOrgRole = clerkOrgRole || undefined;

    // Opcionalmente, buscar dados do usuário no Clerk
    if (clerk && !req.userEmail) {
      try {
        const user = await clerk.users.getUser(clerkUserId);
        req.userEmail = user.emailAddresses[0]?.emailAddress;
      } catch {
        // Se não conseguir buscar usuário, continua sem email
      }
    }

    next();
  } catch (error) {
    console.error('Clerk auth error:', error);
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
};

/**
 * Middleware para verificar se usuário pertence a uma Organization
 */
export const requireOrganization = async (
  req: ClerkAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.clerkOrgId) {
    return res.status(403).json({
      error: 'Você precisa pertencer a uma organização para acessar este recurso'
    });
  }
  next();
};

/**
 * Middleware para verificar se usuário é admin da Organization (agência)
 */
export const requireOrgAdmin = async (
  req: ClerkAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.clerkOrgId) {
    return res.status(403).json({ error: 'Organização não encontrada' });
  }

  if (req.clerkOrgRole !== 'admin') {
    return res.status(403).json({
      error: 'Apenas administradores da agência podem realizar esta ação'
    });
  }

  next();
};

/**
 * Middleware opcional - não falha se não autenticado
 */
export const optionalClerkAuth = async (
  req: ClerkAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkUserId = req.headers['x-clerk-user-id'] as string;
    const clerkOrgId = req.headers['x-clerk-org-id'] as string;
    const clerkOrgRole = req.headers['x-clerk-org-role'] as string;

    if (clerkUserId) {
      req.clerkUserId = clerkUserId;
      req.clerkOrgId = clerkOrgId || undefined;
      req.clerkOrgRole = clerkOrgRole || undefined;
    }

    next();
  } catch {
    next();
  }
};
