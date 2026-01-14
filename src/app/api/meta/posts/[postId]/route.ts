import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleCancelPost } from '@/modules/meta/presentation';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

/**
 * DELETE /api/meta/posts/[postId]
 * Cancela um post agendado
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  const { postId } = await params;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleCancelPost(request, userId, postId);
}
