import { IConnectedAccountRepository } from '../../../domain/repositories';
import { AccountNotFoundError, TokenRefreshError } from '../../../domain/errors';
import { RefreshTokenInput, RefreshTokenOutput } from '../../dtos';
import { IMetaApiClient } from '../../../infrastructure/meta-api/IMetaApiClient';
import { IEncryptionService } from '../../services/IEncryptionService';

/**
 * Use Case: Renovar token de acesso de uma conta
 */
export class RefreshAccountTokenUseCase {
  constructor(
    private connectedAccountRepository: IConnectedAccountRepository,
    private metaApiClient: IMetaApiClient,
    private encryptionService: IEncryptionService
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    // Buscar conta
    const account = await this.connectedAccountRepository.findById(input.accountId);

    if (!account) {
      throw new AccountNotFoundError(input.accountId);
    }

    try {
      // Descriptografar token atual
      const currentToken = this.encryptionService.decrypt(
        account.accessToken.getEncrypted()
      );

      // Trocar por long-lived token
      const newTokenData = await this.metaApiClient.refreshLongLivedToken(currentToken);

      // Calcular nova data de expiração
      const newExpiresAt = new Date();
      newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newTokenData.expires_in);

      // Criptografar novo token
      const encryptedToken = this.encryptionService.encrypt(newTokenData.access_token);

      // Atualizar conta
      account.updateToken(encryptedToken, newExpiresAt);
      await this.connectedAccountRepository.save(account);

      return {
        success: true,
        newExpiresAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new TokenRefreshError(errorMessage);
    }
  }

  /**
   * Renova tokens de todas as contas que estão expirando
   */
  async refreshExpiringTokens(daysThreshold: number = 7): Promise<{
    refreshed: number;
    failed: number;
    errors: Array<{ accountId: string; error: string }>;
  }> {
    const expiringAccounts = await this.connectedAccountRepository.findWithExpiringTokens(
      daysThreshold
    );

    let refreshed = 0;
    let failed = 0;
    const errors: Array<{ accountId: string; error: string }> = [];

    for (const account of expiringAccounts) {
      try {
        await this.execute({ accountId: account.id });
        refreshed++;
      } catch (error) {
        failed++;
        errors.push({
          accountId: account.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { refreshed, failed, errors };
  }
}
