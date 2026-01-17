import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

/**
 * DELETE /api/meta/posts/[postId]
 * Proxy para o backend - Cancela um post agendado
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId, orgId, orgRole } = await auth();
  const { postId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/meta/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-User-Id': userId,
        ...(orgId && { 'X-Clerk-Org-Id': orgId }),
        ...(orgRole && { 'X-Clerk-Org-Role': orgRole }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to cancel post' }, { status: 500 });
  }
}
