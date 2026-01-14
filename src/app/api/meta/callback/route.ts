import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://symponhy-backend-production.up.railway.app';
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.viol1n.com';

/**
 * GET /api/meta/callback
 * Callback do OAuth do Meta/Instagram
 * Recebe code e state do Facebook, envia pro backend processar
 */
export async function GET(request: NextRequest) {
  const { userId, orgId, orgRole } = await auth();

  // Obter parâmetros do callback
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');
  const errorDescription = request.nextUrl.searchParams.get('error_description');

  // Se houve erro no OAuth
  if (errorParam) {
    const errorMessage = encodeURIComponent(errorDescription || errorParam);
    return NextResponse.redirect(`${FRONTEND_URL}/dashboard/settings?error=oauth&message=${errorMessage}`);
  }

  // Validar parâmetros
  if (!code || !state) {
    return NextResponse.redirect(`${FRONTEND_URL}/dashboard/settings?error=missing_params&message=Parâmetros inválidos`);
  }

  try {
    // Enviar code e state para o backend processar
    const response = await fetch(`${BACKEND_URL}/api/meta/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId && { 'X-Clerk-User-Id': userId }),
        ...(orgId && { 'X-Clerk-Org-Id': orgId }),
        ...(orgRole && { 'X-Clerk-Org-Role': orgRole }),
      },
      body: JSON.stringify({ code, state }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = encodeURIComponent(data.error || 'Erro ao conectar conta');
      return NextResponse.redirect(`${FRONTEND_URL}/dashboard/settings?error=callback&message=${errorMessage}`);
    }

    // Sucesso - redirecionar para a página de settings com mensagem de sucesso
    const successMessage = encodeURIComponent(data.message || `${data.accounts} conta(s) conectada(s) com sucesso!`);
    const redirectUrl = data.redirectUrl || '/dashboard/settings';

    return NextResponse.redirect(`${FRONTEND_URL}${redirectUrl}?success=true&message=${successMessage}`);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${FRONTEND_URL}/dashboard/settings?error=callback&message=Erro interno ao processar callback`);
  }
}
