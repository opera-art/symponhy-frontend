import { META_CONFIG } from '../../../config';
import { OAuthState } from '../../../domain/entities';
import { IOAuthStateRepository } from '../../../domain/repositories';
import { InitiateOAuthInput, InitiateOAuthOutput } from '../../dtos';

/**
 * Use Case: Iniciar fluxo OAuth
 *
 * Gera URL de autorização e salva state para CSRF protection
 */
export class InitiateOAuthUseCase {
  constructor(private oauthStateRepository: IOAuthStateRepository) {}

  async execute(input: InitiateOAuthInput): Promise<InitiateOAuthOutput> {
    // Criar OAuth state para CSRF protection
    const oauthState = OAuthState.create(
      input.userId,
      input.organizationId,
      input.redirectUrl
    );

    // Salvar no repositório
    await this.oauthStateRepository.save(oauthState);

    // Construir URL de autorização
    const params = new URLSearchParams({
      client_id: META_CONFIG.appId,
      redirect_uri: META_CONFIG.redirectUri,
      scope: META_CONFIG.scopesString,
      response_type: 'code',
      state: oauthState.state,
    });

    const authorizationUrl = `${META_CONFIG.oauthUrl}?${params.toString()}`;

    return {
      authorizationUrl,
      state: oauthState.state,
    };
  }
}
