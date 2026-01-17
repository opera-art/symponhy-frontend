import { ConnectedAccount } from '../entities';

export interface IConnectedAccountRepository {
  /**
   * Busca conta por ID
   */
  findById(id: string): Promise<ConnectedAccount | null>;

  /**
   * Busca conta por Instagram User ID
   */
  findByIgUserId(igUserId: string): Promise<ConnectedAccount | null>;

  /**
   * Busca todas as contas de um usuário
   */
  findByUserId(userId: string): Promise<ConnectedAccount[]>;

  /**
   * Busca todas as contas de uma organização
   */
  findByOrganizationId(organizationId: string): Promise<ConnectedAccount[]>;

  /**
   * Busca conta específica de um usuário por IG User ID
   */
  findByUserAndIgUserId(userId: string, igUserId: string): Promise<ConnectedAccount | null>;

  /**
   * Busca contas com token expirando em X dias
   */
  findWithExpiringTokens(daysThreshold: number): Promise<ConnectedAccount[]>;

  /**
   * Busca contas ativas que podem publicar
   */
  findActiveAccounts(): Promise<ConnectedAccount[]>;

  /**
   * Salva uma conta (create ou update)
   */
  save(account: ConnectedAccount): Promise<void>;

  /**
   * Remove uma conta
   */
  delete(id: string): Promise<void>;

  /**
   * Atualiza apenas o token de uma conta
   */
  updateToken(id: string, accessToken: string, expiresAt: Date): Promise<void>;
}
