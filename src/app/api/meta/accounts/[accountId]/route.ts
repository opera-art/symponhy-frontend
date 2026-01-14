import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleDisconnectAccount } from '@/modules/meta/presentation';

interface RouteParams {
  params: Promise<{ accountId: string }>;
}

/**
 * DELETE /api/meta/accounts/[accountId]
 * Desconecta uma conta Instagram
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  const { accountId } = await params;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleDisconnectAccount(request, userId, accountId);
}
