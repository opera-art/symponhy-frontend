import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';

/**
 * GET /api/meta/auth
 * Inicia o fluxo OAuth com o Meta/Instagram
 * Obtém a URL de autorização do backend e redireciona
 */
export async function GET(request: NextRequest) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Obter redirect URL do query param
    const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard/settings';

    // Chamar backend para obter URL de autorização
    const response = await fetch(`${BACKEND_URL}/api/meta/auth?redirect=${encodeURIComponent(redirect)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-User-Id': userId,
        ...(orgId && { 'X-Clerk-Org-Id': orgId }),
        ...(orgRole && { 'X-Clerk-Org-Role': orgRole }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    // Redirecionar para a URL de autorização do Meta
    if (data.authUrl) {
      return NextResponse.redirect(data.authUrl);
    }

    return NextResponse.json({ error: 'No auth URL returned' }, { status: 500 });
  } catch (error) {
    console.error('Auth initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate authentication' }, { status: 500 });
  }
}
