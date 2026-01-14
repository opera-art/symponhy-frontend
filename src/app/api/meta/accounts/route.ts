import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleGetAccounts } from '@/modules/meta/presentation';

/**
 * GET /api/meta/accounts
 * Lista as contas Instagram conectadas do usuário
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleGetAccounts(request, userId);
}
