import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleRefreshToken } from '@/modules/meta/presentation';

interface RouteParams {
  params: Promise<{ accountId: string }>;
}

/**
 * POST /api/meta/accounts/[accountId]/refresh
 * Renova o token de uma conta Instagram
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  const { accountId } = await params;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleRefreshToken(request, accountId);
}
