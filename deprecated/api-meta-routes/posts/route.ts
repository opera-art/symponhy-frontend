import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';

/**
 * GET /api/meta/posts
 * Proxy para o backend - Lista posts agendados
 */
export async function GET(request: NextRequest) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Passar query params para o backend
    const url = new URL(`${BACKEND_URL}/api/meta/posts`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
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
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

/**
 * POST /api/meta/posts
 * Proxy para o backend - Cria um novo post agendado
 */
export async function POST(request: NextRequest) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/meta/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-User-Id': userId,
        ...(orgId && { 'X-Clerk-Org-Id': orgId }),
        ...(orgRole && { 'X-Clerk-Org-Role': orgRole }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
