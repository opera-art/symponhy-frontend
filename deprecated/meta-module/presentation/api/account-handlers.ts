import { NextRequest, NextResponse } from 'next/server';
import { getMetaUseCases } from './factory';
import { AccountNotFoundError, TokenRefreshError } from '../../domain/errors';

/**
 * Handler para listar contas conectadas
 * GET /api/meta/accounts
 */
export async function handleGetAccounts(
  request: NextRequest,
  userId: string
): Promise<NextResponse> {
  try {
    const { getUserAccounts } = getMetaUseCases();

    const result = await getUserAccounts.execute(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get accounts:', error);

    return NextResponse.json(
      { error: 'Failed to get accounts' },
      { status: 500 }
    );
  }
}

/**
 * Handler para desconectar conta
 * DELETE /api/meta/accounts/[accountId]
 */
export async function handleDisconnectAccount(
  request: NextRequest,
  userId: string,
  accountId: string
): Promise<NextResponse> {
  try {
    const { disconnectAccount } = getMetaUseCases();

    const result = await disconnectAccount.execute({
      accountId,
      userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to disconnect account:', error);

    if (error instanceof AccountNotFoundError) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}

/**
 * Handler para renovar token
 * POST /api/meta/accounts/[accountId]/refresh
 */
export async function handleRefreshToken(
  request: NextRequest,
  accountId: string
): Promise<NextResponse> {
  try {
    const { refreshAccountToken } = getMetaUseCases();

    const result = await refreshAccountToken.execute({ accountId });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to refresh token:', error);

    if (error instanceof AccountNotFoundError) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if (error instanceof TokenRefreshError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
