import { Response } from 'express';
import { ClerkAuthenticatedRequest } from '../middleware/clerkAuth';
import { createClerkClient } from '@clerk/backend';
import { supabaseAdmin } from '../services/supabaseService';
import { body, param, validationResult } from 'express-validator';

// Clerk client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

/**
 * GET /api/members
 * Lista todos os membros da organização (clientes da agência)
 */
export const getMembers = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const { clerkOrgId, clerkOrgRole } = req;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    // Buscar membros da organização no Clerk
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId: clerkOrgId,
    });

    // Formatar resposta
    const members = await Promise.all(
      memberships.data.map(async (membership) => {
        // Buscar dados do usuário
        const user = await clerk.users.getUser(membership.publicUserData?.userId || '');

        return {
          id: membership.id,
          clerkUserId: membership.publicUserData?.userId,
          email: user.emailAddresses[0]?.emailAddress,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress,
          role: membership.role, // 'admin' ou 'member'
          avatarUrl: user.imageUrl,
          createdAt: membership.createdAt,
        };
      })
    );

    // Se não for admin, retorna apenas o próprio usuário
    if (clerkOrgRole !== 'admin') {
      const selfMember = members.find(m => m.clerkUserId === req.clerkUserId);
      return res.json(selfMember ? [selfMember] : []);
    }

    return res.json(members);
  } catch (error) {
    console.error('Error in getMembers:', error);
    return res.status(500).json({ error: 'Erro ao buscar membros' });
  }
};

/**
 * POST /api/members/invite
 * Convida um novo membro (cliente) para a organização
 */
export const inviteMember = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clerkOrgId, clerkOrgRole } = req;
    const { email, role = 'member' } = req.body;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    if (clerkOrgRole !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem convidar membros' });
    }

    // Criar convite no Clerk
    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId: clerkOrgId,
      emailAddress: email,
      role: role as 'admin' | 'member',
      inviterUserId: req.clerkUserId!,
    });

    return res.status(201).json({
      message: 'Convite enviado com sucesso',
      invitation: {
        id: invitation.id,
        email: invitation.emailAddress,
        role: invitation.role,
        status: invitation.status,
      },
    });
  } catch (error: any) {
    console.error('Error in inviteMember:', error);

    // Tratar erro de email já convidado
    if (error.errors?.[0]?.code === 'duplicate_record') {
      return res.status(400).json({ error: 'Este email já foi convidado' });
    }

    return res.status(500).json({ error: error.message || 'Erro ao enviar convite' });
  }
};

/**
 * POST /api/members
 * Cria um membro diretamente (sem convite) - para migração ou casos especiais
 */
export const createMember = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clerkOrgId, clerkOrgRole } = req;
    const { email, firstName, lastName, password } = req.body;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    if (clerkOrgRole !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar membros' });
    }

    // 1. Criar usuário no Clerk
    const newUser = await clerk.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      password,
    });

    // 2. Adicionar à organização como membro
    const membership = await clerk.organizations.createOrganizationMembership({
      organizationId: clerkOrgId,
      userId: newUser.id,
      role: 'member',
    });

    // 3. Criar profile no Supabase
    await supabaseAdmin.from('profiles').insert({
      clerk_id: newUser.id,
      clerk_org_id: clerkOrgId,
      email,
      full_name: `${firstName || ''} ${lastName || ''}`.trim(),
      role: 'member',
    });

    return res.status(201).json({
      message: 'Membro criado com sucesso',
      member: {
        id: membership.id,
        clerkUserId: newUser.id,
        email,
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        role: 'member',
        createdAt: membership.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error in createMember:', error);

    // Tratar erro de email duplicado
    if (error.errors?.[0]?.code === 'form_identifier_exists') {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    return res.status(500).json({ error: error.message || 'Erro ao criar membro' });
  }
};

/**
 * DELETE /api/members/:userId
 * Remove um membro da organização
 */
export const removeMember = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const { clerkOrgId, clerkOrgRole, clerkUserId } = req;
    const { userId } = req.params;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    if (clerkOrgRole !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem remover membros' });
    }

    // Não permitir remover a si mesmo
    if (userId === clerkUserId) {
      return res.status(400).json({ error: 'Você não pode remover a si mesmo' });
    }

    // Remover da organização no Clerk
    await clerk.organizations.deleteOrganizationMembership({
      organizationId: clerkOrgId,
      userId,
    });

    // Atualizar profile no Supabase (remover org_id)
    await supabaseAdmin
      .from('profiles')
      .update({ clerk_org_id: null, role: null })
      .eq('clerk_id', userId);

    return res.json({ message: 'Membro removido com sucesso' });
  } catch (error: any) {
    console.error('Error in removeMember:', error);
    return res.status(500).json({ error: error.message || 'Erro ao remover membro' });
  }
};

/**
 * PUT /api/members/:userId/role
 * Atualiza o role de um membro (admin ou member)
 */
export const updateMemberRole = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const { clerkOrgId, clerkOrgRole, clerkUserId } = req;
    const { userId } = req.params;
    const { role } = req.body;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    if (clerkOrgRole !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem alterar roles' });
    }

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ error: 'Role inválido. Use "admin" ou "member"' });
    }

    // Não permitir alterar próprio role
    if (userId === clerkUserId) {
      return res.status(400).json({ error: 'Você não pode alterar seu próprio role' });
    }

    // Atualizar no Clerk
    await clerk.organizations.updateOrganizationMembership({
      organizationId: clerkOrgId,
      userId,
      role: role as 'admin' | 'member',
    });

    // Atualizar no Supabase
    await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('clerk_id', userId);

    return res.json({ message: 'Role atualizado com sucesso' });
  } catch (error: any) {
    console.error('Error in updateMemberRole:', error);
    return res.status(500).json({ error: error.message || 'Erro ao atualizar role' });
  }
};

/**
 * GET /api/members/:userId/dashboard
 * Retorna dados do dashboard de um membro (para "Ver como")
 */
export const getMemberDashboard = async (req: ClerkAuthenticatedRequest, res: Response) => {
  try {
    const { clerkOrgId, clerkOrgRole } = req;
    const { userId } = req.params;

    if (!clerkOrgId) {
      return res.status(403).json({ error: 'Organização não encontrada' });
    }

    // Apenas admins podem ver dashboard de outros membros
    if (clerkOrgRole !== 'admin' && userId !== req.clerkUserId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Buscar dados do usuário no Clerk
    const user = await clerk.users.getUser(userId);

    // Buscar estatísticas do Supabase
    const { data: posts } = await supabaseAdmin
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('clerk_org_id', clerkOrgId)
      .eq('clerk_user_id', userId);

    const { data: events } = await supabaseAdmin
      .from('calendar_events')
      .select('id', { count: 'exact' })
      .eq('clerk_org_id', clerkOrgId)
      .eq('clerk_user_id', userId);

    return res.json({
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatarUrl: user.imageUrl,
      },
      stats: {
        totalPosts: posts?.length || 0,
        totalEvents: events?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error in getMemberDashboard:', error);
    return res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
};

/**
 * Validadores
 */
export const memberValidators = {
  invite: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('role')
      .optional()
      .isIn(['admin', 'member'])
      .withMessage('Role deve ser "admin" ou "member"'),
  ],
  create: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 }),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Senha deve ter no mínimo 8 caracteres'),
  ],
  updateRole: [
    param('userId').notEmpty().withMessage('userId é obrigatório'),
    body('role')
      .isIn(['admin', 'member'])
      .withMessage('Role deve ser "admin" ou "member"'),
  ],
};
