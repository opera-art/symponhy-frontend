import { OAuthState } from '../entities';

export interface IOAuthStateRepository {
  /**
   * Busca state por valor
   */
  findByState(state: string): Promise<OAuthState | null>;

  /**
   * Busca state por ID
   */
  findById(id: string): Promise<OAuthState | null>;

  /**
   * Salva um state
   */
  save(oauthState: OAuthState): Promise<void>;

  /**
   * Remove um state (após uso ou expiração)
   */
  delete(id: string): Promise<void>;

  /**
   * Remove states expirados (cleanup)
   */
  deleteExpired(): Promise<number>;

  /**
   * Marca state como usado
   */
  markAsUsed(id: string): Promise<void>;
}
