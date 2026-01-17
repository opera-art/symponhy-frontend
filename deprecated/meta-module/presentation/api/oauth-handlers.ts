import { NextRequest, NextResponse } from 'next/server';
import { getMetaUseCases } from './factory';
import { OAuthError, NoInstagramAccountError } from '../../domain/errors';

/**
 * Handler para iniciar OAuth
 * GET /api/meta/auth
 */
export async function handleInitiateOAuth(
  request: NextRequest,
  userId: string,
  organizationId?: string
): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const redirectUrl = searchParams.get('redirect') || '/dashboard/settings';

    const { initiateOAuth } = getMetaUseCases();

    const result = await initiateOAuth.execute({
      userId,
      organizationId,
      redirectUrl,
    });

    // Redirecionar para o Facebook/Instagram OAuth
    return NextResponse.redirect(result.authorizationUrl);
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);

    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

/**
 * Handler para callback OAuth
 * GET /api/meta/callback
 */
export async function handleOAuthCallback(
  request: NextRequest
): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Usuário cancelou ou erro do Meta
  if (error) {
    console.error('OAuth error from Meta:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || '')}`
    );
  }

  // Parâmetros obrigatórios
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=invalid_request&message=Missing required parameters`
    );
  }

  try {
    const { handleOAuthCallback } = getMetaUseCases();

    const result = await handleOAuthCallback.execute({ code, state });

    // Redirecionar para a URL configurada ou settings
    const redirectUrl = result.redirectUrl || '/dashboard/settings';
    const successMessage = `${result.accountsConnected} conta(s) conectada(s) com sucesso`;

    return NextResponse.redirect(
      `${baseUrl}${redirectUrl}?success=true&message=${encodeURIComponent(successMessage)}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);

    let errorMessage = 'Falha ao conectar conta';
    let errorCode = 'connection_failed';

    if (error instanceof NoInstagramAccountError) {
      errorMessage = 'Nenhuma conta Instagram Business encontrada. Verifique se sua conta está conectada a uma Página do Facebook.';
      errorCode = 'no_instagram_account';
    } else if (error instanceof OAuthError) {
      errorMessage = error.message;
      errorCode = error.code;
    }

    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=${errorCode}&message=${encodeURIComponent(errorMessage)}`
    );
  }
}
