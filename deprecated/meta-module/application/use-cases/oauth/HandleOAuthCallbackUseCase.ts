import { ConnectedAccount } from '../../../domain/entities';
import {
  IConnectedAccountRepository,
  IOAuthStateRepository,
} from '../../../domain/repositories';
import {
  InvalidStateError,
  NoInstagramAccountError,
  OAuthError,
} from '../../../domain/errors';
import { OAuthCallbackInput, OAuthCallbackOutput } from '../../dtos';
import { IMetaApiClient } from '../../../infrastructure/meta-api/IMetaApiClient';
import { IEncryptionService } from '../../services/IEncryptionService';

/**
 * Use Case: Processar callback OAuth
 *
 * Troca code por token, busca contas Instagram e salva
 */
export class HandleOAuthCallbackUseCase {
  constructor(
    private oauthStateRepository: IOAuthStateRepository,
    private connectedAccountRepository: IConnectedAccountRepository,
    private metaApiClient: IMetaApiClient,
    private encryptionService: IEncryptionService
  ) {}

  async execute(input: OAuthCallbackInput): Promise<OAuthCallbackOutput> {
    // 1. Validar state (CSRF protection)
    const oauthState = await this.oauthStateRepository.findByState(input.state);

    if (!oauthState || !oauthState.isValid) {
      throw new InvalidStateError();
    }

    try {
      // 2. Trocar code por access token
      const tokenResponse = await this.metaApiClient.exchangeCodeForToken(input.code);

      // 3. Buscar páginas do Facebook
      const pages = await this.metaApiClient.getFacebookPages(tokenResponse.access_token);

      if (pages.length === 0) {
        throw new NoInstagramAccountError();
      }

      // 4. Para cada página, buscar conta Instagram conectada
      const connectedAccounts: OAuthCallbackOutput['accounts'] = [];

      for (const page of pages) {
        const igAccount = await this.metaApiClient.getInstagramAccount(
          page.id,
          tokenResponse.access_token
        );

        if (!igAccount) continue;

        // Buscar detalhes da conta Instagram
        const igDetails = await this.metaApiClient.getInstagramAccountDetails(
          igAccount.id,
          tokenResponse.access_token
        );

        // Criptografar token antes de salvar
        const encryptedToken = this.encryptionService.encrypt(page.access_token);

        // Calcular data de expiração (tokens de página são long-lived ~60 dias)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);

        // Criar ou atualizar conta conectada
        const existingAccount = await this.connectedAccountRepository.findByUserAndIgUserId(
          oauthState.userId,
          igAccount.id
        );

        const now = new Date();

        const account = existingAccount || new ConnectedAccount({
          id: crypto.randomUUID(),
          userId: oauthState.userId,
          organizationId: oauthState.organizationId,
          igUserId: igAccount.id,
          username: igDetails.username,
          profilePictureUrl: igDetails.profile_picture_url,
          followersCount: igDetails.followers_count,
          accountType: igDetails.account_type || 'BUSINESS',
          pageId: page.id,
          pageName: page.name,
          accessToken: encryptedToken,
          tokenExpiresAt: expiresAt,
          isActive: true,
          connectedAt: now,
          updatedAt: now,
        });

        if (existingAccount) {
          account.updateToken(encryptedToken, expiresAt);
          account.updateProfile(
            igDetails.username,
            igDetails.profile_picture_url,
            igDetails.followers_count
          );
          account.activate();
        }

        await this.connectedAccountRepository.save(account);

        connectedAccounts.push({
          igUserId: igAccount.id,
          username: igDetails.username,
          profilePictureUrl: igDetails.profile_picture_url,
        });
      }

      if (connectedAccounts.length === 0) {
        throw new NoInstagramAccountError();
      }

      // 5. Marcar state como usado
      oauthState.markAsUsed();
      await this.oauthStateRepository.markAsUsed(oauthState.id);

      return {
        success: true,
        accountsConnected: connectedAccounts.length,
        accounts: connectedAccounts,
        redirectUrl: oauthState.redirectUrl,
      };
    } catch (error) {
      // Limpar state mesmo em caso de erro
      await this.oauthStateRepository.delete(oauthState.id);

      if (error instanceof NoInstagramAccountError || error instanceof OAuthError) {
        throw error;
      }

      throw new OAuthError(
        error instanceof Error ? error.message : 'Failed to connect Instagram account',
        'OAUTH_CALLBACK_FAILED'
      );
    }
  }
}
