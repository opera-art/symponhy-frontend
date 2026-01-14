import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleCreatePost, handleGetPosts } from '@/modules/meta/presentation';

/**
 * GET /api/meta/posts
 * Lista posts agendados
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleGetPosts(request, userId);
}

/**
 * POST /api/meta/posts
 * Cria um novo post agendado
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handleCreatePost(request, userId);
}
