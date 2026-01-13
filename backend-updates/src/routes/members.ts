import { Router } from 'express';
import {
  getMembers,
  inviteMember,
  createMember,
  removeMember,
  updateMemberRole,
  getMemberDashboard,
  memberValidators,
} from '../controllers/membersController';
import { clerkAuthMiddleware, requireOrganization, requireOrgAdmin } from '../middleware/clerkAuth';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Todos os endpoints requerem autenticação Clerk
router.use(clerkAuthMiddleware);
router.use(requireOrganization);
router.use(apiRateLimiter);

// GET /api/members - Lista membros da organização
router.get('/', getMembers);

// POST /api/members/invite - Convida membro por email
router.post('/invite', requireOrgAdmin, memberValidators.invite, inviteMember);

// POST /api/members - Cria membro diretamente (com senha)
router.post('/', requireOrgAdmin, memberValidators.create, createMember);

// DELETE /api/members/:userId - Remove membro
router.delete('/:userId', requireOrgAdmin, removeMember);

// PUT /api/members/:userId/role - Atualiza role
router.put('/:userId/role', requireOrgAdmin, memberValidators.updateRole, updateMemberRole);

// GET /api/members/:userId/dashboard - Dashboard do membro (View As)
router.get('/:userId/dashboard', getMemberDashboard);

export default router;
