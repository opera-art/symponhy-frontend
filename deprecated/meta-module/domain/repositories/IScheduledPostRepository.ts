import { ScheduledPost } from '../entities';
import { PostStatusValue } from '../value-objects';

export interface IScheduledPostRepository {
  /**
   * Busca post por ID
   */
  findById(id: string): Promise<ScheduledPost | null>;

  /**
   * Busca posts de uma conta
   */
  findByAccountId(accountId: string): Promise<ScheduledPost[]>;

  /**
   * Busca posts de um usuário
   */
  findByUserId(userId: string): Promise<ScheduledPost[]>;

  /**
   * Busca posts por status
   */
  findByStatus(status: PostStatusValue): Promise<ScheduledPost[]>;

  /**
   * Busca posts pendentes que estão no horário de publicação
   */
  findDuePosts(): Promise<ScheduledPost[]>;

  /**
   * Busca posts agendados para um período
   */
  findScheduledBetween(startDate: Date, endDate: Date): Promise<ScheduledPost[]>;

  /**
   * Busca posts de uma conta em um período
   */
  findByAccountAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ScheduledPost[]>;

  /**
   * Conta posts publicados nas últimas 24h (para rate limiting)
   */
  countPublishedInLast24Hours(accountId: string): Promise<number>;

  /**
   * Salva um post (create ou update)
   */
  save(post: ScheduledPost): Promise<void>;

  /**
   * Remove um post
   */
  delete(id: string): Promise<void>;

  /**
   * Atualiza status de um post
   */
  updateStatus(
    id: string,
    status: PostStatusValue,
    publishedMediaId?: string,
    errorMessage?: string
  ): Promise<void>;
}
