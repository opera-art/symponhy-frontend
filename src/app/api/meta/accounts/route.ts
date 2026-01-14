import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';

/**
 * GET /api/meta/accounts
 * Proxy para o backend - Lista as contas Instagram conectadas
 */
export async function GET(request: NextRequest) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/meta/accounts`, {
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
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
