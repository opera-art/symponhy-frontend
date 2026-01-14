import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleInitiateOAuth } from '@/modules/meta/presentation';

/**
 * GET /api/meta/auth
 * Inicia o fluxo OAuth com o Meta/Instagram
 */
export async function GET(request: NextRequest) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleInitiateOAuth(request, userId, orgId || undefined);
}
